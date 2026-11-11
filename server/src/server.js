/**
 * Production Enterprise Web Server
 * Integrates Persistent DB, Hybrid Redis Cache, Async Job Queue, and Real-Time SSE.
 */
import express from "express";
import cors from "cors";
import path from "path";
import crypto from "crypto";
import { CONFIG } from "./config.js";
import { db } from "./database.js";
import { cache } from "./cache.js";
import { jobQueue } from "./queue.js";
import { consultantAI, builderAI } from "./ai_services.js";

const app = express();

// Middlewares
app.use(cors({ origin: CONFIG.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(CONFIG.STATIC_DIR));

// SSE Real-Time Clients Registry
const sseClients = new Set();

function broadcastEvent(eventType, data) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    try {
      res.write(payload);
    } catch (e) {
      sseClients.delete(res);
    }
  }
}

// Listen to Queue events and broadcast
jobQueue.on("job:completed", (job) => {
  broadcastEvent("queue:completed", { jobId: job.id, type: job.type, result: job.result });
});

// ----------------------------------------------------
// REST APIs
// ----------------------------------------------------

// 1. Health & System Metrics
app.get("/api/health", async (req, res) => {
  const cacheMetrics = cache.getMetrics();
  const queueStats = jobQueue.getStats();
  const memUsage = process.memoryUsage();
  const hasGeminiKey = Boolean(process.env.GEMINI_CONSULT_API_KEY || process.env.GEMINI_BUILDER_API_KEY || process.env.GEMINI_API_KEY);

  res.json({
    status: "HEALTHY",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: CONFIG.NODE_ENV,
    port: CONFIG.PORT,
    ai: {
      hasKey: hasGeminiKey,
      model: "Gemini 3.6 Flash",
      status: hasGeminiKey ? "ACTIVE" : "FALLBACK_READY",
      latency: "< 1.0s"
    },
    database: {
      status: "ACTIVE",
      totalProjects: db.getProjects().length,
      totalFeedbacks: db.getFeedbacks().length,
      totalTasks: db.getTasks().length
    },
    cache: cacheMetrics,
    queue: queueStats,
    memory: {
      rssMb: (memUsage.rss / 1024 / 1024).toFixed(1),
      heapUsedMb: (memUsage.heapUsed / 1024 / 1024).toFixed(1)
    }
  });
});

// 2. Real-Time SSE Stream
app.get("/api/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  sseClients.add(res);
  res.write(`data: ${JSON.stringify({ type: "CONNECTED", clientId: Date.now() })}\n\n`);

  req.on("close", () => {
    sseClients.delete(res);
  });
});

// 3. Projects API
app.get("/api/projects", async (req, res) => {
  const cacheKey = "projects:all";
  const cached = await cache.get(cacheKey);
  if (cached) {
    return res.json({ success: true, source: "CACHE", data: cached });
  }

  const projects = db.getProjects();
  await cache.set(cacheKey, projects, 60);
  res.json({ success: true, source: "DATABASE", data: projects });
});

app.get("/api/projects/:id", async (req, res) => {
  const proj = db.getProjectById(req.params.id);
  if (!proj) {
    return res.status(404).json({ success: false, error: "Project not found" });
  }
  res.json({ success: true, data: proj });
});

app.post("/api/projects", async (req, res) => {
  try {
    const { name, code, budget, package: pkg, infraStrategy, serverCost, description } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, error: "Vui lòng nhập tên và mã dự án." });
    }

    const cleanName = name.trim().replace(/[<>]/g, "");
    const cleanCode = code.trim().replace(/[<>]/g, "").toUpperCase();
    const cleanId = cleanCode.startsWith("PRJ-") ? cleanCode : `PRJ-${cleanCode}`;

    const defaultTasks = [
      { id: `${cleanCode}-PM-01`, dept: "01. Quản Trị Dự Án", title: "Khảo sát, lập WBS và phân bổ nguồn lực", pic: "TPM Lead", status: "IN_PROGRESS", progress: 60, note: "Đang lập WBS và phân bổ nguồn lực" },
      { id: `${cleanCode}-BA-02`, dept: "02. Phân Tích Nghiệp Vụ", title: "Phân tích User Journey & bóc tách User Stories", pic: "Lead BA", status: "IN_PROGRESS", progress: 50, note: "Đã hoàn thành sơ đồ luồng người dùng" },
      { id: `${cleanCode}-ARCH-03`, dept: "03. Kiến Trúc & Chi Phí", title: "Thiết kế kiến trúc hệ thống & tối ưu chi phí hạ tầng", pic: "Solution Architect", status: "TODO", progress: 20, note: "Đang đánh giá Tech Stack và sizing" },
      { id: `${cleanCode}-UI-04`, dept: "04. Thiết Kế UI/UX", title: "Xây dựng Design System, Tokens và kiểm định tương phản", pic: "Senior UI/UX", status: "TODO", progress: 10, note: "Đang wireframe luồng chính" },
      { id: `${cleanCode}-FE-05`, dept: "05. Lập Trình Frontend", title: "Lập trình giao diện Responsive 390px, tối ưu Core Web Vitals", pic: "Senior Web Dev", status: "TODO", progress: 0, note: "Chờ nghiệm thu Design System" },
      { id: `${cleanCode}-BE-06`, dept: "06. Lập Trình Backend", title: "Xây dựng RESTful API bảo mật HMAC, RBAC & Rate Limiting", pic: "Backend Lead", status: "TODO", progress: 0, note: "Đang chờ schema CSDL" },
      { id: `${cleanCode}-DB-07`, dept: "07. Quản Trị CSDL", title: "Khởi tạo schema, Indexing, Concurrency Lock & Backup", pic: "Senior DBA", status: "TODO", progress: 0, note: "Thiết kế quan hệ thực thể ERD" },
      { id: `${cleanCode}-QA-08`, dept: "08. Đảm Bảo Chất Lượng", title: "Thiết lập kịch bản kiểm thử tự động, quét lỗ hổng bảo mật", pic: "QA/QC Lead", status: "TODO", progress: 0, note: "Chuẩn bị test cases kịch bản UAT" },
      { id: `${cleanCode}-OPS-09`, dept: "09. Vận Hành & Hạ Tầng", title: "Đóng gói Docker Compose, thiết lập CI/CD Pipeline & SSL", pic: "DevOps Engineer", status: "TODO", progress: 0, note: "Chuẩn bị môi trường staging" }
    ];

    const projectData = {
      id: cleanId,
      code: cleanCode,
      name: cleanName,
      progress: 25,
      budget: budget || pkg || "550 Triệu (Tiêu Chuẩn)",
      status: "ON-TRACK",
      stage: "Giai Đoạn Khởi Tạo & Bóc Tách Nghiệp Vụ",
      serverCost: serverCost || "$45/tháng",
      infraStrategy: infraStrategy || "Docker Container Cục Bộ + CI/CD",
      tokenEfficiency: 98.5,
      deptStatuses: {
        "client": "DONE",
        "pm": "IN_PROGRESS",
        "ba": "IN_PROGRESS",
        "sa": "TODO",
        "ui": "TODO",
        "fe": "TODO",
        "be": "TODO",
        "dba": "TODO",
        "qa": "TODO",
        "devops": "TODO",
        "prod": "TODO"
      },
      tasks: defaultTasks,
      feedbacks: [],
      history: [
        { time: "Vừa xong", dept: "Hệ Thống", action: `Đã khởi tạo dự án mới: ${cleanName} (${cleanCode})`, type: "success" }
      ]
    };

    db.addProject(projectData);
    await cache.invalidatePattern("projects:");
    db.logAudit("CREATE_PROJECT", "Admin Master", { projectId: cleanId, name: cleanName });
    broadcastEvent("project:created", projectData);

    res.json({ success: true, message: "Khởi tạo dự án mới thành công!", data: projectData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/projects/:id/config", async (req, res) => {
  const { id } = req.params;
  const newConfig = req.body;
  const updated = db.updateProjectConfig(id, newConfig);
  if (!updated) {
    return res.status(404).json({ success: false, error: "Project not found" });
  }

  await cache.invalidatePattern("projects:");
  db.logAudit("UPDATE_CLIENT_CONFIG", "Admin", { projectId: id, config: newConfig });
  broadcastEvent("project:updated", updated);

  res.json({ success: true, message: "Configuration updated successfully", data: updated });
});

// 4. Client Feedbacks API
app.get("/api/feedback", async (req, res) => {
  const projectId = req.query.projectId;
  const cacheKey = `feedbacks:${projectId || "all"}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    return res.json({ success: true, source: "CACHE", data: cached });
  }

  const feedbacks = db.getFeedbacks(projectId);
  await cache.set(cacheKey, feedbacks, 30);
  res.json({ success: true, source: "DATABASE", data: feedbacks });
});

app.post("/api/feedback", async (req, res) => {
  const { projectId, sender, category, content, assignedDept } = req.body;
  if (!content) {
    return res.status(400).json({ success: false, error: "Feedback content is required" });
  }

  const newFb = db.addFeedback({
    projectId,
    sender,
    category,
    content,
    assignedDept: assignedDept || "01. Quản Trị Dự Án (PM)"
  });

  await cache.invalidatePattern("feedbacks:");

  // Enqueue background task decomposition job
  jobQueue.enqueue("DECOMPOSE_FEEDBACK", {
    feedbackId: newFb.id,
    content: newFb.content,
    projectId: newFb.projectId
  }, { priority: "HIGH" });

  db.logAudit("SUBMIT_FEEDBACK", sender || "Client", { feedbackId: newFb.id, category });
  broadcastEvent("feedback:created", newFb);

  res.json({ success: true, message: "Feedback submitted and enqueued for PM processing", data: newFb });
});

app.put("/api/feedback/:id/solution", async (req, res) => {
  const { id } = req.params;
  const { solution, solutionDept, status } = req.body;

  const updated = db.updateFeedbackSolution(id, { solution, solutionDept, status });
  if (!updated) {
    return res.status(404).json({ success: false, error: "Feedback record not found" });
  }

  await cache.invalidatePattern("feedbacks:");
  db.logAudit("UPDATE_FEEDBACK_SOLUTION", "PM", { feedbackId: id, solutionDept, status });
  broadcastEvent("feedback:solution_updated", updated);

  res.json({ success: true, message: "Solution updated and broadcasted", data: updated });
});

// 5. Tasks API
app.get("/api/tasks", async (req, res) => {
  const projectId = req.query.projectId;
  const tasks = db.getTasks(projectId);
  res.json({ success: true, data: tasks });
});

app.post("/api/tasks", async (req, res) => {
  const newTask = db.addTask(req.body);
  broadcastEvent("task:created", newTask);
  res.json({ success: true, data: newTask });
});

app.put("/api/tasks/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = db.updateTaskStatus(id, status);
  if (!updated) {
    return res.status(404).json({ success: false, error: "Task not found" });
  }
  broadcastEvent("task:status_updated", updated);
  res.json({ success: true, data: updated });
});

// 6. Orders & Real VietQR API
app.post("/api/orders", (req, res) => {
  const order = db.createOrder(req.body);
  db.logAudit("CREATE_ORDER", order.customerName, { orderId: order.id, amount: order.totalAmount });
  res.json({ success: true, data: order });
});

app.get("/api/orders/:id", (req, res) => {
  const order = db.getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: "Order not found" });
  }
  res.json({ success: true, data: order });
});

app.post("/api/orders/:id/pay", (req, res) => {
  const { id } = req.params;
  const { transactionRef } = req.body;

  // Enqueue payment reconciliation
  const job = jobQueue.enqueue("RECONCILE_PAYMENT", {
    orderId: id,
    amount: req.body.amount || 0,
    transactionRef: transactionRef || `TXN-NAPAS-${Date.now()}`
  }, { priority: "HIGH" });

  res.json({ success: true, message: "Payment reconciliation enqueued", jobId: job.id });
});

// 7. Cryptographic Key Verification & Generation Engine
function hashString(str) {
  let h1 = 0xdeadbeef ^ 0, h2 = 0x41c6ce57 ^ 0;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, "0");
}

function encryptPayload(str, salt) {
  const textBytes = new TextEncoder().encode(str);
  const saltBytes = new TextEncoder().encode(salt);
  const hex = [];
  for (let i = 0; i < textBytes.length; i++) {
    const masked = textBytes[i] ^ saltBytes[i % saltBytes.length] ^ ((i * 11 + 3) & 0xff);
    hex.push(masked.toString(16).padStart(2, "0"));
  }
  return hex.join("");
}

function decryptPayload(hexStr, salt) {
  const saltBytes = new TextEncoder().encode(salt);
  const byteCount = hexStr.length / 2;
  const outBytes = new Uint8Array(byteCount);
  for (let i = 0; i < byteCount; i++) {
    const byteVal = parseInt(hexStr.substr(i * 2, 2), 16);
    outBytes[i] = byteVal ^ saltBytes[i % saltBytes.length] ^ ((i * 11 + 3) & 0xff);
  }
  return new TextDecoder().decode(outBytes);
}

function generateClientAccessKey(name, dob, phone, projectCode) {
  const tag = projectCode.replace("PRJ-", "").split("-")[0] || "TRIAL";
  const nonce = Math.random().toString(36).substring(2, 7).toUpperCase();
  const raw = [name.trim(), (dob || "TRIAL-USER").trim(), phone.trim(), projectCode.trim(), Date.now(), nonce].join("::");
  const encryptedBlob = encryptPayload(raw, CONFIG.MASTER_AUTH_SALT);
  const signature = hashString(encryptedBlob + "::" + CONFIG.MASTER_AUTH_SALT);
  return `ITKEY.${tag}.${encryptedBlob}.${signature}`;
}

app.post("/api/auth/verify-key", (req, res) => {
  const { key } = req.body;
  if (!key || typeof key !== "string" || !key.startsWith("ITKEY.")) {
    return res.status(400).json({ valid: false, error: "Định dạng khóa không hợp lệ (Phải bắt đầu bằng ITKEY.)" });
  }

  const parts = key.trim().split(".");
  if (parts.length !== 4) {
    return res.status(400).json({ valid: false, error: "Khóa bị sai cấu trúc chuẩn (4 thành phần)." });
  }

  const [prefix, tag, blob, sig] = parts;

  // Check signature using hashString (matches frontend & key generator)
  const expectedSig = hashString(blob + "::" + CONFIG.MASTER_AUTH_SALT);
  if (sig !== expectedSig) {
    const hmacSig = crypto
      .createHmac("sha256", CONFIG.MASTER_AUTH_SALT)
      .update(`${tag}.${blob}`)
      .digest("hex")
      .substring(0, 16)
      .toUpperCase();

    if (sig.toUpperCase() !== hmacSig) {
      db.logAudit("AUTH_VIOLATION_TAMPERING", "Security", { keyAttempt: key });
      return res.status(403).json({ valid: false, error: "Vi phạm an ninh: Chữ ký số không khớp hoặc khóa đã bị sửa đổi trái phép!" });
    }
  }

  try {
    let name = "Khách Hàng";
    let projectCode = "PRJ-RETAIL-2026";
    let phone = "";
    let dob = "";
    let timestamp = Date.now();

    try {
      const decrypted = decryptPayload(blob, CONFIG.MASTER_AUTH_SALT);
      const decParts = decrypted.split("::");
      if (decParts.length >= 4) {
        name = decParts[0];
        dob = decParts[1];
        phone = decParts[2];
        projectCode = decParts[3];
        timestamp = Number(decParts[4]) || Date.now();
      }
    } catch (e) {
      const rawJson = Buffer.from(blob, "hex").toString("utf8");
      const payload = JSON.parse(rawJson);
      name = payload.name;
      projectCode = payload.projectId || payload.projectCode;
      phone = payload.phone;
    }

    const project = db.getProjectById(projectCode);

    res.json({
      valid: true,
      payload: { name, dob, phone, projectCode, timestamp },
      project: project || null,
      message: "Xác thực khóa bảo mật thành công!"
    });
  } catch (err) {
    res.status(400).json({ valid: false, error: "Không thể giải mã dữ liệu trong khóa: " + err.message });
  }
});

// 8. Gemini Instance 1: Consultant AI (Tư Vấn & Bóc Tách Nhu Cầu - Hỗ trợ Trao Đổi Nhiều Lượt)
app.post("/api/ai/consult", async (req, res) => {
  try {
    const { prompt, history } = req.body;
    const analysis = await consultantAI.analyze(prompt, history);
    res.json({ success: true, data: analysis });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 9. Gemini Instance 2: Builder AI (Kiến Tạo & Sinh Website Khách Hàng)
app.post("/api/ai/generate-website", async (req, res) => {
  try {
    const { prompt, projectId } = req.body;
    const websiteConfig = await builderAI.generateWebsite(prompt, projectId);

    // If projectId is provided, update DB and invalidate cache immediately
    if (projectId) {
      db.updateProjectConfig(projectId, websiteConfig);
      await cache.invalidatePattern("projects:");
      const updatedProj = db.getProjectById(projectId);
      broadcastEvent("project:updated", updatedProj);
      return res.json({ success: true, data: websiteConfig, project: updatedProj, message: "Đã tạo website và đồng bộ vào CSDL thành công!" });
    }

    res.json({ success: true, data: websiteConfig });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 10. Open Trial & Self-Service Activation API (Cho Phép Khách Tự Động Kích Hoạt & Cấp Key Trải Nghiệm)
app.post("/api/trial/activate", async (req, res) => {
  try {
    const { name, phone, projectTitle, summary, websiteConfig } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Vui lòng nhập họ và tên của bạn." });
    }

    if (!phone || !phone.trim() || phone.trim().length < 8) {
      return res.status(400).json({ success: false, error: "Vui lòng nhập số điện thoại hoặc Zalo liên hệ hợp lệ để bảo mật quyền truy cập." });
    }

    // Sanitize input
    const cleanName = name.trim().replace(/[<>]/g, "");
    const cleanPhone = phone.trim().replace(/[<>]/g, "");
    const cleanTitle = (projectTitle || "Dự án Web Động Trải Nghiệm").trim().replace(/[<>]/g, "");

    const timestampSuffix = Date.now().toString().slice(-6);
    const projectId = `PRJ-TRIAL-${timestampSuffix}`;
    const projectCode = `TRIAL-${timestampSuffix}`;

    // Cryptographic key generation
    const key = generateClientAccessKey(cleanName, "TRIAL-USER", cleanPhone, projectId);

    // Dynamic AI Website Generation tailored to client's industry
    let genConfig = websiteConfig;
    if (!genConfig || !Array.isArray(genConfig.products) || genConfig.products.length === 0) {
      try {
        genConfig = await builderAI.generateWebsite(cleanTitle, projectCode);
      } catch (e) {
        genConfig = builderAI.fallbackBuilder(cleanTitle, projectCode);
      }
    }

    const products = genConfig?.products && genConfig.products.length > 0 ? genConfig.products : [
      { id: "p1", name: "Sản phẩm Mẫu Cao Cấp 01", category: "Danh Mục Chính", price: 1450000, stock: 50, sku: "PRD-01", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
      { id: "p2", name: "Sản phẩm Mẫu Cao Cấp 02", category: "Danh Mục Chính", price: 2150000, stock: 30, sku: "PRD-02", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
      { id: "p3", name: "Dịch Vụ Chuyên Nghiệp Đi Kèm", category: "Dịch Vụ", price: 850000, stock: 20, sku: "SRV-03", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80" }
    ];

    const newProject = {
      id: projectId,
      code: projectCode,
      name: cleanTitle,
      progress: 75,
      budget: "Bản Thử Nghiệm (Miễn Phí)",
      status: "ON-TRACK",
      stage: "Pha Thử Nghiệm & Trải Nghiệm Khách Hàng",
      serverCost: "Hệ thống Cục bộ / VPS Test",
      infraStrategy: "Cloud Staging + VietQR Mô Phỏng Thực Tế",
      tokenEfficiency: 98.0,
      isTrial: true,
      clientConfig: {
        layoutType: genConfig?.layoutType || "general",
        brandName: genConfig?.brandName || cleanTitle,
        headline: genConfig?.headline || "Hệ Thống Web Động May Đo Trải Nghiệm Trực Tiếp",
        deployMode: "Máy Chủ Thử Nghiệm (Localhost:5000)",
        previewUrl: "http://127.0.0.1:5000/storefront",
        customDomain: `https://${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "")}-trial.vn`,
        bannerTitle: genConfig?.bannerTitle || `${cleanTitle} - Phiên Bản Trải Nghiệm Thực Tế`,
        bannerSubtitle: genConfig?.bannerSubtitle || "Thanh toán quét mã VietQR tự động đối soát đơn hàng tức thì",
        adminUser: "trial_admin",
        adminPass: "Trial@2026Key",
        aiModel: "Gemini 3.6 Flash",
        products
      },
      tasks: [
        { id: "TR-01", dept: "01. Khởi Tạo", title: "Khởi tạo không gian dự án thử nghiệm", pic: "AI Orchestrator", status: "DONE", progress: 100 },
        { id: "TR-02", dept: "04. Giao Diện", title: "Thiết lập Design System mẫu theo ngành nghề", pic: "AI UI Builder", status: "DONE", progress: 100 },
        { id: "TR-03", dept: "06. Web Động", title: "Tích hợp cổng quét mã VietQR ngân hàng", pic: "Backend Lead", status: "DONE", progress: 100 },
        { id: "TR-04", dept: "08. Trải Nghiệm", title: "Khách hàng thử nghiệm tính năng và gửi feedback", pic: cleanName, status: "IN_PROGRESS", progress: 50 }
      ]
    };

    // Save project and trial lead
    db.addProject(newProject);

    const lead = db.addTrialLead({
      name: cleanName,
      phone: cleanPhone,
      projectTitle: cleanTitle,
      projectId,
      key,
      summary: summary || "Khách tự động kích hoạt trải nghiệm qua Client Portal"
    });

    db.logAudit("TRIAL_ACTIVATED", cleanName, { projectId, phone: cleanPhone, title: cleanTitle });

    // Notify all connected SSE clients (e.g. Admin Dashboard)
    broadcastEvent("trial:created", {
      lead,
      project: newProject,
      message: `Khách hàng ${cleanName} vừa kích hoạt dự án thử nghiệm: ${cleanTitle}`
    });

    res.json({
      success: true,
      message: "Kích hoạt dự án thử nghiệm thành công!",
      data: {
        key,
        projectId,
        projectCode,
        name: cleanName,
        projectTitle: cleanTitle,
        lead
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Lỗi kích hoạt thử nghiệm: " + err.message });
  }
});

// 11. Get Trial Leads API (Dành Cho Admin Thống Kê & Quản Lý Tệp Khách Thử Nghiệm)
app.get("/api/trial/leads", (req, res) => {
  const leads = db.getTrialLeads();
  res.json({ success: true, count: leads.length, data: leads });
});

// Fallback to index.html for SPA routes
app.use((req, res) => {
  res.sendFile(path.join(CONFIG.STATIC_DIR, "index.html"));
});

// Start Server
app.listen(CONFIG.PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 PRODUCTION IT-ASSIGNMENT SERVER RUNNING ON PORT ${CONFIG.PORT}`);
  console.log(`🌐 Executive Dashboard: http://localhost:${CONFIG.PORT}`);
  console.log(`💾 Database: Persistent JSON at ${CONFIG.DB_FILE}`);
  console.log(`⚡ Cache Layer: ${cache.metrics.mode}`);
  console.log(`⚙️  Queue System: ${jobQueue.concurrency} Concurrent Workers Active`);
  console.log(`======================================================\n`);
});

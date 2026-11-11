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

// 7. Cryptographic Key Verification API
app.post("/api/auth/verify-key", (req, res) => {
  const { key } = req.body;
  if (!key || !key.startsWith("ITKEY.")) {
    return res.status(400).json({ valid: false, error: "Định dạng khóa không hợp lệ (Phải bắt đầu bằng ITKEY.)" });
  }

  const parts = key.split(".");
  if (parts.length !== 4) {
    return res.status(400).json({ valid: false, error: "Khóa bị sai cấu trúc chuẩn (4 thành phần)." });
  }

  const [prefix, tag, hexPayload, signature] = parts;

  // Verify HMAC checksum
  const expectedSig = crypto
    .createHmac("sha256", CONFIG.MASTER_AUTH_SALT)
    .update(`${tag}.${hexPayload}`)
    .digest("hex")
    .substring(0, 16)
    .toUpperCase();

  if (signature.toUpperCase() !== expectedSig) {
    db.logAudit("AUTH_VIOLATION_TAMPERING", "Security", { keyAttempt: key });
    return res.status(403).json({ valid: false, error: "Vi phạm an ninh: Chữ ký số không khớp hoặc khóa đã bị sửa đổi trái phép!" });
  }

  try {
    const rawJson = Buffer.from(hexPayload, "hex").toString("utf8");
    const payload = JSON.parse(rawJson);

    // Verify against database project
    const project = db.getProjectById(payload.projectId || payload.projectCode || "PRJ-RETAIL-2026");

    res.json({
      valid: true,
      payload,
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

// Fallback to index.html for SPA routes
app.use((req, res) => {
  res.sendFile(path.join(CONFIG.STATIC_DIR, "index.html"));
});

// Start Server
app.listen(CONFIG.PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 PRODUCTION IT-ASSIGNMENT SERVER RUNNING ON PORT ${CONFIG.PORT}`);
  console.log(`🌐 Dashboard URL: http://localhost:${CONFIG.PORT}`);
  console.log(`📦 Client Portal: http://localhost:${CONFIG.PORT}/client_portal.html`);
  console.log(`🏢 Client Workspace: http://localhost:${CONFIG.PORT}/client_workspace.html`);
  console.log(`💾 Database: Persistent JSON at ${CONFIG.DB_FILE}`);
  console.log(`⚡ Cache Layer: ${cache.metrics.mode}`);
  console.log(`⚙️  Queue System: ${jobQueue.concurrency} Concurrent Workers Active`);
  console.log(`======================================================\n`);
});

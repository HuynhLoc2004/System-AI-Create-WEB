/**
 * Production Persistent Database Engine
 * Implements atomic persistence, schema migrations, and real data seeding.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { CONFIG } from "./config.js";

class ProductionDatabase {
  constructor() {
    this.filePath = CONFIG.DB_FILE;
    this.data = {
      projects: [],
      feedbacks: [],
      tasks: [],
      orders: [],
      trial_leads: [],
      audit_logs: [],
      _meta: {
        version: "2.0.0",
        lastUpdated: new Date().toISOString()
      }
    };
    this.init();
  }

  init() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, "utf8");
        this.data = JSON.parse(raw);
        this.data.trial_leads = this.data.trial_leads || [];
        this.data.projects = this.data.projects || [];
        // Hydrate files if missing for zero-load virtual code studio
        let needSave = false;
        this.data.projects.forEach(p => {
          if (!p.files || Object.keys(p.files).length === 0) {
            p.files = this.createDefaultProjectFiles(p);
            needSave = true;
          }
        });
        if (needSave) this.save();
        console.log(`[Database] Loaded persistent data from ${this.filePath} (${this.data.projects?.length || 0} projects)`);
      } catch (err) {
        console.error(`[Database] Error reading DB file, re-initializing: ${err.message}`);
        this.seedInitialData();
      }
    } else {
      console.log(`[Database] First run, seeding production database schema and records...`);
      this.seedInitialData();
    }
  }

  createDefaultProjectFiles(project) {
    const pkgName = (project.code || "project").toLowerCase().replace(/[^a-z0-9_-]/g, "");
    return {
      "package.json": JSON.stringify({
        name: pkgName,
        version: "1.0.0",
        type: "module",
        description: `Mã nguồn dự án ${project.name} (${project.code}) - Chuẩn 9 phòng ban`,
        scripts: {
          "dev": "vite",
          "build": "vite build",
          "preview": "vite preview"
        },
        dependencies: {
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
          "lucide-react": "^0.383.0"
        }
      }, null, 2),
      "src/App.jsx": `import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#0F172A', color: '#F8FAFC', minHeight: '100vh' }}>
      <header style={{ borderBottom: '1px solid #1E293B', paddingBottom: '1.25rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, color: '#38BDF8', fontSize: '1.6rem', fontWeight: 700 }}>${project.name}</h1>
          <p style={{ color: '#94A3B8', margin: '6px 0 0 0', fontSize: '0.85rem' }}>Mã dự án: <code style={{ color: '#34D399', background: '#0B1120', padding: '2px 6px', borderRadius: '4px' }}>${project.code}</code> &bull; Tiêu chuẩn 9 phòng ban IT-Assignment</p>
        </div>
        <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>Zero-Load Production Ready</span>
      </header>

      <main style={{ maxWidth: '900px' }}>
        <div style={{ background: '#1E293B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155', marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0, color: '#F1F5F9', fontSize: '1.15rem' }}>Kiến Trúc Không Trọng Lượng (Zero-Load)</h3>
          <p style={{ color: '#CBD5E1', lineHeight: 1.6, fontSize: '0.9rem' }}>
            Toàn bộ mã nguồn dự án được quản trị trực tiếp dạng Virtual File Tree (JSONB) trong cơ sở dữ liệu.
            Server không cần tải node_modules, máy chủ VPS đạt mức tải CPU 0% khi người dùng xem trước và kiểm thử.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
            <button onClick={() => setActiveTab('overview')} style={{ background: activeTab === 'overview' ? '#2563EB' : '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Tổng Quan Nghiệp Vụ</button>
            <button onClick={() => setActiveTab('tech')} style={{ background: activeTab === 'tech' ? '#2563EB' : '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Thông Số Kỹ Thuật</button>
          </div>
        </div>

        {activeTab === 'tech' && (
          <div style={{ background: '#0B1120', padding: '1.25rem', borderRadius: '8px', border: '1px solid #1E293B', fontFamily: 'monospace', fontSize: '0.82rem', color: '#A5B4FC' }}>
            <div>&bull; Ngân Sách Dự Toán: ${project.budget || 'Tiêu Chuẩn'}</div>
            <div>&bull; Hạ Tầng Triển Khai: ${project.infraStrategy || 'Docker VPS'}</div>
            <div>&bull; Cơ Chế Nén: In-Memory JSZip Streaming</div>
            <div>&bull; Lưu Trữ Code: PostgreSQL / DB JSONB (0% Inodes Pollution)</div>
          </div>
        )}
      </main>
    </div>
  );
}`,
      "src/index.css": `body {
  margin: 0;
  padding: 0;
  background-color: #0b1120;
  color: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}`,
      "database/schema.sql": `-- Cơ sở dữ liệu dự án ${project.name} (${project.code})
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  customer_name VARCHAR(128) NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  status VARCHAR(32) DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`,
      "docker-compose.yml": `version: '3.8'
services:
  app:
    image: node:22-alpine
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped`,
      "README.md": `# ${project.name} (${project.code})

> Dự án được khởi tạo và điều phối bởi hệ sinh thái 9 phòng ban kỹ thuật IT-Assignment.

## Kiến Trúc Zero-Load
- **Lưu trữ:** Virtual File Tree JSONB trong Database (0% node_modules trên đĩa VPS).
- **Xuất mã nguồn:** Nén trực tiếp từ RAM bằng JSZip Streaming.
- **Xem trước:** Render client-side 0% CPU server.`
    };
  }

  seedInitialData() {
    this.data.projects = [
      {
        id: "PRJ-RETAIL-2026",
        name: "Sàn Bán Lẻ Đa Kênh & VietQR Động",
        code: "RETAIL",
        progress: 0,
        budget: "May đo thực tế",
        status: "PLANNING",
        stage: "Pha 1: Khởi Tạo & Chờ Điều Phối AI",
        serverCost: "Localhost:5000 (Zero-Load)",
        infraStrategy: "Virtual File Tree JSONB (0% CPU VPS)",
        tokenEfficiency: 100,
        deptStatuses: {
          client: "IDLE", po: "IDLE", pm: "IDLE", ba: "IDLE", sa: "IDLE",
          ui: "IDLE", fe: "IDLE", be: "IDLE", dba: "IDLE", sec: "IDLE",
          qa: "IDLE", rel: "IDLE", devops: "IDLE", prod: "IDLE", analytics: "IDLE"
        },
        tasks: [],
        feedbacks: [],
        blockers: [],
        state: "DRAFT",
        history: [
          { time: "Khởi tạo", dept: "Hệ Thống", action: "Dự án đã sẵn sàng ở trạng thái 0% nguyên bản. Hãy phát lệnh AI để bắt đầu.", type: "info" }
        ],
        clientConfig: {
          brandName: "Novawear Premium Retail",
          headline: "Hệ Thống Bán Lẻ Thời Trang Đa Kênh Tích Hợp VietQR Tự Động",
          deployMode: "Máy Chủ Cục Bộ Nội Bộ (Localhost:5000)",
          previewUrl: "http://127.0.0.1:5000/storefront",
          customDomain: "https://novawear.com.vn",
          bannerTitle: "Bộ Sưu Tập Thu Đông 2026",
          bannerSubtitle: "Thanh toán quét mã VietQR nhận diện giao dịch tự động trong 0.8 giây",
          adminUser: "novawear_admin",
          adminPass: "Nova@2026MasterPass",
          aiModel: "Gemini 2.5 Flash",
          products: []
        }
      }
    ];

    this.data.feedbacks = [];
    this.data.tasks = [];
    this.data.orders = [];
    this.data.trial_leads = [];
    this.data.audit_logs = [];

    // Ensure default files exist for the project
    this.data.projects.forEach(p => {
      p.files = this.createDefaultProjectFiles(p);
    });

    this.save();
  }

  cleanAllMockData() {
    this.seedInitialData();
    return this.data.projects;
  }

  resetProjectToClean(projectId) {
    const proj = this.getProjectById(projectId);
    if (!proj) return null;
    proj.progress = 0;
    proj.status = "PLANNING";
    proj.stage = "Pha 1: Khởi Tạo & Chờ Điều Phối AI";
    proj.tasks = [];
    proj.feedbacks = [];
    proj.blockers = [];
    proj.state = "DRAFT";
    proj.deptStatuses = {
      client: "IDLE", po: "IDLE", pm: "IDLE", ba: "IDLE", sa: "IDLE",
      ui: "IDLE", fe: "IDLE", be: "IDLE", dba: "IDLE", sec: "IDLE",
      qa: "IDLE", rel: "IDLE", devops: "IDLE", prod: "IDLE", analytics: "IDLE"
    };

    // Filter tasks & feedbacks belonging to this project
    this.data.tasks = this.data.tasks.filter(t => t.projectId !== projectId);
    this.data.feedbacks = this.data.feedbacks.filter(f => f.projectId !== projectId);

    this.save();
    return proj;
  }

  save() {
    try {
      this.data._meta.lastUpdated = new Date().toISOString();
      const tempPath = `${this.filePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), "utf8");
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.error(`[Database] Error saving data: ${err.message}`);
    }
  }

  // Projects API
  getProjects() {
    return this.data.projects;
  }

  getProjectById(id) {
    if (!id) return this.data.projects[0] || null;
    const cleanId = String(id).toLowerCase().trim();
    let project = this.data.projects.find(p => 
      p.id === id || 
      p.code === id ||
      String(p.id).toLowerCase() === cleanId ||
      String(p.code).toLowerCase() === cleanId ||
      (cleanId === "prj_retail" && (p.id === "PRJ-RETAIL-2026" || p.code === "RETAIL"))
    );
    if (!project && this.data.projects.length > 0) {
      if (cleanId === "prj_retail" || cleanId === "starter" || cleanId === "default" || cleanId.includes("retail")) {
        return this.data.projects[0];
      }
    }
    return project || null;
  }

  getProject(id) {
    return this.getProjectById(id);
  }

  updateProjectConfig(id, config) {
    const proj = this.getProjectById(id);
    if (!proj) return null;
    proj.clientConfig = { ...proj.clientConfig, ...config };
    this.save();
    return proj;
  }

  // Feedbacks API
  getFeedbacks(projectId) {
    if (projectId) {
      return this.data.feedbacks.filter(f => f.projectId === projectId);
    }
    return this.data.feedbacks;
  }

  addFeedback(feedback) {
    const newFb = {
      id: "fb_" + Date.now().toString(36) + "_" + Math.random().toString(36).substr(2, 4),
      projectId: feedback.projectId || "PRJ-RETAIL-2026",
      sender: feedback.sender || "Khách Hàng / Đối Tác",
      category: feedback.category || "Góp ý chung",
      content: feedback.content,
      assignedDept: feedback.assignedDept || "01. Quản Trị Dự Án (PM)",
      solution: feedback.solution || "Đang chờ PM phân tích giải pháp kỹ thuật...",
      solutionDept: feedback.solutionDept || "01. Quản Trị Dự Án (PM)",
      status: feedback.status || "IN_PROGRESS",
      timestamp: "Vừa xong (" + new Date().toLocaleTimeString("vi-VN") + ")"
    };
    this.data.feedbacks.unshift(newFb);
    this.save();
    return newFb;
  }

  updateFeedbackSolution(id, { solution, solutionDept, status }) {
    const fb = this.data.feedbacks.find(f => f.id === id);
    if (!fb) return null;
    if (solution) fb.solution = solution;
    if (solutionDept) fb.solutionDept = solutionDept;
    if (status) fb.status = status;
    this.save();
    return fb;
  }

  // Tasks API
  getTasks(projectId) {
    if (projectId) {
      return this.data.tasks.filter(t => t.projectId === projectId);
    }
    return this.data.tasks;
  }

  addTask(task) {
    const newTask = {
      id: task.id || ("TSK-" + Math.floor(100 + Math.random() * 900)),
      projectId: task.projectId || "PRJ-RETAIL-2026",
      dept: task.dept || "01. Quản Trị (PM)",
      title: task.title,
      status: task.status || "IN_PROGRESS",
      cost: task.cost || "0 Token"
    };
    this.data.tasks.unshift(newTask);
    this.save();
    return newTask;
  }

  updateTaskStatus(id, status) {
    const task = this.data.tasks.find(t => t.id === id);
    if (!task) return null;
    task.status = status;
    this.save();
    return task;
  }

  // Orders & VietQR API
  createOrder(orderData) {
    const orderId = "ORD-" + Date.now().toString().slice(-6);
    const order = {
      id: orderId,
      projectId: orderData.projectId || "PRJ-RETAIL-2026",
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      customerName: orderData.customerName || "Khách Vãng Lai",
      customerPhone: orderData.customerPhone || "0909000111",
      vietQrPayload: `00020101021238580010A000000727012600069704220112NOVAPAY888880208QRIBFTTA5303704540${orderData.totalAmount || 100000}5802VN62160812${orderId}6304ABCD`,
      status: "PENDING_PAYMENT",
      createdAt: new Date().toISOString()
    };
    this.data.orders.unshift(order);
    this.save();
    return order;
  }

  getOrder(id) {
    return this.data.orders.find(o => o.id === id);
  }

  reconcileOrder(id, transactionRef) {
    const order = this.getOrder(id);
    if (!order) return null;
    order.status = "PAID";
    order.transactionRef = transactionRef || ("TXN-" + Date.now());
    order.paidAt = new Date().toISOString();
    this.save();
    return order;
  }

  // Trial Leads Management (Open Trial & Self-Service)
  getTrialLeads() {
    if (!this.data.trial_leads) this.data.trial_leads = [];
    return this.data.trial_leads;
  }

  addTrialLead(leadData) {
    if (!this.data.trial_leads) this.data.trial_leads = [];
    const newLead = {
      id: leadData.id || ("LEAD-" + Date.now().toString().slice(-6)),
      name: leadData.name,
      phone: leadData.phone,
      projectTitle: leadData.projectTitle || "Dự án thử nghiệm",
      projectId: leadData.projectId,
      key: leadData.key,
      summary: leadData.summary || "",
      status: "TRIAL_ACTIVE",
      createdAt: new Date().toISOString()
    };
    this.data.trial_leads.unshift(newLead);
    this.save();
    return newLead;
  }

  addProject(project) {
    if (!project.files || Object.keys(project.files).length === 0) {
      project.files = this.createDefaultProjectFiles(project);
    }
    this.data.projects.unshift(project);
    this.save();
    return project;
  }

  // Virtual Code Studio (Zero-Load File Tree APIs)
  getProjectFiles(projectId) {
    const proj = this.getProject(projectId);
    if (!proj) return null;
    if (!proj.files || Object.keys(proj.files).length === 0) {
      proj.files = this.createDefaultProjectFiles(proj);
      this.save();
    }
    return proj.files;
  }

  updateProjectFile(projectId, filePath, content) {
    const proj = this.getProject(projectId);
    if (!proj) return null;
    if (!proj.files) {
      proj.files = this.createDefaultProjectFiles(proj);
    }
    proj.files[filePath] = content;
    proj.history = proj.history || [];
    proj.history.unshift({
      time: "Vừa xong",
      dept: "Vibe Coder AI",
      action: `[VIBE CODE] Cập nhật tệp mã nguồn: ${filePath}`,
      type: "success"
    });
    this.save();

    // 🌟 GHI TRỰC TIẾP VÀO Ổ ĐĨA VẬT LÝ DỰ ÁN (Physical Workspace Disk Sync)
    try {
      const workspaceRoot = process.env.LOCAL_WORKSPACE_ROOT || process.cwd();
      const targetDiskPath = path.resolve(workspaceRoot, filePath);
      if (targetDiskPath.startsWith(path.resolve(workspaceRoot))) {
        const targetDir = path.dirname(targetDiskPath);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        // Bảo vệ file package.json gốc không bị mất server dependencies
        if (filePath === "package.json" && fs.existsSync(targetDiskPath)) {
          try {
            const currentPkg = JSON.parse(fs.readFileSync(targetDiskPath, "utf8"));
            const newPkg = JSON.parse(content);
            const mergedPkg = {
              ...currentPkg,
              ...newPkg,
              scripts: { ...(currentPkg.scripts || {}), ...(newPkg.scripts || {}) },
              dependencies: { ...(currentPkg.dependencies || {}), ...(newPkg.dependencies || {}) }
            };
            fs.writeFileSync(targetDiskPath, JSON.stringify(mergedPkg, null, 2), "utf8");
            console.log(`[Physical Disk Write] Đã cập nhật kết hợp: ${targetDiskPath}`);
            return { filePath, content };
          } catch (_) {}
        }

        fs.writeFileSync(targetDiskPath, content, "utf8");
        console.log(`[Physical Disk Write] Đã ghi trực tiếp vào ổ đĩa: ${targetDiskPath}`);
      }
    } catch (diskErr) {
      console.warn(`[Physical Disk Write Warning] Không thể ghi file vào ổ đĩa: ${diskErr.message}`);
    }

    return { filePath, content };
  }

  recordIdeProgress({ dept, taskTitle, fileTarget, status, note }) {
    const projects = this.getProjects();
    if (!projects || projects.length === 0) return null;
    const project = projects[0];

    const taskId = `IDE-${Math.floor(100 + Math.random() * 900)}`;
    project.tasks = project.tasks || [];
    project.tasks.unshift({
      id: taskId,
      dept: dept || "Lập Trình",
      title: taskTitle || "Cập nhật mã nguồn từ IDE",
      pic: `${dept || "Developer"} (IDE Agent)`,
      status: status || "DONE",
      progress: status === "DONE" ? 100 : (status === "IN_PROGRESS" ? 50 : 0),
      note: note || (fileTarget ? `Tệp: ${fileTarget}` : "Thực thi trực tiếp từ IDE"),
      isDirective: true
    });

    if (project.deptStatuses && dept) {
      project.deptStatuses[dept] = status || "DONE";
    }

    project.history = project.history || [];
    project.history.unshift({
      time: "Vừa xong",
      dept: dept || "IDE Vibe Coding",
      action: `[IDE VIBE] ${taskTitle} ${fileTarget ? `(${fileTarget})` : ""}`,
      type: status === "BLOCKED" ? "danger" : "success"
    });

    if (fileTarget) {
      try {
        const workspaceRoot = process.env.LOCAL_WORKSPACE_ROOT || process.cwd();
        const fullDiskPath = path.resolve(workspaceRoot, fileTarget);
        if (fs.existsSync(fullDiskPath)) {
          const fileContent = fs.readFileSync(fullDiskPath, "utf8");
          project.files = project.files || {};
          project.files[fileTarget] = fileContent;
        }
      } catch (_) {}
    }

    const totalTasks = project.tasks.length;
    const doneTasks = project.tasks.filter(t => t.status === "DONE").length;
    project.progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    this.save();
    return { project, taskId };
  }

  syncProjectFilesToDisk(projectId) {
    const proj = this.getProject(projectId);
    if (!proj || !proj.files) return;
    const workspaceRoot = process.env.LOCAL_WORKSPACE_ROOT || process.cwd();
    for (const [filePath, content] of Object.entries(proj.files)) {
      try {
        const targetDiskPath = path.resolve(workspaceRoot, filePath);
        if (targetDiskPath.startsWith(path.resolve(workspaceRoot))) {
          const targetDir = path.dirname(targetDiskPath);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          fs.writeFileSync(targetDiskPath, content, "utf8");
          console.log(`[Physical Disk Write] Đã đồng bộ file vật lý vào ổ đĩa: ${filePath}`);
        }
      } catch (err) {
        console.warn(`[Disk Sync Warning] ${filePath}: ${err.message}`);
      }
    }
  }

  deleteProjectFile(projectId, filePath) {
    const proj = this.getProject(projectId);
    if (!proj || !proj.files) return false;
    delete proj.files[filePath];
    this.save();
    return true;
  }

  // Audit Logs
  logAudit(action, actor, details) {
    const log = {
      id: "log_" + Date.now(),
      action,
      actor,
      details,
      timestamp: new Date().toISOString()
    };
    this.data.audit_logs.unshift(log);
    if (this.data.audit_logs.length > 500) {
      this.data.audit_logs.pop();
    }
    this.save();
    return log;
  }
}

export const db = new ProductionDatabase();

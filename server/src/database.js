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
        this.data.projects.forEach(p => {
          if (!p.files) p.files = {};
        });
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
    return {};
  }

  seedInitialData() {
    const workspaceRoot = process.env.LOCAL_WORKSPACE_ROOT || process.cwd();
    const folderName = path.basename(path.resolve(workspaceRoot));
    const projectCode = folderName.toUpperCase().replace(/[^A-Z0-9_-]/g, "") || "PROJECT";
    const projectName = folderName.replace(/[-_]/g, " ");

    this.data.projects = [
      {
        id: `PRJ-${projectCode}`,
        name: projectName,
        code: projectCode,
        progress: 0,
        budget: "Khởi tạo theo yêu cầu",
        status: "PLANNING",
        stage: "Pha 1: Khởi Tạo & Chờ Điều Phối AI",
        serverCost: "Localhost:5000 (Zero-Load)",
        infraStrategy: "Local Workspace File System",
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
          { time: "Khởi tạo", dept: "Hệ Thống", action: `Dự án [${projectName}] đã sẵn sàng ở trạng thái 0% nguyên bản (0 tác vụ). Hãy bắt đầu phát lệnh AI!`, type: "info" }
        ],
        files: {}
      }
    ];

    this.data.feedbacks = [];
    this.data.tasks = [];
    this.data.orders = [];
    this.data.trial_leads = [];
    this.data.audit_logs = [];

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

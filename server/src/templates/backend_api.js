/**
 * BACKEND DYNAMIC CMS & OPERATIONS ROUTER
 * Phòng ban phụ trách: 06_Backend_Development & 07_Database_Management
 * Kiến trúc: Dynamic Section-Driven & Catalog Operations REST API
 * Ngành nghề: {{TITLE}}
 */
import { Router } from "express";

export function createProjectRouter(db, broadcastEvent) {
  const router = Router();

  function resolveProject(req, res) {
    const projectId = req.params.projectId || req.projectId;
    const project = db.getProjectById(projectId);
    if (!project) {
      res.status(404).json({ success: false, error: "Không tìm thấy dự án " + projectId });
      return null;
    }
    project.data = project.data || {};
    project.data.sections = project.data.sections || [];
    project.data.catalog_items = project.data.catalog_items || [];
    project.data.submissions = project.data.submissions || [];
    return project;
  }

  // --- CLIENT APIS ---
  router.get("/client/sections", (req, res) => {
    const project = resolveProject(req, res);
    if (!project) return;
    const active = project.data.sections.filter(s => s.active !== false);
    res.json({ success: true, projectId: project.id, data: active });
  });

  router.get("/client/catalog", (req, res) => {
    const project = resolveProject(req, res);
    if (!project) return;
    const active = project.data.catalog_items.filter(i => i.status !== "INACTIVE");
    res.json({ success: true, projectId: project.id, data: active });
  });

  router.post("/client/submissions", (req, res) => {
    const project = resolveProject(req, res);
    if (!project) return;
    const { customerName, phone, itemId, itemName, scheduledDate, note } = req.body;
    if (!customerName || !phone) {
      return res.status(400).json({ success: false, error: "Họ tên và Số điện thoại là bắt buộc" });
    }
    const submission = {
      id: "SUB-" + Math.floor(1000 + Math.random() * 9000),
      customerName: String(customerName).trim(),
      phone: String(phone).trim(),
      itemId: itemId || "",
      itemName: itemName || "Tư vấn tổng quát",
      scheduledDate: scheduledDate || new Date().toISOString().split("T")[0],
      note: note ? String(note).trim() : "",
      status: "PENDING",
      createdAt: new Date().toISOString()
    };
    project.data.submissions.unshift(submission);
    db.save();

    if (typeof broadcastEvent === "function") {
      broadcastEvent("submission:created", { projectId: project.id, submission });
      broadcastEvent("project:data_updated", { projectId: project.id, action: "ADD_SUBMISSION", submission });
    }
    res.json({ success: true, message: "Đặt lịch thành công!", data: submission });
  });

  router.get("/client/submissions", (req, res) => {
    const project = resolveProject(req, res);
    if (!project) return;
    const { phone } = req.query;
    if (!phone) return res.json({ success: true, data: [] });
    const clean = String(phone).replace(/\D/g, "");
    const matches = project.data.submissions.filter(s => {
      const sp = String(s.phone).replace(/\D/g, "");
      return sp.includes(clean) || clean.includes(sp);
    });
    res.json({ success: true, data: matches });
  });

  // --- ADMIN APIS ---
  router.get("/admin/sections", (req, res) => {
    const project = resolveProject(req, res);
    if (!project) return;
    res.json({ success: true, projectId: project.id, data: project.data.sections });
  });

  router.get("/admin/catalog", (req, res) => {
    const project = resolveProject(req, res);
    if (!project) return;
    res.json({ success: true, projectId: project.id, data: project.data.catalog_items });
  });

  router.post("/admin/catalog", (req, res) => {
    const project = resolveProject(req, res);
    if (!project) return;
    const { name, category, price, duration_or_unit, description } = req.body;
    const item = {
      id: "item-" + Date.now().toString(36),
      name: String(name || "").trim(),
      category: category ? String(category).trim() : "Chung",
      price: price || 0,
      duration_or_unit: duration_or_unit || "Lần",
      description: description || "",
      status: "ACTIVE",
      updatedAt: new Date().toISOString()
    };
    project.data.catalog_items.push(item);
    db.save();
    res.json({ success: true, data: item, catalog: project.data.catalog_items });
  });

  router.get("/admin/submissions", (req, res) => {
    const project = resolveProject(req, res);
    if (!project) return;
    res.json({ success: true, projectId: project.id, data: project.data.submissions });
  });

  router.put("/admin/submissions/:id/status", (req, res) => {
    const project = resolveProject(req, res);
    if (!project) return;
    const { id } = req.params;
    const { status } = req.body;
    const sub = project.data.submissions.find(s => s.id === id);
    if (!sub) return res.status(404).json({ success: false, error: "Không tìm thấy đơn " + id });
    sub.status = status || sub.status;
    sub.updatedAt = new Date().toISOString();
    db.save();
    res.json({ success: true, data: sub });
  });

  return router;
}

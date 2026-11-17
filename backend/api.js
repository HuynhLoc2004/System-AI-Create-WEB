/**
 * BACKEND DYNAMIC CMS ROUTER
 * Phòng ban phụ trách: 06_Backend_Development & 07_Database_Management
 * Kiến trúc: Dynamic Section-Driven REST API
 * Ngành nghề: Hệ Thống Nha Khoa & Phòng Khám Chuyên Khoa
 */
import { Router } from "express";

export function createProjectRouter(db, broadcastEvent) {
  const router = Router();

  // Helper trích xuất project từ DB
  function resolveProject(req, res) {
    const projectId = req.params.projectId || req.projectId;
    const project = db.getProjectById(projectId);
    if (!project) {
      res.status(404).json({ success: false, error: "Không tìm thấy dự án " + projectId });
      return null;
    }
    project.data = project.data || { sections: [], settings: {} };
    project.data.sections = project.data.sections || [];
    return project;
  }

  // 1. PUBLIC CLIENT API: Lấy các section đang bật
  router.get("/client/sections", (req, res) => {
    const project = resolveProject(req, res);
    if (!project) return;
    const activeSections = project.data.sections.filter(s => s.active !== false);
    res.json({ success: true, projectId: project.id, data: activeSections });
  });

  // 2. PUBLIC CLIENT API: Lấy dữ liệu cấu hình chung
  router.get("/client/data", (req, res) => {
    const project = resolveProject(req, res);
    if (!project) return;
    res.json({ success: true, projectId: project.id, data: project.data });
  });

  // 3. ADMIN CMS API: Lấy toàn bộ danh sách section để quản trị
  router.get("/admin/sections", (req, res) => {
    const project = resolveProject(req, res);
    if (!project) return;
    res.json({ success: true, projectId: project.id, data: project.data.sections });
  });

  // 4. ADMIN CMS API: Thêm mới section
  router.post("/admin/sections", (req, res) => {
    const project = resolveProject(req, res);
    if (!project) return;
    const { title, subtitle, type, content, items } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: "Tiêu đề section không được để trống" });
    }
    const newSection = {
      id: "sec-" + Date.now().toString(36),
      title: String(title).trim(),
      subtitle: subtitle ? String(subtitle).trim() : "",
      type: type || "content",
      content: content || "",
      items: Array.isArray(items) ? items : [],
      active: true,
      updatedAt: new Date().toISOString()
    };
    project.data.sections.push(newSection);
    db.save();

    if (typeof broadcastEvent === "function") {
      broadcastEvent("project:data_updated", { projectId: project.id, action: "ADD_SECTION", section: newSection });
    }
    res.json({ success: true, message: "Đã thêm section mới thành công", data: newSection, sections: project.data.sections });
  });

  // 5. ADMIN CMS API: Cập nhật section hoặc bật/tắt
  router.put("/admin/sections/:id", (req, res) => {
    const project = resolveProject(req, res);
    if (!project) return;
    const { id } = req.params;
    const sec = project.data.sections.find(s => s.id === id);
    if (!sec) {
      return res.status(404).json({ success: false, error: "Không tìm thấy section " + id });
    }
    Object.assign(sec, req.body, { updatedAt: new Date().toISOString() });
    db.save();

    if (typeof broadcastEvent === "function") {
      broadcastEvent("project:data_updated", { projectId: project.id, action: "UPDATE_SECTION", section: sec });
    }
    res.json({ success: true, message: "Đã cập nhật section", data: sec, sections: project.data.sections });
  });

  // 6. ADMIN CMS API: Xóa section
  router.delete("/admin/sections/:id", (req, res) => {
    const project = resolveProject(req, res);
    if (!project) return;
    const { id } = req.params;
    project.data.sections = project.data.sections.filter(s => s.id !== id);
    db.save();

    if (typeof broadcastEvent === "function") {
      broadcastEvent("project:data_updated", { projectId: project.id, action: "DELETE_SECTION", deletedId: id });
    }
    res.json({ success: true, message: "Đã xóa section", sections: project.data.sections });
  });

  return router;
}

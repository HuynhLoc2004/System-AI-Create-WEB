# KIẾN TRÚC BACKEND STATELESS & IN-MEMORY ZIP STREAMING
## DÀNH CHO BACKEND LEAD & API ENGINEER

> [!IMPORTANT]
> Backend tuân thủ nguyên tắc Stateless tuyệt đối: Không sinh file rác trên filesystem Linux VPS, sử dụng streaming binary trực tiếp từ RAM khi phục vụ file ZIP.

---

## 1. MẪU XỬ LÝ STREAMING ZIP TỪ RAM (JSZIP)

```javascript
import JSZip from "jszip";

/**
 * Xuất trọn bộ mã nguồn dự án thành file .zip trực tiếp từ RAM
 * Tuyệt đối không ghi ra đĩa cứng server!
 */
export async function handleExportProjectZip(req, res, project) {
  try {
    const files = project.files || {};
    const zip = new JSZip();

    // Duyệt cây thư mục ảo từ JSONB
    for (const [filePath, content] of Object.entries(files)) {
      zip.file(filePath, content);
    }

    // Sinh buffer zip trong RAM
    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 }
    });

    const safeName = (project.code || "project").toLowerCase().replace(/[^a-z0-9_-]/g, "");

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${safeName}_source_code.zip"`);
    res.setHeader("Content-Length", zipBuffer.length);

    return res.end(zipBuffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
```

---

## 2. API CẬP NHẬT FILE NGUYÊN TỬ (ATOMIC FILE PATCH)

Khi AI sinh code hoặc người dùng chỉnh sửa 1 file duy nhất:
- Nhận request: `PUT /api/projects/:id/files` với body `{ filePath, content }`.
- Ghi đè khóa `project.files[filePath] = content`.
- Kích hoạt sự kiện SSE `project:file_updated` để tất cả các màn hình quản trị viên cùng thấy cập nhật.

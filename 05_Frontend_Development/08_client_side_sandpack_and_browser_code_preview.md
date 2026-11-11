# KIẾN TRÚC CLIENT-SIDE IN-BROWSER CODE PREVIEW (0% SERVER CPU)
## DÀNH CHO FRONTEND DEVELOPER & UI/UX DESIGNER

> [!TIP]
> Việc biên dịch, bundling và chạy thử (Live Preview) giao diện website của từng người dùng tuyệt đối KHÔNG thực hiện trên server bằng lệnh `npm run dev`. Toàn bộ tác vụ render giao diện được đẩy 100% xuống CPU và RAM của chính trình duyệt người dùng.

---

## 1. MÔ HÌNH THI CÔNG TRÌNH DIỄN GIAO DIỆN (SANDPACK / SRCDOC)

```mermaid
sequenceDiagram
    autonumber
    actor User as Quản Trị Viên (Browser)
    participant ClientApp as Dashboard Frontend
    participant Server as Backend API (Stateless)
    
    User->>ClientApp: Mở Tab "Kho Mã Nguồn Dự Án" (Virtual Studio)
    ClientApp->>Server: GET /api/projects/:id/files (Chỉ tải JSON thuần ~ 80KB)
    Server-->>ClientApp: Trả về JSONB { "src/App.jsx": "...", ... }
    Note over ClientApp: 0% tải CPU máy chủ backend!
    ClientApp->>ClientApp: Dựng cây thư mục & Hiển thị Code Editor
    User->>ClientApp: Bấm "Chạy Thử Trực Tiếp (Live Preview)"
    ClientApp->>ClientApp: Trình duyệt tự nạp Virtual Files vào Sandpack / Iframe srcdoc
    ClientApp-->>User: Giao diện Web hiển thị mượt mà tức thì
```

---

## 2. QUY CHUẨN XUẤT ZIP TRỰC TIẾP TRÊN TRÌNH DUYỆT

- Sử dụng thư viện `JSZip` chạy trực tiếp trên luồng Worker hoặc RAM của trình duyệt.
- Người dùng bấm nút **"Tải Trọn Bộ ZIP Code"**:
  - Mã nguồn từ chuỗi JSON được nén thành blob `.zip` ngay trong bộ nhớ client.
  - Tự động kích hoạt hành động tải xuống (`saveAs(blob, "project.zip")`).
  - Máy chủ không tốn 1 byte ổ cứng để tạo file tạm.


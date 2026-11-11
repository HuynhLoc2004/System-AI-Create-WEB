# QUY TRÌNH QUẢN TRỊ KIẾN TRÚC ZERO-LOAD & VIRTUAL CODE WORKSPACE
## DÀNH CHO PROJECT MANAGER & SYSTEM ARCHITECT (TIÊU CHUẨN PRODUCTION)

> [!IMPORTANT]
> **Nguyên tắc cốt lõi:** Khi hệ thống mở rộng phục vụ hàng nghìn dự án, máy chủ VPS tuyệt đối KHÔNG bao giờ được biến thành máy build mã nguồn cá nhân hay tải `node_modules` nặng hàng gigabyte. Toàn bộ mã nguồn dự án được quản trị dưới dạng **Virtual File Tree (JSONB)** thuần text trong Cơ Sở Dữ Liệu và RAM.

---

## 1. BẢNG SO SÁNH HIỆU NĂNG KIẾN TRÚC

| Tiêu Chí Đánh Giá | Mô Hình Truyền Thống (Cũ) | Mô Hình Zero-Load Virtual Code (Chuẩn Mới) |
| :--- | :--- | :--- |
| **Dung lượng mỗi dự án** | 300MB – 800MB (kèm `node_modules`) | **200KB – 500KB** (Thuần Text JSONB) |
| **Sức chứa trên 1GB RAM/Disk** | 2 – 5 dự án (nguy cơ OOM) | **2,000 – 5,000 dự án chạy song song** |
| **Tải CPU Máy Chủ** | 80% – 100% khi build/dev | **0% – 2% (Stateless API)** |
| **Xuất file mã nguồn** | Nén ổ đĩa sinh file rác | **Nén từ RAM (JSZip Stream) 0-byte Disk** |
| **Độ trễ AI phản hồi** | 30s – 60s (gửi cả dự án phình token) | **1s – 3s (Selective Context Pruning)** |

---

## 2. NGUYÊN TẮC HOẠT ĐỘNG CỦA 2 CON AI TRONG PHÒNG BAN

```mermaid
flowchart TD
    Admin["Admin Master / Khách Hàng"] -->|"1. Gửi Yêu Cầu Kỹ Thuật"| Orchestrator["AI 1: Quản Trị & Điều Phối (PM / SA AI)"]
    
    subgraph S1["Bóc Tách & Tối Ưu Ngữ Cảnh"]
        Orchestrator -->|"2. Nhận File Tree Rút Gọn (Chỉ tên file)"| Context["Cắt Lớp Ngữ Cảnh (Context Pruning)"]
        Context -->|"3. Chỉ định Phòng Ban & File đích"| Spec["Bản Đặc Tả Kỹ Thuật (Precision Task)"]
    end
    
    Spec -->|"4. Gửi Spec + Nội Dung 1 File Cần Sửa"| VibeCoder["AI 2: Chuyên Gia Lập Trình (Specialist Coder AI)"]
    
    subgraph S2["Lập Trình & Lưu Trữ Không Trọng Lượng"]
        VibeCoder -->|"5. Xuất Code Sạch (Zero Bloat)"| CodePatch["Bản Vá Mã Nguồn (Code Patch)"]
        CodePatch -->|"6. Cập nhật trực tiếp files[path]"| Database[("Cơ Sở Dữ Liệu JSONB / PostgreSQL")]
    end
    
    Database -->|"7. Đồng bộ SSE thời gian thực"| Dashboard["Dashboard Giám Sát 9 Phòng Ban"]
    Dashboard -->|"8. In-Browser Preview & Tải ZIP từ RAM"| User["Trình Duyệt Người Dùng (Client RAM)"]
```

---

## 3. CHECKLIST KIỂM ĐỊNH CHO PM TRƯỚC KHI DUYỆT CODE

1. **Tuyệt đối không lưu thư mục `node_modules` hay file build tạm (`dist/`, `.next/`, `build/`) lên ổ cứng VPS.**
2. **Mỗi dự án lưu trữ dạng dictionary cấu trúc phẳng:**
   ```json
   {
     "package.json": "...",
     "src/App.jsx": "...",
     "src/components/Navbar.jsx": "...",
     "database/schema.sql": "..."
   }
   ```
3. **Mọi thao tác xuất mã nguồn phải dùng cơ chế nén trực tiếp từ RAM (`JSZip`) và bắn Stream về trình duyệt.**
4. **Việc render chạy thử (Live Preview) được đẩy toàn bộ về Client-side sử dụng bộ giả lập trình duyệt hoặc Sandbox.**

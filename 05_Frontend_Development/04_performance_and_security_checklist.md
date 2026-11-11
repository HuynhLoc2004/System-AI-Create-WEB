# BẢNG KIỂM ĐỊNH HIỆU NĂNG CLIENT & BẢO MẬT FRONTEND

## 1. Mục Tiêu Chỉ Số Trải Nghiệm Web Cốt Lõi (Core Web Vitals)

| Chỉ Số | Tên Viết Tắt | Mục Tiêu Chuẩn | Giải Pháp Đạt Chuẩn Trong Code |
|---|:---:|:---:|---|
| **Largest Contentful Paint** | **LCP** | **< 2.5 Giây** | Sử dụng component `<Image priority />` của Next.js cho ảnh Banner Hero, nén định dạng WebP/AVIF qua CDN |
| **Interaction to Next Paint** | **INP** | **< 200 ms** | Tách nhỏ các tác vụ JavaScript nặng (Web Workers hoặc `startTransition`), tránh block Main Thread |
| **Cumulative Layout Shift** | **CLS** | **< 0.1** | Luôn quy định rõ thuộc tính `width` và `height` cho ảnh và video; dùng Skeleton giữ chỗ trước |

---

## 2. Danh Mục Kiểm Tra An Toàn Bảo Mật Client (Frontend Security Checklist)
- [ ] **Chống tấn công XSS (Cross-Site Scripting):** Không sử dụng `dangerouslySetInnerHTML` tùy tiện. Trong trường hợp bắt buộc phải render nội dung HTML từ CMS bài viết, bắt buộc bọc qua thư viện lọc mã độc `DOMPurify.sanitize(dirtyHtml)`.
- [ ] **Bảo vệ Cookie Token:** Access và Refresh Token lưu trữ hoàn toàn trong HttpOnly Cookie từ Backend, mã nguồn JavaScript ở Client không thể đọc được thông qua `document.cookie`.
- [ ] **Khử trùng dữ liệu đầu vào (Input Sanitization):** Dùng Zod Schema để validate định dạng số điện thoại, email, không cho phép nhập các ký tự đặc biệt chứa script injection.
- [ ] **Chính sách bảo mật nội dung (Content Security Policy - CSP):** Cấu hình CSP Headers trong file cấu hình `next.config.js` để chặn nạp script lạ từ các domain chưa được định danh.


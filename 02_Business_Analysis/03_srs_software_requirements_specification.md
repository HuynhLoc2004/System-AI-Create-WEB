# TÀI LIỆU ĐẶC TẢ KỸ THUẬT PHẦN MỀM (SOFTWARE REQUIREMENTS SPECIFICATION - SRS)

## 1. Yêu Cầu Chức Năng (Functional Requirements - FR)

### Phân Hệ 1: Xác Thực & Quản Lý Người Dùng (Auth & User Management)
* **FR-AUTH-01:** Hệ thống phải hỗ trợ đăng nhập qua Số điện thoại + OTP, Email + Mật khẩu, và Google Single Sign-On (SSO).
* **FR-AUTH-02:** Hệ thống phải áp dụng cơ chế xác thực JWT với Access Token (hạn 15 phút) và Refresh Token (hạn 7 ngày) được lưu trữ trong HttpOnly Cookie.
* **FR-AUTH-03:** Hệ thống phải cung cấp ma trận phân quyền dựa trên vai trò (Role-Based Access Control - RBAC) với 4 nhóm quyền: `Super Admin`, `Store Manager`, `Staff`, và `Customer`.

### Phân Hệ 2: Quản Lý Sản Phẩm & Tồn Kho (Catalog & Inventory)
* **FR-CAT-01:** Cho phép quản lý sản phẩm đa biến thể (Màu sắc, Kích thước, Dung lượng) với từng SKU và mã vạch Barcode riêng biệt.
* **FR-INV-02:** Khi người dùng bấm "Đặt hàng", hệ thống phải thực hiện khóa tạm thời số lượng tồn kho (Pessimistic Lock / Redis Lock) trong vòng 10 phút. Nếu quá 10 phút chưa thanh toán thành công, hệ thống tự động giải phóng tồn kho.

### Phân Hệ 3: Giỏ Hàng & Thanh Toán Trực Tuyến (Checkout & Payment)
* **FR-PAY-01:** Hỗ trợ thanh toán tự động qua VietQR động, Cổng VNPay, Ví MoMo, Thẻ quốc tế Visa/Mastercard.
* **FR-PAY-02:** Xử lý Webhook thanh toán bảo đảm tính **Idempotency** (Chống việc ghi nhận trùng giao dịch khi nhà mạng gửi lại webhook nhiều lần).

---

## 2. Yêu Cầu Phi Chức Năng (Non-Functional Requirements - NFR)

### NFR-01: Hiệu Năng & Tốc Độ (Performance)
* 95% các yêu cầu truy vấn API thông thường (Read operations) phải trả về kết quả trong thời gian dưới **200 mili-giây** (P95 < 200ms).
* Các tác vụ ghi dữ liệu (Write / Transaction operations) phải hoàn tất trong vòng dưới **500 mili-giây**.
* Thời gian tải lần đầu của giao diện trang chủ trên trình duyệt di động (LCP - Largest Contentful Paint) phải đạt dưới **2.5 giây**.

### NFR-02: Độ Sẵn Sàng & Khả Năng Mở Rộng (Availability & Scalability)
* Cam kết mức độ hoạt động liên tục (Uptime SLA) đạt tối thiểu **99.9%** (Thời gian chết tối đa không quá 43.8 phút/tháng).
* Kiến trúc hệ thống sẵn sàng co giãn tự động (Horizontal Auto-scaling) khi chịu tải đột biến tối thiểu 5.000 người dùng hoạt động đồng thời (CCU).

### NFR-03: Bảo Mật Thông Tin (Security)
* 100% dữ liệu truyền qua mạng phải được mã hóa qua giao thức HTTPS (TLS 1.3).
* Mật khẩu người dùng phải được băm an toàn bằng thuật toán **Argon2id** hoặc **bcrypt** với Cost Factor tối thiểu là 12.
* Phòng chống tuyệt đối các lỗ hổng theo tiêu chuẩn OWASP Top 10 (SQL Injection, XSS, CSRF, Broken Access Control).

### NFR-04: Khả Năng Phục Hồi (Disaster Recovery)
* **RPO (Recovery Point Objective):** Tối đa 1 giờ (Tổn thất dữ liệu tối đa không quá 1 giờ trong trường hợp thảm họa trung tâm dữ liệu).
* **RTO (Recovery Time Objective):** Tối đa 2 giờ (Hệ thống phải được khôi phục và hoạt động trở lại bình thường trong vòng 120 phút).


# BIỂU MẪU BÁO CÁO LỖI CHUẨN MỰC (BUG REPORT TEMPLATE)

* **Mã vé:** `BUG-2026-089`
* **Tiêu đề:** `[CHECKOUT] Mã VietQR không tự động cập nhật trạng thái khi ngân hàng đã gửi webhook IPN`
* **Người phát hiện:** QA Senior Specialist
* **Người được gán xử lý:** Backend Core Lead
* **Mức độ nghiêm trọng:** `Blocker (S1)` | **Độ ưu tiên:** `P1 (Highest)`
* **Môi trường:** `Staging (v1.4.2-rc)` | Thiết bị: iPhone 14 Pro (iOS 17.5 / Safari)

---

## 1. Các Bước Tái Hiện Lỗi (Steps to Reproduce)
1. Đăng nhập tài khoản khách hàng `0901234567`.
2. Thêm sản phẩm `SKU-AP-PRO2` vào giỏ và bấm "Tiến hành Đặt Hàng" bằng phương thức VietQR.
3. Mở Postman gửi giả lập Webhook từ ngân hàng:
   `POST https://api-staging.domain.com/v1/payments/webhook/vietqr` với payload thanh toán hợp lệ.
4. Quan sát màn hình chờ thanh toán của người dùng trên iPhone.

---

## 2. Kết Quả Thực Tế (Actual Result)
* API Webhook trả về HTTP 200 OK nhưng màn hình khách hàng vẫn tiếp tục đếm ngược và không tự động chuyển trang sang màn hình "Thanh toán thành công".

## 3. Kết Quả Mong Đợi (Expected Result)
* Ngay khi nhận được Webhook từ ngân hàng, máy chủ phải bắn tín hiệu qua kênh WebSocket `order:{id}:paid` và màn hình khách hàng lập tức chuyển sang trang chúc mừng đơn hàng hoàn tất.

---

## 4. Bằng Chứng & Logs Kỹ Thuật (Evidence & Console Logs)
* **Video tái hiện:** `attachments/bug-089-recording.mp4`
* **Console Logs:** `WebSocket connection to 'wss://api-staging.domain.com/socket.io' failed: Error in transport`.
* **Phân tích sơ bộ từ QA:** Do cấu hình Nginx Reverse Proxy trên Staging chưa bật header `Upgrade $http_upgrade` cho kết nối WebSocket.


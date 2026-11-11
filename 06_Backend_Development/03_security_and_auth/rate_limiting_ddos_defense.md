# GIỚI HẠN TẦN SUẤT TRUY CẬP (RATE LIMITING) & PHÒNG CHỐNG BRUTE-FORCE

## 1. Cơ Chế Thùng Thẻ Dựa Trên Redis (Token Bucket Algorithm)
Hệ thống sử dụng Redis để đếm và quản lý số lượng request theo địa chỉ IP hoặc User ID:

| Tuyến Đường (Endpoints) | Hạn Mức Tối Đa (Limit) | Cửa Sổ Thời Gian (Window) | Biện Pháp Khi Vượt Ngưỡng |
|---|:---:|:---:|---|
| **Công khai chung** (`/api/v1/*`) | 120 requests | 1 Phút | Trả về `429 Too Many Requests` |
| **Gửi mã OTP qua SMS** (`/api/v1/auth/otp`) | 3 requests | 10 Phút | Khóa gửi OTP, bắt chờ 10 phút để chống spam phí SMS |
| **Thử mật khẩu đăng nhập** (`/api/v1/auth/login`) | 5 lần sai | 15 Phút | Tạm khóa IP và tài khoản 15 phút chống brute-force |
| **Tạo đơn hàng** (`/api/v1/orders/checkout`) | 5 requests | 1 Phút | Ngăn bot tự động gom hàng ảo trong các đợt flash-sale |

---

## 2. Tiêu Đề HTTP Báo Cáo Cho Client (Rate Limit Headers)
Khi trả về response, máy chủ luôn đính kèm các header chuẩn:
* `X-RateLimit-Limit`: Tổng số request cho phép trong cửa sổ thời gian.
* `X-RateLimit-Remaining`: Số lượt request còn lại.
* `X-RateLimit-Reset`: Thời gian (Unix timestamp) khi hạn mức được làm mới lại.


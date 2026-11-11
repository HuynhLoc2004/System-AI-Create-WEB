# QUY CHUẨN ĐỊNH TUYẾN & BẢO VỆ TUYẾN ĐƯỜNG (ROUTING & AUTH GUARDS)

## 1. Phân Tầng Tuyến Đường (Route Segmentation)
* **Public Routes:** `/`, `/products`, `/products/[id]`, `/login`, `/register` (Mọi người đều truy cập được).
* **Protected Customer Routes:** `/cart`, `/checkout`, `/account/*` (Yêu cầu phải đăng nhập thành công).
* **Restricted Admin Routes:** `/admin/*` (Chỉ tài khoản có Role `Admin` hoặc `StoreManager` mới được truy cập).

---

## 2. Next.js Middleware Bảo Vệ Tuyến Đường (Authentication Guard)
* Kiểm tra HttpOnly Cookie chứa session token ngay tại tầng Edge Middleware trước khi render HTML.
* Nếu chưa đăng nhập mà cố tình vào `/checkout` ➔ Chuyển hướng về `/login?redirect=/checkout`.
* Nếu người dùng là `Customer` mà cố tình gõ link `/admin/dashboard` ➔ Chuyển hướng sang trang báo lỗi `403 Forbidden`.


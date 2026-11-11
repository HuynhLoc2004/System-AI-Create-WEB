# CHIẾN LƯỢC BỘ NHỚ ĐỆM REDIS (CACHING STRATEGY)

## 1. Mô Hình Cache-Aside Pattern Chuẩn
* **Khi có yêu cầu đọc dữ liệu (Read):**
  1. Kiểm tra key trong Redis: `GET product:{id}`.
  2. Nếu có dữ liệu (**Cache Hit**): Trả về ngay lập tức (< 2ms).
  3. Nếu không có (**Cache Miss**): Truy vấn vào PostgreSQL, lưu kết quả vào Redis với thời gian hết hạn (Time-To-Live - TTL), sau đó trả về cho người dùng.
* **Khi có yêu cầu cập nhật dữ liệu (Write/Update):**
  1. Cập nhật trực tiếp vào cơ sở dữ liệu PostgreSQL.
  2. Xóa key tương ứng trong Redis: `DEL product:{id}` (Tránh việc cập nhật cache trực tiếp dễ gây sai lệch dữ liệu do race condition).

---

## 2. Quy Chuẩn Đặt Tên Key & Thời Gian Sống (TTL)
* `catalog:categories:tree` (Cây danh mục): TTL = 24 giờ.
* `product:detail:{id}` (Chi tiết sản phẩm): TTL = 1 giờ.
* `user:session:{token_hash}` (Phiên đăng nhập): TTL = 15 phút.
* `otp:phone:{phoneNumber}` (Mã OTP SMS): TTL = 60 giây.
* **Phòng chống nghẽn Cache Stampede (Bảo vệ cơ sở dữ liệu khi cache hết hạn cùng lúc):** Luôn cộng thêm một khoảng thời gian ngẫu nhiên (Jitter) từ 10 đến 60 giây vào TTL gốc (`TTL = Base_TTL + Math.random() * 60`).


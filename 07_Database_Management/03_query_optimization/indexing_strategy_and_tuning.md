# CHIẾN LƯỢC ĐÁNH CHỈ MỤC & TỐI ƯU HÓA TRUY VẤN (INDEX TUNING)

## 1. 4 Loại Chỉ Mục Bắt Buộc Sử Dụng Trong Dự Án
1. **B-Tree Index:** Mặc định cho các trường tìm kiếm chính xác hoặc sắp xếp khoảng: `users(email)`, `orders(created_at)`.
2. **Partial Index (Chỉ mục một phần):** Tiết kiệm 70% dung lượng ổ đĩa bằng cách chỉ đánh index trên dữ liệu còn hoạt động:
   ```sql
   CREATE INDEX idx_active_products ON products (category_id, base_price) WHERE deleted_at IS NULL;
   ```
3. **Composite Index (Chỉ mục kết hợp đa cột):** Tuân thủ **Quy tắc tiền tố bên trái (Leftmost Prefix Rule)**. Ví dụ tìm đơn theo khách hàng và trạng thái:
   ```sql
   CREATE INDEX idx_orders_user_status ON orders (user_id, order_status);
   ```
4. **GIN Index (Generalized Inverted Index):** Tối ưu hóa truy vấn trên cột `JSONB` hoặc tìm kiếm sản phẩm toàn văn (Full-Text Search):
   ```sql
   CREATE INDEX idx_products_search ON products USING GIN (to_tsvector('vietnamese', name));
   ```

---

## 2. Quy Trình Kiểm Tra Bằng EXPLAIN (ANALYZE, BUFFERS)
Trước khi đưa bất kỳ câu lệnh SQL nào vào mã nguồn chính thức:
* Nếu kết quả xuất hiện `Seq Scan on orders` (Quét toàn bộ bảng) với `rows > 10,000` ➔ **TỪ CHỐI CODE REVIEW**, bắt buộc phải đánh thêm Index phù hợp.
* Tiêu chí chấp thuận: `Index Scan` hoặc `Bitmap Index Scan`, thời gian thực thi (Execution Time) phải đạt dưới **15ms**.


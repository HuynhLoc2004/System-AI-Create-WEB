# 01. CẨM NANG TỐI ƯU HÓA TRUY VẤN SIÊU TỐC & ĐỀ XUẤT CÁCH QUERY CHUẨN
## (HIGH-PERFORMANCE QUERY PLAYBOOK & SLOW QUERY MONITORING)

> **Tuyên ngôn DBA:** *"Một câu query viết tồi có thể kéo sập toàn bộ máy chủ cơ sở dữ liệu và làm nghẽn toàn bộ hệ thống API. Phòng Cơ sở dữ liệu có nhiệm vụ là 'Bác sĩ giải phẫu' cho từng câu query từ phía Backend, luôn đề xuất cách viết tối ưu nhất, nhanh nhất và tiêu tốn ít RAM/CPU nhất."*

---

## 1. Giám Sát & Phát Hiện Câu Truy Vấn Chậm (Slow Query Log)

DBA cấu hình trực tiếp trên máy chủ PostgreSQL (`postgresql.conf`):
```ini
# Bật ghi nhận toàn bộ câu lệnh chạy quá 100 mili-giây
log_min_duration_statement = 100

# Bật extension theo dõi hiệu năng truy vấn
shared_preload_libraries = 'pg_stat_statements'
pg_stat_statements.max = 10000
pg_stat_statements.track = all
```

### Câu Lệnh SQL Truy Tìm 10 Câu Query Làm Chậm Hệ Thống Nhất:
```sql
SELECT 
    query, 
    calls AS so_lan_goi, 
    total_exec_time::numeric(10,2) AS tong_thoi_gian_ms,
    mean_exec_time::numeric(10,2) AS thoi_gian_trung_binh_ms,
    rows AS tong_so_dong_tra_ve
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## 2. Bảng Đối So sánh: Query Viết Kém vs Đề Xuất Tối Ưu Từ DBA

| Trường Hợp Nghiệp Vụ | ❌ Cách Viết Kém Từ Backend (Làm Chậm Máy Chủ) | ✅ Đề Xuất Tối Ưu Từ DBA (Nhanh Gấp 50 - 100 Lần) | Giải Thích Kỹ Thuật |
|---|---|---|---|
| **Lấy dữ liệu bảng** | `SELECT * FROM products;` | `SELECT id, name, base_price, stock_quantity FROM products WHERE is_active = TRUE;` | `SELECT *` kéo thừa cột JSONB lớn và ảnh hưởng RAM, làm nghẽn băng thông mạng |
| **Phân trang danh sách lớn** | `SELECT * FROM orders ORDER BY created_at DESC LIMIT 20 OFFSET 100000;` | `SELECT id, order_code, total_amount FROM orders WHERE id < 'uuid_trang_truoc' ORDER BY id DESC LIMIT 20;` | **Keyset / Cursor Pagination:** `OFFSET 100.000` bắt DB phải quét và bỏ qua 100.000 dòng trước đó. Keyset dùng B-Tree index nhảy thẳng tới vị trí cần lấy (< 2ms) |
| **Tìm kiếm chứa từ khóa** | `SELECT * FROM products WHERE name LIKE '%dien thoai%';` | `SELECT * FROM products WHERE to_tsvector('vietnamese', name) @@ to_tsquery('vietnamese', 'dien & thoai');` | `LIKE '%abc%'` bắt buộc quét toàn bảng (Seq Scan). Đề xuất dùng **Full-Text Search kết hợp GIN Index** |
| **Đếm tổng số dòng** | `SELECT COUNT(*) FROM orders;` | Sử dụng bộ đếm ước lượng: `SELECT reltuples::bigint FROM pg_class WHERE relname = 'orders';` hoặc cache vào Redis | `COUNT(*)` trên bảng 5 triệu dòng khóa IO rất nặng. Bảng thống kê `pg_class` cho kết quả tức thì trong 0.1ms |
| **Tránh lỗi N+1 Query** | Gọi 1 query lấy 50 đơn hàng, sau đó chạy vòng lặp 50 query để lấy chi tiết từng đơn hàng | Dùng `JOIN` kết hợp hàm gom nhóm JSON: `SELECT o.id, json_agg(i) FROM orders o JOIN order_items i ON o.id = i.order_id GROUP BY o.id;` | Gom 51 lượt gọi mạng rời rạc thành đúng **1 lượt gọi duy nhất** |

---

## 3. Quy Trình Thẩm Định Bằng EXPLAIN (ANALYZE, BUFFERS)

Trước khi một câu SQL mới được duyệt đưa lên môi trường Production, DBA chạy câu lệnh:
```sql
EXPLAIN (ANALYZE, BUFFERS, VERBOSE) 
SELECT id, order_code FROM orders WHERE user_id = 'b0000000-0000-0000-0000-000000000002';
```
* **Tiêu chí VƯỢT QUA (PASS):**
  - Sử dụng `Index Scan` hoặc `Bitmap Index Scan`.
  - Bộ nhớ đọc từ Cache (Shared Hit Blocks) chiếm > 95%, đọc trực tiếp từ đĩa (Shared Read Blocks) gần bằng 0.
  - Thời gian thực thi `Execution Time < 15ms`.
* **Tiêu chí TỪ CHỐI (FAIL):** Xuất hiện `Seq Scan on orders` kèm cảnh báo thời gian > 50ms ➔ Trả về cho Backend sửa lại cấu trúc query hoặc thiết kế thêm index chuyên dụng.


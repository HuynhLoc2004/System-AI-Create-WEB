# QUY CHUẨN MIGRATION CƠ SỞ DỮ LIỆU KHÔNG GIÁN ĐOẠN (ZERO-DOWNTIME MIGRATIONS)

## 1. Nguyên Tắc Expand and Contract (Mở Rộng và Thu Hẹp)
Khi cần đổi tên một cột hoặc tách bảng trên môi trường Production đang chạy:
1. **Pha 1 (Expand):** Thêm cột mới `new_column` vào bảng mà KHÔNG xóa cột cũ `old_column`. Mã nguồn Backend được cập nhật để ghi dữ liệu đồng thời vào cả 2 cột.
2. **Pha 2 (Backfill):** Chạy script chạy ngầm từng batch nhỏ để copy dữ liệu từ cột cũ sang cột mới cho toàn bộ các bản ghi trong quá khứ.
3. **Pha 3 (Contract):** Cập nhật Backend chỉ đọc và ghi từ `new_column`. Sau 1-2 Sprint kiểm tra an toàn, mới chạy migration xóa `old_column`.

---

## 2. Các Lệnh Cấm Khi Chạy Migration Trực Tiếp Trên Production
* ❌ **CẤM:** `ALTER TABLE orders ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL;` ➔ Việc thêm cột `NOT NULL` có giá trị mặc định trên bảng hàng triệu dòng trong các phiên bản cũ sẽ gây khóa toàn bảng (Exclusive Table Lock), làm chết toàn bộ API!
* ✅ **CHUẨN:** Thêm cột không có giá trị mặc định trước, cập nhật dữ liệu dần, sau đó mới bật ràng buộc `NOT NULL` bằng `VALIDATE CONSTRAINT`.
* ❌ **CẤM:** Chạy `CREATE INDEX` trực tiếp trong giờ cao điểm. Bắt buộc dùng cú pháp `CREATE INDEX CONCURRENTLY` trong PostgreSQL để không chặn luồng ghi dữ liệu.


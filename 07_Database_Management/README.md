# 07. ĐỘI NGŨ CHUYÊN TRÁCH CƠ SỞ DỮ LIỆU (DATABASE TEAM / DBA / DATA ENGINEER)

> **Vị trí trong chuỗi:** Đội ngũ bảo vệ và tổ chức tài sản quý giá nhất của mọi hệ thống công nghệ: **DỮ LIỆU**.

---

### 1. Mục Tiêu Cốt Lõi (Core Mission)
* **Truy vấn siêu tốc & Đề xuất cách query tối ưu:** Đảm bảo thời gian phản hồi của 95% truy vấn dưới 50ms; đóng vai trò là "chuyên gia tối ưu", liên tục soi xét và đề xuất cách viết query tốt nhất thay thế các câu lệnh viết ẩu từ Backend.
* **Kỷ luật đánh Index nghiêm ngặt (Chống tràn ổ đĩa):** Tuyệt đối không đánh index bừa bãi, không tạo index trùng lặp gây bóp nghẹt tốc độ ghi và làm phình ổ cứng; quét và xóa sạch các index rác không dùng.
* **Dọn dẹp rác & Tinh chỉnh Autovacuum thường xuyên:** Tự động giải phóng dòng chết (Dead Tuples), dọn dẹp giỏ hàng bỏ quên, phiên đăng nhập hết hạn và lưu trữ lạnh dữ liệu cũ.
* **Sao lưu dữ liệu đa tầng định kỳ (Backup & Restore Drills):** Sao lưu liên tục WAL mỗi 5 phút (RPO < 5m), Full dump hàng ngày lên Cloud độc lập, định kỳ diễn tập khôi phục thực tế.
* **Người gác cổng tối cao cho an toàn dữ liệu:** Phân quyền tối thiểu cho Backend (tước bỏ quyền DROP/TRUNCATE), bắt buộc 100% Parameterized Queries để triệt tiêu SQL Injection, mã hóa dữ liệu nhạy cảm AES-256.

---

### 2. Trách Nhiệm Chi Tiết (Detailed Responsibilities)

1. **Thiết kế lược đồ & Tối ưu hóa câu lệnh (Schema & Query Optimization):**
   * Chuẩn hóa dữ liệu mức 3NF kết hợp cột JSONB linh hoạt.
   * Giám sát câu truy vấn chậm (Slow Query Log > 100ms) qua `pg_stat_statements`.
   * Thẩm định câu lệnh bằng `EXPLAIN (ANALYZE, BUFFERS)`: Chuyển đổi phân trang `OFFSET` thành `Keyset/Cursor Pagination`, gom nhóm N+1 query thành 1 query duy nhất.

2. **Kỷ luật Index & Kiểm soát phình ổ đĩa (Index Discipline & Bloat Control):**
   * Không đánh index trên cột ít giá trị (Low cardinality) hoặc cột thường xuyên UPDATE.
   * Chạy script rà soát xóa các index có `idx_scan = 0` bằng cú pháp an toàn `DROP INDEX CONCURRENTLY`.
   * Ưu tiên sử dụng Partial Index và Covering Index để tiết kiệm 80% dung lượng ổ cứng.

3. **Dọn dẹp rác tự động & Sao lưu đa tầng (Housekeeping & Multi-tier Backup):**
   * Cấu hình Autovacuum dọn sạch Dead Tuples ngay khi bảng biến động 5%.
   * Thiết lập Cronjob 03:00 sáng dọn sạch session rác, mã OTP hết hạn và giỏ hàng ảo.
   * Vận hành 3 tầng sao lưu: WAL liên tục (5 phút) + Daily Full Dump + Weekly Snapshot; diễn tập khôi phục ngày 15 hàng tháng.

4. **Kiểm soát bảo mật & Hàng rào chống SQL Injection tầng DBA:**
   * Tạo tài khoản `app_backend_user` phân quyền tối thiểu (CẤM DROP/ALTER/TRUNCATE).
   * Kiểm duyệt 100% code truy vấn Backend, cấm nối chuỗi raw SQL, bắt buộc dùng biến tham số `$1, $2`.
   * Mã hóa tại chỗ (At-Rest AES-256), mã hóa đường truyền (TLS 1.3 `sslmode=require`) và bật Row-Level Security (RLS).

---

### 3. Bộ Công Cụ Sử Dụng (Toolstack)
* **Quản trị & Giám sát GUI:** DBeaver, DataGrip, pgAdmin 4.
* **Quản lý Migration phiên bản:** Flyway, Liquibase, TypeORM / Prisma Migrations.
* **Kiểm tra hiệu năng:** `pg_stat_statements`, `pg_hero`, Percona Toolkit.

---

### 4. Danh Mục Tài Liệu Bàn Giao Trong Thư Mục Này
* [`01_erd_data_modeling/`](./01_erd_data_modeling/): 
  - [`erd_specifications.md`](./01_erd_data_modeling/erd_specifications.md): Sơ đồ quan hệ thực thể (ERD) chuẩn 3NF.
  - [`data_dictionary_template.md`](./01_erd_data_modeling/data_dictionary_template.md): Từ điển dữ liệu chi tiết cho toàn bộ các bảng.
  - [`database_security_and_injection_defense.md`](./01_erd_data_modeling/database_security_and_injection_defense.md): **[BẢO MẬT & CHỐNG SQLi TẦNG DBA]** Phân quyền tối thiểu (CẤM DROP/ALTER), kiểm soát Backend và Row-Level Security.
* [`02_migrations_and_seeds/`](./02_migrations_and_seeds/): Tiêu chuẩn Migration không gián đoạn (Zero-Downtime), mã nguồn DDL khởi tạo bảng, script rollback và dữ liệu mẫu (Seed data).
* [`03_query_optimization/`](./03_query_optimization/): 
  - [`high_performance_query_playbook.md`](./03_query_optimization/high_performance_query_playbook.md): **[CẨM NANG QUERY SIÊU TỐC]** Giám sát Slow Query Log > 100ms, kỹ thuật Keyset Pagination, diệt lỗi N+1 Query.
  - [`strict_indexing_discipline_and_bloat_control.md`](./03_query_optimization/strict_indexing_discipline_and_bloat_control.md): **[KỶ LUẬT ĐÁNH INDEX THÉP]** Chống phình ổ đĩa, script tìm và xóa index rác, Partial & Covering Index.
  - [`indexing_strategy_and_tuning.md`](./03_query_optimization/indexing_strategy_and_tuning.md): Nguyên lý hoạt động B-Tree, Composite, GIN Indexes.
* [`04_backup_and_recovery/`](./04_backup_and_recovery/): 
  - [`data_cleaning_and_retention_policy.md`](./04_backup_and_recovery/data_cleaning_and_retention_policy.md): **[DỌN RÁC & SAO LƯU ĐA TẦNG]** Tinh chỉnh Autovacuum dọn Dead Tuples, cronjob 03:00 dọn dữ liệu tạm và sao lưu WAL mỗi 5 phút.
  - [`backup_policy_and_disaster_recovery.md`](./04_backup_and_recovery/backup_policy_and_disaster_recovery.md): Quy trình diễn tập khôi phục thảm họa (Disaster Recovery PITR).


# CHÍNH SÁCH SAO LƯU & KỊCH BẢN PHỤC HỒI DỮ LIỆU (BACKUP & RECOVERY POLICY)

## 1. Lịch Trình Sao Lưu Dữ Liệu Tự Động (Automated Backup Schedule)

| Loại Sao Lưu | Tần Suất Thực Hiện | Nơi Lưu Trữ | Thời Gian Lưu Trữ (Retention) |
|---|---|---|---|
| **Full Database Backup (pg_dump)** | Hàng ngày vào 02:00 sáng | Máy chủ Cloudflare R2 / AWS S3 tại một Region khác | Lưu trữ trong vòng 30 ngày |
| **Write-Ahead Log (WAL Archiving)** | Liên tục mỗi 5 phút (WAL files) | Bucket S3 tách biệt có bật mã hóa AES-256 | Lưu trữ trong vòng 7 ngày gần nhất |
| **Bản chụp ổ đĩa (Storage Snapshot)** | Hàng tuần vào 03:00 sáng Chủ Nhật | Snapshot cấp độ ổ cứng VPS/Cloud Provider | Lưu trữ trong vòng 4 tuần |

---

## 2. Kịch Bản Diễn Tập Phục Hồi Thảm Họa (Disaster Recovery Drill)
* **Tần suất diễn tập:** Thực hiện định kỳ mỗi quý một lần (3 tháng/lần) vào cuối tuần trên môi trường Staging.
* **Quy trình phục hồi điểm thời gian (Point-In-Time Recovery - PITR):**
  1. Khởi tạo một cơ sở dữ liệu trống trên cụm máy chủ mới.
  2. Nạp bản Full Backup gần nhất của ngày hôm đó: `pg_restore -d db_name latest_full_backup.dump`.
  3. Áp dụng các tệp WAL liên tiếp cho tới đúng thời điểm sự cố xảy ra (ví dụ: `2026-11-20 14:28:15 UTC`).
  4. Xác nhận dữ liệu khớp 100% và chuyển hướng lưu lượng mạng (Switch DNS) sang cụm mới. Thời gian diễn tập không được vượt quá **30 phút** (đạt tiêu chuẩn RTO).


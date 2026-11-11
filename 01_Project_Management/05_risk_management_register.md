# BẢNG THEO DÕI & QUẢN TRỊ RỦI RO DỰ ÁN (RISK MANAGEMENT REGISTER)

| Mã Rủi Ro | Phân Loại | Mô Tả Rủi Ro | Xác Suất (1-5) | Mức Độ Ảnh Hưởng (1-5) | Điểm Rủi Ro (P x I) | Kế Hoạch Ứng Phó & Giảm Thiểu | Người Chịu Trách Nhiệm |
|---|---|---|:---:|:---:|:---:|---|---|
| **RSK-01** | Phạm vi | Khách hàng liên tục thay đổi yêu cầu giữa chừng (Scope Creep) | 4 | 4 | **16 (Cao)** | Ký phụ lục hợp đồng (Change Request - CR); mọi yêu cầu phát sinh phải tính thêm chi phí và dời hạn release tương ứng | TPM & BA |
| **RSK-02** | Kỹ thuật | Cổng thanh toán bên thứ ba phản hồi chậm hoặc hay lỗi mạng | 3 | 4 | **12 (TB)** | Thiết kế cơ chế Retry với Exponential Backoff, Idempotency Key, và trang bị Circuit Breaker | Solution Architect & BE |
| **RSK-03** | Nhân sự | Nhân sự lập trình viên chủ chốt (Core Dev) nghỉ việc đột xuất | 2 | 5 | **10 (TB)** | Áp dụng bắt buộc Code Review, tài liệu hóa kiến trúc chi tiết, phân công Pair Programming | TPM & Tech Lead |
| **RSK-04** | Hạ tầng | Chi phí Cloud AWS/GCP vượt định mức do truy vấn không tối ưu | 3 | 3 | **9 (TB)** | Cài đặt AWS Budgets cảnh báo khi chạm 80% hạn mức; DBA audit chỉ mục database định kỳ hàng tuần | DevOps & DBA |
| **RSK-05** | Tiến độ | Đội Frontend bị nghẽn do chờ đợi API Backend hoàn tất | 4 | 4 | **16 (Cao)** | Sử dụng Mockoon / Prism Swagger Mocking để FE code độc lập trước khi BE hoàn thành API thực | TPM, FE & BE Leads |

---

## Quản Trị Nợ Kỹ Thuật (Tech Debt Management)
* **Quy tắc 80/20:** 80% dung lượng Sprint dành cho tính năng kinh doanh mới, 20% dung lượng Sprint bắt buộc dành riêng cho Refactoring code, vá lỗi bảo mật, nâng cấp thư viện và tối ưu hiệu năng.
* **Nguyên tắc "Cắm cờ nợ kỹ thuật":** Bất kỳ giải pháp tạm bợ (workaround/hack) nào được chấp thuận để kịp tiến độ phải được tạo ngay một vé Jira loại `Tech Debt` để xử lý dứt điểm trong 2 Sprint tiếp theo.


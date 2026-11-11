# QUY CHUẨN ĐỒNG NHẤT 3 MÔI TRƯỜNG (ENVIRONMENT PARITY)

Hệ thống được vận hành theo tiêu chuẩn 12-Factor App, đảm bảo môi trường Dev, Staging và Production giống hệt nhau về cấu trúc chạy, chỉ khác nhau về biến môi trường (Environment Variables) và cấu hình tài nguyên:

| Tiêu Chí So Sánh | Môi Trường DEV | Môi Trường STAGING / UAT | Môi Trường PRODUCTION |
|---|---|---|---|
| **Mục đích** | Lập trình viên thử nghiệm code | QA test chức năng, Khách duyệt UAT | Khách hàng thực tế giao dịch |
| **Tên miền (Domain)** | `localhost` / `dev.internal` | `staging.domain.com` | `app.domain.com` / `api.domain.com` |
| **Cơ sở dữ liệu** | PostgreSQL Local / Docker | Managed Postgres (Cấu hình bằng Prod) | Multi-AZ High-Availability Postgres |
| **Dữ liệu trong DB** | Dữ liệu giả định (Seed Data) | Dữ liệu thực đã làm mờ/ẩn danh tính | Dữ liệu giao dịch thật (Bảo mật 100%) |
| **Cổng thanh toán** | Mock Sandbox | Sandbox chính thức của Ngân hàng | Production Live Gateway |
| **Cảnh báo lỗi** | Hiện chi tiết Stack Trace ra màn hình | Ghi log vào Sentry Staging | Ghi log ẩn danh vào Sentry + Alert bot |

---

## Quản Lý Bí Mật An Toàn (Secrets Management)
* **Tuyệt đối KHÔNG commit file `.env` lên Git Repo.** File `.gitignore` luôn chứa dòng `.env*`.
* Toàn bộ mật khẩu, khóa bí mật được lưu trên **GitHub Encrypted Secrets** hoặc **HashiCorp Vault / AWS Secrets Manager** và chỉ được tiêm vào máy chủ lúc deploy.


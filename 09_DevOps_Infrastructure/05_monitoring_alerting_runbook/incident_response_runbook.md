# SỔ TAY QUY TRÌNH XỬ LÝ SỰ CỐ KHẨN CẤP (INCIDENT RESPONSE RUNBOOK)

## 1. Phân Cấp Mức Độ Sự Cố (Severity Levels)

| Mức Độ | Định Nghĩa | Thời Gian Phản Hồi Tức Thì (MTTA) | Thời Gian Khắc Phục Mục Tiêu (MTTR) |
|---|---|:---:|:---:|
| **SEV-1 (Thảm họa)** | Toàn bộ web/app bị sập hoàn toàn, cơ sở dữ liệu mất kết nối, người dùng không thể thanh toán | **< 5 Phút** | **< 30 Phút** |
| **SEV-2 (Nghiêm trọng)** | Một tính năng lõi ngừng hoạt động (ví dụ không thể tìm kiếm sản phẩm), hiệu năng chậm gấp 5 lần | **< 15 Phút** | **< 2 Giờ** |
| **SEV-3 (Trung bình)** | Lỗi tính năng phụ, gián đoạn một nhóm nhỏ người dùng | **< 1 Giờ** | **Trong vòng 8 Giờ** |
| **SEV-4 (Thấp)** | Lỗi nhỏ về giao diện, cảnh báo dung lượng disk sắp đầy | **< 4 Giờ** | **Trong vòng 24 Giờ** |

---

## 2. Kịch Bản Xử Lý Sự Cố SEV-1 (Quy Tắc 4 Bước)
1. **Bước 1: Ngăn Chặn Thiệt Hại (Mitigation):**
   - Nếu bản deploy mới gây lỗi: **LẬP TỨC ROLLBACK** về Docker Image của phiên bản trước bằng lệnh:
     `docker compose up -d --no-deps backend-core:v1.3.9` (Thời gian xử lý: 60 giây).
   - Nếu bị tấn công DDoS: Bật chế độ "Under Attack Mode" trên Cloudflare trong 1 cú click.
2. **Bước 2: Giao Tiếp Minh Bạch (Communication):**
   - TPM gửi thông báo tình trạng (Status Page) cho Khách hàng & Người dùng: *"Hệ thống đang tiến hành bảo trì đột xuất, dự kiến hoàn tất trong 20 phút."*
3. **Bước 3: Điều Tra Nguyên Nhân Gốc Rễ (Investigation):**
   - Không được vội vã sửa code trực tiếp trên Production!
   - Kéo log từ Sentry và Loki về môi trường Dev để tái hiện.
4. **Bước 4: Báo Cáo Hậu Kỳ (Post-Mortem / RCA):**
   - Họp đội ngũ trong vòng 24 giờ sau khi hệ thống hoạt động ổn định trở lại.
   - Biên soạn tài liệu phân tích nguyên nhân gốc rễ (Root Cause Analysis - RCA) và lập danh sách hành động ngăn ngừa tái diễn.


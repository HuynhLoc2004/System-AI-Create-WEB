# ĐIỀU LỆ DỰ ÁN (PROJECT CHARTER)

| Thông Tin Chung | Chi Tiết |
|---|---|
| **Tên dự án:** | Hệ Thống Số Hóa Quản Trị & Vận Hành Doanh Nghiệp Toàn Diện |
| **Mã dự án:** | PRJ-CORP-2026 |
| **Quản trị dự án (TPM):** | Huỳnh Tấn Lộc (Lead Coordinator) |
| **Khách hàng / Sponsor:** | Ban Giám Đốc Doanh Nghiệp |
| **Ngày bắt đầu:** | 10/11/2026 |
| **Hạn bàn giao (Target Go-Live):** | 10/05/2027 (6 tháng) |
| **Tổng ngân sách phê duyệt:** | 1.850.000.000 VNĐ (~$75,000 USD) |

---

## 1. Mục Tiêu Kinh Doanh (Business Objectives)
1. Tự động hóa 80% quy trình nghiệp vụ thủ công hiện tại, giảm thời gian xử lý đơn hàng từ 48 giờ xuống dưới 15 phút.
2. Hỗ trợ quy mô giao dịch đồng thời (Peak Concurrent Users): Tối thiểu 5.000 người dùng trực tuyến đồng thời không gián đoạn.
3. Tỷ lệ hệ thống khả dụng (System Availability / SLA): Đạt tối thiểu 99.9% uptime.

## 2. Phạm Vi Dự Án (Scope)
* **Trong phạm vi (In-Scope):**
  - Cổng thông tin khách hàng (Customer Portal Web & Mobile Responsive).
  - Bảng điều khiển quản trị nội bộ (Internal Back-office Admin CMS).
  - Hệ thống API Backend và Microservices nghiệp vụ.
  - Tích hợp cổng thanh toán trực tuyến (VNPay, MoMo, Visa/Mastercard).
  - Tích hợp hệ thống thông báo đa kênh (SMS OTP, Email Transaction, Push Notification).
  - Cơ sở hạ tầng Cloud và quy trình CI/CD tự động 100%.
* **Ngoài phạm vi (Out-of-Scope - Phase 1):**
  - Tính năng AI Chatbot tự động tư vấn sản phẩm (Dự kiến chuyển sang Phase 2).
  - Ứng dụng Native iOS/Android trên App Store/Google Play (Ưu tiên PWA/Flutter Web ở giai đoạn MVP).

## 3. Ràng Buộc & Giả Định (Constraints & Assumptions)
* **Ràng buộc ngân sách:** Chi phí hạ tầng Cloud không vượt quá $800 USD/tháng trong giai đoạn đầu.
* **Ràng buộc an toàn thông tin:** Dữ liệu người dùng phải được mã hóa tại ổ đĩa (AES-256) và tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
* **Giả định:** Khách hàng cử đầu mối chuyên môn (Product Owner / Domain Expert) phản hồi yêu cầu nghiệm thu trong vòng 48 giờ làm việc.


# 06. MA TRẬN PHÂN RÃ YÊU CẦU NGHIỆP VỤ XUỐNG TỪNG BỘ PHẬN
## (CROSS-DEPARTMENT REQUIREMENT DECOMPOSITION MATRIX)

> **Mục tiêu:** Cầu nối sống còn giữa phòng BA và các phòng ban kỹ thuật phía dưới. Bất kỳ một tính năng nghiệp vụ nào được BA viết ra bắt buộc phải được bóc tách đồng bộ sang đầy đủ các phòng ban tương ứng.

---

## 1. Ma Trận Phân Rã Mẫu: Tính Năng "Mua Ngay & Quét Mã VietQR Động"

| Bộ Phận Nhận Bàn Giao | Tác Vụ Cụ Thể Sau Khi Bóc Tách (Decomposed Sub-Tasks) | Đầu Vào Cần Thiết (Inputs) | Tiêu Chuẩn Đầu Ra (Acceptance Deliverable) |
|---|---|---|---|
| **04. UI/UX Designer** | Thiết kế Popup hiển thị mã VietQR động, đồng hồ đếm ngược 10:00, nút "Tôi đã chuyển khoản", trạng thái mờ kính | User Stories từ BA | File Figma trạng thái `Ready for Dev`, xuất SVG icon ngân hàng |
| **07. Database Team** | Tạo bảng `payments`, thêm cột `expires_at` vào bảng `orders`, đánh Partial Index trên đơn chưa thanh toán | Báo cáo thực thể từ BA | Migration script DDL, đảm bảo kiểm tra khóa ACID |
| **06. Backend Dev** | Viết API `POST /api/v1/orders/checkout`, tích hợp BullMQ delay job hủy đơn sau 10 phút, Webhook IPN ngân hàng | SRS & Schema từ DBA | API đạt chuẩn RESTful, Swagger docs, Unit Test độ bao phủ > 80% |
| **05. Frontend Dev** | Ghép giao diện Checkout từ Figma, kết nối API qua Axios Interceptor, tích hợp WebSocket bắt sự kiện thanh toán | API Contract & Figma | Giao diện chạy mượt mà, Optimistic UI cập nhật tức thì |
| **08. QA / QC Team** | Viết Test Cases thử nghiệm: Quét QR đúng số tiền, quét sai nội dung, quá hạn 10 phút, thử chèn mã độc vào ô ghi chú | Tiêu chí AC từ BA & API | Nhật ký test PASS/FAIL, khẳng định không rò rỉ dữ liệu trên Mock DB |
| **09. DevOps Team** | Cấu hình WebSocket trên Nginx Reverse Proxy (`Upgrade $http_upgrade`), giám sát độ trễ Webhook ngân hàng | Kiến trúc từ Solution Architect | Pipeline deploy tự động, Alert bot Telegram sẵn sàng báo lỗi kết nối |

---

## 2. Tiêu Chuẩn Nghiệm Thu Chuyển Giao (Handshake Criteria)
* Một yêu cầu nghiệp vụ chỉ được coi là phân rã hoàn tất khi **Lead của cả 6 phòng ban kỹ thuật** xác nhận:
  1. Hiểu rõ 100% mục đích kinh doanh của tính năng.
  2. Không có bất kỳ khoảng trống kỹ thuật (Technical Gap) nào chưa được phân công.
  3. Khối lượng công việc đã được ước tính Story Points và đưa vào Sprint Backlog.


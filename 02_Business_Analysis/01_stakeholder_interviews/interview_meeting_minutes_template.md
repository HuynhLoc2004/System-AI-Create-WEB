# BIÊN BẢN HỌP THU THẬP YÊU CẦU NGHIỆP VỤ (REQUIREMENT INTERVIEW MINUTES)

**Mã phiên họp:** REQ-MTG-001  
**Ngày thực hiện:** 12/11/2026 | **Thời gian:** 09:30 - 11:00  
**Địa điểm:** Phòng họp A / Trực tuyến qua Google Meet  
**Người chủ trì (BA):** Huỳnh Tấn Lộc (Lead BA)  
**Người ghi biên bản:** BA Specialist  
**Thành phần tham gia:**
* Đại diện Khách hàng: Giám đốc Vận hành, Kế toán trưởng
* Đại diện Kỹ thuật: Lead BA, Solution Architect

---

## 1. Nội Dung Thảo Luận Chi Tiết
* **Hiện trạng:** Đơn hàng hiện tại được nhân viên kinh doanh nhập bằng tay vào Google Sheets, sau đó báo kế toán qua Zalo để kiểm tra chuyển khoản.
* **Vấn đề phát sinh (Pain points):**
  - Mất trung bình 45 phút để xác nhận 1 đơn thanh toán thành công.
  - Tỷ lệ sót đơn hoặc nhầm mã chuyển khoản lên tới 6.5%.
  - Khi có chương trình flash-sale, Google Sheets bị quá tải và đứng máy hoàn toàn.
* **Yêu cầu mong muốn (To-Be Workflow):**
  - Khách hàng quét mã VietQR tự động sinh nội dung chuyển khoản duy nhất.
  - Ngân hàng gửi Webhook thông báo giao dịch thành công trong vòng tối đa 3 giây.
  - Hệ thống tự động trừ kho tức thì và gửi tin nhắn Zalo ZNS / SMS xác nhận cho khách.

---

## 2. Các Quyết Định Đã Thống Nhất (Decisions Made)
1. Bỏ quy trình xác nhận thủ công qua Zalo đối với 100% các đơn thanh toán trực tuyến.
2. Cho phép nhân viên kinh doanh xem trạng thái đơn hàng nhưng chỉ Kế toán mới có quyền thực hiện thao tác Hoàn tiền (Refund).

---

## 3. Các Vấn Đề Còn Bỏ Ngỏ & Kế Hoạch Theo Dõi (Open Items)
* [ ] Kế toán trưởng cần cung cấp tài liệu cấu trúc tài khoản kế toán và hạn mức hoàn tiền trước ngày 15/11/2026.
* [ ] BA gửi lại bản thảo sơ đồ luồng thanh toán trước ngày 16/11/2026 để khách hàng ký duyệt.


# TÀI LIỆU YÊU CẦU KINH DOANH (BUSINESS REQUIREMENTS DOCUMENT - BRD)

| Dự Án | Hệ Thống Số Hóa Quản Trị & Vận Hành Doanh Nghiệp |
|---|---|
| **Phiên bản:** | 1.0 (Final Draft) |
| **Tác giả:** | Đội ngũ Phân tích nghiệp vụ (BA Team) |
| **Người phê duyệt:** | Project Sponsor / Ban Giám Đốc |
| **Ngày ban hành:** | 18/11/2026 |

---

## 1. Tuyên Bố Bối Cảnh & Vấn Đề Kinh Doanh (Problem Statement)
Doanh nghiệp đang vận hành mô hình kinh doanh đa kênh với tốc độ tăng trưởng 40%/năm. Tuy nhiên, quy trình xử lý đơn hàng, quản lý kho và đối soát tài chính hiện vẫn phụ thuộc 70% vào bảng tính thủ công và tin nhắn rời rạc. Hậu quả là thời gian xử lý đơn hàng kéo dài, tỷ lệ thất thoát tồn kho và sai sót thanh toán ảnh hưởng tiêu cực tới trải nghiệm khách hàng và uy tín thương hiệu.

---

## 2. Mục Tiêu Kinh Doanh Đo Lường Được (SMART Business Objectives)
1. **Giảm thiểu thời gian xử lý đơn hàng:** Rút ngắn thời gian từ lúc đặt hàng thành công đến khi kho nhận lệnh in phiếu từ 45 phút xuống dưới 60 giây.
2. **Loại bỏ sai sót thanh toán:** Đạt độ chính xác đối soát tài chính 99.99% nhờ cơ chế Webhook ngân hàng tự động.
3. **Mở rộng năng lực phục vụ:** Hệ thống đáp ứng tối thiểu 100.000 đơn hàng/ngày mà không cần bổ sung nhân sự vận hành thủ công.

---

## 3. Chân Dung Người Dùng Mục Tiêu (User Personas)

### Persona 1: Khách hàng mua sắm (End Customer - B2C)
* **Nhân khẩu học:** 22 - 40 tuổi, sử dụng smartphone 85% thời gian lướt web.
* **Mục tiêu:** Tìm kiếm sản phẩm nhanh, giỏ hàng mượt mà, thanh toán QR trong 1 chạm, nhận thông báo giao hàng ngay lập tức.
* **Nỗi đau:** App load chậm, bắt nhập lại thông tin thẻ ngân hàng phức tạp, không biết đơn hàng đang ở đâu.

### Persona 2: Quản lý kho & Đóng gói (Warehouse Staff)
* **Nhân khẩu học:** 25 - 45 tuổi, thao tác trên máy tính bảng hoặc máy quét mã vạch cầm tay.
* **Mục tiêu:** Nhận đơn theo thời gian thực (Real-time), quét mã vạch SKU để xuất kho chính xác 100%.
* **Nỗi đau:** Đơn hàng trùng lặp, số lượng tồn kho trên mạng lệch với hàng thực tế trong kệ.

### Persona 3: Kế toán trưởng & Ban Giám Đốc (Admin / Management)
* **Mục tiêu:** Xem biểu đồ doanh thu theo thời gian thực, tự động kết xuất báo cáo thuế, phân quyền chặt chẽ từng nhân viên.
* **Nỗi đau:** Số liệu phân mảnh, cuối tháng mất 3-5 ngày tăng ca để tổng hợp số liệu.


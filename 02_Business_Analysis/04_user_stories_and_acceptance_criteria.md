# DANH MỤC USER STORIES & TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA)

Mỗi User Story được thiết kế chuẩn cấu trúc Agile, áp dụng cú pháp Gherkin (**Given - When - Then**) để phục vụ trực tiếp cho đội Lập trình và Đội ngũ Kiểm thử viết kịch bản Test.

---

### Story ID: US-AUTH-01: Đăng Nhập Hệ Thống Bằng Số Điện Thoại & OTP
* **Là:** Một khách hàng đã có tài khoản trên hệ thống,
* **Tôi muốn:** Nhập số điện thoại để nhận mã OTP qua SMS và đăng nhập nhanh,
* **Để:** Tôi không cần phải ghi nhớ mật khẩu phức tạp mà vẫn bảo mật an toàn.

#### Tiêu Chí Nghiệm Thu (Acceptance Criteria):
* **Kịch bản 1: Đăng nhập thành công với mã OTP hợp lệ**
  * **Given:** Người dùng đang ở màn hình đăng nhập và đã nhập số điện thoại hợp lệ `0901234567`.
  * **When:** Người dùng bấm "Gửi mã" và nhập chính xác mã OTP `6 chữ số` trong vòng 60 giây.
  * **Then:** Hệ thống xác thực thành công, lưu JWT vào cookie bảo mật và chuyển hướng người dùng về Trang chủ với lời chào tên người dùng.
* **Kịch bản 2: Nhập sai mã OTP quá số lần cho phép (Bảo mật chống dò mã)**
  * **Given:** Người dùng đã nhận mã OTP nhưng nhập sai liên tiếp 5 lần.
  * **When:** Người dùng bấm xác nhận lần thứ 5.
  * **Then:** Hệ thống khóa tạm thời số điện thoại trong 15 phút và hiển thị thông báo lỗi: *"Bạn đã thử sai quá 5 lần. Vui lòng thử lại sau 15 phút."*

---

### Story ID: US-ORD-02: Giữ Tồn Kho Tạm Thời Khi Bấm Tiến Hành Thanh Toán
* **Là:** Khách hàng đang có sản phẩm trong giỏ hàng,
* **Tôi muốn:** Hệ thống giữ tạm số lượng sản phẩm đó cho tôi trong lúc tôi thao tác chuyển khoản ngân hàng,
* **Để:** Tôi không bị người khác mua mất món hàng yêu thích trong lúc đang quét mã VietQR.

#### Tiêu Chí Nghiệm Thu (Acceptance Criteria):
* **Kịch bản 1: Giữ hàng thành công trong thời gian 10 phút**
  * **Given:** Sản phẩm "Áo thun kích thước L" chỉ còn tồn kho đúng 1 cái.
  * **When:** Khách hàng A bấm nút "Tiến hành thanh toán" và màn hình hiển thị mã QR thanh toán.
  * **Then:** Số lượng tồn kho hiển thị cho khách hàng khác B giảm về 0 (Hiển thị nhãn Hết hàng).
  * **And:** Đồng hồ đếm ngược 10:00 bắt đầu chạy trên màn hình của khách hàng A.
* **Kịch bản 2: Tự động hoàn tồn kho khi hết hạn 10 phút mà chưa thanh toán**
  * **Given:** Đồng hồ đếm ngược 10:00 của khách hàng A chạm mốc 00:00 và chưa có tín hiệu Webhook chuyển khoản thành công từ ngân hàng.
  * **When:** Bộ hẹn giờ hết hạn kích hoạt (Background job timeout).
  * **Then:** Trạng thái đơn hàng chuyển sang `Đã hủy do hết hạn`, số lượng tồn kho tự động cộng trả lại 1 cái cho hệ thống.


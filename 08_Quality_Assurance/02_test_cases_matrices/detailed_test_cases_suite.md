# BỘ KỊCH BẢN KIỂM THỬ CHI TIẾT (DETAILED TEST CASES SUITE)

### Test Case: TC-ORD-010: Khóa Tồn Kho Tạm Thời Khi Bấm Tiến Hành Thanh Toán
* **Phân hệ:** Quản lý đơn hàng & Tồn kho
* **Độ ưu tiên:** High (P1)
* **Loại test:** Functional & Concurrency Testing
* **Tiền điều kiện:** 
  - Sản phẩm `SKU-AP-PRO2` chỉ còn đúng 1 sản phẩm trong cơ sở dữ liệu (`stock_quantity = 1`).
  - Có 2 tài khoản thử nghiệm: User A (Browser Chrome) và User B (Browser Safari).

#### Các Bước Thực Hiện (Test Steps):
1. User A mở trang sản phẩm `SKU-AP-PRO2`, bấm "Thêm vào giỏ" và chuyển tới trang `/checkout`.
2. User A bấm nút "Tiến hành Đặt Hàng" ➔ Hệ thống hiển thị mã VietQR thanh toán và đồng hồ đếm ngược 10:00.
3. Đồng thời, User B tải lại trang sản phẩm `SKU-AP-PRO2` trên Safari.
4. User B cố tình bấm nút "Thêm vào giỏ" hoặc gọi API `POST /api/v1/orders/checkout`.

#### Kết Quả Mong Đợi (Expected Result):
* Màn hình của User B hiển thị nhãn: **"Sản phẩm tạm thời hết hàng (Đang có khách giữ đơn)"**.
* Nút thanh toán của User B bị vô hiệu hóa (Disabled).
* Nếu User B cố tình bypass UI gọi API trực tiếp ➔ Backend trả về mã lỗi `400 Bad Request` với message: `"Sản phẩm không đủ số lượng tồn kho"`.

---

### Test Case: TC-ORD-011: Tự Động Hoàn Tồn Kho Sau 10 Phút Không Thanh Toán
* **Phân hệ:** Quản lý đơn hàng & Worker nền
* **Độ ưu tiên:** High (P1)
* **Loại test:** Boundary & Timeout Testing
* **Tiền điều kiện:** User A đã tạo đơn hàng ở TC-ORD-010 (Đồng hồ đếm ngược 10 phút đang chạy).

#### Các Bước Thực Hiện:
1. User A không quét mã QR, đóng trình duyệt hoặc để nguyên màn hình chạy hết 10 phút.
2. Tại phút thứ 10:01, kiểm tra trạng thái đơn hàng trên bảng điều khiển Admin và trong Database.
3. User B tải lại trang sản phẩm `SKU-AP-PRO2`.

#### Kết Quả Mong Đợi (Expected Result):
* Đơn hàng của User A chuyển trạng thái thành `CANCELLED_TIMEOUT`.
* Số lượng tồn kho trong database tự động cộng trả lại (`stock_quantity = 1`).
* Trang sản phẩm của User B hiển thị lại trạng thái **"Còn hàng"** và User B có thể tiến hành đặt hàng bình thường.


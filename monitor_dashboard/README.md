# TRUNG TÂM GIÁM SÁT TIẾN ĐỘ & LUỒNG PHỐI HỢP 9 PHÒNG BAN
## (IT-ASSIGNMENT OPERATIONAL DASHBOARD)

Ứng dụng Web Dashboard độc lập dành riêng cho **Người Quản Lý (Manager / Executive / PM)** để trực quan hóa, kiểm soát toàn diện luồng phối hợp (Workflow) giữa 9 phòng ban trong quá trình AI "Vibe Coding" và theo dõi tiến độ đa dự án theo thời gian thực.

---

## 🌟 Các Tính Năng Nổi Bật

1. **Sơ Đồ Luồng Phối Hợp Trực Quan Sống Động (Animated SVG Workflow):**
   - Vẽ đường kết nối, mũi tên dẫn truyền dữ liệu chuẩn xác từ:
     `Khách Hàng ➔ 01. PM ➔ 02. BA ➔ 03. SA & 04. UI/UX ➔ 05. FE / 06. BE / 07. DBA ➔ 08. QA ➔ 09. DevOps ➔ Hệ Thống Production 24/7`.
   - Hiệu ứng luồng chạy (Animated Dash Flow) hiển thị chính xác các kênh đang phối hợp `WORKING`, các nút `DONE` (xanh ngọc), và các điểm nghẽn `BLOCKED` (đỏ chớp nháy).
   - Bấm trực tiếp vào bất kỳ phòng ban nào để mở **Khay Thanh Tra (Inspector)**: Xem chi tiết Đầu vào (Inputs), Đầu ra bàn giao (Deliverables) và lọc nhanh các task liên quan.

2. **Quản Trị Đa Dự Án Linh Hoạt (Multi-Project Switcher):**
   - Dễ dàng chuyển đổi giữa các dự án đang chạy:
     - *Dự án A: Sàn Bán Lẻ Đa Kênh & VietQR Động* (Tiến độ 68%, Gói Standard 1.85 Tỷ).
     - *Dự án B: Cổng Ví Điện Tử & Chuyển Tiền Tức Thời* (Tiến độ 35%, Gói MVP 550 Triệu).
     - *Dự án C: Hệ Thống ERP Quản Trị Chuỗi Cung Ứng* (Tiến độ 88%, Gói Enterprise 3.5 Tỷ).
   - Nút **"+ Khởi Tạo Dự Án"** cho phép thêm bất kỳ dự án mới nào vào hệ sinh thái ngay trên giao diện.

3. **Bảng Quản Trị Tác Vụ Minh Bạch (Master Task Board):**
   - Thống kê chi tiết từng task: Mã Task, Phòng ban, Tên việc cụ thể, Người phụ trách (PIC), Trạng thái, % Tiến độ.
   - 4 Bộ lọc nhanh: `Đã Xong`, `Đang Làm`, `Bị Nghẽn`, `Đã Hủy Bỏ` (kèm lý do vì sao hủy).
   - Nút 🔄 chuyển đổi trạng thái task nhanh (Real-time update) tự động cập nhật thanh tiến độ % của toàn dự án.

4. **Dòng Thời Gian Lịch Sử & Nhật Ký Vibe Coding (Live Audit Trail):**
   - Hiển thị theo thứ tự thời gian những gì từng phòng ban và AI vừa thực hiện (Ví dụ: *"Frontend hoàn tất giao diện Mobile 390px"*, *"Backend báo cáo Blocker chờ ngân hàng"*).
   - Lưu trữ bền vững qua `localStorage` – dữ liệu không bị mất khi F5 tải lại trang.

3. **Phân Quyền Vai Trò (Role-Based Access Control) & Bảo Vệ Chi Phí Token AI:**
   - **Chế độ Admin Master:** Toàn quyền phát lệnh kỹ thuật xuống 9 phòng ban (`+ Phát Lệnh Cho AI Vibe`), cấp Key bảo mật cho khách hàng, khởi tạo dự án.
   - **Chế độ Khách Hàng (Client):** Khi khách hàng đăng nhập bằng Project Access Key, hệ thống tự động ẩn nút phát lệnh AI Vibe (tránh tốn chi phí token của Admin) và khóa quyền chỉnh sửa skill kỹ thuật. Khách hàng chỉ theo dõi tiến độ và gửi **Feedback** về cho **Project Manager (PM)**.

4. **Cổng Tư Vấn Khách Hàng Thân Thiện ([`client_portal.html`](./client_portal.html)):**
   - Dành cho khách vãng lai và đối tác tìm hiểu dịch vụ.
   - **AI Chuyên Gia Tư Vấn (Client-Facing AI):** Phân tích ý tưởng dưới ngôn ngữ đời thường, dễ hiểu, làm nổi bật lợi ích kinh doanh và dự toán chi phí hợp lý.
   - Kênh kết nối trực tiếp với Admin: Zalo, Hotline 24/7, Facebook Messenger, Email.
   - Cổng đăng nhập bảo mật bằng **Mã Khóa Dự Án (Project Access Key)**.

5. **Bộ Sinh & Xác Thực Key Mã Hóa Dự Án (`ITKEY-...`):**
   - Admin nhập Tên khách hàng + Ngày sinh + SĐT + Mã dự án &rarr; Hệ thống tự động mã hóa kèm chữ ký số.
   - Tích hợp bộ lọc an ninh đầu vào (Input Sanitization): Chặn đứng 100% các hành vi tấn công XSS, SQL Injection hoặc cố ý đánh cắp dữ liệu.

---

## 🚀 Hướng Dẫn Mở & Trải Nghiệm Dashboard

Bạn có thể mở Dashboard trực tiếp bằng 1 trong các cách sau:

### Cách 1: Mở Trực Tiếp Bằng Trình Duyệt Web (Đơn Giản Nhất)
* Vào thư mục: `d:\DOWNLOAD\IT-Assignment\monitor_dashboard\`
* Click đúp chuột vào tệp **`index.html`** để mở trên Google Chrome, Edge hoặc Safari.

### Cách 2: Khởi Chạy Local Server (Nếu Muốn Mở Cổng HTTP)
Mở terminal tại thư mục `monitor_dashboard` và gõ một trong các lệnh:
```bash
# Bằng Node.js (npx serve):
npx serve .

# Hoặc bằng Python:
python -m http.server 8080
```
Sau đó truy cập: `http://localhost:8080` trên trình duyệt.


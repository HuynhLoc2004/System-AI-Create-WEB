# 05. ĐỘI NGŨ PHÁT TRIỂN GIAO DIỆN (FRONTEND DEVELOPERS)

> **Vị trí trong chuỗi:** Đội ngũ xây dựng toàn bộ những gì người dùng cuối nhìn thấy, chạm vào và tương tác trực tiếp.

---

### 1. Mục Tiêu Cốt Lõi (Core Mission)
* **Tái hiện chính xác thiết kế (Pixel-Perfect Fidelity):** Hiện thực hóa bản vẽ Figma thành giao diện web/app sống động, mượt mà trên mọi thiết bị.
* **Tối ưu tốc độ hiển thị vượt trội:** Đạt điểm chuẩn trải nghiệm Google Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1).
* **Trải nghiệm mượt mà & Xử lý lỗi tinh tế:** Không giật lag khi chuyển trang, hiển thị trạng thái chờ thông minh (Skeleton Loading) và thông báo lỗi rõ ràng.

---

### 2. Trách Nhiệm Chi Tiết (Detailed Responsibilities)

1. **Phân rã thành phần nguyên tử (Atomic Components):**
   * Chia nhỏ giao diện Figma thành các khối có khả năng tái sử dụng tối đa:
     - *Atoms:* Nút bấm (Button), Ô nhập (Input), Nhãn (Badge), Biểu tượng (Icon).
     - *Molecules:* Ô tìm kiếm (Input + Button), Thẻ sản phẩm nhỏ.
     - *Organisms:* Thanh điều hướng (Navbar), Bảng dữ liệu (Data Table), Giỏ hàng nổi.
     - *Templates & Pages:* Khung trang hoàn chỉnh.

2. **Đảm bảo tính thích ứng đa màn hình (Responsive Design):**
   * Kiểm thử chuẩn xác trên Mobile (375px+), Tablet, Laptop và màn hình 4K.
   * Xử lý tối ưu thao tác cảm ứng chạm (Touch gestures) trên thiết bị di động.

3. **Quản lý trạng thái ứng dụng (State Management):**
   * Phân tách rõ ràng giữa:
     - **Server State:** Dữ liệu fetch từ API Backend, quản lý qua TanStack Query (React Query) với cơ chế tự động revalidate, cache và optimistic update.
     - **Client State:** Dữ liệu UI cục bộ (Mở/đóng Sidebar, Modal, Dark/Light Mode) quản lý qua Zustand nhẹ nhàng.

4. **Tích hợp dữ liệu API & Xử lý bảo mật Client:**
   * Kết nối RESTful API / GraphQL / WebSocket từ Backend theo chuẩn OpenAPI.
   * Tự động gắn JWT Token vào Header qua Interceptors, tự động gọi API Refresh Token khi Access Token hết hạn mà không ngắt quãng phiên làm việc của người dùng.
   * Phòng chống tấn công mã độc Cross-Site Scripting (XSS), khử trùng dữ liệu đầu vào (DOMPurify).

---

### 3. Bộ Công Cụ Sử Dụng (Toolstack)
* **Framework & Core:** React 18/19, Next.js 14+ (App Router), TypeScript.
* **Styling:** Tailwind CSS, Lucide React Icons, Shadcn/ui, Framer Motion.
* **State & Data Fetching:** Zustand, TanStack Query v5, Axios.
* **Form & Validation:** React Hook Form, Zod.
* **Testing & Kiểm tra:** Chrome DevTools, Lighthouse, Postman, Jest, Playwright.

---

### 4. Danh Mục Tài Liệu Bàn Giao Trong Thư Mục Này
* [`01_coding_standards/`](./01_coding_standards/): Tiêu chuẩn Clean Code, cấu trúc mã nguồn Feature-based và mẫu Component chuẩn.
* [`02_state_and_routing/`](./02_state_and_routing/): Quy chuẩn quản lý State, điều hướng Router và bảo vệ tuyến đường (Auth Guards).
* [`03_api_integration/`](./03_api_integration/): Mã nguồn mẫu Axios Interceptor tự động Refresh Token, xử lý Skeleton Loading.
* [`04_performance_and_security_checklist.md`](./04_performance_and_security_checklist.md): Bảng kiểm định hiệu năng Core Web Vitals và bảo mật client.


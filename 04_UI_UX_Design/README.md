# 04. ĐỘI NGŨ THIẾT KẾ TRẢI NGHIỆM & GIAO DIỆN (UI/UX DESIGNER)

> **Vị trí trong chuỗi:** Biến tài liệu chữ viết khô khan thành giao diện tương tác trực quan, sống động trước khi viết dòng code đầu tiên.

---

### 1. Mục Tiêu Cốt Lõi (Core Mission)
* **Bản sắc sáng tạo riêng biệt & Bắt mắt:** Không sao chép máy móc, xây dựng ngôn ngữ thiết kế độc bản (Neo-Modern Glass & Dark/Light System) tạo dấu ấn thương hiệu sâu đậm trong tâm trí khách hàng.
* **Kỷ luật thị giác nghiêm ngặt (Strict Visual Discipline):** Chỉ sử dụng bảng mã màu cố định và thang font chữ chuẩn hóa suốt toàn bộ dự án; bài trừ triệt để tình trạng thiết kế và gõ mã màu/cỡ chữ bừa bãi.
* **Ưu tiên nhu cầu khách hàng & Trải nghiệm cuộn mượt mà:** Bố cục lấy người dùng làm trung tâm (Thumb-zone), trải nghiệm cuộn trang êm ái 60/120fps (Kinetic Smooth Scroll), không gây mỏi mắt hay gián đoạn mạch cảm xúc.
* **Thích ứng hoàn mỹ đa màn hình (Fluid Responsive):** Co dãn linh hoạt và tối ưu từ iPhone nhỏ (375px) đến máy tính để bàn 4K rộng lớn.

---

### 2. Trách Nhiệm Chi Tiết (Detailed Responsibilities)

1. **UX (Trải nghiệm người dùng) & Nghiên cứu hành vi:**
   * Nghiên cứu hành vi thực tế, vẽ luồng người dùng (User Flow) chi tiết từ lúc mở web đến khi thanh toán thành công.
   * Tạo khung xương màn hình (Low-fidelity Wireframes) để BA, TPM và Khách hàng kiểm chứng logic trước khi làm màu sắc.

2. **UI (Giao diện người dùng) & Bản sắc sáng tạo độc bản:**
   * Thiết kế giao diện đồ họa hoàn chỉnh với độ sắc nét cao (High-fidelity Mockups trên Figma).
   * Tuân thủ tỷ lệ vàng 60-30-10 trong phối màu và chuẩn độ tương phản tiếp cận (WCAG AAA/AA).
   * Thiết kế thích ứng đa kích cỡ màn hình: Mobile (375-430px), Tablet (768-1024px), Desktop (1440px+).

3. **Xây dựng Hệ Thống Thiết Kế & Kỷ luật Design Tokens:**
   * Quy chuẩn hóa toàn bộ các yếu tố cơ bản (Design Tokens: Màu cố định, Thang cỡ chữ chuẩn, 8pt Grid, Bo góc).
   * Xây dựng thư viện thành phần giao diện (UI Components: Buttons, Inputs, Modals, Dropdowns, Badges, Tables) với đầy đủ 7 trạng thái tương tác.

4. **Đặc tả trải nghiệm cuộn trang mượt mà (Kinetic Motion & Smooth Scroll):**
   * Định nghĩa cơ chế Header thông minh tự ẩn/hiện khi cuộn (Headroom pattern).
   * Thiết kế hiệu ứng trồi nội dung nhịp nhàng (Staggered Scroll Reveal) tối ưu bằng GPU không gây giật lag.

5. **Tạo bản mẫu thử nghiệm & Bàn giao chuẩn xác (Prototype & Handoff):**
   * Bàn giao file Figma chuẩn chỉ (Dev Handoff Mode) kèm ghi chú kích thước và tài nguyên SVG tối ưu.

---

### 3. Bộ Công Cụ Sử Dụng (Toolstack)
* **Thiết kế & Prototype chính:** Figma, FigJam.
* **Hỗ trợ minh họa & Đồ họa:** Adobe Illustrator, Photoshop, Unsplash, Iconify.

---

### 4. Danh Mục Tài Liệu Bàn Giao Trong Thư Mục Này
* [`01_ux_research_user_flow/`](./01_ux_research_user_flow/): Luồng người dùng, kiến trúc thông tin (IA) và khung xương wireframe.
* [`02_design_system/`](./02_design_system/): 
  - [`strict_brand_identity_and_creative_rules.md`](./02_design_system/strict_brand_identity_and_creative_rules.md): **[QUY TẮC CỐT LÕI]** Bản sắc thiết kế độc bản, kỷ luật thép về bảng màu cố định, font chữ và danh sách lỗi cấm kỵ.
  - [`smooth_scroll_and_motion_experience.md`](./02_design_system/smooth_scroll_and_motion_experience.md): **[TRẢI NGHIỆM CUỘN MƯỢT]** Đặc tả cuộn mượt mà 60/120fps, Header tự ẩn/hiện thông minh và hiệu ứng trồi nội dung.
  - [`fluid_responsive_design_rules.md`](./02_design_system/fluid_responsive_design_rules.md): **[RESPONSIVE ĐA THIẾT BỊ]** Quy tắc thiết kế co giãn mượt mà, tối ưu vùng bấm ngón tay cái trên di động.
  - [`design_system_tokens.md`](./02_design_system/design_system_tokens.md): Bảng quy chuẩn Design Tokens chi tiết và 7 trạng thái component.
  - [`tokens.json`](./02_design_system/tokens.json): Tệp JSON token xuất sang code cho Frontend lập trình.
* [`03_figma_handoff_specs/`](./03_figma_handoff_specs/): Hướng dẫn bàn giao cho Dev (Handoff specs, Asset export, Animation easing) và tiêu chí nghiệm thu Prototype.


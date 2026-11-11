# 04. BẢNG KIỂM ĐỊNH 5 CHIỀU: UI, UX, HIỆU ỨNG, TRẢI NGHIỆM & RESPONSIVE
## (5-DIMENSIONAL FRONTEND AUDIT CHECKLIST)

> **Mục đích:** Trước khi ký duyệt (Sign-off) một màn hình hoặc tính năng giao diện, kiểm thử viên QA bắt buộc phải rà soát đối chiếu đầy đủ cả 5 chiều không gian bên dưới, không được bỏ sót bất kỳ hạng mục nào.

---

## 1. Chiều 1: Kiểm Thử Giao Diện Đồ Họa (UI Pixel-Perfect Audit)
- [ ] **Màu sắc đúng Token:** So màu các nút bấm, viền, icon xem có khớp chính xác với mã Hex trong tài liệu Design System hay không (Không dùng màu xám xỉn hoặc màu xanh sai lệch).
- [ ] **Typography đúng thang cỡ:** Kiểm tra font chữ đúng `Plus Jakarta Sans`, kích thước Heading và Body đúng thang Modular Type Scale (12px, 14px, 16px, 20px, 24px, 32px, 48px). Không xuất hiện cỡ chữ lẻ như 13px, 15px.
- [ ] **Khoảng cách lưới 8pt:** Đo đạc padding, margin giữa các thẻ card xem có tuân thủ quy tắc bội số của 8px (8px, 16px, 24px, 32px) hay không.
- [ ] **Độ tương phản màu sắc (WCAG AAA/AA):** Chữ đen trên nền trắng, chữ trắng trên nền xanh đạt độ tương phản tối thiểu 4.5:1, không bị chói mắt hay nhạt nhòa khó đọc dưới ánh nắng mặt trời.

---

## 2. Chiều 2: Kiểm Thử Trải Nghiệm Thao Tác (UX Usability Audit)
- [ ] **Quy tắc 3 cú click chuột:** Khách hàng từ trang chủ có thể tìm thấy sản phẩm và tới bước thanh toán trong vòng tối đa 3 thao tác hay không.
- [ ] **Thông báo lỗi tử tế & rõ ràng (Human-readable Error Messages):** Khi người dùng làm sai, hệ thống hiển thị thông báo hướng dẫn cụ thể (Ví dụ: *"Vui lòng nhập số điện thoại gồm 10 chữ số"*), tuyệt đối không hiển thị mã lỗi vô cảm như `Error Code: 500 Null Pointer`.
- [ ] **Vùng bấm ngón tay cái thuận tiện (Thumb Zone):** Các nút quan trọng nhất trên điện thoại (Mua ngay, Thêm vào giỏ) nằm ở nửa dưới màn hình để bấm bằng 1 tay dễ dàng.

---

## 3. Chiều 3: Kiểm Thử Hiệu Ứng Chuyển Động (Motion & Smooth Scroll Audit)
- [ ] **Trải nghiệm cuộn trang mượt mà (60fps/120fps):** Cuộn chuột hoặc lướt ngón tay trang web trôi êm ái (Lenis Engine), không có hiện tượng giật cục, khựng hình hoặc xé hình.
- [ ] **Thanh Menu thông minh (Headroom Behavior):**
  - Khi cuộn xuống: Menu trượt ẩn mượt mà mở rộng tầm nhìn.
  - Khi hơi cuộn ngược lên: Menu trượt xuống ngay tức khắc với hiệu ứng kính mờ sương (`backdrop-blur`).
- [ ] **Hiệu ứng trồi thẻ Card nhịp nhàng (Staggered Reveal):** Các sản phẩm khi lọt vào tầm mắt trồi nhẹ 15px theo nhịp sóng, thời gian chuyển động trong khoảng 300ms - 400ms.
- [ ] **Không gây quá tải CPU:** Kiểm tra tab Performance trong Chrome DevTools, CPU không bị nhảy vọt lên 100% khi cuộn trang liên tục.

---

## 4. Chiều 4: Kiểm Thử Trải Nghiệm Chờ Tải (Perceived Performance Audit)
- [ ] **Trạng thái Skeleton Loading:** Khi mạng chậm (Giả lập chế độ Fast 3G trên DevTools), các khối chữ nhật màu xám nhấp nháy giữ chỗ trước, không xuất hiện màn hình trắng tinh hoặc vòng tròn xoay tít giữa trang.
- [ ] **Trạng thái trống (Empty State):** Khi giỏ hàng chưa có gì hoặc tìm kiếm không ra kết quả, màn hình hiển thị hình minh họa thân thiện kèm nút gợi ý: *"Khám phá sản phẩm ngay"*.
- [ ] **Trạng thái mất mạng (Offline Fallback):** Khi rút dây mạng hoặc ngắt wifi, hệ thống hiển thị thông báo thông cảm: *"Mất kết nối Internet. Vui lòng kiểm tra lại đường truyền của bạn"*.

---

## 5. Chiều 5: Kiểm Thử Tương Thích Mọi Kích Thước Màn Hình (Responsive Audit)
- [ ] **Không bị lỗi cuộn ngang tai hại (Zero Horizontal Overflow):** Tuyệt đối không có thanh cuộn ngang xuất hiện trên bất kỳ dòng điện thoại nào (`overflow-x: hidden`).
- [ ] **Kiểm thử trên 5 kích thước chuẩn:**
  1. *Mobile siêu nhỏ:* iPhone SE / 375px.
  2. *Mobile chuẩn:* iPhone 14/15 / 390px.
  3. *Máy tính bảng:* iPad Pro / 768px - 1024px.
  4. *Laptop văn phòng:* MacBook Air / 1280px.
  5. *Màn hình lớn:* Desktop Monitor / 1440px - 1920px.
- [ ] **Bàn phím ảo di động:** Khi chạm vào ô nhập liệu trên điện thoại, bàn phím số/chữ nhảy lên không được che khuất ô nhập hoặc nút "Xác nhận".
- [ ] **Xoay lật màn hình (Orientation):** Khi xoay ngang điện thoại (Landscape mode), bố cục tự động dàn đều, không bị vỡ khung.


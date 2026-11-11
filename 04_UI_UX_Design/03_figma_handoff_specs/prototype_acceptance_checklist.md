# BIÊN BẢN NGHIỆM THU BẢN MẪU TƯƠNG TÁC (PROTOTYPE ACCEPTANCE CHECKLIST)

Trước khi chuyển giao bản vẽ Figma sang Sprint Lập trình Frontend, nhóm BA, PO và Frontend Lead cùng thực hiện bài kiểm tra:

- [ ] **Tính liên tục của luồng (Flow Continuity):** Toàn bộ các nút bấm chính có thể bấm và chuyển trang trơn tru từ Trang chủ ➔ Xem sản phẩm ➔ Giỏ hàng ➔ Thanh toán ➔ Trang xác nhận thành công.
- [ ] **Bao quát trường hợp lỗi (Error States):** Có màn hình hiển thị khi không có kết quả tìm kiếm (Empty State), lỗi mất kết nối mạng (Offline State) và trang 404 Không tìm thấy trang.
- [ ] **Kiểm tra trạng thái Skeleton Loading:** Có thiết kế khối xám nhấp nháy mô phỏng nội dung trong lúc chờ API trả về dữ liệu.
- [ ] **Độ tương thích thiết bị (Responsive Coverage):** Mỗi trang đều có đủ 2 bản vẽ: Mobile view (390px) và Desktop view (1440px).
- [ ] **Ký duyệt chuyển giao:**
  * UI/UX Designer: *Đã hoàn tất & Gắn nhãn `Ready for Dev`*
  * Business Analyst: *Xác nhận khớp 100% với SRS*
  * Frontend Lead: *Xác nhận tính khả thi & Bắt đầu phân rã Component*


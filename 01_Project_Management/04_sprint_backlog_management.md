# QUY TRÌNH QUẢN LÝ SPRINT BACKLOG & ĐỊNH NGHĨA HOÀN THÀNH

## 1. Tiêu Chuẩn Tiếp Nhận (Definition of Ready - DoR)
Một User Story chỉ được đưa vào Sprint Planning khi thỏa mãn 100% các tiêu chí sau:
- [ ] User Story được viết đúng chuẩn: *"Là [vai trò], tôi muốn [hành động], để [giá trị đem lại]"*.
- [ ] Có đầy đủ Tiêu chí nghiệm thu (Acceptance Criteria - AC) viết theo chuẩn **Given - When - Then**.
- [ ] Có bản vẽ thiết kế Figma đính kèm (cho task UI) và đã được UI/UX Designer gắn nhãn `Ready for Dev`.
- [ ] Đã có API Contract hoặc Swagger specs dự kiến (nếu liên quan đến giao tiếp FE - BE).
- [ ] Đã được toàn đội ước tính độ phức tạp (Story Points / Planning Poker).
- [ ] Đã nhận diện và không bị chặn bởi bất kỳ phụ thuộc nào bên ngoài (No unresolved dependencies).

---

## 2. Tiêu Chuẩn Hoàn Thành (Definition of Done - DoD)
Một Task/Story chỉ được chuyển sang trạng thái **Done** khi:
- [ ] Toàn bộ mã nguồn đã được commit lên Git nhánh tương ứng và tuân thủ Clean Code.
- [ ] Đã qua bước Code Review (Tối thiểu 1 Senior/Peer chấp thuận Pull Request).
- [ ] Unit Test đạt độ bao phủ (Coverage) tối thiểu 75%, không có test case nào bị fail.
- [ ] CI/CD Pipeline chạy tự động thành công (Build, Lint, Test, Container Scan).
- [ ] Đã deploy thành công lên môi trường `Staging`.
- [ ] QA/QC đã kiểm thử chức năng và xác nhận đạt yêu cầu theo Acceptance Criteria.
- [ ] Không xuất hiện lỗi mới (No regressions) và không có lỗi từ mức Major trở lên còn tồn đọng.
- [ ] Tài liệu hướng dẫn sử dụng hoặc API docs đã được cập nhật đồng bộ.

---

## 3. Nhịp Sinh Học Trong Sprint (Scrum Ceremonies)
1. **Sprint Planning (Đầu Sprint - 2 giờ):** TPM, BA và Dev chọn Story từ Product Backlog đưa vào Sprint Backlog dựa trên Velocity trung bình.
2. **Daily Standup (Hàng ngày lúc 09:15 - 15 phút):** 
   * Hôm qua bạn đã hoàn thành gì?
   * Hôm nay bạn dự định làm gì?
   * Bạn có gặp bất kỳ trở ngại (Blocker) nào không?
3. **Backlog Refinement / Grooming (Giữa Sprint - 1 giờ):** Làm rõ yêu cầu cho Sprint kế tiếp.
4. **Sprint Review / Demo (Cuối Sprint - 1.5 giờ):** Trình diễn sản phẩm chạy thực tế cho Khách hàng & Ban Giám Đốc.
5. **Sprint Retrospective (Sau Demo - 1 giờ):** 
   * Điều gì đã làm tốt? (What went well?)
   * Điều gì cần cải thiện? (What could be improved?)
   * Hành động cụ thể cho Sprint tới? (Action items).


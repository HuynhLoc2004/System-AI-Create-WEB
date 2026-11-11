# HƯỚNG DẪN BÀN GIAO THIẾT KẾ CHO LẬP TRÌNH VIÊN (FIGMA HANDOFF)

## 1. Tổ Chức Layer & Cấu Trúc File Figma
1. **Auto Layout 100%:** Mọi khung hình (Frame), nút bấm, card và layout đều bắt buộc bật Auto Layout. Tuyệt đối không để layer trôi nổi tự do (Absolute Position) trừ trường hợp Modal Backdrop hoặc Tooltip.
2. **Quy tắc xuất tài nguyên (Asset Export):**
   * Biểu tượng (Icons): Xuất định dạng chuẩn **SVG**, gộp vector (Outline Stroke, Flatten), kích thước bao chuẩn 24x24px.
   * Hình ảnh minh họa: Xuất 2 phiên bản: WebP (ưu tiên nén nhẹ) và PNG độ phân giải `@2x` cho màn hình Retina.
3. **Hiệu ứng chuyển động (Micro-interactions & Animations):**
   * Thời lượng chuyển cảnh thông thường: **200ms - 300ms**.
   * Đường cong chuyển động chuẩn: `cubic-bezier(0.4, 0, 0.2, 1)` (Chuẩn Ease-in-out của Tailwind / Material Design).
   * Không sử dụng animation dài quá 500ms vì gây ức chế cho người dùng lặp lại thao tác nhiều lần.

---

## 2. Giao Tiếp Đội Ngũ Qua Figma Comment
* Khi Designer sửa đổi bất kỳ vị trí nào sau khi đã bàn giao: Bắt buộc để lại Comment dạng: `[CHANGE-LOG 20/11]: Cập nhật padding từ 16px lên 24px theo yêu cầu BA @frontend-lead`.
* Đội Frontend sau khi hoàn tất màn hình sẽ tag QA và Designer vào kiểm tra đối soát từng pixel (Pixel-perfect verification).


# CHIẾN LƯỢC TRẠNG THÁI CHỜ THÔNG MINH (SKELETON LOADING & FALLBACKS)

## 1. Nguyên Tắc Trải Nghiệm Chờ Tải (Perceived Performance)
1. **Tuyệt đối không dùng một con xoay tròn (Spinner) ở giữa trang trắng:** Nó khiến người dùng có cảm giác trang web bị đơ hoặc tải rất lâu.
2. **Sử dụng Skeleton Screens:** Dựng các khối chữ nhật màu xám nhạt (`bg-slate-200 animate-pulse`) khớp chính xác vị trí ảnh đại diện, dòng tiêu đề và nút bấm thật. Khi dữ liệu đổ về, nội dung sẽ hiện ra liền mạch mà không làm nhảy bố cục trang (Chống giật CLS - Cumulative Layout Shift).

---

## 2. Xử Lý 4 Trạng Thái Mẫu Cho Mọi Màn Hình Có Dữ Liệu
Mọi component danh sách dữ liệu phải bao quát đủ 4 trạng thái:
1. `isLoading`: Render bộ Skeleton tương ứng.
2. `isError`: Render nút "Thử lại" (Retry button) kèm thông báo lỗi mạng.
3. `isEmpty`: Render hình minh họa Empty State kèm câu gợi ý: *"Chưa có đơn hàng nào. Khám phá sản phẩm ngay!"*.
4. `isSuccess`: Render danh sách dữ liệu chính xác.


# QUY CHUẨN ĐIỂM NGẮT MÀN HÌNH THÍCH ỨNG (RESPONSIVE BREAKPOINTS)

| Thiết Bị Mục Tiêu | Điểm Ngắt (Breakpoint) | Kích Thước Frame Figma Chuẩn | Số Cột Lưới (Grid Columns) | Lề Hai Bên (Gutter / Margin) |
|---|:---:|:---:|:---:|:---:|
| **Điện thoại di động (Mobile)** | `< 640px` (sm) | **390 x 844 px** (iPhone 14/15) | 4 Cột | 16px |
| **Máy tính bảng (Tablet)** | `640px - 1023px` (md) | **834 x 1194 px** (iPad Pro 11") | 8 Cột | 24px |
| **Máy tính xách tay (Laptop/Desktop)** | `1024px - 1439px` (lg) | **1280 x 800 px** (MacBook Air) | 12 Cột | 32px |
| **Màn hình lớn (Large Desktop / QHD)** | `>= 1440px` (xl/2xl) | **1440 x 900 px** & Max 1920px | 12 Cột | Auto Centered (Max-width 1280px) |

---

## Quy Tắc Thiết Kế Ưu Tiên Di Động (Mobile-First Rule)
* Luôn thiết kế giao diện từ màn hình Mobile nhỏ nhất (375px) trước. Đảm bảo trải nghiệm 1 ngón tay cái (Thumb zone) thuận tiện, vùng bấm (Tap Target) tối thiểu phải đạt kích thước **44 x 44px**.
* Không thiết kế bảng dữ liệu (Table) quá nhiều cột trên màn hình điện thoại; chuyển đổi sang dạng Thẻ (Card list) khi co về kích thước Mobile.


# BỘ QUY CHUẨN DESIGN SYSTEM & TOKENS

Toàn bộ thông số thiết kế được đặt tên đồng nhất với biến Tailwind CSS để lập trình viên Frontend sử dụng trực tiếp mà không cần quy đổi thủ công.

---

## 1. Bảng Màu Chuẩn (Color Palette & Semantic Tokens)

| Token Name | Mã Màu Hex | Mục Đích Sử Dụng | Tiêu Chuẩn Tiếp Cận (WCAG) |
|---|---|---|---|
| `primary-500` | `#2563EB` (Royal Blue) | Nút bấm chính (Primary CTA), liên kết, thương hiệu chủ đạo | Đạt Contrast 4.5:1 trên nền trắng (AA) |
| `primary-600` | `#1D4ED8` | Trạng thái Hover của nút chính | - |
| `secondary-500`| `#475569` (Slate) | Nút phụ, viền thẻ (Borders), biểu tượng phụ | Đạt AA |
| `success-500`  | `#10B981` (Emerald) | Thông báo thành công, đơn hàng đã thanh toán | Đạt AA |
| `warning-500`  | `#F59E0B` (Amber) | Cảnh báo tồn kho sắp hết, trạng thái chờ xử lý | Đạt AA |
| `danger-500`   | `#EF4444` (Rose) | Báo lỗi form, nút Hủy đơn, cảnh báo nguy hiểm | Đạt AA |
| `bg-surface`   | `#FFFFFF` / `#0F172A` | Nền trang chế độ Sáng (Light) / Tối (Dark mode) | - |

---

## 2. Thang Đo Cỡ Chữ (Typography Scale)
* **Font Family:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

| Cấp Bậc | Kích Thước (Font-Size) | Chiều Cao Dòng (Line-Height) | Độ Đậm (Font-Weight) | Ứng Dụng Thực Tế |
|---|:---:|:---:|:---:|---|
| `Display-1` | 36px (2.25rem) | 44px (2.75rem) | 700 (Bold) | Banner Hero Trang chủ |
| `Heading-1` | 28px (1.75rem) | 36px (2.25rem) | 700 (Bold) | Tiêu đề trang chính (Page Title) |
| `Heading-2` | 22px (1.375rem) | 28px (1.75rem) | 600 (SemiBold) | Tiêu đề khối / Section Header |
| `Body-Large`| 16px (1.00rem) | 24px (1.50rem) | 400 (Regular) | Nội dung văn bản chính, bài viết |
| `Body-Small`| 14px (0.875rem) | 20px (1.25rem) | 400 (Regular) | Ghi chú form, bảng dữ liệu, mô tả phụ |
| `Caption`   | 12px (0.75rem) | 16px (1.00rem) | 500 (Medium) | Nhãn Badge trạng thái, Timestamp |

---

## 3. Hệ Thống Lưới Khoảng Cách (8pt Spacing Grid)
Mọi khoảng cách (Padding, Margin, Gap) phải là bội số của **8px** (ngoại trừ 4px cho viền siêu nhỏ):
* `space-1`: 4px (Icon padding, micro tag)
* `space-2`: 8px (Khoảng cách giữa icon và chữ)
* `space-3`: 12px (Padding trong ô nhập liệu Input)
* `space-4`: 16px (Padding trong card thành phần chuẩn)
* `space-6`: 24px (Khoảng cách giữa các khối dữ liệu)
* `space-8`: 32px (Margin giữa các phân đoạn trang)
* `space-12`: 48px (Padding trên dưới của Section)

---

## 4. 7 Trạng Thái Thành Phần Giao Diện (Component States)
Mọi thành phần nhập liệu và nút bấm bắt buộc phải được thiết kế đủ 7 trạng thái trên Figma:
1. `Default`: Trạng thái ban đầu khi vừa tải trang.
2. `Hover`: Con trỏ chuột rê vào (đổi màu nhẹ + hiệu ứng chuyển màu 150ms).
3. `Focus`: Bàn phím Tab vào hoặc chuột click giữ (viền sáng 2px ring với màu primary).
4. `Active`: Khoảnh khắc chuột bấm xuống.
5. `Disabled`: Nút bị mờ đi (Opacity 50%, con trỏ chuột hiển thị `not-allowed`).
6. `Loading`: Nút hiển thị con quay Spinner xoay tròn và chặn không cho bấm tiếp.
7. `Error`: Viền đỏ `#EF4444` kèm thông điệp giải thích lỗi bên dưới.


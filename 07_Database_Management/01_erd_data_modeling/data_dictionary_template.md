# TỪ ĐIỂN DỮ LIỆU CHI TIẾT (DATA DICTIONARY)

### Bảng: `orders` (Quản lý đơn hàng)

| Tên Cột (Column Name) | Kiểu Dữ Liệu | Khóa | Cho Phép Rỗng (Nullable) | Giá Trị Mặc Định | Ràng Buộc & Mô Tả Nghiệp Vụ |
|---|---|:---:|:---:|---|---|
| `id` | `UUID` | PK | NO | `gen_random_uuid()` | Định danh duy nhất toàn cầu cho đơn hàng |
| `order_code` | `VARCHAR(32)` | UK | NO | - | Mã đơn hàng hiển thị cho khách (VD: `ORD-20261120-9988`) |
| `user_id` | `UUID` | FK | NO | - | Tham chiếu tới bảng `users(id)` |
| `total_amount` | `NUMERIC(14,2)`| - | NO | `0.00` | Tổng giá trị đơn hàng sau khi trừ voucher (>= 0) |
| `order_status` | `VARCHAR(30)` | - | NO | `'PENDING'` | Trạng thái: `PENDING`, `CONFIRMED`, `SHIPPING`, `COMPLETED`, `CANCELLED` |
| `payment_status` | `VARCHAR(30)` | - | NO | `'UNPAID'` | Trạng thái thanh toán: `UNPAID`, `PAID`, `REFUNDED` |
| `shipping_address`| `JSONB` | - | NO | - | Địa chỉ nhận hàng (Họ tên, SĐT, Số nhà, Phường, Quận, Tỉnh) |
| `expires_at` | `TIMESTAMPTZ` | - | YES | `NOW() + INTERVAL '10 min'` | Thời hạn thanh toán, quá hạn sẽ tự động hủy đơn |
| `created_at` | `TIMESTAMPTZ` | - | NO | `CURRENT_TIMESTAMP` | Thời điểm tạo đơn |
| `updated_at` | `TIMESTAMPTZ` | - | NO | `CURRENT_TIMESTAMP` | Thời điểm cập nhật cuối cùng |


# XỬ LÝ BẤT ĐỒNG BỘ QUA HÀNG ĐỢI THÔNG ĐIỆP (MESSAGE QUEUE & WORKERS)

## 1. Kiến Trúc Hàng Đợi (Queue Architecture)

```
[Backend Core API]
       │
       ├──> Đẩy Job vào Queue ──> [Redis BullMQ / RabbitMQ]
       │                                     │
       ▼                                     ▼
[Trả về ngay HTTP 202 Accepted]    [Worker Service Xử Lý Chạy Ngầm]
                                             ├──> Gửi Email / SMS OTP
                                             ├──> Xuất Hóa Đơn Điện Tử PDF
                                             └──> Tự Động Khôi Phục Tồn Kho Khi Quá Hạn
```

---

## 2. Tiêu Chuẩn Xử Lý Webhook Ngân Hàng Không Bị Trùng Lặp (Idempotency)
Khi cổng thanh toán (VNPay, MoMo) gửi thông báo IPN:
1. Trích xuất mã giao dịch duy nhất từ ngân hàng: `transaction_reference_id`.
2. Thực hiện lệnh Redis Atomic: `SETNX lock:webhook:{id} 1 EX 300` (Khóa trong 5 phút).
   - Nếu trả về `0` (Đã có worker khác đang xử lý): Bỏ qua ngay lập tức, trả về HTTP 200 OK.
   - Nếu trả về `1`: Tiếp tục kiểm tra trong Database bảng `orders`. Nếu đơn đã ở trạng thái `PAID` ➔ Dừng lại, trả về HTTP 200 OK.
3. Cập nhật trạng thái đơn thành `PAID` và kích hoạt luồng xuất kho.


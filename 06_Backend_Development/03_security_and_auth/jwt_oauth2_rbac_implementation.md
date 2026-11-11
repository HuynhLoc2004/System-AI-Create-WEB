# BẢO MẬT XÁC THỰC JWT KÉP & PHÂN QUYỀN VAI TRÒ (RBAC)

## 1. Cơ Chế Xoay Vòng Refresh Token (Refresh Token Rotation)

```mermaid
sequenceDiagram
    autonumber
    actor C as Trình Duyệt Client
    participant BE as Backend Auth Service
    participant DB as Redis / PostgreSQL Session Table

    C->>BE: POST /api/v1/auth/login (SĐT + OTP / Mật khẩu)
    BE->>BE: Xác minh credentials thành công
    BE->>DB: Lưu Hash của Refresh Token (Family ID = F1)
    BE-->>C: Trả về Access Token (15m) + Ghi Refresh Token R1 vào HttpOnly Cookie
    
    Note over C,BE: Sau 15 phút, Access Token hết hạn...
    C->>BE: POST /api/v1/auth/refresh (Gửi kèm Cookie R1)
    BE->>DB: Kiểm tra R1 có hợp lệ trong Family F1 không?
    alt Token R1 hợp lệ
        BE->>DB: VÔ HIỆU HÓA R1, tạo mới R2 trong cùng Family F1
        BE-->>C: Cấp Access Token mới + Cookie R2 mới
    else R1 ĐÃ BỊ DÙNG TRƯỚC ĐÓ (Dấu hiệu bị tin tặc đánh cắp token)
        BE->>DB: CẢNH BÁO: HỦY TOÀN BỘ PHIÊN trong Family F1 ngay lập tức!
        BE-->>C: Trả về 401 Unauthorized, bắt buộc đăng nhập lại
    end
```

---

## 2. Triển Khai Role-Based Access Control (RBAC Guard)
Sử dụng Custom Decorator `@Roles('ADMIN', 'STORE_MANAGER')` trên các Controller. Guard sẽ trích xuất danh sách roles từ Access Token đã giải mã, kiểm tra đối chiếu trước khi cho phép request đi vào hàm Service.


# 04. CHIẾN LƯỢC TRIỂN KHAI CANARY & CỜ TÍNH NĂNG (CANARY DEPLOYMENT & FEATURE FLAGS)
**Phòng Ban:** 12. Quản Lý Phát Hành & Nghiệm Thu (Release Management & UAT Coordinator)  
**Tiêu Chuẩn:** Progressive Delivery & Feature Flag Standard  
**Mục Tiêu:** Giảm thiểu rủi ro khi tung ra tính năng mới bằng cách chỉ mở cho một tỷ lệ nhỏ người dùng thử nghiệm trước khi mở rộng ra 100%.

---

## 1. MÔ HÌNH CANARY TIER-1 (TRIỂN KHAI TIỆM TIẾN)
Thay vì tung bản cập nhật cho 100% người dùng ngay lập tức (dễ gây quá tải hoặc dính lỗi hàng loạt):

```text
[Bản Phát Hành Mới]
       │
       ├──► 5% Người Dùng Nội Bộ / VIP Tester (Theo dõi lỗi trong 2 giờ)
       │         └── Không có lỗi ngoại lệ ──►
       ├──► 25% Khách Hàng Ngẫu Nhiên (Theo dõi tỷ lệ thanh toán VietQR)
       │         └── Chỉ số kinh doanh ổn định ──►
       └──► 100% Toàn Bộ Khách Hàng (Hoàn tất Go-Live)
```

---

## 2. QUẢN LÝ CỜ TÍNH NĂNG Ở FRONTEND & BACKEND (FEATURE FLAGS)
Không cần deploy lại mã nguồn mỗi khi muốn bật/tắt một tính năng:

```javascript
// Ví dụ cấu hình Feature Flag trong Client Store
const FEATURE_FLAGS = {
    ENABLE_VIETQR_NAPAS: true,      // Cổng thanh toán VietQR đã kiểm định
    ENABLE_AI_PRODUCT_ADVISOR: false, // Trợ lý AI đang thử nghiệm nội bộ
    ENABLE_DARK_MODE_TOGGLE: true     // Chế độ tối
};

// Sử dụng trong React Component:
export function PaymentSection({ order }) {
    if (!FEATURE_FLAGS.ENABLE_VIETQR_NAPAS) {
        return <p>Cổng thanh toán đang bảo trì định kỳ, vui lòng liên hệ hotline.</p>;
    }
    return <VietQRAutoCheckout amount={order.total} memo={order.id} />;
}
```
Lợi ích: Khi có lỗi phát sinh, chỉ cần đổi `false` trên cấu hình là tính năng lập tức ẩn đi, không ảnh hưởng đến người dùng khác!

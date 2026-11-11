# 01. THEO DÕI SỰ KIỆN HÀNH VI NGƯỜI DÙNG Ở FRONTEND (FRONTEND EVENT TRACKING VIA POSTHOG / GA4)
**Phòng Ban:** 13. Đo Lường Hành Vi & Vận Hành Hậu Phát Hành (Product Analytics & Post-Launch Support)  
**Tiêu Chuẩn:** Event-Driven Product Instrumentation  
**Mục Tiêu:** Đảm bảo mọi lượt click quan trọng, hành vi thêm giỏ hàng, và quét mã VietQR đều được ghi nhận bằng sự kiện định lượng để phân tích phễu chuyển đổi.

---

## 1. TẠI SAO PHẢI CÀI ĐẶT EVENT TRACKING NGAY TỪ ĐẦU?
Nếu web ra mắt mà không gắn tracking:
- Không biết khách hàng thoát ra ở bước nào (Drop-off funnel).
- Không biết nút "Mua Ngay" hay nút "Thêm Vào Giỏ" được bấm nhiều hơn.
- Không thể tối ưu doanh thu dựa trên dữ liệu thực.

---

## 2. CHUẨN ĐẶT TÊN SỰ KIỆN (EVENT TAXONOMY CHUẨN TIER-1)
Sử dụng cấu trúc: `[Đối Tượng] [Hành Động]` (Object + Action):

| Tên Sự Kiện (Event Name) | Vị Trí Kích Hoạt | Thuộc Tính Gửi Kèm (Payload) |
| :--- | :--- | :--- |
| `product_viewed` | Khi khách mở trang chi tiết sản phẩm | `{ product_id: "BT-LOC-01", price: 3850000, category: "Gốm Phong Thủy" }` |
| `cart_item_added` | Khi khách bấm nút "Thêm vào giỏ" | `{ product_id: "BT-LOC-01", quantity: 1, current_cart_total: 3850000 }` |
| `checkout_qr_generated` | Khi mã VietQR hiển thị thành công | `{ order_id: "ORD-9912", amount: 3850000, payment_method: "VietQR_Napas" }` |
| `payment_completed` | Khi hệ thống ghi nhận đối soát thành công | `{ order_id: "ORD-9912", duration_seconds: 14 }` |

---

## 3. CODE MẪU BỌC TRACKER NHẸ NHÀNG (ZERO-LOAD EVENT TRACKER)
Không tải thư viện nặng vài megabyte; sử dụng wrapper nhẹ chỉ gửi beacon hoặc telemetry:

```javascript
// utils/analytics.js
export function trackEvent(eventName, properties = {}) {
    const payload = {
        event: eventName,
        properties: {
            ...properties,
            timestamp: new Date().toISOString(),
            screen_resolution: `${window.innerWidth}x${window.innerHeight}`,
            referrer: document.referrer
        }
    };

    // Gửi qua Navigator Beacon không làm nghẽn main thread
    if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/events', JSON.stringify(payload));
    } else {
        fetch('/api/analytics/events', { method: 'POST', body: JSON.stringify(payload), keepalive: true }).catch(() => {});
    }
}
```


# 04. PHÒNG THỦ LỖ HỔNG ỦY QUYỀN VÀ TRUY CẬP TRÁI PHÉP ĐỐI TƯỢNG (IDOR / BOLA DEFENSE)
**Phòng Ban:** 11. An Toàn Thông Tin Ứng Dụng (Application Security - DevSecOps)  
**Tiêu Chuẩn:** OWASP API Security Top 10 - API1:2023 Broken Object Level Authorization (BOLA/IDOR)  
**Mục Tiêu:** Đảm bảo một khách hàng A không thể xem trộm hoặc sửa đổi đơn hàng, giỏ hàng, hoặc thông tin của khách hàng B chỉ bằng cách đổi ID trên đường dẫn URL.

---

## 1. NGUY CƠ BOLA / IDOR DO AI TỰ ĐỘNG SINH CODE
AI thường viết code lấy dữ liệu dựa thuần túy trên `req.params.id`:
```javascript
// ❌ ĐOẠN CODE NGUY HIỂM DO AI SINH THIẾU KIỂM SOÁT
app.get('/api/orders/:id', async (req, res) => {
    // Kẻ tấn công chỉ cần đổi :id=1 thành :id=2 là đọc trộm đơn hàng của người khác!
    const order = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    res.json(order);
});
```

---

## 2. QUY CHUẨN BẮT BUỘC PHÒNG CHỐNG BOLA / IDOR

```javascript
// ✅ ĐOẠN CODE ĐẠT CHUẨN TIER-1 APPSEC GATE
app.get('/api/orders/:id', verifyAuthMiddleware, async (req, res) => {
    const orderId = req.params.id;
    const currentUserId = req.user.id; // Lấy từ Token đã xác thực
    const userRole = req.user.role;

    let query;
    let params;

    if (userRole === 'ADMIN') {
        // Admin được quyền xem mọi đơn
        query = 'SELECT * FROM orders WHERE id = $1';
        params = [orderId];
    } else {
        // Khách hàng BẮT BUỘC phải sở hữu đơn hàng đó
        query = 'SELECT * FROM orders WHERE id = $1 AND user_id = $2';
        params = [orderId, currentUserId];
    }

    const order = await db.query(query, params);
    if (!order.rows[0]) {
        return res.status(404).json({ error: 'Đơn hàng không tồn tại hoặc bạn không có quyền truy cập' });
    }
    return res.json(order.rows[0]);
});
```

### Tiêu Chuẩn Thẻ Nhận Diện ID:
1. **Không dùng số tự tăng tuần tự (Auto-increment Integer IDs)** ở Client-facing API: Tránh để lộ số lượng đơn hàng (VD: `/orders/1`, `/orders/2`).
2. **Sử dụng UUIDv4 hoặc NanoID ngẫu nhiên:** Ví dụ: `/orders/ord_9f83ac71e2`.

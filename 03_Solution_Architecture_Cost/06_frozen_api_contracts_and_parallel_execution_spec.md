# 06. ĐẶC TẢ ĐÓNG BĂNG HỢP ĐỒNG API & PHÁT TRIỂN SONG SONG (FROZEN API CONTRACTS & PARALLEL EXECUTION SPEC)
**Phòng Ban:** 03. Kiến Trúc Sư Hệ Thống & Tối Ưu Chi Phí (Solution Architect & Cost)  
**Tiêu Chuẩn:** Contract-First Development (OpenAPI 3.0 & TypeScript Interface Freezing)  
**Mục Tiêu:** Triệt tiêu điểm nghẽn "Frontend phải ngồi chờ Backend code xong API mới làm được giao diện", cho phép FE & BE lập trình song song 100%.

---

## 1. NGUYÊN TẮC BĂNG HÓA HỢP ĐỒNG (CONTRACT FREEZING)
Trước khi lập trình viên gõ dòng code đầu tiên, Solution Architect bắt buộc phải phát hành **Bản hợp đồng API đã đóng băng (Frozen Contract)**:
- Một khi đã đóng băng, Backend không được tùy tiện đổi tên trường JSON (VD: đổi `price` thành `amount`).
- Frontend sử dụng hợp đồng này để tạo Mock Data nội bộ hoặc MSW (Mock Service Worker) và dựng toàn bộ giao diện ngay lập tức.

---

## 2. BẢN HỢP ĐỒNG API CHUẨN (TYPESCRIPT DATA CONTRACT)

```typescript
// contracts/ecommerce.contract.ts

/**
 * HỢP ĐỒNG DỮ LIỆU ĐÃ ĐÓNG BĂNG GIỮA FRONTEND VÀ BACKEND
 * Phiên bản: v1.0.0-FROZEN
 */

export interface ProductItem {
    id: string;             // Định dạng: "PROD-XXX"
    name: string;           // Tên sản phẩm tiếng Việt có dấu
    price: number;          // Đơn vị: VNĐ (Nguyên dương)
    category: string;       // Tên danh mục
    imageUrl: string;       // URL hình ảnh sắc nét
    stock: number;          // Số lượng tồn kho
}

export interface CreateOrderRequest {
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    items: Array<{
        productId: string;
        quantity: number;
    }>;
}

export interface CreateOrderResponse {
    orderId: string;
    totalAmount: number;
    vietQrPayload: {
        bankCode: string;
        accountNumber: string;
        accountName: string;
        qrDataUrl: string;   // Chuỗi mã QR Napas 247
    };
    status: 'PENDING_PAYMENT' | 'PAID' | 'FAILED';
}
```

### Lợi Ích Của Cơ Chế Này:
1. **Rút ngắn 50% thời gian phát triển:** FE và BE làm việc độc lập không bị chặn (Unblocked).
2. **Ghép nối (Integration) không lỗi:** Khi BE hoàn thành, chỉ cần trỏ endpoint thật là hệ thống khớp 100% không phát sinh lỗi sai tên thuộc tính (Mismatch Key).

# 01. GIAO THỨC KIỂM THỬ CHẤP NHẬN NGƯỜI DÙNG & DỮ LIỆU GIẢ LẬP SẢN XUẤT (UAT PROTOCOL & MOCK PRODUCTION DATA)
**Phòng Ban:** 12. Quản Lý Phát Hành & Nghiệm Thu (Release Management & UAT Coordinator)  
**Tiêu Chuẩn:** User Acceptance Testing (UAT) Standard & Synthetic Data Protocol  
**Mục Tiêu:** Đảm bảo khách hàng và người dùng cuối nghiệm thu sản phẩm trên một môi trường độc lập (Staging Sandbox) với dữ liệu giả lập giống thật 100% trước khi cho khách hàng thật truy cập.

---

## 1. TẠI SAO QA SIGN-OFF CHƯA ĐỦ ĐỂ GO-LIVE?
QA chỉ kiểm tra tính đúng đắn về mặt kỹ thuật: "Bấm nút có bị lỗi cú pháp không? API có trả về 200 OK không?".  
Nhưng **UAT (Nghiệm thu người dùng)** kiểm tra tính đúng đắn về mặt nghiệp vụ và trải nghiệm:
- Tên sản phẩm hiển thị trên di động có bị xấu không?
- Khi quét mã VietQR bằng app ngân hàng thật (VCB, MB, Techcombank), nội dung đơn hàng có dễ hiểu không?
- Luồng mua hàng thực tế của khách mất bao nhiêu giây? Khách có bị lúng túng không?

---

## 2. BỘ DỮ LIỆU GIẢ LẬP SẢN XUẤT CHUẨN (MOCK PRODUCTION DATA SEEDER)
Môi trường UAT không bao giờ để trống dữ liệu (Empty State) và không dùng dữ liệu thử nghiệm ngớ ngẩn (như "abc", "test 123"):

```json
[
  {
    "id": "PROD-LOC-01",
    "sku": "BT-LOC-01",
    "name": "Bình Hút Lộc Thuận Buồm Xuôi Gió Men Lam",
    "category": "Gốm Phong Thủy",
    "price": 3850000,
    "originalPrice": 4500000,
    "stock": 12,
    "description": "Chế tác thủ công bởi nghệ nhân Bát Tràng, vẽ vàng kim 24K cao cấp, bảo hành men vĩnh cửu.",
    "imageUrl": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80",
    "isFeatured": true
  }
]
```

### Tiêu Chuẩn Bộ Dữ Liệu UAT:
1. **Hình ảnh sắc nét chuẩn tỉ lệ:** Hình ảnh Unsplash CDN chuẩn góc chụp sản phẩm thật, không vỡ hạt, không mờ.
2. **Giá tiền và số liệu thực tế:** Định dạng tiền tệ `Intl.NumberFormat('vi-VN')` có ký hiệu `đ` rõ ràng.
3. **Mã VietQR động Napas 247:** Hiển thị mã QR chuẩn Napas chứa số tài khoản thụ hưởng thử nghiệm để quét kiểm tra trực tiếp.

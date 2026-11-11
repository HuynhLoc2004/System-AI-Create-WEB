# KIẾN TRÚC THÔNG TIN & SƠ ĐỒ LUỒNG TRẢI NGHIỆM NGƯỜI DÙNG (USER FLOW & IA)

## 1. Sơ Đồ Cấu Trúc Thông Tin Toàn Trang (Information Architecture - IA)

```
[TRANG CHỦ - HOME]
  ├── [1.0 KHÁM PHÁ SẢN PHẨM]
  │     ├── Danh mục phân cấp (Category Tree)
  │     ├── Thanh tìm kiếm nâng cao & Gợi ý từ khóa
  │     └── Bộ lọc thuộc tính (Giá, Thương hiệu, Đánh giá sao, Tình trạng kho)
  │
  ├── [2.0 CHI TIẾT SẢN PHẨM - PDP]
  │     ├── Thư viện ảnh / video sản phẩm
  │     ├── Chọn biến thể (Màu sắc, Size)
  │     ├── Kiểm tra tình trạng tồn kho theo chi nhánh
  │     └── Nút: "Thêm vào giỏ" & "Mua ngay"
  │
  ├── [3.0 GIỎ HÀNG & THANH TOÁN - CHECKOUT]
  │     ├── Xem lại số lượng & Mã giảm giá (Voucher)
  │     ├── Điền địa chỉ giao hàng & Tính phí ship
  │     ├── Chọn cổng thanh toán (VietQR, Thẻ, COD)
  │     └── Xác nhận thanh toán & Hiển thị mã QR động
  │
  └── [4.0 TRUNG TÂM TÀI KHOẢN - USER DASHBOARD]
        ├── Lịch sử đơn hàng & Trạng thái vận chuyển
        ├── Sổ địa chỉ cá nhân
        └── Cài đặt bảo mật (Đổi mật khẩu, Bật 2FA)
```

---

## 2. Quy Tắc Tối Ưu UX: 3 Cú Click Chuột (3-Click Rule)
Khách hàng từ bất kỳ màn hình nào cũng phải có khả năng tìm thấy sản phẩm và hoàn tất đặt hàng trong vòng **tối đa 3 thao tác chính**:
1. Thao tác 1: Tìm kiếm hoặc bấm danh mục từ Trang chủ.
2. Thao tác 2: Chọn kích thước/màu và bấm "Mua ngay" tại trang sản phẩm.
3. Thao tác 3: Xác nhận thông tin nhận hàng và quét mã QR thanh toán.


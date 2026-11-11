# 02. CHIẾN LƯỢC CẮT GỌT PHẠM VI (MVP SCOPE SLICING) & TIÊU CHÍ LOẠI BỎ TÍNH NĂNG (FEATURE KILL CRITERIA)
**Phòng Ban:** 10. Quản Lý Sản Phẩm (Product Management - PO)  
**Tiêu Chuẩn:** Tier-1 Enterprise MVP Definition (Thực thi theo nguyên tắc "Bỏ 60% tính năng thừa")  
**Mục Tiêu:** Ngăn chặn việc BA và Dev sa đà vào các tính năng "vẽ vời" không mang lại giá trị chuyển đổi kinh doanh.

---

## 1. NGUYÊN TẮC CỐT LÕI: "KILL 60% SCOPE" (TIÊU DIỆT PHÙ HOA)
Khi khách hàng yêu cầu 10 tính năng, 6 tính năng trong số đó là:
- Đặt trước cho tương lai xa (Premature Optimization).
- Bắt chước các sàn TMĐT khổng lồ mà không có dữ liệu người dùng thực tế (Shopee/Lazada feature clone).
- Tăng gấp 3 lần chi phí máy chủ và thời gian phát triển mà tỷ lệ chuyển đổi < 1%.

> **Nhiệm vụ của PO:** Nhận diện 40% tính năng xương sống tạo ra 100% doanh thu ban đầu và **CHẶN ĐỨNG (KILL)** 60% tính năng phù hoa ngay tại cửa ngõ tiếp nhận.

---

## 2. MA TRẬN PHÂN LOẠI TÍNH NĂNG (MOSCOW MATRIX CHO TIER-1 MVP)

| Nhóm | Định Nghĩa Nghiệp Vụ | Quyết Định PO | Hành Động Vibe Code AI |
| :--- | :--- | :--- | :--- |
| **MUST HAVE (Bắt Buộc)** | Thiếu tính năng này, hệ thống không thể vận hành hoặc không thể thu tiền (VD: Danh mục, Xem chi tiết, Đặt hàng, Quét VietQR Napas). | **GIỮ LẠI 100%** | Code ngay ở Phase 1. Tối ưu trải nghiệm chạm và tải trang < 0.5s. |
| **SHOULD HAVE (Nên Có)** | Quan trọng nhưng có thể dùng giải pháp thủ công thay thế trong tuần đầu (VD: Thông báo đẩy Telegram cho chủ shop, Lọc giá nâng cao). | **ĐƯA VÀO PHASE 1.5** | Thiết kế API Contract sẵn, nhưng chưa kích hoạt giao diện phức tạp. |
| **COULD HAVE (Có Thì Tốt)** | Tính năng làm đẹp, gamification, review video đa tầng, mini game quay thưởng. | **TẠM DỪNG (PARKED)** | Không viết code. Ghi nhận vào Backlog V2. |
| **WON'T HAVE (Loại Bỏ)** | Tính năng phức tạp gây nghẽn server: Livestream video, Chatbox Socket P2P không cần thiết, Đa ví điện tử khi khách chỉ dùng QR. | **KILL HOÀN TOÀN** | Từ chối yêu cầu, giải thích bằng ROI & rủi ro tải server. |

---

## 3. TIÊU CHÍ "KILL" TÍNH NĂNG TỰ ĐỘNG CỦA AI PO (KILL CRITERIA GATE)
Hệ thống AI PO sẽ tự động từ chối sinh code nếu phát hiện các yêu cầu sau:

1. **Yêu cầu cài đặt Server Build nặng:**  
   - Bất kỳ yêu cầu nào đòi hỏi server phải build video động, ffmpeg convert nặng hoặc lưu trữ file video raw lên ổ cứng VPS -> **KILL**. Thay bằng nhúng link Youtube/Vimeo hoặc Cloudinary CDN.
2. **Yêu cầu Socket / Chat đa bên khi chưa có 100 DAU:**  
   - Yêu cầu chat real-time phức tạp giữa người mua và người bán -> **KILL**. Thay bằng Deep link mở Zalo Official Account hoặc Hotline Direct Call.
3. **Yêu cầu đăng ký phức tạp (Multi-step Registration):**  
   - Bắt người dùng điền 8 trường dữ liệu mới cho xem hàng -> **KILL**. Chuyển sang mô hình Mua Hàng Nhanh (Guest Checkout qua Số điện thoại + OTP/VietQR).

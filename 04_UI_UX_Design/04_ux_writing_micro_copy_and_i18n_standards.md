# 04. TIÊU CHUẨN UX WRITING, MICRO-COPY & QUỐC TẾ HÓA (UX WRITING, MICRO-COPY & I18N STANDARDS)
**Phòng Ban:** 04. Thiết Kế Trải Nghiệm & Giao Diện Người Dùng (UI/UX Design)  
**Tiêu Chuẩn:** Human-Centric Micro-copy & Multi-Language Readiness  
**Mục Tiêu:** Loại bỏ các thông báo lỗi kỹ thuật vô nghĩa (như "Error: 500", "Object is null"), thay bằng ngôn ngữ tự nhiên, ấm áp, rõ ràng và có cấu trúc đa ngôn ngữ i18n sẵn sàng.

---

## 1. NGUYÊN TẮC VÀNG CỦA UX WRITING TIER-1
1. **Rõ ràng (Clear):** Người dùng nhìn vào hiểu ngay chuyện gì đang xảy ra.
2. **Ngắn gọn (Concise):** Không viết văn miêu tả dài dòng; dùng từ ngữ chỉ dẫn hành động (Action-oriented).
3. **Có ích (Helpful):** Khi có lỗi, luôn chỉ ra người dùng cần làm gì tiếp theo (Call-to-Action).
4. **Không dùng Modal Browser mặc định:** Tuyệt đối không dùng `window.alert()` / `confirm()` xấu xí; dùng Modal / Toast thiết kế đồng bộ với hệ thống.

---

## 2. BẢNG CHUYỂN ĐỔI MICRO-COPY (TRƯỚC VÀ SAU KHI TỐI ƯU)

| Tình Huống | ❌ Thông Báo Cũ (Kỹ thuật / Khô cứng) | ✅ Thông Báo Đạt Chuẩn Tier-1 (UX Writing) |
| :--- | :--- | :--- |
| **Giỏ hàng rỗng (Empty State)** | "Không có dữ liệu trong giỏ" | "Giỏ hàng của bạn đang trống! Hãy khám phá những bộ sưu tập gốm/thời trang tuyệt đẹp ngay nhé." |
| **Lỗi mạng hoặc server gián đoạn** | "Error 500: Internal Server Error" | "Đã có gián đoạn kết nối nhỏ. Đừng lo lắng, dữ liệu của bạn vẫn an toàn. Hãy bấm thử lại nhé!" |
| **Quét mã QR thanh toán** | "Thanh toán QR code" | "Mở ứng dụng ngân hàng bất kỳ để quét mã. Đơn hàng sẽ được xác nhận tự động sau 1 giây." |
| **Xác nhận làm mới / rời trang** | Pop-up trình duyệt: "Bạn có muốn làm mới..." | Modal chuyên dụng của hệ thống: Có 2 nút rõ ràng "Tiếp tục tư vấn" và "Bắt đầu cuộc trò chuyện mới". |

---

## 3. CẤU TRÚC ĐA NGÔN NGỮ QUỐC TẾ HÓA (I18N READY)
Tách toàn bộ chuỗi hiển thị ra từ điển JSON:

```json
// locales/vi.json
{
  "cart": {
    "title": "Giỏ Hàng Của Bạn",
    "empty": "Giỏ hàng của bạn đang trống!",
    "checkout_btn": "Thanh Toán Ngay Bằng VietQR",
    "total": "Tổng thanh toán:"
  },
  "alerts": {
    "network_error": "Kết nối máy chủ bị gián đoạn, đang tự động kết nối lại...",
    "confirm_reset": "Bạn có chắc muốn làm mới phiên tư vấn này không?"
  }
}
```
Lợi ích: Giúp website có thể mở rộng sang Tiếng Anh (`en.json`), Tiếng Nhật (`ja.json`) chỉ trong 5 phút mà không phải sửa một dòng code giao diện nào.

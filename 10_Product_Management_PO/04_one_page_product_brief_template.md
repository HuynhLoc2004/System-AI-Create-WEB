# 04. MẪU PRODUCT BRIEF 1 TRANG (ONE-PAGE PRODUCT BRIEF TEMPLATE)
**Phòng Ban:** 10. Quản Lý Sản Phẩm (Product Management - PO)  
**Tiêu Chuẩn:** Executive 1-Pager Handshake  
**Mục Đích:** Tài liệu bắt buộc PO bàn giao cho Ban Quản trị Dự án (01 TPM) và Kiến trúc sư (03 SA) trước khi viết 1 dòng code nào.

---

## MẪU CHUẨN PRODUCT BRIEF CHO MỖI DỰ ÁN AI VIBE CODE

```markdown
# PRODUCT BRIEF: [TÊN DỰ ÁN]

## 1. BÀI TOÁN KINH DOANH & ĐỐI TƯỢNG MỤC TIÊU (THE PROBLEM & USERS)
- **Ai gặp khó khăn:** [VD: Khách hàng trẻ muốn mua đồ gốm/quần áo trực tuyến nhanh chóng nhưng ngại chuyển khoản sai thông tin].
- **Nỗi đau lớn nhất (Pain point):** Phải chờ chủ shop rep tin nhắn gửi số tài khoản, xác nhận giao dịch thủ công mất từ 15-30 phút.
- **Giá trị cốt lõi giải quyết (Core Value):** Trải nghiệm tự động 100% từ chọn món, sinh VietQR động có sẵn số tiền & nội dung, đối soát tự động.

## 2. PHẠM VI MVP THỰC SỰ (IN-SCOPE vs OUT-OF-SCOPE)
### IN-SCOPE (Bắt buộc hoàn thành 100%):
1. Giao diện Catalog chuẩn Responsive (390px Mobile - 1440px Desktop).
2. Giỏ hàng trượt (Slide-over Cart) lưu trữ bộ nhớ LocalStorage.
3. Cổng VietQR Napas 247 Dynamic tự động gắn số đơn hàng.
4. Trình xuất file ZIP tải về 0 byte dung lượng đĩa VPS.

### OUT-OF-SCOPE (Bị từ chối ở phiên bản này):
- ❌ Không làm hệ thống điểm thưởng tích lũy (Reward Points).
- ❌ Không làm Livestream trực tiếp trên web.
- ❌ Không làm đa ngôn ngữ 10 thứ tiếng khi chưa có khách quốc tế.

## 3. CHỈ SỐ THÀNH CÔNG (SUCCESS METRICS - OKRs)
- **Tốc độ tải trang:** < 0.6 giây trên mạng 4G di động.
- **Tỷ lệ quét QR hoàn thành:** > 90% số đơn tạo ra.
- **Mức độ tiêu thụ tài nguyên máy chủ:** 0 byte node_modules cài cục bộ, RAM < 30MB/dự án.

## 4. BÀN GIAO TIẾP THEO (NEXT HANDOFF)
- **Bàn giao cho:** Phòng 01 TPM (Lập tiến độ & phân chia Task) và Phòng 02 BA (Bóc tách Use Case).
- **Hạn chốt:** Ngay sau khi PO phát hành Product Brief này.
```


# 02. CHECKLIST GO-LIVE CHUẨN TIER-1 & MA TRẬN PHÊ DUYỆT (GO-LIVE CHECKLIST & SIGN-OFF MATRIX)
**Phòng Ban:** 12. Quản Lý Phát Hành & Nghiệm Thu (Release Management & UAT Coordinator)  
**Tiêu Chuẩn:** Zero-Defect Production Release Protocol  
**Mục Tiêu:** Đảm bảo không có bản phát hành nào được đưa lên Internet công cộng nếu chưa vượt qua đầy đủ các điều kiện tiên quyết.

---

## 1. MA TRẬN KÝ DUYỆT PHÁT HÀNH (SIGN-OFF MATRIX)

| Phòng Ban | Vai Trò | Điều Kiện Ký Duyệt Bắt Buộc | Trạng Thái |
| :--- | :--- | :--- | :--- |
| **10. Product Owner (PO)** | Nghiệm thu Nghiệp vụ | 100% tính năng trong MVP hoàn thành, đúng bài toán kinh doanh. | [ ] PO SIGNED |
| **08. Quality Assurance (QA)** | Thẩm định Kỹ thuật | 0 Blocker, 0 Critical Bug, Tỷ lệ Pass Test E2E = 100%. | [ ] QA SIGNED |
| **11. DevSecOps (AppSec)** | An toàn Thông tin | 0 Secret rò rỉ, 0 Critical CVE, Đã quét SAST/DAST đạt chuẩn. | [ ] SEC SIGNED |
| **07. Database Admin (DBA)** | Toàn vẹn Dữ liệu | Migration hoàn tất theo mô hình Expand & Contract (Zero Downtime). | [ ] DBA SIGNED |
| **09. DevOps / SRE** | Hạ tầng Mạng & Server | Chứng chỉ SSL/TLS xanh, Nginx gzip/brotli sẵn sàng, Monitor sẵn. | [ ] OPS SIGNED |

---

## 2. BẢNG KIỂM TRA 10 BƯỚC TRƯỚC GIỜ G (PRE-RELEASE CHECKLIST)
- [ ] 1. **Kiểm tra URL miền chính:** Tên miền đã trỏ đúng DNS A-Record và có SSL HTTPS hợp lệ.
- [ ] 2. **Kiểm tra Favicon & Meta SEO:** Trang web có title, description, OpenGraph image rõ ràng khi share mạng xã hội.
- [ ] 3. **Kiểm tra Responsive:** Đã test mượt mà trên iPhone (390px), Android (412px), iPad (768px), Laptop (1440px).
- [ ] 4. **Kiểm tra tốc độ LCP:** Điểm PageSpeed Mobile >= 90, LCP < 1.2s.
- [ ] 5. **Kiểm tra Cổng VietQR:** Sinh đúng mã QR, đúng thông tin chủ tài khoản và mã đơn hàng.
- [ ] 6. **Kiểm tra Trang 404 & Empty State:** Không hiển thị màn hình trắng (White Screen of Death) khi vào link lạ.
- [ ] 7. **Kiểm tra Dialog / Modal xác nhận:** Không dùng `window.alert()` / `window.confirm()` mặc định của trình duyệt; dùng Modal UI đồng bộ.
- [ ] 8. **Kiểm tra Xóa Cache Client:** Đã cấu hình Cache-Control thích hợp để khách hàng không bị lưu file JS cũ.
- [ ] 9. **Kế hoạch Rollback:** Bản backup code và dữ liệu gần nhất đã sẵn sàng khôi phục trong 30 giây.
- [ ] 10. **Thông báo Đội Hỗ trợ:** Đội Post-Launch Analytics & Support đã bật Dashboard theo dõi lỗi real-time.


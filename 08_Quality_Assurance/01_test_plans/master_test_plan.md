# KẾ HOẠCH KIỂM THỬ TỔNG THỂ (MASTER TEST PLAN)

| Dự Án | Hệ Thống Số Hóa Quản Trị & Vận Hành Doanh Nghiệp |
|---|---|
| **Người lập kế hoạch:** | QA Lead / Test Manager |
| **Phiên bản:** | 1.0 (Approved) |
| **Kỳ kiểm thử:** | Toàn bộ 12 Sprints + Giai đoạn UAT (6 tháng) |

---

## 1. Phạm Vi Kiểm Thử (Testing Scope)
* **Trong phạm vi kiểm thử (In-Scope):**
  - Kiểm thử chức năng toàn bộ các module: Auth, Catalog, Cart, Checkout, Order Tracking, Admin CMS.
  - Kiểm thử tích hợp API (API Integration Testing) với 100% Swagger endpoints.
  - Kiểm thử bảo mật cơ bản: SQL Injection, XSS, kiểm tra rò rỉ JWT, Brute-force form đăng nhập.
  - Kiểm thử chịu tải (Performance Load Test): 5.000 CCU trên môi trường Staging.
  - Kiểm thử tương thích: iOS Safari, Android Chrome, Windows Chrome/Edge, macOS Safari.
* **Ngoài phạm vi (Out-of-Scope):**
  - Kiểm thử tính tương thích trên trình duyệt Internet Explorer (IE) cũ đã khai tử.

---

## 2. Tiêu Chuẩn Tạm Dừng & Tiếp Tục (Suspension & Resumption Criteria)
* **Tạm dừng kiểm thử (Suspension):** Nếu bản build phát sinh lỗi `Blocker` làm sập môi trường Staging hoặc không thể đăng nhập vào hệ thống, QA lập tức dừng kiểm thử và trả vé (Reject Build) về cho đội Dev.
* **Tiếp tục kiểm thử (Resumption):** Chỉ bắt đầu test lại khi DevOps và Dev Lead thông báo đã deploy hotfix thành công và xác nhận môi trường đã xanh trở lại trên CI/CD.

---

## 3. Tiêu Chuẩn Hoàn Thành & Nghiệm Thu Chất Lượng (Exit Criteria for Release)
Một phiên bản chỉ được phép triển khai lên Production khi đạt 100% các điều kiện:
- [ ] **100%** Test Cases mức High/Critical được thực thi.
- [ ] Tỷ lệ Pass tối thiểu đạt **98%** trên tổng số Test Cases.
- [ ] **0 lỗi Blocker** (Gây sập hệ thống, mất tiền, không thể thanh toán).
- [ ] **0 lỗi Critical** (Tính năng chính bị tê liệt nhưng có cách đi vòng tạm thời).
- [ ] Lỗi Major còn tồn đọng không quá 2 lỗi và đã có giải pháp khắc phục trong vòng 48h.
- [ ] Toàn bộ kịch bản tự động hóa E2E hồi quy (Regression Test) chạy xanh 100%.
- [ ] Biên bản nghiệm thu **QA Sign-off Report** được ký đầy đủ bởi QA Lead và TPM.


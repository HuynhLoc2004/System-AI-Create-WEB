# PHÒNG 13: ĐO LƯỜNG HÀNH VI & VẬN HÀNH HẬU PHÁT HÀNH (PRODUCT ANALYTICS & POST-LAUNCH SUPPORT)
**Mã phòng ban:** `13_Product_Analytics_PostLaunch`  
**Vai trò cốt lõi:** Lắng nghe nhịp thở của sản phẩm sau khi ra mắt. Đo lường phễu chuyển đổi (Event Tracking), thu thập lỗi runtime thời gian thực (Sentry/Telemetry), bảo đảm SLA khắc phục sự cố và chuyển đổi phản hồi của người dùng thành đầu vào cho chu kỳ phát triển tiếp theo của PO.

---

## 1. VỊ TRÍ TRONG VÒNG ĐỜI DỰ ÁN (LIFECYCLE POSITION)
- **Đứng sau:** Phòng 12 (Release Management) và Phòng 09 (DevOps).
- **Khép kín vòng lặp:** Cung cấp dữ liệu thực tế ngược về Phòng 10 (PO) để ra quyết định cải tiến sản phẩm.

---

## 2. DANH MỤC TÀI LIỆU CHUẨN TIER-1
1. [01. Theo Dõi Sự Kiện Hành Vi Người Dùng Ở Frontend (Frontend Event Tracking)](file:///d:/DOWNLOAD/IT-Assignment/13_Product_Analytics_PostLaunch/01_frontend_event_tracking_posthog_mixpanel.md)
2. [02. Quan Sát Và Bắt Lỗi Ngoại Lệ Thời Gian Thực (Runtime Error Observability)](file:///d:/DOWNLOAD/IT-Assignment/13_Product_Analytics_PostLaunch/02_runtime_error_observability_sentry_logrocket.md)
3. [03. Cam Kết Chất Lượng Hậu Phát Hành & Phễu Phản Hồi (Post-Launch SLA & Feedback Funnel)](file:///d:/DOWNLOAD/IT-Assignment/13_Product_Analytics_PostLaunch/03_post_launch_sla_and_customer_feedback_funnel.md)

---

## 3. ĐẦU VÀO VÀ ĐẦU RA BÀN GIAO (HANDSHAKES)
- **Đầu vào (Inputs):** Sản phẩm chạy thực tế trên môi trường Production, tương tác của người dùng cuối.
- **Đầu ra (Outputs):**
  - Báo cáo Tỷ lệ Kích hoạt & Phễu rơi rụng (Activation & Funnel Report).
  - Báo cáo lỗi ngoại lệ tức thì (Crash & Exception Logs).
  - Backlog cải tiến gửi lại cho PO.


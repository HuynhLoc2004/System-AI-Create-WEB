# PHÒNG 12: QUẢN LÝ PHÁT HÀNH & NGHIỆM THU NGƯỜI DÙNG (RELEASE MANAGEMENT & UAT)
**Mã phòng ban:** `12_Release_Management_UAT`  
**Vai trò cốt lõi:** Người gác cổng cuối cùng trước khi đưa sản phẩm ra Internet công cộng. Quản lý việc nghiệm thu người dùng (UAT), cấp dữ liệu giả lập chuẩn, điều phối Go-Live Checklist, thiết lập quy trình Rollback khẩn cấp 30 giây và phân phối Canary qua Feature Flags.

---

## 1. VỊ TRÍ TRONG VÒNG ĐỜI DỰ ÁN (LIFECYCLE POSITION)
- **Nằm giữa:** Phòng 08 (QA), Phòng 11 (DevSecOps), Phòng 09 (DevOps) và Người dùng thật trên Production.
- **Nguyên tắc:** Dù QA và Dev đã hoàn thành 100%, sản phẩm chỉ được Go-Live khi có đủ chữ ký của Release Manager và UAT Sign-off.

---

## 2. DANH MỤC TÀI LIỆU CHUẨN TIER-1
1. [01. Giao Thức UAT & Dữ Liệu Giả Lập Sản Xuất (UAT Protocol & Mock Production Data)](file:///d:/DOWNLOAD/IT-Assignment/12_Release_Management_UAT/01_uat_protocol_and_mock_production_data_guide.md)
2. [02. Checklist Go-Live & Ma Trận Ký Duyệt (Go-Live Checklist & Sign-Off Matrix)](file:///d:/DOWNLOAD/IT-Assignment/12_Release_Management_UAT/02_tier1_go_live_checklist_and_sign_off_matrix.md)
3. [03. Sổ Tay Khôi Phục Khẩn Cấp Trong 30 Giây (30-Second Rapid Rollback Runbook)](file:///d:/DOWNLOAD/IT-Assignment/12_Release_Management_UAT/03_thirty_second_rapid_rollback_runbook.md)
4. [04. Chiến Lược Triển Khai Canary & Cờ Tính Năng (Canary Deployment & Feature Flags)](file:///d:/DOWNLOAD/IT-Assignment/12_Release_Management_UAT/04_canary_deployment_and_feature_flags_strategy.md)

---

## 3. ĐẦU VÀO VÀ ĐẦU RA BÀN GIAO (HANDSHAKES)
- **Đầu vào (Inputs):** Build artifacts từ QA và DevOps, chứng chỉ an ninh từ DevSecOps, xác nhận phạm vi từ PO.
- **Đầu ra (Outputs):**
  - Môi trường UAT Sandbox có dữ liệu sinh động.
  - Biên bản ký duyệt phát hành (Release Approval Certificate).
  - Production Deployment Trigger & Kế hoạch Rollback 30s sẵn sàng.

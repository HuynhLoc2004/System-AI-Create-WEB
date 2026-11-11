# PHÒNG 11: AN TOÀN THÔNG TIN ỨNG DỤNG & AN NINH MÃ NGUỒN (DEVSECOPS / APPSEC)
**Mã phòng ban:** `11_Application_Security_DevSecOps`  
**Vai trò cốt lõi:** Bảo vệ an ninh toàn diện từ chuỗi cung ứng mã nguồn (Supply Chain), ngăn rò rỉ Secret/API Key, thiết lập hàng rào SAST/DAST tự động và triệt tiêu lỗ hổng logic ủy quyền (IDOR/BOLA).

---

## 1. VỊ TRÍ TRONG VÒNG ĐỜI DỰ ÁN (LIFECYCLE POSITION)
- **Giám sát song song:** Cùng lúc với Phòng 06 (Backend), Phòng 05 (Frontend), và Phòng 07 (Database).
- **Chốt chặn:** Đứng trước Phòng 08 (QA/QC) và Phòng 12 (Release Management).
- **Quyền hạn đặc biệt:** Có quyền **VETO (PHỦ QUYẾT)** từ chối Merge code hoặc chặn Deploy lên Production nếu phát hiện lỗ hổng mức độ Critical/High.

---

## 2. DANH MỤC TÀI LIỆU CHUẨN TIER-1
1. [01. Bảo Mật Chuỗi Cung Ứng & Quét Lỗ Hổng CVE (Software Supply Chain & CVE Scanning)](file:///d:/DOWNLOAD/IT-Assignment/11_Application_Security_DevSecOps/01_software_supply_chain_and_cve_scanning_policy.md)
2. [02. Ngăn Chặn Rò Rỉ Khóa Bí Mật & API Key (Secret Leak Prevention)](file:///d:/DOWNLOAD/IT-Assignment/11_Application_Security_DevSecOps/02_secret_leak_prevention_git_secrets_and_gitleaks.md)
3. [03. Chính Sách Kiểm Tra Bảo Mật Tự Động SAST & DAST (Automated Security Gates)](file:///d:/DOWNLOAD/IT-Assignment/11_Application_Security_DevSecOps/03_sast_dast_automated_security_gate_policy.md)
4. [04. Phòng Thủ Lỗ Hổng Ủy Quyền & Truy Cập Đối Tượng (IDOR / BOLA Defense)](file:///d:/DOWNLOAD/IT-Assignment/11_Application_Security_DevSecOps/04_idor_bola_authorization_logic_defense.md)

---

## 3. ĐẦU VÀO VÀ ĐẦU RA BÀN GIAO (HANDSHAKES)
- **Đầu vào (Inputs):** Mã nguồn từ FE & BE, danh sách packages khai báo trong `package.json`, cấu hình biến môi trường.
- **Đầu ra (Outputs):**
  - DevSecOps Audit Report (Báo cáo thẩm định an ninh 0 Critical CVE).
  - Chứng chỉ An toàn Secret (Secret Clearance Certificate).
  - Phê duyệt mở cổng bàn giao sang Release Management (UAT Sign-off ready).


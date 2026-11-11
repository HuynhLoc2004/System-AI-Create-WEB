# QUẢN TRỊ ĐA DỰ ÁN (MULTI-PROJECT WORKSPACE MANAGEMENT)

> **Nguyên tắc phân định ranh giới cốt lõi:**
> * **Tầng 1 - Bộ Khung 9 Phòng Ban (`IT-Assignment`):** Là trung tâm điều hành tổ chức (Enterprise Operating Hub), chứa toàn bộ tiêu chuẩn chuẩn mực (SOP), quy chuẩn kỹ thuật, ma trận phối hợp, tiêu chuẩn bảo mật và phương pháp luận vận hành của doanh nghiệp. Tầng này **dùng chung cho mọi dự án (Đa dự án - Multi-project)**, không gắn cứng vào bất kỳ một dự án riêng lẻ nào.
> * **Tầng 2 - Không Gian Dự Án Riêng Biệt (`projects/<tên_dự_án>/`):** Khi bắt đầu bất kỳ một dự án thực tế nào, toàn bộ mã nguồn, cấu hình môi trường (Local vs Production), tệp di trú dữ liệu, bản vẽ thiết kế và tài liệu bàn giao cụ thể của dự án đó **PHẢI ĐƯỢC TẠO VÀ LƯU TRỮ TÁCH BIỆT TRONG THƯ MỤC CỦA CHÍNH DỰ ÁN ĐÓ**. Tuyệt đối không xả rác hay tạo folder thử nghiệm bừa bãi vào bộ khung tiêu chuẩn của 9 phòng ban.

---

## 1. Cấu Trúc Tổng Thể Đa Dự Án

```
IT-Assignment/                                 # [TRUNG TÂM ĐIỀU HÀNH 9 PHÒNG BAN]
├── 01_Project_Management/                     # Quy chuẩn điều phối, lập kế hoạch, quản trị task
├── 02_Business_Analysis/                      # Phương pháp luận lấy yêu cầu, BRD, SRS, BPMN
├── 03_Solution_Architecture_Cost/             # Tiêu chuẩn kiến trúc SAD, ADR, bài toán chi phí
├── 04_UI_UX_Design/                           # Bản sắc thiết kế, Design System tokens, 60fps scroll
├── 05_Frontend_Development/                   # Tiêu chuẩn code Clean Component, State, Routing
├── 06_Backend_Development/                    # Tiêu chuẩn Clean Architecture, DTO, JWT, Worker
├── 07_Database_Management/                    # Tiêu chuẩn ERD, Indexing, dọn rác, backup WAL
├── 08_Quality_Assurance/                      # Tiêu chuẩn kiểm thử 5 chiều, bảo mật Input, test log
├── 09_DevOps_Infrastructure/                  # Tiêu chuẩn CI/CD, Dockerfile, Nginx SSL, Runbook
│
└── projects/                                  # [KHÔNG GIAN TRIỂN KHAI CÁC DỰ ÁN THỰC TẾ]
    ├── _project_template/                     # Khuôn mẫu chuẩn để nhân bản khi có dự án mới
    │   ├── config/                            # Cấu hình Local vs Production (Keys, Mail, Payment, S3)
    │   ├── docs/                              # Tài liệu riêng của dự án (Charter, SRS, Handoff)
    │   ├── src/                               # Toàn bộ mã nguồn thực thi
    │   │   ├── frontend/                      # Web / Mobile app của dự án
    │   │   ├── backend/                       # REST/gRPC API service của dự án
    │   │   └── database/                      # Migrations & Seeds riêng của dự án
    │   └── deploy/                            # Docker Compose Local vs Production
    │
    ├── project_ecommerce_retail/              # Dự án thực tế 1: Sàn bán lẻ trực tuyến
    ├── project_corporate_crm/                 # Dự án thực tế 2: Hệ thống CRM nội bộ
    └── ...                                    # Mọi dự án khác đều bám vào quy chuẩn 9 phòng ban
```

---

## 2. Quy Trình Khởi Tạo Dự Án Mới (Project Scaffolding SOP)

Khi Khách hàng ký hợp đồng một dự án mới:
1. **Bước 1 (Khởi tạo không gian dự án):**
   * Nhân bản thư mục `projects/_project_template/` thành `projects/<tên_dự_án_mới>/`.
2. **Bước 2 (9 Phòng ban tiếp quản & vận hành theo SOP):**
   * **PM & BA:** Vào thư mục `projects/<tên_dự_án>/docs/` tạo tài liệu đặc tả nghiệp vụ theo mẫu chuẩn ở `01_Project_Management` và `02_Business_Analysis`.
   * **UI/UX Designer:** Bàn giao bản vẽ Figma và Design Tokens vào `projects/<tên_dự_án>/docs/design_system/`.
   * **Database Team:** Viết các migration scripts khởi tạo bảng vào `projects/<tên_dự_án>/src/database/`.
   * **Backend & Frontend:** Viết code thực thi trong `projects/<tên_dự_án>/src/backend/` và `projects/<tên_dự_án>/src/frontend/`.
   * **DevOps Team:** Cấu hình tệp biến môi trường `local.env` và `production.env` (Mail Google, Cổng thanh toán, Cloud Storage) vào `projects/<tên_dự_án>/config/`.
   * **QA Team:** Chạy kiểm thử trên môi trường Sandbox của dự án và lưu nhật ký nghiệm thu vào `projects/<tên_dự_án>/docs/qa_logs/`.

---

## 3. Quản Lý Tách Biệt: Môi Trường Local vs Production Của Dự Án

Mỗi dự án độc lập có bộ cấu hình hoàn chỉnh phân tách rành mạch:
* **Môi Trường Local (`config/local.env`):**
  - Chạy trên máy lập trình viên.
  - Sử dụng Google Mail SMTP App Password thử nghiệm.
  - Sử dụng VietQR / VNPay Sandbox cổng kiểm thử.
  - Sử dụng MinIO hoặc Local Storage để lưu ảnh tạm thời.
* **Môi Trường Production (`config/production.env`):**
  - Chạy trên máy chủ Cloud/VPS thực tế.
  - Sử dụng Google Workspace SMTP / SendGrid sản xuất.
  - Sử dụng Cổng thanh toán trực tiếp của Ngân hàng thật.
  - Sử dụng Cloudflare R2 / AWS S3 lưu trữ hình ảnh sản phẩm thực tế với CDN toàn cầu.


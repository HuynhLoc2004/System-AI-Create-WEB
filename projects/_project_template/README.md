# KHUÔN MẪU DỰ ÁN CHUẨN (PROJECT WORKSPACE TEMPLATE)

Thư mục này là khuôn mẫu chuẩn hóa dùng để nhân bản ra bất kỳ dự án thực tế nào của công ty. Toàn bộ 9 phòng ban của `IT-Assignment` sẽ phối hợp làm việc trực tiếp bên trong không gian của dự án này.

---

## Cấu Trúc Nội Bộ Của Một Dự Án Độc Lập

```
projects/<tên_dự_án>/
├── config/                                    # Cấu hình biến môi trường riêng của dự án
│   ├── local.env.example                      # Mẫu biến môi trường chạy Local (Dev / Sandbox)
│   └── production.env.example                 # Mẫu biến môi trường chạy Production thật
│
├── deploy/                                    # Kịch bản triển khai container riêng của dự án
│   ├── docker-compose.local.yml               # Cụm dịch vụ chạy Local (Dev)
│   └── docker-compose.prod.yml                # Cụm dịch vụ chạy Production máy chủ
│
├── docs/                                      # Toàn bộ tài liệu nghiệp vụ riêng của dự án
│   ├── project_overview.md                    # Tổng quan bài toán, mục tiêu, khách hàng
│   ├── srs_specifications.md                  # Đặc tả kỹ thuật phần mềm (BA thực hiện)
│   ├── figma_links_and_tokens.md              # Đường dẫn Figma & Design Tokens (UI/UX)
│   └── qa_test_reports.md                     # Nhật ký kiểm thử nghiệm thu (QA thực hiện)
│
└── src/                                       # Toàn bộ mã nguồn thực thi của dự án
    ├── database/                              # Migrations & Seed data riêng của dự án
    │   ├── migrations/                        # Các file SQL tạo bảng
    │   └── seeds/                             # Dữ liệu mẫu khởi tạo
    │
    ├── backend/                               # Mã nguồn Backend API (REST / GraphQL)
    │   ├── src/
    │   └── package.json
    │
    └── frontend/                              # Mã nguồn Giao diện Web / Mobile
        ├── src/
        └── package.json
```


# CẤU TRÚC PHÂN RÃ CÔNG VIỆC (WORK BREAKDOWN STRUCTURE - WBS)

Cấu trúc WBS 4 cấp độ phân bổ toàn bộ khối lượng công việc cho từng nhóm phòng ban:

```
1.0 QUẢN TRỊ & KHỞI ĐỘNG DỰ ÁN (Project Management)
    1.1 Kick-off & Thống nhất điều lệ dự án
    1.2 Thiết lập công cụ điều phối (Jira, Confluence, Slack, Git)
    1.3 Lập kế hoạch chi tiết & Phân bổ tài nguyên
    1.4 Điều phối Sprint & Họp định kỳ

2.0 KHẢO SÁT & ĐẶC TẢ NGHIỆP VỤ (Business Analysis)
    2.1 Phỏng vấn Stakeholders & Thu thập yêu cầu
    2.2 Soạn thảo tài liệu yêu cầu kinh doanh (BRD)
    2.3 Soạn thảo tài liệu đặc tả phần mềm (SRS & NFRs)
    2.4 Vẽ sơ đồ luồng quy trình (BPMN / Flowchart)
    2.5 Xây dựng User Stories & Tiêu chí nghiệm thu (AC)

3.0 KIẾN TRÚC HỆ THỐNG & DỰ TOÁN (Architecture & Costing)
    3.1 Khảo sát tải trọng & Lựa chọn Tech Stack
    3.2 Thiết kế kiến trúc mức cao (C4 Model - Level 1, 2, 3)
    3.3 Lập bảng dự toán chi phí nhân sự & Cloud Infrastructure
    3.4 Soạn thảo tài liệu quyết định kiến trúc (ADRs)

4.0 THIẾT KẾ TRẢI NGHIỆM & GIAO DIỆN (UI/UX Design)
    4.1 Nghiên cứu người dùng & Bản đồ trải nghiệm (User Journey)
    4.2 Thiết kế khung dây cấu trúc (Low-fi Wireframe)
    4.3 Xây dựng Hệ thống thiết kế dùng chung (Design System & Tokens)
    4.4 Thiết kế giao diện chi tiết (High-fi Mockups trên Figma)
    4.5 Tạo bản mẫu tương tác (Interactive Prototype) & Chốt với khách hàng

5.0 THIẾT KẾ & QUẢN TRỊ DỮ LIỆU (Database Engineering)
    5.1 Thiết kế mô hình dữ liệu quan hệ (ERD - Normalized 3NF)
    5.2 Viết Database Migration Scripts & Seed Data ban đầu
    5.3 Đánh chỉ mục (Index Strategy) & Tối ưu hóa truy vấn
    5.4 Thiết lập chiến lược sao lưu định kỳ & Kế hoạch phục hồi dữ liệu

6.0 PHÁT TRIỂN HỆ THỐNG BACKEND (Backend Development)
    6.1 Khởi tạo dự án & Cấu hình Clean Architecture
    6.2 Xây dựng module Xác thực & Phân quyền (JWT, OAuth2, RBAC)
    6.3 Phát triển các APIs nghiệp vụ chính (RESTful & OpenAPI Spec)
    6.4 Tích hợp Caching Redis & Message Queue bất đồng bộ
    6.5 Viết Unit Test & Tích hợp cổng thanh toán / dịch vụ bên thứ ba

7.0 PHÁT TRIỂN GIAO DIỆN FRONTEND (Frontend Development)
    7.1 Khởi tạo mã nguồn & Cấu hình Atomic Components
    7.2 Thiết lập Quản lý trạng thái (State Management) & Định tuyến (Routing)
    7.3 Hiện thực hóa giao diện người dùng Responsive (Mobile/Tablet/Web)
    7.4 Kết nối API Backend, xử lý trạng thái tải (Loading/Skeleton) và lỗi
    7.5 Tối ưu hóa hiệu năng tải trang (Core Web Vitals) & Bảo mật Client

8.0 KIỂM THỬ & ĐẢM BẢO CHẤT LƯỢNG (Quality Assurance)
    8.1 Xây dựng Master Test Plan & Ma trận truy xuất (Traceability Matrix)
    8.2 Viết Test Cases chi tiết (Positive, Negative, Boundary)
    8.3 Thực thi Manual Testing (Chức năng, Giao diện, Đa thiết bị)
    8.4 Phát triển kịch bản tự động hóa (Automation E2E Testing)
    8.5 Kiểm thử hiệu năng & Chịu tải cao (Stress/Load Testing với k6/JMeter)
    8.6 Quản lý vòng đời lỗi và cấp chứng nhận nghiệm thu (QA Sign-off)

9.0 HẠ TẦNG & TỰ ĐỘNG HÓA VẬN HÀNH (DevOps & Infrastructure)
    9.1 Thiết lập môi trường cách ly (Dev, Staging, Production)
    9.2 Đóng gói Docker & Docker Compose cho toàn bộ dịch vụ
    9.3 Xây dựng đường ống tự động CI/CD (GitHub Actions / GitLab CI)
    9.4 Cấu hình Reverse Proxy Nginx, Tên miền, Chứng chỉ SSL/TLS
    9.5 Thiết lập Giám sát (Prometheus, Grafana) & Cảnh báo tức thì qua Telegram/Slack
```


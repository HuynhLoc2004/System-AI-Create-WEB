# 03. ĐỘI NGŨ ƯỚC LƯỢNG CHI PHÍ & GIẢI PHÁP KỸ THUẬT
## Solution Architect / Tech Lead / Cost Estimator

> **Vị trí trong chuỗi:** Định hình khung xương kỹ thuật vững chắc và giải bài toán kinh tế công nghệ cho dự án.

---

### 1. Mục Tiêu Cốt Lõi (Core Mission)
* **Chọn đúng công nghệ cho bài toán:** Tránh bẫy "dùng dao mổ trâu giết gà" (Over-engineering) hoặc chọn công nghệ lỗi thời không thể mở rộng (Under-engineering).
* **Tối ưu chi phí hạ tầng Cloud:** Cấu hình tài nguyên vừa vặn với dung lượng tải trọng (Capacity planning), tiết kiệm ngân sách hàng tháng cho doanh nghiệp.
* **Dự trù chính xác nguồn lực & rủi ro kỹ thuật:** Đảm bảo thời gian và kinh phí phát triển phản ánh đúng độ phức tạp của bài toán.

---

### 2. Trách Nhiệm Chi Tiết (Detailed Responsibilities)

1. **Về Kiến Trúc Kỹ Thuật (Architecture Design):**
   * Đưa ra quyết định mô hình kiến trúc: So sánh và lựa chọn giữa Monolith, Modular Monolith hay Microservices.
   * Lựa chọn toàn diện Tech Stack: Ngôn ngữ backend, framework frontend, cơ sở dữ liệu (SQL vs NoSQL), bộ nhớ đệm (Cache), hàng đợi thông điệp (Message Queue).
   * Thiết kế giải pháp an ninh mạng tổng thể: Xác thực tập trung (OAuth2/OIDC, JWT), phân quyền RBAC/ABAC, mã hóa đường truyền và mã hóa ổ cứng.

2. **Về Ước Lượng Chi Phí (Cost Estimation & Budgeting):**
   * **Chi phí nhân sự (Labor Cost):** Bóc tách WBS thành Story Points / Man-hours / Man-months cho từng vị trí (Frontend, Backend, Database, QA, DevOps).
   * **Chi phí hạ tầng Cloud & Dịch vụ thứ ba (Infra & 3rd Party Cost):** Tính toán cấu hình CPU, RAM, ổ cứng SSD NVMe, băng thông truyền tải, chi phí cổng thanh toán, SMS OTP, Email API.
   * **Chi phí dự phòng rủi ro (Contingency Buffer):** Tính toán khoản bù đắp rủi ro bắt buộc từ **15% đến 25%** cho những phát sinh bất khả kháng về kỹ thuật.

---

### 3. Bộ Công Cụ Sử Dụng (Toolstack)
* **Mô hình hóa kiến trúc:** C4 Model, PlantUML, Draw.io, Structurizr.
* **Tính toán chi phí Cloud:** AWS Pricing Calculator, Google Cloud Pricing Calculator, Azure TCO Calculator.
* **Bảng tính dự toán:** Google Sheets / Microsoft Excel với công thức dự báo Monte Carlo.

---

### 4. Danh Mục Tài Liệu Bàn Giao Trong Thư Mục Này
* [`01_system_architecture_document_sad.md`](./01_system_architecture_document_sad.md): Tài liệu thiết kế kiến trúc hệ thống chuẩn mực (SAD).
* [`02_tech_stack_adr/`](./02_tech_stack_adr/): Bộ ghi nhận quyết định kiến trúc (Architecture Decision Records - ADRs).
* [`03_cost_estimation/`](./03_cost_estimation/): Bảng bóc tách khối lượng & chi phí chi tiết (CBS) và bài toán kích cỡ hạ tầng Cloud.
* [`04_technical_risk_assessment.md`](./04_technical_risk_assessment.md): Đánh giá rủi ro kỹ thuật, điểm nghẽn hiệu năng và mục tiêu RTO/RPO.


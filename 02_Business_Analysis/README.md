# 02. ĐỘI NGŨ PHÂN TÍCH NGHIỆP VỤ (BUSINESS ANALYST - BA)

> **Vị trí trong chuỗi:** Mắt xích đầu tiên chuyển hóa ngôn ngữ đời sống / kinh doanh thành ngôn ngữ kỹ thuật chuẩn xác.

---

### 1. Mục Tiêu Cốt Lõi (Core Mission)
Đảm bảo hệ thống công nghệ được xây dựng giải quyết **đúng và trúng** bài toán kinh doanh của khách hàng và người dùng cuối:
* **Hiểu sâu chủ đề & động cơ kinh doanh:** Làm rõ ngay từ ngày đầu khách hàng ưu tiên trọng tâm nào: **Thương hiệu**, **Giao diện**, **SEO mạnh mẽ**, **Tỷ lệ chuyển đổi bán hàng**, hay **Tự động hóa vận hành**.
* **Phân tích hành vi & tâm lý người tiêu dùng (Consumer Intent):** Đặt người dùng cuối làm trung tâm, gỡ bỏ toàn bộ các rào cản và nỗi sợ tâm lý khi thao tác trên hệ thống.
* **Không thừa:** Loại bỏ các tính năng lãng phí tài nguyên phát triển nhưng không đem lại giá trị.
* **Không thiếu:** Bao quát toàn bộ các kịch bản thực tế, trường hợp biên (edge cases) và ngoại lệ nghiệp vụ.

---

### 2. Trách Nhiệm Chi Tiết (Detailed Responsibilities)

0. **Khám phá chiến lược dự án & Mục đích người dùng (Strategic Discovery - Bước Quan Trọng Nhất):**
   * Xác định rõ chủ đề dự án (E-commerce, FinTech, EdTech, B2B SaaS,...) và định vị phân khúc thương hiệu.
   * Tổ chức phiên họp Discovery chuyên sâu bằng Bộ câu hỏi định vị chiến lược để đo lường trọng số ưu tiên: Thẩm mỹ giao diện vs Điểm SEO Google vs Tỷ lệ chốt đơn (CRO).
   * Phân tích hành trình tâm lý khách hàng (Customer Emotional Journey) và việc cần làm (Jobs-To-Be-Done).

1. **Khảo sát hiện trạng & Lấy yêu cầu (Requirement Gathering & Elicitation):**
   * Tổ chức các buổi phỏng vấn chuyên sâu với các bên liên quan (Stakeholders: Giám đốc, Kế toán, Quản lý kho, Khách hàng cuối).
   * Phân tích hệ thống cũ (Legacy system), phân tích khoảng trống (Gap Analysis) và nhận diện các "nỗi đau" (Pain points).

2. **Phân loại yêu cầu hệ thống:**
   * **Yêu cầu chức năng (Functional Requirements - FR):** Hệ thống có những chức năng gì, người dùng thực hiện thao tác gì, đầu vào và đầu ra của dữ liệu.
   * **Yêu cầu phi chức năng (Non-Functional Requirements - NFR):** Tiêu chuẩn thời gian phản hồi (Response time < 200ms), độ chịu tải (5,000 CCU), bảo mật (Mã hóa, chuẩn OWASP Top 10), tính sẵn sàng (99.9% Uptime).

3. **Mô hình hóa luồng nghiệp vụ (Business Process Modeling):**
   * Trực quan hóa quy trình bằng sơ đồ luồng dữ liệu (Data Flow Diagram - DFD).
   * Vẽ sơ đồ chuẩn quốc tế BPMN 2.0 (Business Process Model and Notation).
   * Xây dựng sơ đồ Use Case và sơ đồ tuần tự (Sequence Diagram) hỗ trợ đội kiến trúc.

4. **Biên soạn tài liệu đặc tả & User Stories:**
   * Chuyển hóa yêu cầu thành User Story tuân thủ nguyên tắc **INVEST**.
   * Viết tiêu chí nghiệm thu rõ ràng (Acceptance Criteria - AC) theo cú pháp chuẩn **Given - When - Then** để QA dùng làm test case và Dev dùng làm căn cứ lập trình.

---

### 3. Bộ Công Cụ Sử Dụng (Toolstack)
* **Vẽ sơ đồ & Luồng:** Draw.io, Lucidchart, Miro, Enterprise Architect, FigJam.
* **Tài liệu đặc tả & Kho tri thức:** Confluence, Notion, Google Docs.
* **Quản trị Backlog & Stories:** Jira Software, Linear.

---

### 4. Danh Mục Tài Liệu Bàn Giao Trong Thư Mục Này
* [`00_project_discovery_and_strategic_goals.md`](./00_project_discovery_and_strategic_goals.md): **[BƯỚC QUAN TRỌNG NHẤT]** Bản phân tích khám phá chiến lược, chủ đề ngành hàng, 5 trọng tâm mong muốn (Thương hiệu, SEO, Giao diện, Doanh số, Vận hành) và tâm lý người tiêu dùng.
* [`01_stakeholder_interviews/`](./01_stakeholder_interviews/): Bộ câu hỏi phỏng vấn định vị chiến lược (Discovery Questionnaire) và biểu mẫu biên bản họp lấy yêu cầu.
* [`02_brd_business_requirements_document.md`](./02_brd_business_requirements_document.md): Tài liệu yêu cầu kinh doanh tổng thể (BRD).
* [`03_srs_software_requirements_specification.md`](./03_srs_software_requirements_specification.md): Tài liệu đặc tả kỹ thuật phần mềm chi tiết (SRS).
* [`04_user_stories_and_acceptance_criteria.md`](./04_user_stories_and_acceptance_criteria.md): Danh mục User Stories chuẩn kèm Acceptance Criteria (Gherkin).
* [`05_business_process_modeling/`](./05_business_process_modeling/): Sơ đồ quy trình BPMN, Use Case và kịch bản tương tác người dùng.
* [`06_cross_department_requirement_breakdown_matrix.md`](./06_cross_department_requirement_breakdown_matrix.md): **[MA TRẬN PHÂN RÃ LIÊN PHÒNG BAN]** Bóc tách từng yêu cầu nghiệp vụ xuống task chi tiết cho UI/UX, Backend, Frontend, DBA, QA và DevOps.


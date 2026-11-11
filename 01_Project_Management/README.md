# 01. BỘ PHẬN ĐIỀU PHỐI DỰ ÁN & QUẢN TRỊ KỸ THUẬT
## Project Coordinator / Technical Project Manager (TPM)

> **Vị trí trong chuỗi:** Trung tâm điều hành thần kinh, kết nối kinh doanh với kỹ thuật và gắn kết mọi phòng ban chức năng.

---

### 1. Mục Tiêu Cốt Lõi (Core Mission)
Đảm bảo toàn bộ dự án hoàn thành theo nguyên lý kiềng 3 chân kinh điển của Quản trị dự án:
* **Đề xuất phương án & bài toán chi phí trước triển khai (Quan trọng nhất):** Chủ động xây dựng 2 - 3 gói giải pháp (Tiết kiệm MVP vs Chuyên nghiệp vs Doanh nghiệp lớn) kèm bài toán kinh tế minh bạch trước khi bắt tay vào làm; "may đo" linh hoạt bộ công cụ (Toolstack) tùy theo túi tiền và đặc thù của từng khách hàng.
* **On-time:** Đúng kỳ hạn cam kết với khách hàng và Ban Giám Đốc.
* **On-scope:** Đúng phạm vi đã thống nhất, kiểm soát chặt chẽ phình to tính năng (Scope Creep).
* **On-budget:** Nằm trong hạn mức ngân sách tài chính và tài nguyên nhân sự cho phép.
* **Chất lượng đạt chuẩn:** Đáp ứng đầy đủ tiêu chí nghiệm thu và chất lượng vận hành.

---

### 2. Trách Nhiệm Chi Tiết (Detailed Responsibilities)

0. **Đề xuất phương án tiền khả thi & Lựa chọn công cụ linh hoạt (Pre-Implementation Proposals):**
   * Phối hợp cùng BA và Solution Architect xây dựng bảng so sánh 3 gói giải pháp: Chi phí nhân sự (Man-months), chi phí Cloud hàng tháng, thời gian ra mắt (Time-to-market).
   * Đề xuất bộ công cụ "may đo" (Toolstack) theo ngân sách của khách: Khách startup dùng Linear/Notion/VPS giá rẻ; khách doanh nghiệp dùng Jira/Figma/CI-CD tự động hóa; khách ngân hàng dùng Jenkins/On-premise khép kín.
   * Ký biên bản thống nhất phương án và hạn mức ngân sách trước khi giải ngân nguồn lực cho đội kỹ thuật.

1. **Bẻ nhỏ bức tranh lớn (Decomposition):**
   * Chia nhỏ bài toán tổng thể thành các Cột mốc (Milestones), Bản phát hành (Releases) và Chu kỳ phát triển ngắn hạn (Sprints 1-2 tuần).
   * Lập cấu trúc phân rã công việc (Work Breakdown Structure - WBS) từ cấp độ Tính năng (Epic) xuống Tác vụ (Task).

2. **Điều phối luồng thông tin (Communication Orchestration):**
   * Làm cầu nối dịch thuật hai chiều: Ngăn chặn tình trạng "tam sao thất bản" giữa kỳ vọng kinh doanh của Khách hàng/Sếp và thực tế kỹ thuật của đội ngũ Dev.
   * Tổ chức các phiên họp Scrum chuẩn: Sprint Planning, Daily Standup, Backlog Grooming, Sprint Review và Retrospective.

3. **Nhận diện và tháo gỡ điểm nghẽn (Blocker Resolution):**
   * Là "đầu tàu dọn đường" cho đội ngũ kỹ thuật:
     * Frontend chờ API Backend ➔ Thúc đẩy thống nhất Mock Data/Swagger contract.
     * Developer chờ Designer chốt bản vẽ Figma ➔ Thúc đẩy BA và Designer ưu tiên màn hình chính.
     * Hạ tầng Dev/Staging gặp sự cố ➔ Điều phối DevOps ưu tiên cấp cứu hạ tầng ngay lập tức.

4. **Quản trị rủi ro & Nợ kỹ thuật (Risk & Tech Debt Management):**
   * Dự trù biến động nhân sự (nghỉ việc, ốm đau), rủi ro công nghệ mới và chi phí hạ tầng phát sinh.
   * Dành tỷ lệ thích hợp (10% - 15% thời lượng Sprint) để giải quyết Tech Debt tránh hệ thống bị sập khi scale.

---

### 3. Bộ Công Cụ Sử Dụng (Toolstack)
* **Quản lý Task & Sprint:** Jira, Linear, ClickUp, Notion, Trello.
* **Tiến độ & Biểu đồ:** Gantt Chart (Microsoft Project / TeamGantt / Jira Advanced Roadmaps), Burndown Chart.
* **Giao tiếp & Cảnh báo:** Slack, Microsoft Teams, Telegram Groups, Zoom/Google Meet.

---

### 4. Danh Mục Tài Liệu Bàn Giao Trong Thư Mục Này
* [`00_pre_implementation_solution_and_cost_proposals.md`](./00_pre_implementation_solution_and_cost_proposals.md): **[BƯỚC ĐỀ XUẤT QUAN TRỌNG NHẤT]** Đề xuất 3 gói phương án triển khai, bài toán chi phí nhân sự/hạ tầng và khung lựa chọn bộ công cụ (Toolstack) linh hoạt tùy theo khách hàng.
* [`11_multi_project_governance_and_client_feedback_loop.md`](./11_multi_project_governance_and_client_feedback_loop.md): **[ĐIỀU PHỐI ĐA DỰ ÁN & VÒNG LẶP FEEDBACK KHÁCH HÀNG]** Quản trị song song 2 - 3 dự án độc lập không chồng chéo, tự động hóa chuỗi solution an toàn (không dựa dẫm cảm tính của AI Agent), quy chuẩn Web động (Production data thật vs Sandbox Mock data) và cơ chế PM tiếp nhận feedback khách hàng để đề xuất giải pháp xử lý chuyên nghiệp.
* [`10_atomic_task_decomposition_and_ai_vibe_coding_sop.md`](./10_atomic_task_decomposition_and_ai_vibe_coding_sop.md): **[QUY CHUẨN TASK NGUYÊN TỬ & TIẾT KIỆM TOKEN]** Chiến thuật Vibe Coding đỉnh cao: 1 Prompt = 1 Task, giảm 95% chi phí API token, triệt tiêu ảo giác AI để tối ưu hóa biên lợi nhuận.
* [`atomic_ai_task_prompt_template.md`](./atomic_ai_task_prompt_template.md): Biểu mẫu prompt chuẩn cô đọng < 300 tokens để giao việc cho bất kỳ mô hình AI nào.
* [`08_master_task_tracking_and_status_dashboard.md`](./08_master_task_tracking_and_status_dashboard.md): **[BẢNG CHIẾN LƯỢC QUẢN TRỊ TASK TOÀN DIỆN]** Thống kê minh bạch trạng thái: ĐÃ XONG, ĐANG LÀM, CHỜ LÀM, BỊ NGHẼN và ĐÃ HỦY BỎ (ghi rõ lý do), phân bổ phòng ban rõ ràng.
* [`09_inter_department_collaboration_and_token_efficiency.md`](./09_inter_department_collaboration_and_token_efficiency.md): **[ĐIỀU PHỐI TRƠN TRU & TIẾT KIỆM TOKEN]** Cơ chế tham vấn kỹ thuật 2 chiều, phân rã yêu cầu, cân bằng tải nhân lực và chiến lược siêu tiết kiệm Token khi làm việc với AI.
* [`01_project_charter.md`](./01_project_charter.md): Điều lệ dự án (Mục tiêu, phạm vi, ngân sách, nhân sự chủ chốt).
* [`02_wbs_work_breakdown_structure.md`](./02_wbs_work_breakdown_structure.md): Bảng phân rã cấu trúc công việc toàn diện.
* [`03_project_plan_milestones.md`](./03_project_plan_milestones.md): Lộ trình triển khai, danh sách cột mốc và biểu đồ Gantt.
* [`04_sprint_backlog_management.md`](./04_sprint_backlog_management.md): Quy trình quản trị Sprint, tiêu chuẩn DoR & DoD.
* [`sprint_backlog_jira_import.csv`](./sprint_backlog_jira_import.csv): Tệp CSV danh mục công việc mẫu sẵn sàng nạp trực tiếp vào Jira/ClickUp.
* [`05_risk_management_register.md`](./05_risk_management_register.md): Bảng theo dõi và xử lý rủi ro dự án.
* [`06_blocker_resolution_escalation.md`](./06_blocker_resolution_escalation.md): Quy trình giải phóng điểm nghẽn và leo thang sự cố.
* [`07_progress_reporting_templates/`](./07_progress_reporting_templates/): Thư mục biểu mẫu báo cáo tuần, báo cáo cháy việc (Burndown) và cập nhật tiến độ.


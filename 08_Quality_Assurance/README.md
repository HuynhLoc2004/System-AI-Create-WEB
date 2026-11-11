# 08. ĐỘI NGŨ KIỂM THỬ & ĐẢM BẢO CHẤT LƯỢNG (QA / QC - SOFTWARE TESTERS)

> **Vị trí trong chuỗi:** "Cửa khẩu" kiểm soát chất lượng tối thượng trước khi phần mềm được phép đến tay người dùng thực tế.

---

### 1. Mục Tiêu Cốt Lõi (Core Mission)
* **Kiểm thử từng chức năng ngay khi bàn giao:** Không dồn việc tới cuối dự án; mỗi khi Dev triển khai xong một tính năng, QA thực hiện kiểm thử từng bước (Step-by-step), ghi chép nhật ký rõ ràng chức năng nào PASS / chức năng nào FAIL kèm bằng chứng cụ thể.
* **Kiểm định toàn diện 5 chiều:** Soát lỗi từ Logic chức năng, Giao diện (UI chuẩn Pixel), Trải nghiệm (UX), Hiệu ứng chuyển động (Motion/Scroll 60fps), đến Tính thích ứng (Responsive) trên mọi dòng điện thoại di động.
* **Bảo mật tuyệt đối ô nhập liệu (Input Security):** Kiểm tra kỹ lưỡng 2 lớp (Client & Server), đánh chặn toàn bộ các cuộc tấn công tiêm mã độc SQL Injection, Cross-Site Scripting (XSS), tràn bộ đệm và gian lận dữ liệu.
* **Kiểm thử Database an toàn 100% bằng Mock Data:** Cách ly tuyệt đối với cơ sở dữ liệu thật (Production), chỉ chạy test trên môi trường Sandbox với dữ liệu giả lập, tự động Rollback sau khi test để không làm ô nhiễm hệ thống.
* **Chịu đựng điều kiện khắc nghiệt:** Đảm bảo hệ thống đứng vững dưới tải trọng 5.000 người dùng đồng thời mà không bị sập hay tràn bộ nhớ.

---

### 2. Trách Nhiệm Chi Tiết (Detailed Responsibilities)

1. **Phân tích yêu cầu & Thiết kế ma trận kiểm thử (Test Matrix):**
   * Đọc kỹ tài liệu SRS và Acceptance Criteria để xác định toàn bộ các nhánh rẽ và kịch bản biên (Boundary Value Analysis, Equivalence Partitioning).
   * Lập Ma trận truy xuất nguồn gốc yêu cầu (Requirements Traceability Matrix - RTM) để đảm bảo không bỏ sót bất kỳ yêu cầu kinh doanh nào.

2. **Thực thi kiểm thử thủ công & Ghi chép nhật ký từng bước (Manual Testing & Daily Log):**
   * **Kiểm thử chức năng (Functional Testing):** Kiểm tra từng form nhập liệu, logic tính tiền, trừ khuyến mãi, phân quyền truy cập.
   * **Ghi nhật ký thực thi (Execution Ledger):** Đánh dấu trạng thái `PASS` / `FAIL` cho từng tính năng, mô tả nguyên nhân lỗi và đính kèm video/ảnh chụp bằng chứng.
   * **Kiểm thử 5 chiều giao diện:** Rà soát từng pixel so với Figma, kiểm tra độ mượt cuộn trang 60fps (Kinetic scroll), trạng thái chờ Skeleton và tính thích ứng trên 5 cỡ màn hình di động.

3. **Kiểm thử an ninh bảo mật ô nhập liệu (Input Penetration Testing):**
   * Sử dụng các bộ dữ liệu độc hại (Attack Payloads) để tấn công thử nghiệm SQL Injection, XSS, ký tự đặc biệt, chuỗi 10.000 ký tự.
   * Xác minh Backend chặn đứng kể cả khi kẻ gian bypass giao diện gọi thẳng API bằng Postman/curl.

4. **Kiểm thử cơ sở dữ liệu cô lập với Mock Data (Sandbox DB Testing):**
   * Sử dụng cơ chế Transaction Auto-Rollback để dữ liệu test tự biến mất sau mỗi ca kiểm thử.
   * Sử dụng Sandbox ngân hàng giả lập, tuyệt đối không dùng tiền thật hay tài khoản thật.

5. **Kiểm thử tự động hóa & Chịu tải (Automation & Performance Testing):**
   * Viết kịch bản tự động hóa E2E bằng **Playwright** chạy hồi quy (Regression Test) trong CI/CD.
   * Thực hiện kiểm thử chịu tải bằng **k6**, bơm tải 5.000 CCU đo độ trễ P95.

6. **Quản lý vòng đời lỗi & Ký duyệt nghiệm thu (QA Sign-off):**
   * Bắt lỗi chuẩn mực lên Jira, phân định rõ Severity và Priority.
   * Ký biên bản nghiệm thu chất lượng (**QA Sign-off Report**) khi không còn lỗi nghiêm trọng tồn đọng.

---

### 3. Bộ Công Cụ Sử Dụng (Toolstack)
* **Quản trị Test & Báo cáo Bug:** Jira Software, TestRail, Zephyr Scale.
* **Kiểm thử API & Hiệu năng:** Postman (Newman CLI), k6, Apache JMeter.
* **Tự động hóa E2E & Cross-browser:** Playwright, Cypress, Selenium Grid.

---

### 4. Danh Mục Tài Liệu Bàn Giao Trong Thư Mục Này
* [`01_test_plans/`](./01_test_plans/): 
  - [`master_test_plan.md`](./01_test_plans/master_test_plan.md): Kế hoạch kiểm thử tổng thể (Master Test Plan) và tiêu chuẩn Pass/Fail.
  - [`database_mock_testing_and_sandbox_policy.md`](./01_test_plans/database_mock_testing_and_sandbox_policy.md): **[CHÍNH SÁCH DATABASE AN TOÀN]** Cách ly tuyệt đối với dữ liệu thật, kiểm thử mock data và tự động rollback.
  - [`ui_ux_responsive_inspection_checklist.md`](./01_test_plans/ui_ux_responsive_inspection_checklist.md): **[BẢNG KIỂM ĐỊNH 5 CHIỀU]** Rà soát chi tiết UI, UX, Hiệu ứng cuộn 60fps, Skeleton và Responsive 5 màn hình.
* [`02_test_cases_matrices/`](./02_test_cases_matrices/): 
  - [`feature_verification_execution_log.md`](./02_test_cases_matrices/feature_verification_execution_log.md): **[NHẬT KÝ KIỂM THỬ TỪNG BƯỚC]** Bảng theo dõi tính năng sau bàn giao, đánh dấu PASS/FAIL kèm bằng chứng.
  - [`input_security_and_sanitization_matrix.md`](./02_test_cases_matrices/input_security_and_sanitization_matrix.md): **[BẢO MẬT Ô NHẬP LIỆU]** Ma trận tấn công thử nghiệm SQLi, XSS, Fuzzing và kiểm định 2 lớp phòng thủ.
  - [`requirements_traceability_matrix.md`](./02_test_cases_matrices/requirements_traceability_matrix.md): Ma trận truy xuất nguồn gốc RTM liên kết SRS với Test Cases.
  - [`detailed_test_cases_suite.md`](./02_test_cases_matrices/detailed_test_cases_suite.md): Bộ Test Cases chi tiết (Positive, Negative, Boundary).
* [`03_automation_and_performance/`](./03_automation_and_performance/): Kịch bản tự động Playwright và kế hoạch test tải k6 (5.000 CCU).
* [`04_bug_tracking_reports/`](./04_bug_tracking_reports/): Ma trận phân loại lỗi, biểu mẫu Bug Report chuẩn và Biên bản ký duyệt nghiệm thu QA Sign-off.


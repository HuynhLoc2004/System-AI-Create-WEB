# 09. ĐỘI NGŨ TRIỂN KHAI & VẬN HÀNH HẠ TẦNG (DEVOPS / SYSADMIN)

> **Vị trí trong chuỗi:** Cầu nối giữa Lập trình (Dev) và Vận hành (Ops), xây dựng đường băng vững chắc cho phần mềm cất cánh.

---

### 1. Mục Tiêu Cốt Lõi (Core Mission)
* **Đề xuất hạ tầng tối ưu & Tiết kiệm chi phí nhất:** Lựa chọn đúng cấu hình phần cứng (CPU/RAM/NVMe) và mô hình triển khai (Hybrid VPS + Cloudflare CDN) giúp hệ thống chạy mượt mà 5.000 CCU nhưng tiết kiệm tới 75% ngân sách so với các dịch vụ đám mây đắt đỏ.
* **Triển khai an toàn tuyệt đối (Zero-Downtime):** Áp dụng kỹ thuật Rolling Updates và Healthcheck tự động; đảm bảo khách hàng đang mua sắm không bao giờ gặp lỗi 502, sẵn sàng kịch bản tự động Rollback trong 60 giây nếu có sự cố.
* **Bảo mật tuyệt đối các Secret Key:** Triển khai triết lý Zero-Trust, cấm commit file `.env`, tiêm biến bí mật lúc runtime qua kênh mã hóa, và xoay vòng khóa định kỳ 90 ngày.
* **Đóng gói tối giản, loại bỏ 100% file dư thừa:** Áp dụng tệp `.dockerignore` nghiêm ngặt và Multi-stage build rút gọn dung lượng Docker Image từ 1.5GB xuống dưới 100MB, quét sạch lỗ hổng bảo mật bằng Trivy.
* **Đường ống CI/CD tự động hóa linh hoạt:** Cung cấp sẵn các bộ kịch bản tự động hóa hoàn chỉnh cho cả **GitHub Actions**, **GitLab CI** và **Jenkins Pipeline** tùy theo đề xuất của dự án.

---

### 2. Trách Nhiệm Chi Tiết (Detailed Responsibilities)

1. **Khảo sát cấu hình & Tối ưu hóa chi phí máy chủ (FinOps & Capacity Sizing):**
   * Định cỡ máy chủ cho 3 môi trường: Dev, Staging / UAT và Production.
   * Cấu hình Cloudflare CDN đệm 85% lưu lượng tĩnh, giảm tải CPU máy chủ gốc và miễn phí 100% băng thông truyền tải.
   * Lên lịch tự động tắt máy chủ Test ngoài giờ làm việc để tiết kiệm 35% chi phí điện toán.

2. **Xây dựng đường ống CI/CD đa nền tảng linh hoạt:**
   * Thiết lập quy trình 5 chặng tự động: `Lint & Typecheck ➔ Unit & Integration Test ➔ Multi-stage Build ➔ Trivy Security Scan ➔ Deploy Rolling Restart`.
   * Cung cấp kịch bản chuẩn hóa cho GitHub Actions, GitLab CI và Jenkinsfile.

3. **Quản lý đa môi trường & Triển khai an toàn:**
   * Đồng bộ 3 môi trường: Dev, Staging (UAT) và Production.
   * Kiểm soát cổng UAT: Bắt buộc có chữ ký nghiệm thu UAT Sign-off từ QA và Khách hàng mới được kích hoạt tag release lên Production.
   * Cơ chế kiểm tra sức khỏe (Health Check) trước khi đảo luồng Nginx và kịch bản Rollback tự động 60 giây.

4. **Bảo vệ khóa bí mật & Đóng gói container nhẹ:**
   * Mã hóa bí mật tại kho Vault / GitHub Secrets, tiêm thẳng vào bộ nhớ RAM của container khi chạy.
   * Rà soát loại bỏ triệt để file rác, mã nguồn thử nghiệm qua tệp `.dockerignore`.

5. **Giám sát & Cảnh báo tức thì (Monitoring & Alerting):**
   * Cài đặt bộ giám sát Prometheus, Grafana, Sentry và Uptime Kuma.
   * Tích hợp bot tự động bắn cảnh báo khẩn cấp (Push Alert) về Telegram/Slack trong 10 giây khi CPU > 85% hoặc tỷ lệ lỗi 5xx > 1%.

---

### 3. Bộ Công Cụ Sử Dụng (Toolstack)
* **Hệ điều hành & Máy chủ:** Linux Ubuntu Server 22.04/24.04 LTS, AWS EC2, Hetzner Cloud.
* **Container:** Docker, Docker Compose, Kubernetes (K8s).
* **CI/CD:** GitHub Actions, GitLab CI.
* **Web Server & SSL:** Nginx, Certbot Let's Encrypt, Cloudflare.
* **Quan sát & Cảnh báo:** Prometheus, Grafana, Sentry, Uptime Kuma, Telegram Alert Bot.

---

### 4. Danh Mục Tài Liệu Bàn Giao Trong Thư Mục Này
* [`01_ci_cd_pipelines/`](./01_ci_cd_pipelines/): 
  - [`cicd_architecture_specifications.md`](./01_ci_cd_pipelines/cicd_architecture_specifications.md): Kiến trúc đường ống CI/CD 5 chặng chuẩn mực.
  - [`safe_production_deployment_and_rollback.md`](./01_ci_cd_pipelines/safe_production_deployment_and_rollback.md): **[TRIỂN KHAI AN TOÀN & ROLLBACK]** Kỹ thuật Rolling update không gián đoạn, cổng nghiệm thu UAT và script hoàn tác 60s.
  - [`github_actions_production_pipeline.yml`](./01_ci_cd_pipelines/github_actions_production_pipeline.yml): Pipeline GitHub Actions Production tự động.
  - [`jenkins_and_gitlab_ci_alternative_pipelines.md`](./01_ci_cd_pipelines/jenkins_and_gitlab_ci_alternative_pipelines.md): **[CI/CD ĐA NỀN TẢNG]** Kịch bản chuẩn hóa cho GitLab CI (`.gitlab-ci.yml`) và Jenkins (`Jenkinsfile`).
* [`02_environments/`](./02_environments/): 
  - [`cost_effective_server_recommendations.md`](./02_environments/cost_effective_server_recommendations.md): **[ĐỀ XUẤT SERVER TỐI ƯU CHI PHÍ]** So sánh hạ tầng, định cỡ phần cứng và mô hình Hybrid VPS + Cloudflare tiết kiệm 75%.
  - [`zero_trust_secrets_management.md`](./02_environments/zero_trust_secrets_management.md): **[BẢO MẬT KHÓA BÍ MẬT & API KEYS]** 5 nguyên tắc cấm, tiêm biến môi trường lúc runtime và xoay vòng key 90 ngày.
  - [`environment_parity_standards.md`](./02_environments/environment_parity_standards.md): Tiêu chuẩn đồng bộ 3 môi trường (Dev, Staging/UAT, Production).
  - [`.env.example`](./02_environments/.env.example): Tệp biến môi trường mẫu chuẩn bảo mật.
* [`03_containerization/`](./03_containerization/): 
  - [`minimalist_docker_packaging_and_dockerignore.md`](./03_containerization/minimalist_docker_packaging_and_dockerignore.md): **[ĐÓNG GÓI TỐI GIẢN]** Quy chuẩn loại bỏ file rác, rút gọn image từ 1.5GB xuống 85MB và quét bảo mật Trivy.
  - [`.dockerignore`](./03_containerization/.dockerignore): Tệp cấu hình chặn triệt để tệp dư thừa khi build container.
  - [`docker_standards_and_multistage.md`](./03_containerization/docker_standards_and_multistage.md): Tiêu chuẩn Multi-stage build và Non-root user.
  - [`docker-compose.production.yml`](./03_containerization/docker-compose.production.yml): Toàn bộ cụm dịch vụ Production (Nginx, FE, BE, DB, Redis, Worker).
* [`04_network_security_reverse_proxy/`](./04_network_security_reverse_proxy/): Cấu hình Nginx chuẩn bảo mật cao SSL TLS 1.3 và WebSocket.
* [`05_monitoring_alerting_runbook/`](./05_monitoring_alerting_runbook/): Hướng dẫn thiết lập bộ giám sát Observability và Sổ tay xử lý sự cố khẩn cấp (Runbook).


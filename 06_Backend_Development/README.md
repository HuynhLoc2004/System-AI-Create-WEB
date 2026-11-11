# 06. ĐỘI NGŨ PHÁT TRIỂN HỆ THỐNG BACKEND (BACKEND DEVELOPERS)

> **Vị trí trong chuỗi:** Xây dựng bộ não logic, xử lý luồng tính toán cốt lõi, bảo mật thông tin và lưu chuyển dữ liệu ngầm dưới bề mặt hệ thống.

---

### 1. Mục Tiêu Cốt Lõi (Core Mission)
* **Tính toán chính xác 100% nghiệp vụ (Business Logic Accuracy):** Xử lý tiền tệ, chiết khấu, trừ tồn kho và đối soát tài chính không xảy ra sai lệch dù là một đồng.
* **An toàn & Bảo mật cao (High Security):** Kiểm soát nghiêm ngặt cửa ngõ API, phòng chống gian lận, rò rỉ dữ liệu và tấn công mã độc.
* **Xử lý đồng thời lớn & Ổn định (High Concurrency & Stability):** Đảm bảo phản hồi nhanh dưới 200ms ngay cả trong giờ cao điểm Flash-sale.

---

### 2. Trách Nhiệm Chi Tiết (Detailed Responsibilities)

1. **Xây dựng kiến trúc phân tầng sạch (Clean Architecture):**
   * Tách biệt độc lập giữa:
     - `Controllers / Handlers`: Tiếp nhận HTTP Request, giải nén dữ liệu.
     - `Services / Use Cases`: Nơi chứa toàn bộ luật nghiệp vụ (Business Rules).
     - `Repositories / DAOs`: Tương tác với Database qua ORM/Query Builder.
     - `Entities / Domain Models`: Định nghĩa cấu trúc thực thể lõi.

2. **Thiết kế & Chuẩn hóa API (RESTful & OpenAPI):**
   * Tuân thủ chuẩn RESTful: Đúng động từ HTTP (GET, POST, PUT, PATCH, DELETE), đúng mã phản hồi HTTP Status Code (200, 201, 400, 401, 403, 404, 422, 500).
   * Kiểm soát chặt chẽ dữ liệu đầu vào thông qua **Data Transfer Objects (DTO)** và tự động kiểm tra định dạng (Validation Pipes).
   * Tự động xuất tài liệu Swagger / OpenAPI 3.0 cho đội Frontend và QA sử dụng.

3. **Xác thực, phân quyền & Bảo mật chuyên sâu:**
   * Triển khai hệ thống Token kép (Access Token ngắn hạn + Refresh Token dài hạn lưu trong HttpOnly Cookie).
   * Phân quyền chi tiết tới từng hành động theo vai trò (RBAC) bằng Decorators & Guards.
   * Chống tấn công brute-force và DDoS bằng cơ chế **Rate Limiting** dựa trên Redis.

4. **Xử lý tác vụ nền & Hàng đợi bất đồng bộ (Async Workers & Message Queues):**
   * Đẩy toàn bộ các tác vụ tốn thời gian (Gửi email xác nhận, gửi SMS OTP, xuất hóa đơn điện tử, xử lý Webhook thanh toán) vào hàng đợi **BullMQ / RabbitMQ**.
   * Thiết lập cơ chế chạy lại khi lỗi (Retry with Exponential Backoff) và lưu các thông điệp lỗi hỏng vào Hàng đợi thư chết (Dead-Letter Queue - DLQ).

5. **Tối ưu hóa bộ nhớ đệm (Caching với Redis):**
   * Triển khai mô hình **Cache-Aside Pattern** cho dữ liệu danh mục sản phẩm, giảm tải 80% truy vấn trực tiếp vào PostgreSQL.

---

### 3. Bộ Công Cụ Sử Dụng (Toolstack)
* **Nền tảng chính:** Node.js, NestJS, TypeScript, Java Spring Boot, Python FastAPI.
* **Cơ sở dữ liệu & Cache:** PostgreSQL, Redis 7, Prisma ORM / TypeORM.
* **Hàng đợi & Message Broker:** BullMQ, RabbitMQ.
* **Tài liệu & Thử nghiệm:** Swagger UI, Postman, Jest, Supertest.

---

### 4. Danh Mục Tài Liệu Bàn Giao Trong Thư Mục Này
* [`01_architecture_standards/`](./01_architecture_standards/): Tiêu chuẩn Clean Architecture và mã nguồn mẫu xử lý Transaction đơn hàng.
* [`02_api_specifications/`](./02_api_specifications/): Chuẩn thiết kế RESTful API và hướng dẫn cấu hình Swagger OpenAPI.
* [`03_security_and_auth/`](./03_security_and_auth/): Triển khai JWT kép, RBAC Guards và bảo vệ Rate Limiting chống Brute-force.
* [`04_async_workers_queue/`](./04_async_workers_queue/): Cấu hình hàng đợi BullMQ, cơ chế Idempotent Webhook và chiến lược Caching Redis.


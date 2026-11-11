# ADR-002: QUYẾT ĐỊNH TECH STACK TOÀN DIỆN CHO DỰ ÁN

* **Trạng thái:** Được chấp thuận (Accepted)  
* **Ngày quyết định:** 16/11/2026  
* **Người quyết định:** Solution Architect, Frontend Lead, Backend Lead  

---

## Bảng Quyết Định Công Nghệ (Tech Stack Matrix)

| Tầng Công Nghệ | Lựa Chọn Đạt Chuẩn | Lý Do Kỹ Thuật & Kinh Tế |
|---|---|---|
| **Frontend Framework** | **Next.js 14+ (App Router) & React** | Hỗ trợ Server-Side Rendering (SSR) tối ưu SEO, Server Components tải trang nhanh, cộng đồng hỗ trợ lớn nhất thế giới |
| **Styling & UI Kit** | **Tailwind CSS & Shadcn/ui** | Không phát sinh runtime CSS, khả năng tùy biến vô hạn theo Design System của Figma, bundle size siêu nhẹ |
| **Backend Framework** | **NestJS (Node.js & TypeScript)** | Cấu trúc phân lớp rõ ràng tương tự Spring Boot/Angular, kiểu dữ liệu chặt chẽ (Strict TypeScript), hỗ trợ Microservices native |
| **Cơ Sở Dữ Liệu Chính** | **PostgreSQL 16** | Hệ quản trị CSDL quan hệ mạnh mẽ nhất hiện nay, hỗ trợ chuẩn ACID hoàn hảo cho giao dịch tiền tệ, hỗ trợ cột JSONB tốc độ cao |
| **Bộ Nhớ Đệm & Session** | **Redis 7** | Tốc độ in-memory siêu tốc (phản hồi < 2ms), hỗ trợ Pub/Sub, Rate Limiting và khóa phân tán (Redlock) |
| **Hàng Đợi Nhiệm Vụ Nền** | **BullMQ / Redis Streams** | Nhẹ hơn nhiều so với cụm Kafka/RabbitMQ riêng biệt trong giai đoạn đầu, quản lý job thất bại, tự động retry và delay job xuất sắc |
| **Tài Liệu Hóa API** | **Swagger / OpenAPI 3.0** | Tự động sinh tài liệu từ code NestJS decorators, hỗ trợ xuất sang Postman Collection trong 1 click |
| **Container & Triển Khai** | **Docker & Docker Compose** | Đồng nhất môi trường 100% giữa máy lập trình viên, Staging và Production Server |


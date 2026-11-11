# ADR-001: LỰA CHỌN MÔ HÌNH KIẾN TRÚC MODULAR MONOLITH THAY VÌ MICROSERVICES

* **Trạng thái:** Được chấp thuận (Accepted)  
* **Ngày quyết định:** 15/11/2026  
* **Người quyết định:** Solution Architect, Tech Lead, TPM  

---

## 1. Ngữ Cảnh Bài Toán (Context)
Dự án được khởi động với đội ngũ kỹ thuật gồm 8-10 lập trình viên. Doanh nghiệp cần đưa sản phẩm ra thị trường nhanh trong vòng 6 tháng. Yêu cầu tải trọng ban đầu là 5.000 CCU, quy trình nghiệp vụ còn đang trong giai đoạn hoàn thiện cùng khách hàng. Nếu lựa chọn Microservices ngay từ ngày đầu, đội ngũ sẽ phải đối mặt với các bài toán phân tán phức tạp: Distributed Transactions (Saga Pattern), Eventual Consistency, Service Discovery, Distributed Tracing và chi phí hạ tầng DevOps cao gấp 3-4 lần.

## 2. Quyết Định (Decision)
Chúng tôi quyết định áp dụng mô hình **Modular Monolith** kết hợp nguyên lý Domain-Driven Design (DDD):
* Tất cả các module (Auth, Order, Catalog, Payment, Warehouse) được đặt trong một kho mã nguồn duy nhất (Single Repository).
* Mỗi module tuân thủ ranh giới chặt chẽ: Chỉ gọi hàm qua Interface nội bộ hoặc phát sinh Domain Events bất đồng bộ. Cấm tuyệt đối việc module này truy vấn trực tiếp bảng cơ sở dữ liệu của module khác.

## 3. Hệ Quả & Lợi Ích (Consequences)
* **Tích cực:** 
  - Tốc độ phát triển cực nhanh, việc refactor code và thay đổi schema dữ liệu dễ dàng trong 1 transaction.
  - Quản lý CI/CD đơn giản, triển khai gọn nhẹ chỉ cần 1 container chính cho API.
  - Chi phí hạ tầng Cloud tiết kiệm đáng kể.
* **Tiêu cực:** Phải kiểm soát kỷ luật code nghiêm ngặt để tránh biến dự án thành "cục bùn lớn" (Big Ball of Mud). Đã trang bị công cụ kiểm tra phụ thuộc (Dependency Linter) trong quy trình CI.


# TÍNH TOÁN KÍCH CỠ HẠ TẦNG CLOUD DỰA TRÊN DUNG LƯỢNG TẢI (CAPACITY SIZING)

## 1. Các Thông Số Tải Trọng Đầu Vào (Input Sizing Metrics)
* **Số người dùng hoạt động hàng ngày (Daily Active Users - DAU):** 50.000 DAU.
* **Số người dùng hoạt động đồng thời lúc đỉnh điểm (Peak CCU):** 5.000 Concurrent Users.
* **Tỷ lệ thao tác:** 80% Đọc dữ liệu (Xem sản phẩm, đọc tin tức) / 20% Ghi dữ liệu (Thêm giỏ hàng, đặt đơn, bình luận).
* **Ước tính số Request mỗi giây (Requests Per Second - RPS):**
  - Trung bình mỗi active user tạo ra 1 request mỗi 10 giây.
  - $\text{Peak RPS} = \frac{5.000 \text{ CCU}}{10 \text{ s}} \times 1.5 \text{ (Hệ số an toàn)} = \mathbf{750 \text{ RPS}}$.

---

## 2. Bóc Tách Nhu Cầu Tài Nguyên Máy Chủ

### Tầng 1: Reverse Proxy & Caching (Nginx + Redis)
* 750 RPS với 80% là request đọc (Read RPS = 600 RPS).
* Nhờ lưu cache danh mục sản phẩm và trang chủ vào Redis (Cache Hit Ratio dự kiến 85%):
  - 510 RPS được trả về ngay tức khắc từ RAM của Redis trong vòng 2ms.
  - Chỉ có 240 RPS (150 read miss + 90 write) đi sâu vào tầng Backend Application.
* **Cấu hình đề xuất:** 1 node Redis Cache (4 vCPU, 8GB RAM).

### Tầng 2: Backend Application Cluster (NestJS Node.js)
* 1 container Node.js (NestJS) đơn luồng xử lý hiệu quả khoảng 250 - 300 RPS cho logic nghiệp vụ có kết nối cơ sở dữ liệu.
* Để chịu tải 240 RPS trực tiếp và dự phòng khi có đợt Flash-sale đột biến:
  - Cần tối thiểu 2 containers chạy song song dưới cơ chế Load Balancer.
* **Cấu hình đề xuất:** 2 VMs (Mỗi VM: 4 vCPU, 8GB RAM), CPU utilization duy trì dưới 65%.

### Tầng 3: Relational Database (PostgreSQL 16)
* Số giao dịch ghi đỉnh điểm: 90 Write Transactions/second.
* **Cấu hình đề xuất:**
  - 1 Primary DB Instance: 4 vCPU, 16GB RAM, ổ cứng SSD NVMe 100GB (Provisioned IOPS 3.000).
  - Kết nối qua Connection Pooler (PgBouncer) giới hạn tối đa 150 active connections tránh cạn kiệt RAM.
  - Tốc độ tăng trưởng dữ liệu: Ước tính 15GB/tháng ➔ Ổ cứng 100GB đáp ứng an toàn trong 6 tháng đầu.


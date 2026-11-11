# KẾ HOẠCH KIỂM THỬ CHỊU TẢI & STRESS TEST VỚI K6 (5,000 CCU)

## 1. Kịch Bản Tăng Tải (Load Profile Stages)
Kịch bản mô phỏng đợt mở bán Flash-sale: Bơm lượng người dùng đồng thời từ 0 lên 5.000 Virtual Users (VUs):

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '3m', target: 1000 },  // Giai đoạn 1: Khởi động lên 1,000 users
    { duration: '5m', target: 5000 },  // Giai đoạn 2: Tăng vọt lên đỉnh điểm 5,000 users
    { duration: '10m', target: 5000 }, // Giai đoạn 3: Duy trì tải đỉnh trong 10 phút liên tục
    { duration: '2m', target: 0 },     // Giai đoạn 4: Hạ tải về 0 (Ramp-down)
  ],
  thresholds: {
    // 95% requests phải phản hồi dưới 200ms
    http_req_duration: ['p(95)<200'],
    // Tỷ lệ lỗi toàn hệ thống không được vượt quá 0.1%
    http_req_failed: ['rate<0.001'],
  },
};

export default function () {
  // 1. Xem danh mục sản phẩm (Đọc từ Redis Cache)
  let res = http.get('https://staging-api.domain.com/v1/products?limit=20');
  check(res, { 'status is 200': (r) => r.status === 200 });

  sleep(1);

  // 2. Thao tác xem chi tiết sản phẩm
  let detailRes = http.get('https://staging-api.domain.com/v1/products/d0000000-0000-0000-0000-000000000001');
  check(detailRes, { 'detail status is 200': (r) => r.status === 200 });

  sleep(2);
}
```

---

## 2. Tiêu Chí Đánh Giá Điểm Sập Hệ Thống (Stress Test Thresholds)
* Nếu CPU của máy chủ Backend chạm ngưỡng > 85% trong quá trình chạy: DevOps kích hoạt cấu hình tự động mở rộng (Auto-scale thêm container thứ 3 và thứ 4).
* Nếu tỷ lệ lỗi HTTP 500 hoặc 502 Bad Gateway xuất hiện vượt quá 0.5% ➔ Gắn nhãn **FAIL**, yêu cầu DBA và Backend Lead điều chỉnh lại Connection Pool của PostgreSQL.


# QUY CHUẨN THIẾT KẾ RESTFUL API & HTTP STATUS CODES

## 1. Nguyên Tắc Đặt Tên Điểm Cuối (Endpoint URL Conventions)
* Sử dụng danh từ số nhiều (Plural nouns): `/api/v1/orders`, `/api/v1/products`.
* Không sử dụng động từ trong URL (Tránh: `/api/v1/getProducts` hay `/api/v1/createOrder`).
* Sử dụng chữ thường kết hợp dấu gạch nối (kebab-case): `/api/v1/order-items`.
* Đánh phiên bản rõ ràng trên đường dẫn (API Versioning): `/api/v1/*`.

---

## 2. Ma Trận Động Từ HTTP & Mã Trạng Thái Trả Về

| Động Từ (Method) | Đường Dẫn Mẫu | Mục Đích | Mã Thành Công Chuẩn | Mã Lỗi Thường Gặp |
|---|---|---|:---:|:---:|
| **GET** | `/api/v1/products` | Lấy danh sách sản phẩm (có phân trang) | **200 OK** | 400 Bad Request |
| **GET** | `/api/v1/products/{id}` | Lấy chi tiết 1 sản phẩm | **200 OK** | 404 Not Found |
| **POST** | `/api/v1/orders` | Tạo mới đơn hàng | **201 Created** | 400 Bad Request, 422 Unprocessable |
| **PUT** | `/api/v1/users/{id}` | Cập nhật toàn bộ thông tin người dùng | **200 OK** | 400 Bad Request, 404 Not Found |
| **PATCH** | `/api/v1/orders/{id}` | Cập nhật một phần (ví dụ đổi trạng thái đơn) | **200 OK** | 400 Bad Request, 409 Conflict |
| **DELETE** | `/api/v1/items/{id}` | Xóa hoặc vô hiệu hóa bản ghi (Soft Delete) | **204 No Content** | 404 Not Found, 403 Forbidden |

---

## 3. Quy Chuẩn Phân Trang, Lọc & Sắp Xếp (Pagination & Filtering)
* Mọi danh sách trả về bắt buộc có phân trang để tránh tràn RAM:
  - `GET /api/v1/products?page=1&limit=20&sort=-createdAt&category=electronics`
* Định dạng phản hồi phân trang chuẩn:
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 154,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```


# ĐẶC TẢ SCHEMA VIRTUAL FILE TREE JSONB & CƠ CHẾ ATOMIC PATCH
## DÀNH CHO SENIOR DBA & DATABASE ADMINISTRATOR

> [!NOTE]
> Chiến lược lưu trữ cây thư mục mã nguồn ảo (Virtual File Tree) trong PostgreSQL / Document DB để đảm bảo ACID, không phân mảnh Inodes và tốc độ truy xuất dưới 1ms.

---

## 1. POSTGRESQL SCHEMA & JSONB MANIPULATION

```sql
-- Cập nhật nội dung một file đơn lẻ mà không cần ghi đè toàn bộ project
UPDATE projects
SET files = jsonb_set(
    COALESCE(files, '{}'::jsonb),
    ARRAY['src/components/Checkout.jsx'],
    to_jsonb('export default function Checkout() { ... }'::text),
    true -- Tạo mới nếu chưa tồn tại
),
updated_at = NOW()
WHERE id = 'PRJ-RETAIL-2026';

-- Xóa một file khỏi cây thư mục ảo
UPDATE projects
SET files = files - 'src/temp.js'
WHERE id = 'PRJ-RETAIL-2026';
```

---

## 2. CHÍNH SÁCH QUẢN TRỊ BẢN THUẦN TEXT

1. **Giới hạn kích thước file:** Mỗi file text không vượt quá 2MB. Các tài sản nhị phân nặng (ảnh lớn, video) phải đưa lên Cloudflare R2 / S3 CDN thay vì lưu thô vào CSDL.
2. **Bảo toàn tính toàn vẹn:** Khóa `package.json` và `README.md` luôn được khởi tạo mặc định trong mỗi dự án mới.

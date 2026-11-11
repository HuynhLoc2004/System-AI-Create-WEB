# HƯỚNG DẪN ĐÓNG GÓI DOCKER & VẬN HÀNH THỰC TẾ 9 PHÒNG BAN

Tài liệu hướng dẫn triển khai nền tảng **IT-Assignment Enterprise** lên máy chủ VPS / Cloud Production (AWS, DigitalOcean, Linode, Google Cloud, v.v.) bằng Docker & Docker Compose, cùng Quy chuẩn Quản trị Phân luồng 9 Phòng ban và Tiêu chuẩn Thiết kế Chống "AI Hóa" (Anti-AI-Slop).

---

## 1. QUY TRÌNH ĐIỀU PHỐI TỪ BAN QUẢN TRỊ XUỐNG 9 PHÒNG BAN (SOP CHUẨN)

Hệ thống **tuyệt đối không để AI tự ý code hoặc phát hành bừa bãi** mà tuân thủ nghiêm ngặt nguyên tắc **Manager-in-the-Loop**:

```
[ Khách Hàng Gửi Yêu Cầu / Ý Tưởng / Feedback ]
                    │
                    ▼
     [ 🤖 Gemini Consultant AI (Instance 1) ]
  (Bóc tách sơ bộ: Mô hình, Tính năng Web Động, Ngân sách)
                    │
                    ▼
      [ 👔 BAN QUẢN TRỊ / PROJECT MANAGER (PM) ]
 (Đánh giá tính khả thi, thẩm định phạm vi, phê duyệt giải pháp)
                    │
   ┌────────────────┼────────────────┬────────────────┐
   ▼                ▼                ▼                ▼
[02. BA]        [03. SA]         [04. UI/UX]      [07. DBA]
Nghiệp vụ       Kiến trúc         Thiết kế         Cơ sở dữ liệu
SRS & BPMN      Stack & Cost     Design System    Schema & An toàn
   │                │                │                │
   └────────────────┼────────────────┼────────────────┘
                    │
                    ▼
   ┌────────────────┴────────────────┐
   ▼                                 ▼
[05. FRONTEND]                 [06. BACKEND]
Web Động 60fps                 API & Đối soát VietQR
   │                                 │
   └────────────────┬────────────────┘
                    │
                    ▼
            [08. KIỂM THỬ QA/QC]
       (Chống SQLi, XSS, Test 20 dòng màn hình)
                    │
                    ▼
         [09. HẠ TẦNG & DEVOPS]
       (Đóng gói Docker, SSL Nginx, Vận hành 24/7)
                    │
                    ▼
        [ KHÁCH HÀNG NGHIỆM THU TRÊN WORKSPACE ]
```

---

## 2. QUY CHUẨN THIẾT KẾ CHỐNG "AI HÓA" (ANTI-AI-SLOP DESIGN STANDARD)

Để tránh tình trạng "10 website làm bằng AI như 1", đầy rẫy emoji, màu sắc lòe loẹt và văn phong sáo rỗng, toàn bộ đội ngũ và **Con Gemini Builder AI (Instance 2)** bắt buộc tuân thủ 5 nguyên tắc:

1. **Tuyệt Đối Không Dùng Emoji Trang Trí:**
   - Cấm chèn emoji (`✨, 🚀, 🛒, ⚡, 🔥`) vào tiêu đề, tên sản phẩm, mã SKU hay nút bấm.
   - Thay vào đó sử dụng SVG Icon tối giản (Feather / Lucide style) với nét vẽ mảnh 1.5px - 2px.
2. **Bảng Màu Kiềm Chế & Sang Trọng (Curated Palette):**
   - Nền tối sâu thẳm: Midnight Slate `#090D16`, Dark Obsidian `#0D1424`.
   - Màu nhấn chủ đạo: Royal Blue `#2563EB` hoặc Emerald `#059669`. Tối đa 2 màu nhấn trong toàn bộ trang web.
   - Không sử dụng gradient cầu vồng, neon tím xanh gây nhức mắt người dùng.
3. **Phân Cấp Typography Rõ Ràng (Typographic Hierarchy):**
   - Font chữ hình học hiện đại: `Plus Jakarta Sans` hoặc `Inter`. Font số liệu & mã code: `JetBrains Mono`.
   - Không viết các đoạn văn dài dòng 500 từ sáo rỗng. Mọi thông tin đều bóc tách thành bullet hoặc thẻ metric súc tích.
4. **Dữ Liệu Thật 100% & Giá Niêm Yết VNĐ:**
   - Sản phẩm có tên chuyên môn thực tế theo ngành nghề (VD: *Áo Blazer Dạ Cashmere Ý*, *Bình Hút Lộc Men Lam Bát Tràng*).
   - Giá tiền là số nguyên VNĐ hợp lý, có mã SKU chuẩn công nghiệp (VD: `BLZ-CSM-01`).
5. **Đồng Bộ Nhất Quán Giữa Các Trang (Cross-Page Consistency):**
   - Cùng một hệ thống viền (`rgba(255,255,255,0.08)`), cùng bán kính bo góc (`border-radius: 10px - 14px`), và cùng phong cách nút bấm giữa trang Quản Trị, Cổng Tư Vấn và Workspace Khách Hàng.

---

## 3. HƯỚNG DẪN TRIỂN KHAI VỚI DOCKER & DOCKER COMPOSE

### Yêu Cầu Máy Chủ (VPS Minimum Specs)
- **Hệ điều hành:** Ubuntu 22.04 LTS / Debian 12 / AlmaLinux 9
- **Cấu hình tối thiểu:** 1 vCPU, 1GB RAM (khuyến nghị 2GB RAM để chạy Docker mượt mà), 20GB SSD
- **Phần mềm:** Docker Engine $\ge$ 24.0, Docker Compose $\ge$ 2.20

---

### Bước 1: Sao Chép Mã Nguồn Lên Máy Chủ
```bash
# Đăng nhập vào VPS của bạn qua SSH
ssh root@your-vps-ip

# Tạo thư mục và clone / tải mã nguồn lên
mkdir -p /opt/it-assignment
cd /opt/it-assignment
```

---

### Bước 2: Cấu Hình File Môi Trường (`.env`)
Sao chép mẫu cấu hình và dán các Key của bạn:
```bash
cp .env.example .env
nano .env
```
Điền 2 Key Gemini riêng biệt vào file `.env`:
```env
# Con Gemini 1: Phân tích nhu cầu khách hàng
GEMINI_CONSULT_API_KEY=AIzaSy...your_consultant_key
GEMINI_CONSULT_MODEL=gemini-2.5-pro

# Con Gemini 2: Tự động kiến tạo Website & Sản phẩm
GEMINI_BUILDER_API_KEY=AIzaSy...your_builder_key
GEMINI_BUILDER_MODEL=gemini-2.5-pro

# Cấu hình máy chủ
PORT=5000
NODE_ENV=production
REDIS_URL=redis://redis:6379
DB_FILE=/app/server/data/production.db.json
```

---

### Bước 3: Khởi Chạy Nền Tảng (1 Câu Lệnh)
```bash
docker compose up -d --build
```
Hệ thống sẽ tự động:
1. Đóng gói ứng dụng Node.js Alpine siêu nhẹ.
2. Khởi tạo container Redis 7 Alpine làm tầng đệm Cache.
3. Gắn Volume lưu trữ dữ liệu bền vững `app_data` vào `/app/server/data/production.db.json` (không bao giờ bị mất dữ liệu khi restart container).
4. Mở Port `5000` sẵn sàng phục vụ.

---

### Bước 4: Kiểm Tra Trạng Thái & Nhật Ký
```bash
# Xem danh sách container đang chạy
docker compose ps

# Xem log thời gian thực của ứng dụng
docker compose logs -f app

# Kiểm tra sức khỏe hệ thống (Healthcheck)
curl http://localhost:5000/api/health
```

---

### Bước 5: Cấu Hình Tên Miền & Chứng Chỉ SSL Miễn Phí (Nginx Reverse Proxy)

Cài đặt Nginx trên VPS để trỏ tên miền của bạn (VD: `https://tenmien-cuaban.com`):

```nginx
server {
    server_name tenmien-cuaban.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Cấu hình SSE thời gian thực
        proxy_buffering off;
        proxy_read_timeout 86400s;
    }
}
```

Kích hoạt chứng chỉ SSL Let's Encrypt tự động:
```bash
sudo certbot --nginx -d tenmien-cuaban.com
```

---

## 4. ĐƯỜNG DẪN TRUY CẬP HỆ THỐNG
* **Trang Quản Trị Trung Tâm & Điều Hành 9 Phòng Ban (Admin Hub):** `http://<IP-VPS>:5000/` (hoặc `http://localhost:5000/`)
* **API Quản Trị Dự Án & Tác Vụ:** `http://<IP-VPS>:5000/api/projects`



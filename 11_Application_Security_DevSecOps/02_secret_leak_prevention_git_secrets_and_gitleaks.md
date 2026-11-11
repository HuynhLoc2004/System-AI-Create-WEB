# 02. NGĂN CHẶN RÒ RỈ KHÓA BÍ MẬT & API KEY (SECRET LEAK PREVENTION VIA GITLEAKS & GIT-SECRETS)
**Phòng Ban:** 11. An Toàn Thông Tin Ứng Dụng (Application Security - DevSecOps)  
**Tiêu Chuẩn:** OWASP Top 10 A07:2021 (Identification and Authentication Failures)  
**Mục Tiêu:** Đảm bảo 100% không bao giờ có khóa bí mật (API Key, JWT Secret, DB Password) bị hardcode vào mã nguồn hoặc commit lên Git.

---

## 1. MẪU PATTERN NHẬN DIỆN KHÓA BÍ MẬT (DETECTION PATTERNS)
DevSecOps thiết lập bộ lọc Regex quét toàn bộ nội dung file trước khi lưu vào Database JSONB hoặc Commit:

| Loại Khóa | Mẫu Regex Nhận Diện | Hành Động Xử Lý |
| :--- | :--- | :--- |
| **Gemini / OpenAI API Key** | `AIzaSy[A-Za-z0-9_-]{33}` / `sk-[A-Za-z0-9]{48}` | **BLOCK NGAY LẬP TỨC**. Yêu cầu chuyển vào `process.env.GEMINI_API_KEY` |
| **JWT Secret Hardcode** | `jwt\.sign\(.*,\s*["'][a-zA-Z0-9_\-]{4,}["']\)` | **REJECT**. Bắt buộc dùng `process.env.JWT_SECRET` |
| **PostgreSQL Connection String** | `postgres(ql)?:\/\/[a-zA-Z0-9_-]+:[^@]+@[a-zA-Z0-9._-]+:[0-9]+\/[a-zA-Z0-9_-]+` | **REJECT**. Bắt buộc dùng biến môi trường cấu hình tại runtime |
| **AWS Access / Secret Key** | `AKIA[0-9A-Z]{16}` | **BLOCK & BÁO ĐỘNG ĐỎ** |

---

## 2. QUY CHUẨN MÃ HÓA VÀ BẢO VỆ MÔI TRƯỜNG (ENVIRONMENT ENCRYPTION)
1. **File `.env` không bao giờ vào Git:** File `.gitignore` mặc định có `.env`, `.env.local`, `*.pem`, `*.key`.
2. **File `.env.example` chỉ chứa tên biến:**
   ```env
   # CHỈ ĐỂ TÊN BIẾN, KHÔNG BAO GIỜ ĐỂ GIÁ TRỊ THẬT
   GEMINI_API_KEY=your_gemini_api_key_here
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   JWT_SECRET=your_jwt_secret_min_32_characters
   ```
3. **Tự động quét Pre-Commit:** Hệ thống tích hợp Gitleaks / scan script tự động chặn lệnh commit nếu phát hiện chuỗi nghi vấn là Key thật.


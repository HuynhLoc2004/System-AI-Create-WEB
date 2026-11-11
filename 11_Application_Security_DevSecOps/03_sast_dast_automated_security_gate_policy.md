# 03. CHÍNH SÁCH KIỂM TRA BẢO MẬT TỰ ĐỘNG SAST & DAST (AUTOMATED SECURITY GATES)
**Phòng Ban:** 11. An Toàn Thông Tin Ứng Dụng (Application Security - DevSecOps)  
**Tiêu Chuẩn:** Static Application Security Testing (SAST) & Dynamic Analysis (DAST)  
**Mục Tiêu:** Tự động phát hiện lỗi injection, XSS, insecure deserialization ngay khi code vừa được sinh ra.

---

## 1. SAST GATE: QUÉT TĨNH MÃ NGUỒN (STATIC CODE ANALYSIS)
Khi AI sinh code Frontend (React) và Backend (Node/Express), bộ lọc SAST tự động kiểm tra:

### Quy Tắc Chặn Đứng (Blocking Rules):
1. **Chặn XSS trong React:**
   - Cấm hoàn toàn việc sử dụng `dangerouslySetInnerHTML` trừ khi có ghi chú kiểm định và bọc qua hàm `DOMPurify.sanitize()`.
2. **Chặn SQL Injection trong Backend:**
   - Cấm ghép chuỗi truy vấn: `query = "SELECT * FROM users WHERE id = '" + id + "'"` -> **FAIL GATE**.
   - Bắt buộc dùng Parameterized Query: `query = "SELECT * FROM users WHERE id = $1", [id]`.
3. **Chặn ReDoS (Regular Expression Denial of Service):**
   - Cấm các biểu thức Regex lồng nhau đa thức có khả năng treo CPU Node.js event loop khi nhận chuỗi đầu vào độc hại.

---

## 2. DAST GATE: QUÉT ĐỘNG ỨNG DỤNG TẠI RUNTIME (DYNAMIC ANALYSIS)
Tại môi trường chạy thử (Staging / Virtual Workspace):
1. **Header Security Check:**
   - Ứng dụng phải có đầy đủ các HTTP Security Headers do `helmet` sinh ra:
     - `Content-Security-Policy (CSP)`
     - `X-Frame-Options: SAMEORIGIN` (Chống Clickjacking)
     - `X-Content-Type-Options: nosniff`
     - `Strict-Transport-Security (HSTS)`
2. **Rate Limiting Check:**
   - Endpoint tạo đơn hàng, đăng nhập, hoặc sinh QR phải có Rate Limiting (`express-rate-limit`) chống Spam Brute-force (Tối đa 10 requests / phút / IP).

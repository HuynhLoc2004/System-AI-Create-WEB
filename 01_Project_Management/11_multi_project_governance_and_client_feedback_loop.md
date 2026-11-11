# 11. QUY CHUẨN ĐIỀU PHỐI ĐA DỰ ÁN & VÒNG LẶP TIẾP NHẬN FEEDBACK KHÁCH HÀNG
## Multi-Project Coexistence, Autonomous Solution Orchestration & Client Feedback Loop

> **Tôn chỉ tối thượng:** 
> 1. Bộ khung 9 phòng ban IT-Assignment phục vụ đồng thời nhiều dự án (2 - 3 dự án trở lên) hoàn toàn độc lập, tuyệt đối không chồng chéo ngữ cảnh, dữ liệu hay cấu hình.
> 2. Đưa ra giải pháp (Solutions) mượt mà nhất và an toàn nhất thông qua quy trình tự động hóa (Automation) giữa 9 phòng ban — **không dựa dẫm vào cảm tính hay "bộ não" riêng lẻ của con Agent AI**.
> 3. 100% ứng dụng là **Web Động (Dynamic Web)**: Production chạy dữ liệu thật 100% (Real DB, Live Payment, Cloud CDN); Local/UAT chạy Mock Data cô lập 100%, bảo vệ an toàn cho dữ liệu thực.
> 4. **PM (Project Manager) là phòng ban trực tiếp tiếp nhận phản hồi (Feedback) từ khách hàng** trên Dashboard, chủ trì xây dựng Solution kỹ thuật nghiêm túc, loại bỏ UI tùy tiện/trẻ con, chuẩn hóa theo đúng Brand Guideline của khách hàng.

---

### 1. Ma Trận Điều Phối Đa Dự Án Không Chồng Chéo (Multi-Project Isolation Architecture)

```
====================================================================================================
                             IT-ASSIGNMENT ENTERPRISE FRAMEWORK (SOP HUB)
====================================================================================================
                                      │ (Điều phối 9 Phòng Ban)
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
  projects/prj_retail/         projects/prj_fintech/        projects/prj_corp_erp/
  ├── config/                  ├── config/                  ├── config/
  │   ├── local.env (Mock)     │   ├── local.env (Mock)     │   ├── local.env (Mock)
  │   └── production.env (Live)│   └── production.env (Live)│   └── production.env (Live)
  ├── src/ (Dynamic Web)       ├── src/ (Dynamic Web)       ├── src/ (Dynamic Web)
  └── docs/ (SRS riêng biệt)   └── docs/ (SRS riêng biệt)   └── docs/ (SRS riêng biệt)
```

#### Quy Tắc Cô Lập Ngữ Cảnh 100% (Strict Context Isolation Rules):
1. **Không giao thoa bộ nhớ AI (Zero Context Bleed):** Khi kích hoạt AI Vibe Coding cho Dự án A (`projects/prj_retail`), lệnh prompt chỉ được nạp đúng context, SRS và schema của dự án đó. Cấm nạp tài liệu hoặc code của Dự án B vào prompt để tránh ảo giác và lẫn lộn nghiệp vụ.
2. **Cấu hình biến môi trường riêng biệt:** Mỗi dự án sở hữu file cấu hình độc lập (`local.env`, `production.env`) nằm bên trong thư mục của chính nó. Không dùng chung database instance giữa các dự án.
3. **Cân bằng tải nhân lực đa dự án (Resource Load Balancing):** PM chịu trách nhiệm theo dõi ma trận khối lượng công việc của từng kỹ sư/subagent ở từng dự án, đảm bảo không có phòng ban nào bị quá tải hoặc là điểm nghẽn cho dự án còn lại.

---

### 2. Tự Động Hóa Xây Dựng Solution — Không Dựa Dẫm Cảm Tính Agent

AI Agent (Gemini, Claude, GPT, v.v.) chỉ đóng vai trò là **Công cụ thực thi vi mô (Execution Engine)**. Mọi giải pháp kỹ thuật bắt buộc phải tuân theo chuỗi tự động hóa khép kín 9 bước của hệ sinh thái IT-Assignment:

```
[Khách Hàng Feedback / Yêu Cầu Mới]
                │
                ▼
[01. PM Tiếp Nhận]: Thẩm định rủi ro & chi phí (Scope & Budget impact)
                │
                ▼
[02. BA Đặc Tả]: Viết User Story với Acceptance Criteria (Gherkin chuẩn)
                │
                ▼
[03. SA Lập Phương Án]: Ra quyết định kiến trúc ADR an toàn nhất
                │
                ▼
[04. UI/UX Chuẩn Hóa]: Thiết kế theo Brand Guideline của khách (Nghiêm túc, không emoji tùy tiện)
                │
                ▼
[07. DBA Kiểm Duyệt]: Thiết kế DDL, Migration script, gác cổng bảo mật chống SQLi
                │
                ▼
[06. Backend Lập Trình]: Code Clean Architecture, Transaction ACID, Idempotency
                │
                ▼
[05. Frontend Ghép Web Động]: Tích hợp React/Next.js dynamic state, Axios Interceptor
                │
                ▼
[08. QA Kiểm Thử Độc Lập]: Test chức năng, bảo mật input trên Mock DB, ký PASS/FAIL
                │
                ▼
[09. DevOps Triển Khai]: Đóng gói Docker nhỏ gọn, CI/CD tự động, Rollback 60s
```

> **Nguyên tắc an toàn:** Không một Agent nào được phép tự tiện thay đổi cấu trúc database hoặc cấu hình bảo mật nếu chưa đi qua bước duyệt ADR của SA và Schema review của DBA!

---

### 3. Tiêu Chuẩn Web Động (Dynamic Web) & Phân Tách Môi Trường Triệt Để

Tuyệt đối không xây dựng web tĩnh HTML/CSS đơn sơ làm mất giá trị sản phẩm. Mọi dự án khách hàng bàn giao đều là **Web Động hoàn chỉnh**:

| Tiêu Chí | Môi Trường Local / UAT / Staging | Môi Trường Production Thực Tế |
| :--- | :--- | :--- |
| **Bản chất Web** | **Web động Full-Stack** (React/Next.js + NestJS/Node.js) | **Web động Full-Stack** tối ưu hóa SSR/ISR |
| **Dữ liệu (Data)** | **Mock Data 100% cô lập** (Mock API Server / Dev DB riêng) | **Dữ liệu thật 100%** (PostgreSQL Production cụm an toàn) |
| **Thanh toán** | Cổng Sandbox test mode (Không phát sinh dòng tiền thật) | VietQR động ngân hàng thực, IPN Webhook tức thì |
| **Tài nguyên Media** | Local disk hoặc Bucket test tạm thời | Cloudflare R2 / AWS S3 + CDN phân tán tốc độ cao |
| **Bảo mật & Phân quyền** | Dữ liệu thử nghiệm, tước bỏ dữ liệu cá nhân (Anonymized) | Mã hóa dữ liệu người dùng, JWT kép, HTTPS TLS 1.3 |
| **Nguyên tắc an toàn** | **Tuyệt đối không trỏ nhầm sang Production Database** | **Có cơ chế sao lưu tự động WAL 5 phút/lần** |

---

### 4. Vòng Lặp Tiếp Nhận Feedback Khách Hàng (Client Feedback Loop SOP)

Khách hàng hoặc Ban Quản Trị gửi phản hồi trực tiếp từ giao diện **Website Giám Sát (Operational Dashboard)**:

#### Bước 1: Tiếp Nhận & Phân Loại Tại Bàn Làm Việc PM
* Mọi feedback từ Dashboard tự động trỏ về hộp thư công việc của **`01_Project_Management`**.
* PM thẩm tra nội dung theo 4 nhóm:
  1. *UI/UX & Thẩm mỹ thương hiệu:* Giao diện thừa icon, màu sắc không hợp thương hiệu, scroll bị giật.
  2. *Nghiệp vụ (Business Logic):* Luồng mua hàng, tính giá trị đơn, trừ kho tự động.
  3. *Hiệu năng & Kỹ thuật:* Trang tải chậm, API phản hồi > 500ms, bộ nhớ đầy.
  4. *Yêu cầu tính năng mới (Change Request - CR):* Cần đánh giá phát sinh chi phí và thời gian.

#### Bước 2: Thiết Lập Solution Kỹ Thuật (Solution Engineering)
* PM không trả lời hứa hẹn bừa bãi. PM triệu tập phiên tham vấn chớp nhoáng với **Solution Architect (SA)** và **UI/UX Designer**:
  * Đưa ra giải pháp mượt nhất (ít ảnh hưởng tới code cũ nhất).
  * Đảm bảo tính an toàn cao nhất (không gây ra lỗ hổng bảo mật hay xung đột database).

#### Bước 3: Phân Bổ Tác Vụ Nguyên Tử (Atomic Dispatch)
* PM chuyển hóa Solution thành các Task hạt nguyên tử (Atomic Tasks) và đẩy vào Sprint của dự án:
  * Ví dụ Feedback: *"Giao diện nhiều emoji trông như con nít, yêu cầu sửa theo nhận diện thương hiệu tối giản sang trọng."*
  * $\rightarrow$ Task cho UI/UX: *Cập nhật tokens.json, loại bỏ emoji, áp dụng bảng màu Dark Navy chuẩn doanh nghiệp.*
  * $\rightarrow$ Task cho Frontend: *Refactor component hiển thị text thuần và icon vector SVG tinh tế.*
  * $\rightarrow$ Task cho QA: *Kiểm tra 100% màn hình đảm bảo đúng nhận diện thương hiệu.*

#### Bước 4: Nghiệm Thu & Phản Hồi Khách Hàng
* Sau khi QA ký duyệt PASS trên môi trường UAT, PM gửi thông báo cập nhật kèm đường link nghiệm thu ngay trên Dashboard cho khách hàng đánh giá.

---

### 5. Tiêu Chuẩn Chuyên Nghiệp Trong Thiết Kế UI/UX Của Dự Án

* **Không tự ý chèn emoji/icon bừa bãi:** Tránh biến giao diện phần mềm doanh nghiệp thành ứng dụng nhắn tin thiếu nghiêm túc.
* **Tôn trọng Brand Guideline của khách hàng:**
  * Khách hàng tài chính/ngân hàng $\rightarrow$ Tone màu xanh navy, xám bạc, biểu tượng vector tối giản, dứt khoát.
  * Khách hàng bán lẻ/thương mại điện tử $\rightarrow$ Giao diện sáng rõ, tập trung vào hình ảnh sản phẩm, nút bấm mua hàng trực quan.
  * Khách hàng công nghệ/SaaS $\rightarrow$ Dark mode hiện đại, font chữ kỹ thuật JetBrains Mono/Inter, thanh thoát và trực quan.
* Mọi thay đổi về phong cách giao diện đều phải có sự lắng nghe, ghi nhận và điều phối giải pháp thông qua **Project Manager**.


# 05. CỔNG CHẤT LƯỢNG TỰ ĐỘNG & TIÊU CHÍ KẾT THÚC KIỂM THỬ (AUTOMATED QUALITY GATES & EXIT CRITERIA)
**Phòng Ban:** 08. Kiểm Định & Đảm Bảo Chất Lượng (Quality Assurance - QA/QC)  
**Tiêu Chuẩn:** ISO/IEC/IEEE 29119 Software Testing Standard & Automated Quality Gate  
**Mục Tiêu:** Đặt ra các ranh giới chất lượng không thể thỏa hiệp trước khi cho phép một tính năng được ký nghiệm thu.

---

## 1. KHÁI NIỆM QUALITY GATE (CỔNG CHẤT LƯỢNG)
Không còn tình trạng "Dev bảo xong thì QA cho qua". Hệ thống kiểm định dựa trên bộ chỉ số định lượng bắt buộc:

```mermaid
flowchart TD
    A["Code Được Đẩy Lên"] --> B["Quality Gate 1: Static Lint & Types<br>(0 Lỗi TypeScript/ESLint)"]
    B --> C["Quality Gate 2: Unit Test Coverage<br>(Core Business Logic >= 70%)"]
    C --> D["Quality Gate 3: Web Performance<br>(Bundle JS < 500KB, LCP < 1.2s)"]
    D --> E["Quality Gate 4: Security & Bug Count<br>(0 Blocker, 0 Critical Bug)"]
    E -->|VƯỢT QUA 100%| F["QA SIGN-OFF THÀNH CÔNG"]
    E -->|RỚT BẤT KỲ ĐIỀU KIỆN NÀO| G["AUTO REJECT & TRẢ VỀ DEV"]
```

---

## 2. MA TRẬN TIÊU CHÍ KẾT THÚC KIỂM THỬ (EXIT CRITERIA MATRIX)

| Tiêu Chí Đánh Giá | Ngưỡng Tối Thiểu Bắt Buộc | Phương Pháp Đo Lường |
| :--- | :--- | :--- |
| **Độ phủ kiểm thử đơn vị (Unit Test Coverage)** | **>= 70%** đối với Core Logic (Tính tiền giỏ hàng, sinh mã VietQR, xác thực auth) | Jest / Vitest Coverage Report |
| **Số lượng lỗi nghiêm trọng (Bug Count)** | **0 Blocker, 0 Critical, 0 Major Bug** | Issue Tracker / Bug Log |
| **Kích thước gói Frontend (Bundle Size)** | **< 500 KB** (Gzip/Brotli) để tải nhanh trên mạng di động | Webpack / Vite Bundle Analyzer |
| **Độ trễ phản hồi giao diện (INP)** | **< 200 ms** (Mọi nút bấm phải phản hồi tức thì) | Chrome Performance Profiler |
| **Tính tương thích đa thiết bị** | **100% không tràn ngang (Horizontal Scrollbar)** trên màn hình 390px | Mobile Device Viewport Matrix |

# TÀI LIỆU YÊU CẦU SẢN PHẨM CHUẨN TIER-1 (PRD - PRODUCT REQUIREMENTS DOCUMENT)
## PHÒNG QUẢN LÝ SẢN PHẨM (PRODUCT MANAGEMENT / PO LEAD)

> [!IMPORTANT]
> **Tuyên ngôn của Product Owner (PO):** Khác biệt cốt lõi giữa TPM (quản lý thời gian, task, ngân sách) và PO là PO chịu trách nhiệm về **GIÁ TRỊ KINH DOANH (Business Value)**: *"Tính năng này giải quyết nỗi đau gì của người dùng? Nếu không làm thì hệ thống có sụp đổ không? Đâu là chỉ số đo lường thành công (Success Metric)?"*

---

## 1. CẤU TRÚC PRD CHUẨN TIER-1 ENTERPRISE

```mermaid
flowchart LR
    Problem["1. Nỗi Đau Khách Hàng (User Problem)"] --> Hypo["2. Giả Thuyết & Giải Pháp (Hypothesis)"]
    Hypo --> Metrics["3. Chỉ Số Thành Công (KPIs / North Star)"]
    Metrics --> Scope["4. Cắt Lát Phạm Vi (MVP Slicing: Must vs Wont)"]
    Scope --> Handoff["5. Chuyển Giao BA & Tech Team"]
```

### Các Khối Bắt Buộc Trong Bản PRD:
1. **Bối cảnh & Vấn đề thực tế (The Why):** 
   - Mô tả nỗi đau cụ thể của nhóm khách hàng mục tiêu (Target Persona).
   - Dẫn chứng số liệu (Data-driven evidence) hoặc khảo sát thực tế.
2. **Mục tiêu kinh doanh (Business Goals):**
   - Không được ghi chung chung "làm web bán lẻ đẹp".
   - Phải ghi cụ thể: "Tăng tỷ lệ hoàn tất đơn hàng (Checkout Completion Rate) từ 32% lên 65% bằng cổng VietQR tự động".
3. **Chỉ số đo lường hiệu quả (Success Metrics):**
   - **Primary Metric (North Star):** Ví dụ GMV giao dịch qua cổng tự động.
   - **Secondary Metric:** Thời gian trung bình để khách quét mã và đối soát (< 2 giây).
   - **Guardrail Metric:** Tỷ lệ huỷ đơn do lỗi cổng thanh toán (< 0.5%).
4. **Phân rã phạm vi MVP (MoSCoW Slicing):**
   - **Must-Have (P0):** Bắt buộc phải có để tạo thành vòng lặp giá trị cốt lõi.
   - **Should-Have (P1):** Quan trọng nhưng có thể ra mắt ở bản v1.1.
   - **Could-Have (P2):** Tính năng phụ trợ (Wishlist, gợi ý AI cá nhân hóa).
   - **Won't-Have (P3):** CẮT BỎ TRIỆT ĐỂ trong giai đoạn 1 để tránh trễ hạn Go-Live.

---

## 2. QUY CHUẨN BÀN GIAO CHO BỘ PHẬN BA & ARCHITECT

Trước khi chuyển giao bản PRD sang cho Business Analyst (BA) viết SRS và Architect thiết kế hệ thống, PO phải ký xác nhận **Checklist Sẵn Sàng (Definition of Ready - DoR)**:
- [ ] Đã trả lời được câu hỏi: *"Khách hàng chấp nhận trả bao nhiêu tiền cho tính năng này?"*
- [ ] Đã cắt giảm tối thiểu 50% các ý tưởng rườm rà do khách hàng hoặc các bên liên quan tự vẽ ra.
- [ ] Bản PRD gói gọn trong tối đa 3-5 trang (hoặc 1 trang Product Brief cô đọng), không viết dài dòng văn hoa.


# BIỂU MẪU PROMPT NGUYÊN TỬ CHO AI (ATOMIC AI PROMPT TEMPLATE)

> **Mục đích:** Sử dụng mẫu chuẩn này để giao việc cho bất kỳ mô hình AI nào (Gemini, Claude, GPT, Cursor). Mẫu này được tối ưu hóa để AI phản hồi chính xác 100% ngay từ lần đầu tiên với lượng tiêu hao Token tối thiểu (< 300 tokens).

---

```markdown
### [VAI TRÒ / PHÒNG BAN]:
Bạn đang đảm nhiệm vai trò [Ví dụ: Senior Backend Developer / DBA / UI Designer] tuân thủ quy chuẩn của IT-Assignment.

### [MỤC TIÊU DUY NHẤT (SINGLE OBJECTIVE)]:
[Mô tả chính xác đúng 1 việc cần làm trong 1-2 câu. Ví dụ: Viết migration script tạo bảng `orders` có ràng buộc khóa ngoại và cột UUID.]

### [PHẠM VI TỆP TIN (FILE SCOPE)]:
- Đọc tham khảo: `projects/<ten_du_an>/docs/erd_spec.json`
- Tạo/Sửa duy nhất tại file: `projects/<ten_du_an>/src/database/migrations/001_create_orders.sql`

### [HỢP ĐỒNG ĐẦU VÀO / SCHEMAS (INPUT CONTRACT)]:
[Dán cấu trúc JSON Schema hoặc TypeScript Type ngắn gọn tại đây - Không dán cả file to]

### [TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA)]:
1. Phải có ràng buộc `CHECK (total_amount >= 0)`.
2. Tạo chỉ mục `CREATE INDEX idx_orders_user ON orders(user_id)`.
3. Chỉ xuất ra nội dung mã nguồn trong code block, KHÔNG giải thích dông dài, KHÔNG viết code giả lập `// ... todo`.
```


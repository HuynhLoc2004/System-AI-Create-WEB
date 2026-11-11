# 14. MA TRẬN ĐÁNH GIÁ ẢNH HƯỞNG THAY ĐỔI YÊU CẦU & CHỐNG PHÌNH PHẠM VI (SCOPE CREEP & CHANGE REQUEST IMPACT MATRIX)
**Phòng Ban:** 01. Quản Trị Dự Án Kỹ Thuật (Project Management / TPM)  
**Tiêu Chuẩn:** Tier-1 Change Control Board (CCB) Protocol  
**Mục Tiêu:** Ngăn chặn việc khách hàng hoặc các bên liên quan thay đổi yêu cầu liên tục làm vỡ tiến độ, cháy ngân sách API token và gây rối loạn luồng phối hợp giữa các phòng ban.

---

## 1. NGUYÊN TẮC: "MỌI THAY ĐỔI ĐỀU PHẢI TRẢ GIÁ BẰNG THỜI GIAN VÀ TÀI NGUYÊN"
Khi dự án đang trong Sprint phát triển, mọi yêu cầu thay đổi (Change Request - CR) từ khách hàng **không được phép chèn ngang vô tội vạ**.  
TPM phải lập tức bóc tách ma trận ảnh hưởng 3 chiều:
1. **Story Points (Khối lượng công việc kỹ thuật phát sinh).**
2. **Chi phí tài nguyên AI & Hạ tầng (Token & VPS Cost).**
3. **Thời gian trễ hạn bàn giao (Delivery Delay Days).**

---

## 2. MA TRẬN ĐÁNH GIÁ ẢNH HƯỞNG (CR IMPACT MATRIX)

| Mức Độ CR | Mô Tả Thay Đổi | Số Điểm Kỹ Thuật (Points) | Ước Tính Token AI | Tác Động Tiến Độ | Quyết Định Của TPM |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CR-Minor (Nhỏ)** | Đổi màu sắc giao diện, đổi text tiêu đề banner, sửa font chữ. | 1 - 2 SP | ~2,000 Tokens | 0 ngày (Sửa trực tiếp) | **DUYỆT NGAY** (Giao UI/UX & FE xử lý trong 15 phút). |
| **CR-Medium (Vừa)** | Thêm 1 trường dữ liệu vào đơn hàng (VD: Ghi chú giao hàng), thêm 1 bộ lọc danh mục. | 3 - 5 SP | ~8,000 Tokens | Trễ 0.5 - 1 ngày | **XEM XÉT CÙNG BA & SA**. Cập nhật API Contract trước khi sửa code. |
| **CR-Major (Lớn)** | Đổi kiến trúc từ Mua Nhanh sang Hệ thống Đấu giá đa người dùng, tích hợp thêm sàn khác. | >= 13 SP | > 40,000 Tokens | Trễ 3 - 7 ngày | **TỪ CHỐI CHÈN VÀO SPRINT HIỆN TẠI**. Chuyển sang Phase 2 hoặc ký phụ lục hợp đồng mới. |

---

## 3. BIỂU MẪU ĐỀ XUẤT THAY ĐỔI (CHANGE REQUEST FORM)
Bất kỳ thành viên nào nhận yêu cầu thay đổi từ khách phải điền Form gửi TPM:
- **Tên yêu cầu:** [VD: Tích hợp thêm cổng thanh toán MoMo song song VietQR].
- **Lý do kinh doanh:** Khách hàng yêu cầu thêm phương thức thanh toán.
- **Phòng ban bị ảnh hưởng:** BA (Bóc luồng), SA (Sửa API), BE (Tích hợp SDK), FE (Thêm UI nút bấm), QA (Viết thêm test case).
- **Phán quyết của TPM:** Chấp thuận / Từ chối / Dời sang phiên bản tiếp theo.


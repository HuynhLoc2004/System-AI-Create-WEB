# HƯỚNG DẪN KHẢO SÁT & BỘ CÂU HỎI PHỎNG VẤN LẤY YÊU CẦU (REQUIREMENT ELICITATION)

## 1. Khung Phân Loại Bên Liên Quan (Stakeholder Mapping)

| Nhóm Đối Tượng | Đại Diện Phỏng Vấn | Mục Tiêu Phỏng Vấn | Câu Hỏi Trọng Tâm |
|---|---|---|---|
| **C-Level / Ban Giám Đốc** | CEO, COO, CFO | Tầm nhìn chiến lược, ROI, ngân sách, kỳ hạn bàn giao | "Thành công của dự án này sau 1 năm được đo bằng chỉ số kinh doanh cụ thể nào?" |
| **Vận hành & Nghiệp vụ trực tiếp** | Quản lý kho, Kế toán trưởng, CSKH | Quy trình thao tác hàng ngày, điểm nghẽn, thời gian xử lý thủ công | "Bước nào trong quy trình hiện tại làm mất nhiều thời gian và dễ xảy ra sai sót nhất?" |
| **Khách hàng cuối (End-users)** | Khách hàng mua sắm, đối tác | Trải nghiệm mua sắm, thanh toán, nhận thông báo | "Khó khăn lớn nhất khi quý khách đặt đơn hàng và thanh toán trên hệ thống cũ là gì?" |
| **Đội ngũ IT / Vận hành cũ** | SysAdmin, IT Support | Dữ liệu cũ cần chuyển đổi (Migration), bảo mật, hệ thống bên ngoài đang kết nối | "Có những API hoặc hệ thống nào bắt buộc phải tích hợp và duy trì tương thích ngược?" |

---

## 2. Kỹ Thuật Làm Rõ Yêu Cầu (5 Whys Technique)
Khi người dùng yêu cầu một tính năng: *"Tôi muốn có nút xuất báo cáo ra file Excel trên mọi màn hình"*, BA cần áp dụng kỹ thuật 5 Whys:
1. *Tại sao bạn cần xuất Excel?* ➔ Để gửi cho kế toán trưởng vào cuối ngày.
2. *Tại sao kế toán trưởng cần file Excel đó?* ➔ Để đối soát doanh thu giữa cổng thanh toán và phần mềm.
3. *Tại sao cần đối soát thủ công trên Excel?* ➔ Vì hệ thống hiện tại không tự động khớp lệnh thanh toán với ngân hàng.
4. **Giải pháp thực sự:** Không phải là làm nút xuất Excel bừa bãi, mà là **xây dựng tính năng Tự động đối soát ngân hàng (Automated Bank Reconciliation)**, giúp giải quyết tận gốc vấn đề!


# BẢNG BÓC TÁCH KHỐI LƯỢNG CÔNG VIỆC & DỰ TOÁN CHI PHÍ (COST BREAKDOWN STRUCTURE - CBS)

*Thời gian thực hiện dự án:* 6 tháng (24 tuần / 12 Sprints)  
*Đơn vị tiền tệ:* VNĐ (Việt Nam Đồng)

---

## 1. Chi Phí Nhân Lực Kỹ Thuật (Labor Cost - Man-Months)

| Vị Trí Chuyên Môn | Số Lượng (Người) | Thời Gian (Tháng) | Khối Lượng (Man-Months) | Đơn Giá / Tháng (VNĐ) | Thành Tiền (VNĐ) |
|---|:---:|:---:|:---:|:---:|:---:|
| **Project Coordinator / TPM** | 1 | 6 | 6 | 35.000.000 | 210.000.000 |
| **Business Analyst (BA)** | 1 | 4 | 4 | 28.000.000 | 112.000.000 |
| **Solution Architect (Part-time)** | 1 | 2.5 | 2.5 | 45.000.000 | 112.500.000 |
| **UI/UX Designer** | 1 | 3 | 3 | 25.000.000 | 75.000.000 |
| **Frontend Developers (Senior + Mid)** | 2 | 5 | 10 | 28.000.000 | 280.000.000 |
| **Backend Developers (Senior + Mid)** | 2 | 5.5 | 11 | 30.000.000 | 330.000.000 |
| **Database Specialist / DBA** | 1 | 2 | 2 | 32.000.000 | 64.000.000 |
| **QA / QC Lead & Automation Tester** | 2 | 4.5 | 9 | 22.000.000 | 198.000.000 |
| **DevOps Engineer** | 1 | 3 | 3 | 32.000.000 | 96.000.000 |
| **TỔNG CHI PHÍ NHÂN SỰ (A)** | **12** | - | **50.5 MM** | - | **1.477.500.000 VNĐ** |

---

## 2. Chi Phí Hạ Tầng Cloud & Dịch Vụ Bên Thứ Ba (6 Tháng Dự Án)

| Hạng Mục Dịch Vụ | Cấu Hình Dự Kiến | Chi Phí / Tháng (VNĐ) | Thời Gian | Thành Tiền (VNĐ) |
|---|---|:---:|:---:|:---:|
| **Cloud Compute (AWS EC2 / Hetzner VPS)** | 2 node Production (8 vCPU, 32GB RAM) + 1 node Staging | 7.500.000 | 6 tháng | 45.000.000 |
| **Managed Database (Postgres RDS)** | 4 vCPU, 16GB RAM, 100GB SSD NVMe Multi-AZ | 5.000.000 | 6 tháng | 30.000.000 |
| **Cloud Storage & CDN (Cloudflare R2/AWS S3)** | Lưu trữ hình ảnh sản phẩm & tài liệu (~500GB) | 1.000.000 | 6 tháng | 6.000.000 |
| **Dịch vụ SMS OTP & Zalo ZNS** | Gói 20.000 tin nhắn OTP + thông báo đơn hàng | 2.500.000 | 6 tháng | 15.000.000 |
| **Cổng Thanh Toán / Phí giao dịch thử nghiệm** | Phí duy trì kết nối Sandbox & môi trường UAT | 1.000.000 | 6 tháng | 6.000.000 |
| **Công cụ bản quyền (Figma, Jira, Sentry, Github)** | Gói nhóm làm việc 12 thành viên | 3.500.000 | 6 tháng | 21.000.000 |
| **TỔNG CHI PHÍ HẠ TẦNG & DỊCH VỤ (B)** | - | **20.500.000** | - | **123.000.000 VNĐ** |

---

## 3. Tổng Hợp Ngân Sách Dự Án & Quỹ Dự Phòng Rủi Ro

| Khoản Mục | Tỷ Lệ (%) | Số Tiền (VNĐ) |
|---|:---:|:---:|
| Chi phí nhân sự kỹ thuật (A) | 79.8% | 1.477.500.000 |
| Chi phí hạ tầng Cloud & Dịch vụ thứ ba (B) | 6.6% | 123.000.000 |
| **Tổng Chi Phí Trực Tiếp (A + B)** | **86.4%** | **1.600.500.000** |
| **Quỹ Dự Phòng Rủi Ro (Contingency Buffer - 15.6%)** | **13.6%** | **249.500.000** |
| **TỔNG NGÂN SÁCH ĐƯỢC DUYỆT (PROJECT BUDGET)** | **100%** | **1.850.000.000 VNĐ** |

*Ghi chú:* Quỹ dự phòng rủi ro 249.500.000 VNĐ chỉ được giải ngân khi có sự phê duyệt bằng văn bản từ Project Sponsor cho các trường hợp: Phát sinh yêu cầu ngoài phạm vi ban đầu (Change Request lớn), thiên tai hoặc sự cố mạng bất khả kháng từ nhà cung cấp dịch vụ viễn thông/Cloud.


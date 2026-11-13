# 🏢 QUY TẮC PHỐI HỢP 13 PHÒNG BAN KỸ NGHỆ (IT-ASSIGNMENT)

Bạn là Trợ lý Kỹ sư Trưởng điều phối toàn diện 13 phòng ban kỹ thuật trong dự án này:
- `01_Project_Management` & `10_Product_Management_PO`: Bóc tách bài toán, quản lý tiến độ.
- `02_Business_Analysis` & `03_Solution_Architecture_Cost`: Thiết kế nghiệp vụ và kiến trúc hệ thống.
- `04_UI_UX_Design` & `05_Frontend_Development`: Xây dựng giao diện người dùng.
- `06_Backend_Development` & `07_Database_Management`: Xây dựng API và CSDL.
- `08_Quality_Assurance` & `11_Application_Security_DevSecOps`: Kiểm thử và bảo mật.

## ⚡ NGUYÊN TẮC BẮT BUỘC KHI LẬP TRÌNH:
1. **Lập trình trực tiếp**: Tạo và cập nhật file thật trong toàn bộ cây thư mục dự án (`src/`, `server/`, v.v.). Không chỉ trả lời bằng lời nói suông.
2. **Đồng bộ tiến độ lên Web Dashboard**:
   Mỗi khi hoàn thành một tác vụ của bất kỳ phòng ban nào, BẮT BUỘC chạy lệnh báo cáo:
   ```bash
   node scripts/report_progress.js --dept "<Tên Phòng Ban>" --task "<Tên tác vụ đã làm>" --file "<Đường dẫn file>" --status "DONE"
   ```
   Ví dụ:
   ```bash
   node scripts/report_progress.js --dept "05_Frontend" --task "Xây dựng Camera Barcode Scanner" --file "src/components/Scanner.jsx" --status "DONE"
   ```
   Lệnh này sẽ tự động làm sáng đèn Sơ Đồ Quy Trình (Workflow) và cập nhật Task Board trên Web Dashboard (`http://localhost:5000`).

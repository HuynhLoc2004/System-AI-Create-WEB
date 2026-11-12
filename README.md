# Sàn Bán Lẻ Đa Kênh & VietQR Động (RETAIL)

> Dự án được khởi tạo và điều phối bởi hệ sinh thái 9 phòng ban kỹ thuật IT-Assignment.

## Kiến Trúc Zero-Load
- **Lưu trữ:** Virtual File Tree JSONB trong Database (0% node_modules trên đĩa VPS).
- **Xuất mã nguồn:** Nén trực tiếp từ RAM bằng JSZip Streaming.
- **Xem trước:** Render client-side 0% CPU server.
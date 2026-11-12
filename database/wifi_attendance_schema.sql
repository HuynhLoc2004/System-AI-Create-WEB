-- ========================================================
-- WIFI & IP EMPLOYEE ATTENDANCE SYSTEM SCHEMA
-- Phòng Quản Trị Cơ Sở Dữ Liệu (07_Database_Management)
-- ========================================================

-- 1. Bảng Chi Nhánh & Văn Phòng
CREATE TABLE IF NOT EXISTS offices (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Danh Sách WiFi / Router Hợp Lệ Của Văn Phòng (Chống Fake BSSID & IP)
CREATE TABLE IF NOT EXISTS office_networks (
    id VARCHAR(50) PRIMARY KEY,
    office_id VARCHAR(50) REFERENCES offices(id),
    ssid VARCHAR(100) NOT NULL,            -- Tên mạng WiFi (VD: "CONGTY_OFFICE_5G")
    bssid VARCHAR(50) NOT NULL,           -- Địa chỉ MAC vật lý của Router (VD: "a4:2b:b0:xx:xx:xx")
    allowed_subnet VARCHAR(50) NOT NULL,  -- Dải IP nội bộ hợp lệ (VD: "192.168.1.0/24")
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Nhân Viên
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(50) PRIMARY KEY,
    office_id VARCHAR(50) REFERENCES offices(id),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'EMPLOYEE',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng Nhật Ký Điểm Danh (Chứa Bằng Chứng Mạng & Chống Gian Lận)
CREATE TABLE IF NOT EXISTS attendance_logs (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50) REFERENCES employees(id),
    network_id VARCHAR(50) REFERENCES office_networks(id),
    check_type VARCHAR(20) NOT NULL,      -- 'CHECK_IN' hoặc 'CHECK_OUT'
    client_ip VARCHAR(50) NOT NULL,
    client_bssid VARCHAR(50),             -- BSSID router mà thiết bị đang bắt
    client_ssid VARCHAR(100),
    device_info TEXT,
    status VARCHAR(20) NOT NULL,          -- 'VALID', 'INVALID_WIFI', 'SPOOF_ATTEMPT'
    verification_note TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dữ Liệu Mẫu Khởi Tạo Cho Trụ Sở Chính
INSERT INTO offices (id, name, address) 
VALUES ('OFFICE-HQ', 'Trụ Sở Chính - Tòa Nhà Công Nghệ', 'Tầng 12, Tòa Nhà Innovation, TP.HCM')
ON CONFLICT (id) DO NOTHING;

INSERT INTO office_networks (id, office_id, ssid, bssid, allowed_subnet)
VALUES 
('NET-01', 'OFFICE-HQ', 'COMPANY_OFFICE_5G', 'a4:2b:b0:9c:88:12', '192.168.1.0/24'),
('NET-02', 'OFFICE-HQ', 'COMPANY_OFFICE_2.4G', 'a4:2b:b0:9c:88:13', '192.168.1.0/24')
ON CONFLICT (id) DO NOTHING;

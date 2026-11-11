-- CHÈN DỮ LIỆU VAI TRÒ MẶC ĐỊNH
INSERT INTO roles (id, role_code, role_name, permissions) VALUES
('a0000000-0000-0000-0000-000000000001', 'SUPER_ADMIN', 'Quản Trị Tối Cao', '["*"]'::jsonb),
('a0000000-0000-0000-0000-000000000002', 'STORE_MANAGER', 'Quản Lý Cửa Hàng', '["orders:read", "orders:write", "products:write"]'::jsonb),
('a0000000-0000-0000-0000-000000000003', 'CUSTOMER', 'Khách Hàng Mua Sắm', '["profile:read", "orders:create", "orders:read_self"]'::jsonb)
ON CONFLICT (role_code) DO NOTHING;

-- CHÈN TÀI KHOẢN ADMIN THỬ NGHIỆM (Mật khẩu: Admin@123456 băm bằng bcrypt)
INSERT INTO users (id, full_name, email, phone_number, password_hash, role_id) VALUES
('b0000000-0000-0000-0000-000000000001', 'Nguyễn Quản Trị', 'admin@system.local', '0900000001', '$2b$12$eX.7vj1.k1qB2gVqG2v.e.w8r7n5t0q.982h3b198a23019823019', 'a0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000002', 'Trần Khách Mẫu', 'customer@example.com', '0901234567', '$2b$12$eX.7vj1.k1qB2gVqG2v.e.w8r7n5t0q.982h3b198a23019823019', 'a0000000-0000-0000-0000-000000000003')
ON CONFLICT (phone_number) DO NOTHING;

-- CHÈN DANH MỤC SẢN PHẨM MẪU
INSERT INTO categories (id, name, slug) VALUES
('c0000000-0000-0000-0000-000000000001', 'Thiết Bị Điện Tử', 'thiet-bi-dien-tu'),
('c0000000-0000-0000-0000-000000000002', 'Phụ Kiện Công Nghệ', 'phu-kien-cong-nghe')
ON CONFLICT (slug) DO NOTHING;

-- CHÈN SẢN PHẨM THỬ NGHIỆM
INSERT INTO products (id, sku, name, slug, category_id, base_price, stock_quantity) VALUES
('d0000000-0000-0000-0000-000000000001', 'SKU-IP16-PRO', 'Điện thoại thông minh Flagship 2026', 'dien-thoai-thong-minh-flagship-2026', 'c0000000-0000-0000-0000-000000000001', 28990000.00, 50),
('d0000000-0000-0000-0000-000000000002', 'SKU-AP-PRO2', 'Tai nghe chống ồn không dây TWS', 'tai-nghe-chong-on-khong-day-tws', 'c0000000-0000-0000-0000-000000000002', 4990000.00, 100)
ON CONFLICT (sku) DO NOTHING;


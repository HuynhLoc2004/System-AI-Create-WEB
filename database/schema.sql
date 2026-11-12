-- Cơ sở dữ liệu dự án Sàn Bán Lẻ Đa Kênh & VietQR Động (RETAIL)
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  customer_name VARCHAR(128) NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  status VARCHAR(32) DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
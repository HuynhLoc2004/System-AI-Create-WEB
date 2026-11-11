/**
 * MOCK API SERVER CHO ĐỘI NGŨ FRONTEND
 * Giải quyết dứt điểm điểm nghẽn: "Frontend chờ API Backend"
 * Chạy trực tiếp bằng lệnh: node mock_api_server.js
 * Cổng: http://localhost:4000
 */

const http = require("http");

const PORT = 4000;

const products = [
  {
    id: "d0000000-0000-0000-0000-000000000001",
    sku: "SKU-IP16-PRO",
    name: "Điện thoại thông minh Flagship 2026",
    price: 28990000,
    stock: 50,
    category: "Thiết Bị Điện Tử",
  },
  {
    id: "d0000000-0000-0000-0000-000000000002",
    sku: "SKU-AP-PRO2",
    name: "Tai nghe chống ồn không dây TWS",
    price: 4990000,
    stock: 100,
    category: "Phụ Kiện Công Nghệ",
  },
];

const server = http.createServer((req, res) => {
  // CORS Headers cho phép Frontend Next.js / React kết nối từ localhost:3000
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. API Lấy danh sách sản phẩm
  if (req.url.startsWith("/api/v1/products") && req.method === "GET") {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        data: products,
        meta: { page: 1, limit: 20, totalItems: products.length },
      })
    );
    return;
  }

  // 2. API Đăng nhập OTP
  if (req.url === "/api/v1/auth/login" && req.method === "POST") {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        statusCode: 200,
        message: "Đăng nhập thành công!",
        accessToken: "mock-jwt-access-token-expires-in-15m",
        user: {
          id: "b0000000-0000-0000-0000-000000000002",
          fullName: "Trần Khách Mẫu",
          phone: "0901234567",
          role: "CUSTOMER",
        },
      })
    );
    return;
  }

  // 3. API Tạo đơn hàng Checkout
  if (req.url === "/api/v1/orders/checkout" && req.method === "POST") {
    res.writeHead(201);
    res.end(
      JSON.stringify({
        statusCode: 201,
        orderId: "ord_mock_123456",
        orderCode: "ORD-20261120-8888",
        totalAmount: 28990000,
        paymentStatus: "PENDING_PAYMENT",
        vietQrPayload: "00020101021238540010A000000727012600069704220112ORD88885204581253037045408289900005802VN62240820ORD-20261120-88886304C4E1",
        expiresInSeconds: 600,
      })
    );
    return;
  }

  // Tuyến đường mặc định 404
  res.writeHead(404);
  res.end(JSON.stringify({ statusCode: 404, error: "Not Found", message: "Mock Route không tồn tại." }));
});

server.listen(PORT, () => {
  console.log(`[MOCK API SERVER] Sẵn sàng phục vụ đội Frontend tại http://localhost:${PORT}`);
});


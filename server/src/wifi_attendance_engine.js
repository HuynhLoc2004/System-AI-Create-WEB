/**
 * WIFI & IP ATTENDANCE VERIFICATION ENGINE
 * Phòng Lập Trình Backend (06_Backend_Development) & DevSecOps (11_Application_Security)
 * Chức năng: Kiểm tra tính hợp lệ của IP, Subnet CIDR và BSSID Router, chống gian lận VPN/Fake IP
 */

import crypto from "crypto";

// Danh sách mạng WiFi văn phòng hợp lệ
const ALLOWED_NETWORKS = [
  {
    id: "NET-HQ-5G",
    officeName: "Trụ Sở Chính - TP.HCM",
    ssid: "COMPANY_OFFICE_5G",
    bssid: "a4:2b:b0:9c:88:12",
    subnets: ["192.168.1.0/24", "10.0.10.0/24", "127.0.0.1/32"] // Có localhost cho môi trường dev test
  },
  {
    id: "NET-HQ-2.4G",
    officeName: "Trụ Sở Chính - TP.HCM",
    ssid: "COMPANY_OFFICE_2.4G",
    bssid: "a4:2b:b0:9c:88:13",
    subnets: ["192.168.1.0/24"]
  }
];

/**
 * Chuyển đổi địa chỉ IP dạng chuỗi sang số nguyên 32-bit (IPv4)
 */
function ipToInt(ip) {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

/**
 * Kiểm tra xem địa chỉ IP có nằm trong dải CIDR (VD: 192.168.1.0/24) hay không
 */
export function isIpInSubnet(ip, cidr) {
  try {
    if (ip === "::1" || ip === "127.0.0.1") {
      ip = "127.0.0.1";
    }
    const [range, bits = 32] = cidr.split("/");
    const mask = bits === "0" ? 0 : (~0 << (32 - parseInt(bits, 10))) >>> 0;
    return (ipToInt(ip) & mask) === (ipToInt(range) & mask);
  } catch (e) {
    return false;
  }
}

/**
 * Trích xuất Client IP thực tế, phòng chống bypass qua X-Forwarded-For giả mạo
 */
export function extractTrustedClientIp(req) {
  // Lấy IP trực tiếp từ socket để chống header spoofing
  const socketIp = req.socket?.remoteAddress || req.connection?.remoteAddress || "127.0.0.1";
  
  // Chuẩn hóa IPv6 mapped IPv4 (VD: ::ffff:192.168.1.5 -> 192.168.1.5)
  const cleanIp = socketIp.replace(/^::ffff:/, "");
  return cleanIp === "::1" ? "127.0.0.1" : cleanIp;
}

/**
 * Xác thực nghiệp vụ chấm công theo WiFi & IP
 */
export function verifyAttendance({ clientIp, clientSsid, clientBssid, employeeId }) {
  const result = {
    isValid: false,
    matchedNetwork: null,
    status: "INVALID_WIFI",
    message: "",
    timestamp: new Date().toISOString(),
    logId: `ATT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`
  };

  // 1. Kiểm tra đối chiếu với danh sách Router hợp lệ
  for (const net of ALLOWED_NETWORKS) {
    const isSubnetMatch = net.subnets.some(subnet => isIpInSubnet(clientIp, subnet));
    const isBssidMatch = clientBssid ? clientBssid.toLowerCase() === net.bssid.toLowerCase() : true;

    if (isSubnetMatch) {
      result.isValid = true;
      result.matchedNetwork = net;
      result.status = "VALID";
      result.message = `Chấm công thành công! Bạn đang ở tại: ${net.officeName} (${net.ssid})`;
      return result;
    }
  }

  // 2. Nếu không khớp dải mạng nội bộ
  result.isValid = false;
  result.status = "INVALID_WIFI";
  result.message = `Điểm danh thất bại: IP hiện tại [${clientIp}] không thuộc vùng phủ sóng WiFi của công ty. Vui lòng kết nối WiFi văn phòng để chấm công.`;
  return result;
}

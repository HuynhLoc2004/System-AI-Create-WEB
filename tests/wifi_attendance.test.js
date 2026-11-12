/**
 * TEST SUITE: WIFI ATTENDANCE ENGINE
 * Phòng Đảm Bảo Chất Lượng (08_Quality_Assurance)
 */
import test from "node:test";
import assert from "node:assert";
import { isIpInSubnet, verifyAttendance } from "../server/src/wifi_attendance_engine.js";

test("Kiểm tra dải mạng Subnet CIDR (192.168.1.0/24)", () => {
  // IP cùng dải văn phòng
  assert.strictEqual(isIpInSubnet("192.168.1.45", "192.168.1.0/24"), true);
  assert.strictEqual(isIpInSubnet("192.168.1.254", "192.168.1.0/24"), true);

  // IP ở nhà hoặc quán cafe (khác dải)
  assert.strictEqual(isIpInSubnet("192.168.2.10", "192.168.1.0/24"), false);
  assert.strictEqual(isIpInSubnet("14.161.20.10", "192.168.1.0/24"), false);
});

test("Quy trình xác thực điểm danh nhân viên", () => {
  // Trường hợp 1: Nhân viên đang ở văn phòng (IP đúng)
  const validCheck = verifyAttendance({
    clientIp: "192.168.1.88",
    clientSsid: "COMPANY_OFFICE_5G",
    clientBssid: "a4:2b:b0:9c:88:12",
    employeeId: "EMP-001"
  });
  assert.strictEqual(validCheck.isValid, true);
  assert.strictEqual(validCheck.status, "VALID");

  // Trường hợp 2: Nhân viên bật 4G ở ngoài đường (IP lạ)
  const invalidCheck = verifyAttendance({
    clientIp: "171.244.50.12",
    clientSsid: "VIETTEL_4G",
    clientBssid: "00:00:00:00:00:00",
    employeeId: "EMP-001"
  });
  assert.strictEqual(invalidCheck.isValid, false);
  assert.strictEqual(invalidCheck.status, "INVALID_WIFI");
});

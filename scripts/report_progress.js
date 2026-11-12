/**
 * IDE-to-Web Dashboard Progress Bridge
 * Used by AI Agents / Developers inside VS Code to automatically update
 * the local Mission Control Dashboard (http://localhost:5000) in real time.
 * 
 * Usage:
 *   node scripts/report_progress.js --dept "05_Frontend" --task "Xây dựng CartDrawer" --file "src/components/CartDrawer.jsx" --status "DONE"
 */
import fs from "fs";
import path from "path";
import http from "http";

const args = process.argv.slice(2);
function getArg(flag, def = "") {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : def;
}

const dept = getArg("--dept", "05_Frontend");
const taskTitle = getArg("--task", "Cập nhật mã nguồn");
const fileTarget = getArg("--file", "");
const status = getArg("--status", "DONE").toUpperCase(); // DONE | IN_PROGRESS | BLOCKED
const note = getArg("--note", "");

const payload = JSON.stringify({
  dept,
  taskTitle,
  fileTarget,
  status,
  note
});

const req = http.request(
  {
    hostname: "localhost",
    port: 5000,
    path: "/api/ide/report-progress",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload)
    }
  },
  (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      try {
        const json = JSON.parse(data);
        if (json.success) {
          console.log(`[Dashboard Bridge] Đã đồng bộ tiến độ lên Web Dashboard: [${dept}] -> ${taskTitle} (${status})`);
        } else {
          console.warn(`[Dashboard Bridge Warning] ${json.error || data}`);
        }
      } catch (_) {
        console.log(`[Dashboard Bridge] Phản hồi máy chủ: ${data}`);
      }
    });
  }
);

req.on("error", (err) => {
  // If server is not running, log cleanly without throwing
  console.log(`[Dashboard Bridge Offline] Web server chưa mở hoặc đang bận (${err.message}). Code vẫn được lưu trực tiếp vào ổ đĩa.`);
});

req.write(payload);
req.end();


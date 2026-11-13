#!/usr/bin/env node

/**
 * IT-Assignment Enterprise Platform CLI
 * Run directly with: npx it-assignment-enterprise-platform [command]
 */

import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const command = args[0] || "start";

console.log("\n============================================================");
console.log("  🏢 IT-ASSIGNMENT 13 DEPARTMENTS ENTERPRISE PLATFORM");
console.log("  ⚡ Autonomous AI Vibe Coding & Real-time Command Center");
console.log("============================================================\n");

if (command === "help" || command === "--help" || command === "-h") {
  console.log("Cách sử dụng:");
  console.log("  npx it-assignment-enterprise-platform start     (Mặc định) Khởi chạy Đài Quan Sát Web tại http://localhost:5000");
  console.log("  npx it-assignment-enterprise-platform init      Cài đặt bộ kỹ năng 13 phòng ban vào dự án hiện tại");
  console.log("  npx it-assignment-enterprise-platform help      Hiển thị hướng dẫn này\n");
  process.exit(0);
}

if (command === "init") {
  console.log("📦 Đang sao chép bộ kỹ năng 13 phòng ban vào dự án hiện tại...");
  const targetDir = process.cwd();
  const deptFolders = [
    "01_Project_Management",
    "02_Business_Analysis",
    "03_Solution_Architecture_Cost",
    "04_UI_UX_Design",
    "05_Frontend_Development",
    "06_Backend_Development",
    "07_Database_Management",
    "08_Quality_Assurance",
    "09_DevOps_Infrastructure",
    "10_Product_Management_PO",
    "11_Application_Security_DevSecOps",
    "12_Release_Management_UAT",
    "13_Product_Analytics_PostLaunch"
  ];

  let copied = 0;
  for (const dept of deptFolders) {
    const srcPath = path.join(packageRoot, dept);
    const destPath = path.join(targetDir, dept);
    if (fs.existsSync(srcPath)) {
      fs.cpSync(srcPath, destPath, { recursive: true });
      copied++;
    }
  }

  // Copy scripts/report_progress.js
  const scriptSrc = path.join(packageRoot, "scripts", "report_progress.js");
  const scriptDest = path.join(targetDir, "scripts", "report_progress.js");
  if (fs.existsSync(scriptSrc)) {
    fs.mkdirSync(path.join(targetDir, "scripts"), { recursive: true });
    fs.copyFileSync(scriptSrc, scriptDest);
  }

  console.log(`✅ Đã cài đặt thành công ${copied}/13 phòng ban vào: ${targetDir}`);
  console.log("👉 Bây giờ bạn có thể chat với AI trong IDE để tự động phối hợp theo 13 phòng ban!\n");
  process.exit(0);
}

if (command === "start" || command === "serve") {
  const workspaceRoot = process.cwd();
  const localDbDir = path.join(workspaceRoot, ".it-assignment");
  if (!fs.existsSync(localDbDir)) {
    fs.mkdirSync(localDbDir, { recursive: true });
  }
  const dbFile = path.join(localDbDir, "project.db.json");
  const serverScript = path.join(packageRoot, "server", "src", "server.js");
  console.log(`🚀 Đang khởi động Web Dashboard & Backend tại: http://localhost:5000 ...`);
  console.log(`📂 Thư mục làm việc dự án: ${workspaceRoot}`);
  console.log(`💾 CSDL Cục bộ dự án: ${dbFile}\n`);

  const child = spawn(process.execPath, [serverScript], {
    cwd: packageRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      LOCAL_WORKSPACE_ROOT: workspaceRoot,
      DB_FILE: dbFile,
      PORT: process.env.PORT || "5000"
    }
  });

  child.on("error", (err) => {
    console.error(`❌ Lỗi khởi chạy máy chủ: ${err.message}`);
    process.exit(1);
  });

  child.on("exit", (code) => {
    process.exit(code || 0);
  });
}


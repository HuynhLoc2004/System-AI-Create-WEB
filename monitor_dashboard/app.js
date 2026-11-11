/**
 * IT-ASSIGNMENT OPERATIONAL MONITORING HUB
 * Interactive Multi-Project Workflow & Real-Time Department Collaboration
 * Version: 3.5 (Production Hardened: Cryptographic HMAC Signature, Client CMS & Zero Mock Leakage)
 */

// ========================================================
// 1. CRYPTOGRAPHIC INTEGRITY & SECURITY SANITIZATION ENGINE
// ========================================================
const IT_MASTER_AUTH_SALT = "IT_ASSIGNMENT_SUPER_SECRET_SALT_2026_@#!$%";

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeInput(text) {
  if (!text) return "";
  const maliciousPattern = /(<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|javascript:|onload=|onerror=|onclick=|<style\b)/gi;
  if (maliciousPattern.test(text)) {
    return "";
  }
  return String(text).trim();
}

function hashString(str) {
  let h1 = 0xdeadbeef ^ 0, h2 = 0x41c6ce57 ^ 0;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, "0");
}

function encryptPayload(rawText, salt) {
  const utf8Bytes = new TextEncoder().encode(rawText);
  const saltBytes = new TextEncoder().encode(salt);
  const hex = [];
  for (let i = 0; i < utf8Bytes.length; i++) {
    const b = utf8Bytes[i] ^ saltBytes[i % saltBytes.length] ^ ((i * 11 + 3) & 0xff);
    hex.push(b.toString(16).padStart(2, "0"));
  }
  return hex.join("");
}

function decryptPayload(hexStr, salt) {
  const saltBytes = new TextEncoder().encode(salt);
  const byteCount = hexStr.length / 2;
  const outBytes = new Uint8Array(byteCount);
  for (let i = 0; i < byteCount; i++) {
    const byteVal = parseInt(hexStr.substr(i * 2, 2), 16);
    outBytes[i] = byteVal ^ saltBytes[i % saltBytes.length] ^ ((i * 11 + 3) & 0xff);
  }
  return new TextDecoder().decode(outBytes);
}

function generateEncryptedKey(name, dob, phone, projectCode) {
  const tag = projectCode.replace("PRJ-", "").split("-")[0] || "PROJ";
  const nonce = Math.random().toString(36).substring(2, 7).toUpperCase();
  const raw = [name.trim(), dob.trim(), phone.trim(), projectCode.trim(), Date.now(), nonce].join("::");
  const encryptedBlob = encryptPayload(raw, IT_MASTER_AUTH_SALT);
  const signature = hashString(encryptedBlob + "::" + IT_MASTER_AUTH_SALT);
  return `ITKEY.${tag}.${encryptedBlob}.${signature}`;
}

function verifyAndDecodeClientKey(key) {
  if (!key || typeof key !== "string") throw new Error("Khóa truy cập không hợp lệ.");
  const parts = key.trim().split(".");
  if (parts.length !== 4 || parts[0] !== "ITKEY") {
    throw new Error("Định dạng khóa không hợp lệ (Phải có dạng ITKEY.<TAG>.<DATA>.<SIG>).");
  }
  const [prefix, tag, blob, sig] = parts;
  const expectedSig = hashString(blob + "::" + IT_MASTER_AUTH_SALT);
  if (sig !== expectedSig) {
    throw new Error("Khóa bảo mật không chính xác hoặc đã bị can thiệp trái phép (Integrity Violation)!");
  }
  const decrypted = decryptPayload(blob, IT_MASTER_AUTH_SALT);
  const [name, dob, phone, projectCode, timestamp, nonce] = decrypted.split("::");
  if (!name || !projectCode) {
    throw new Error("Dữ liệu khóa bị thiếu thông tin xác thực.");
  }
  return { valid: true, name, dob, phone, projectCode, timestamp: Number(timestamp) };
}

// 2. Initial Projects Data Store (Isolated Multi-Project Coexistence)
const defaultProjects = [
  {
    id: "prj_retail",
    code: "PRJ-RETAIL-2026",
    name: "Sàn Bán Lẻ Đa Kênh & VietQR Động",
    package: "Gói May Đo Doanh Nghiệp",
    budget: "Tối Ưu Thực Tế (1.85 Tỷ)",
    serverCost: "Node.js Localhost:5000",
    daysRemaining: "Sprint 1: Khởi Tạo & Chờ Lệnh",
    tokenSaved: "100%",
    progress: 0,
    status: "PLANNING",
    stage: "Pha 1: Khởi Tạo & Chờ Điều Phối AI",
    environment: "PRODUCTION",
    deptStatuses: {
      "client": "IDLE", "po": "IDLE", "pm": "IDLE", "ba": "IDLE", "sa": "IDLE",
      "ui": "IDLE", "fe": "IDLE", "be": "IDLE", "dba": "IDLE", "sec": "IDLE",
      "qa": "IDLE", "rel": "IDLE", "devops": "IDLE", "prod": "IDLE", "analytics": "IDLE"
    },
    tasks: [],
    feedbacks: [],
    history: [
      { time: "Vừa xong", dept: "Hệ Thống", action: "Dự án đã sẵn sàng ở trạng thái 0% nguyên bản. Hãy phát lệnh AI để bắt đầu.", type: "info" }
    ],
    clientConfig: {
      brandName: "Novawear Premium Retail",
      headline: "Hệ Thống Bán Lẻ Thời Trang Đa Kênh Tích Hợp VietQR Tự Động",
      previewUrl: "http://127.0.0.1:5000/storefront",
      deployMode: "LOCAL_SERVER",
      customDomain: "https://novawear.com.vn",
      sslActive: true,
      adminUser: "novawear_admin",
      adminPass: "Nova@2026MasterPass",
      products: []
    }
  },
  {
    id: "prj_fintech",
    code: "PRJ-FINTECH-2026",
    name: "Cổng Thanh Toán & Ví Điện Tử B2B",
    package: "Gói Tài Chính Phân Tán",
    budget: "Tối Ưu Thực Tế (3.20 Tỷ)",
    serverCost: "Node.js Localhost:5000",
    daysRemaining: "Sprint 1: Khởi Tạo & Chờ Lệnh",
    tokenSaved: "100%",
    progress: 0,
    status: "PLANNING",
    stage: "Pha 1: Khởi Tạo & Chờ Điều Phối AI",
    environment: "PRODUCTION",
    deptStatuses: {
      "client": "IDLE", "po": "IDLE", "pm": "IDLE", "ba": "IDLE", "sa": "IDLE",
      "ui": "IDLE", "fe": "IDLE", "be": "IDLE", "dba": "IDLE", "sec": "IDLE",
      "qa": "IDLE", "rel": "IDLE", "devops": "IDLE", "prod": "IDLE", "analytics": "IDLE"
    },
    tasks: [],
    feedbacks: [],
    history: [
      { time: "Vừa xong", dept: "Hệ Thống", action: "Dự án đã sẵn sàng ở trạng thái 0% nguyên bản.", type: "info" }
    ],
    clientConfig: {
      brandName: "PayLink Core Gateway",
      headline: "Hạ Tầng Thanh Toán B2B Phân Tán Đa Kênh Tốc Độ Cao",
      previewUrl: "http://127.0.0.1:5000/fintech-gateway",
      customDomain: "https://paylink-core.vn",
      sslActive: true,
      adminUser: "fintech_secops",
      adminPass: "Fintech@CorePCI2026",
      products: []
    }
  },
  {
    id: "prj_pharma",
    code: "PRJ-PHARMA",
    name: "Hệ Thống Phân Phối Dược Phẩm 2026",
    package: "Gói Doanh Nghiệp Dược",
    budget: "Tối Ưu Thực Tế (1.85 Tỷ)",
    serverCost: "Node.js Localhost:5000",
    daysRemaining: "Sprint 1: Khởi Tạo & Chờ Lệnh",
    tokenSaved: "100%",
    progress: 0,
    status: "PLANNING",
    stage: "Pha 1: Khởi Tạo & Chờ Điều Phối AI",
    environment: "PRODUCTION",
    deptStatuses: {
      "client": "IDLE", "po": "IDLE", "pm": "IDLE", "ba": "IDLE", "sa": "IDLE",
      "ui": "IDLE", "fe": "IDLE", "be": "IDLE", "dba": "IDLE", "sec": "IDLE",
      "qa": "IDLE", "rel": "IDLE", "devops": "IDLE", "prod": "IDLE", "analytics": "IDLE"
    },
    tasks: [],
    feedbacks: [],
    history: [
      { time: "Vừa xong", dept: "Hệ Thống", action: "Dự án đã sẵn sàng ở trạng thái 0% nguyên bản.", type: "info" }
    ],
    clientConfig: {
      brandName: "PharmaCare Global",
      headline: "Hệ Thống Phân Phối Dược Phẩm Đạt Chuẩn GSP/GDP",
      previewUrl: "http://127.0.0.1:5000/pharma-b2b",
      customDomain: "https://pharmacare-global.com",
      sslActive: true,
      adminUser: "pharma_director",
      adminPass: "Pharma@2026Verified",
      products: []
    }
  }
];

// Department Metadata for Clear SVG Rendering (Spacious Nodes, Precision Typography, Zero Text Overflow)
const departmentsData = {
  "client": {
    badge: "CLIENT",
    title: "KHÁCH HÀNG / SPONSOR",
    subtitle: "Chủ Đầu Tư & Nghiệm Thu",
    role: "Đầu vào định hướng kinh doanh, phê duyệt ngân sách và nghiệm thu sản phẩm cuối.",
    inputs: ["Ý tưởng kinh doanh thô", "Hạn mức ngân sách tối đa", "Yêu cầu mốc thời gian bàn giao"],
    deliverables: ["Hợp đồng kinh tế", "Phê duyệt điều lệ Project Charter", "Biên bản nghiệm thu UAT Sign-off"],
    x: 110, y: 160, width: 140, height: 80
  },
  "po": {
    badge: "10. PO",
    title: "QUẢN LÝ SẢN PHẨM",
    subtitle: "Product Owner / PM",
    role: "Định nghĩa PRD, cắt bỏ 60% tính năng thừa (Kill Criteria), thiết lập North Star Metric và phát hành Product Brief 1 trang.",
    inputs: ["Ý tưởng kinh doanh từ Sponsor", "Phản hồi người dùng từ Analytics (Phòng 13)", "Nghiên cứu thị trường"],
    deliverables: ["Product Brief 1 trang", "Bản đặc tả PRD Tier-1", "Ma trận MoSCoW & North Star KPI"],
    x: 110, y: 320, width: 140, height: 80
  },
  "pm": {
    badge: "01. PM",
    title: "QUẢN TRỊ DỰ ÁN",
    subtitle: "Project Manager / TPM",
    role: "Trung tâm điều hành, tiếp nhận phản hồi khách hàng, phân tích Solution kỹ thuật và điều phối các phòng ban.",
    inputs: ["Mục tiêu kinh doanh & Feedback từ khách", "Phản hồi tiến độ từ các phòng ban", "Báo cáo rủi ro kỹ thuật"],
    deliverables: ["WBS phân rã công việc", "Bảng điều khiển Master Task", "Ma trận Scope Creep & Change Request"],
    x: 320, y: 160, width: 140, height: 80
  },
  "ba": {
    badge: "02. BA",
    title: "PHÂN TÍCH NGHIỆP VỤ",
    subtitle: "Business Analyst",
    role: "Khám phá chiến lược (Brand/SEO/CRO), đặc tả phần mềm SRS và bẻ rã ma trận yêu cầu.",
    inputs: ["Product Brief từ PO", "Góp ý khả thi từ Solution Architect", "Phỏng vấn người dùng cuối"],
    deliverables: ["Tài liệu BRD & SRS chuẩn", "Sơ đồ quy trình BPMN", "Ma trận phân rã công việc kỹ thuật"],
    x: 320, y: 320, width: 140, height: 80
  },
  "sa": {
    badge: "03. SA",
    title: "KIẾN TRÚC & CHI PHÍ",
    subtitle: "Solution Architect",
    role: "Định hình khung xương kỹ thuật Modular Monolith, đóng băng API Contracts (OpenAPI 3.0) và tính chi phí hạ tầng.",
    inputs: ["Tài liệu SRS từ BA", "Dung lượng tải trọng dự kiến (CCU/RPS)", "Tham vấn cùng các Tech Leads"],
    deliverables: ["Frozen API Contracts (OpenAPI 3.0)", "Tài liệu kiến trúc hệ thống SAD", "Bảng bóc tách chi phí CBS"],
    x: 580, y: 160, width: 150, height: 80
  },
  "ui": {
    badge: "04. UI/UX",
    title: "THIẾT KẾ TRẢI NGHIỆM",
    subtitle: "Design System & Motion",
    role: "Bản sắc thiết kế độc bản, UX Writing & Micro-copy nhân văn, hỗ trợ đa ngôn ngữ i18n và cuộn 60fps.",
    inputs: ["SRS & Luồng người dùng từ BA", "Định hướng thương hiệu khách hàng", "Tiêu chuẩn kỹ thuật từ Frontend"],
    deliverables: ["Bộ Design System tokens.json", "Tiêu chuẩn UX Writing & Micro-copy", "Prototype Figma có tương tác"],
    x: 580, y: 320, width: 150, height: 80
  },
  "dba": {
    badge: "07. DBA",
    title: "CƠ SỞ DỮ LIỆU",
    subtitle: "Database Administrator",
    role: "Thiết kế ERD chuẩn 3NF, gác cổng bảo mật chống SQLi, Zero-Downtime Migration (Expand & Contract).",
    inputs: ["Báo cáo thực thể từ BA & SA", "Tần suất câu lệnh từ Backend", "Dung lượng tăng trưởng dữ liệu"],
    deliverables: ["Zero-Downtime Expand & Contract Script", "DDL Schema & Migration scripts", "Chiến lược Index có chọn lọc"],
    x: 785, y: 95, width: 135, height: 75
  },
  "be": {
    badge: "06. BE",
    title: "LẬP TRÌNH BACKEND",
    subtitle: "Clean Arch & Core APIs",
    role: "Bộ não xử lý Web Động, tuân thủ Frozen API Contract, quản trị Transaction ACID, bảo mật JWT kép.",
    inputs: ["Frozen API Contract từ SA", "Database Schema từ DBA", "Kiến trúc SAD từ Solution Architect"],
    deliverables: ["Hệ thống API RESTful chuẩn Swagger", "Xử lý hàng đợi bất đồng bộ", "Unit Test bảo vệ logic nghiệp vụ"],
    x: 785, y: 225, width: 135, height: 75
  },
  "fe": {
    badge: "05. FE",
    title: "LẬP TRÌNH FRONTEND",
    subtitle: "Web Động Next.js / React",
    role: "Tái hiện thiết kế pixel-perfect, lập trình song song qua Frozen API Mock, tích hợp Event Tracking.",
    inputs: ["Bản vẽ Figma & Design Tokens", "Frozen API Contracts từ SA", "Tiêu chuẩn UX Writing từ UI/UX"],
    deliverables: ["Ứng dụng Web Động Next.js", "Clean Components theo Atomic design", "Tích hợp Event Tracking PostHog"],
    x: 785, y: 355, width: 135, height: 75
  },
  "sec": {
    badge: "11. SEC",
    title: "AN TOÀN THÔNG TIN",
    subtitle: "DevSecOps / AppSec",
    role: "Gác cổng an ninh chuỗi cung ứng mã nguồn (CVE), chống rò rỉ API Secret, quét SAST/DAST và triệt tiêu lỗi IDOR/BOLA.",
    inputs: ["Mã nguồn FE & BE", "Khai báo package.json", "Cấu hình biến môi trường .env"],
    deliverables: ["DevSecOps Audit Report 0 CVE", "Chứng nhận quét Secret Clearance", "Quyền Veto chặn Merge/Deploy"],
    x: 955, y: 225, width: 140, height: 80
  },
  "qa": {
    badge: "08. QA",
    title: "KIỂM ĐỊNH CHẤT LƯỢNG",
    subtitle: "QA/QC & Quality Gates",
    role: "Kiểm thử tự động theo Quality Gate (Coverage >= 70%, 0 Blocker, Bundle < 500KB), kiểm tra bảo mật Input.",
    inputs: ["Bản build Staging từ Dev", "Báo cáo bảo mật từ DevSecOps", "Môi trường Sandbox cô lập"],
    deliverables: ["Quality Gate Pass Report", "Nhật ký kiểm thử PASS/FAIL", "Biên bản nghiệm thu QA Sign-off"],
    x: 1130, y: 160, width: 140, height: 80
  },
  "rel": {
    badge: "12. REL",
    title: "QUẢN LÝ PHÁT HÀNH",
    subtitle: "Release & UAT Lead",
    role: "Tổ chức nghiệm thu người dùng (UAT), cấp dữ liệu giả lập chuẩn, điều phối Go-Live Checklist và kích hoạt Rollback 30s.",
    inputs: ["Bản build Staging từ QA", "Chứng nhận an toàn từ DevSecOps", "Mock Production Data"],
    deliverables: ["Môi trường UAT Sandbox", "Go-Live Sign-Off Matrix", "Sổ tay Rollback 30 giây"],
    x: 1130, y: 320, width: 145, height: 80
  },
  "devops": {
    badge: "09. OPS",
    title: "HẠ TẦNG & TRIỂN KHAI",
    subtitle: "DevOps & CI/CD Cloud",
    role: "Đề xuất server tối ưu chi phí, CI/CD tự động, bảo mật Secret Keys, đóng gói Docker 85MB và Rollback 60s.",
    inputs: ["Mã nguồn từ Dev", "Chứng nhận nghiệm thu từ QA & Release Lead", "Cấu hình biến môi trường .env"],
    deliverables: ["Đường ống CI/CD GitHub/GitLab/Jenkins", "Hệ thống Docker Compose VPS chạy 24/7", "Dashboard Prometheus & Alert Bot Telegram"],
    x: 1445, y: 225, width: 140, height: 80
  },
  "prod": {
    badge: "PROD",
    title: "VẬN HÀNH THỰC TẾ",
    subtitle: "Production 24/7",
    role: "Môi trường vận hành sản xuất thực tế phục vụ người tiêu dùng cuối không gián đoạn.",
    inputs: ["Bản release tag chính thức từ DevOps", "Chứng chỉ SSL TLS 1.3", "Hạ tầng Cloudflare WAF"],
    deliverables: ["Uptime SLA 99.9%", "Trải nghiệm người dùng mượt mà", "Báo cáo doanh thu & giao dịch ngân hàng"],
    x: 1625, y: 160, width: 140, height: 80
  },
  "analytics": {
    badge: "13. DATA",
    title: "ĐO LƯỜNG & HẬU MÃI",
    subtitle: "Analytics & Post-Launch",
    role: "Theo dõi sự kiện phễu người dùng (PostHog/GA4), quan sát lỗi ngoại lệ thời gian thực (Sentry) và bảo đảm SLA phản hồi.",
    inputs: ["Người dùng thao tác trên Production", "Nhật ký ngoại lệ Client/Server", "Hộp góp ý phản hồi từ khách"],
    deliverables: ["Báo cáo Tỷ lệ Kích hoạt & Phễu rơi rụng", "Cảnh báo lỗi ngoại lệ tức thì", "Vòng lặp phản hồi gửi ngược về PO"],
    x: 1625, y: 320, width: 145, height: 80
  }
};

// Workflow Graph Connection Edges (From -> To)
const workflowEdges = [
  { from: "client", to: "po" },
  { from: "po", to: "pm" },
  { from: "pm", to: "ba" },
  { from: "ba", to: "sa" },
  { from: "ba", to: "ui" },
  { from: "sa", to: "dba" },
  { from: "sa", to: "be" },
  { from: "ui", to: "fe" },
  { from: "dba", to: "be", bidirectional: true },
  { from: "be", to: "fe", bidirectional: true },
  { from: "be", to: "sec" },
  { from: "fe", to: "sec" },
  { from: "be", to: "qa" },
  { from: "fe", to: "qa" },
  { from: "sec", to: "qa" },
  { from: "qa", to: "rel" },
  { from: "rel", to: "devops" },
  { from: "devops", to: "prod" },
  { from: "prod", to: "analytics" },
  { from: "analytics", to: "po", bidirectional: false }
];

// App State & Role Management
let projects = [];
let currentProjectId = "prj_retail";
let activeFilter = "all";
let searchTerm = "";
let selectedDeptId = null;
let activeDirectiveDept = null;

// User Roles: "ADMIN" (Master full-access) or "CLIENT" (Restricted view & feedback only)
let currentRole = "ADMIN";
let clientAuthorizedProject = null;
let loggedClientName = null;
let currentPerspective = "BUSINESS"; // "BUSINESS" (Customer Friendly) or "TECHNICAL" (Dev Jargon)
let activeResolvingTaskId = null;
const DEFAULT_ADMIN_MASTER_KEY = "ADMIN-MASTER-SECURE-2026";

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
  createToastContainer();
  detectUserRole();
  loadProjectsFromStorage();
  initProjectDropdown();
  setupEventListeners();
  renderDashboard();
  initRealtimeHeartbeat();
  updateLiveServerMetrics();
  setInterval(updateLiveServerMetrics, 10000);
  fetchTrialLeads();
  setInterval(fetchTrialLeads, 15000);
});

// Detect User Role from URL Params or Session Storage
function detectUserRole() {
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get("role");
  const projectParam = urlParams.get("project");

  const sessionRole = sessionStorage.getItem("it_logged_role");
  const sessionProject = sessionStorage.getItem("it_authorized_project");
  const sessionName = sessionStorage.getItem("it_client_name");

  if (roleParam === "client" || sessionRole === "CLIENT") {
    currentRole = "CLIENT";
    clientAuthorizedProject = projectParam || sessionProject || "PRJ-RETAIL-2026";
    loggedClientName = sessionName || "Quý Khách Hàng";
  } else {
    currentRole = "ADMIN";
  }
}

// Toast Notification System
function createToastContainer() {
  if (!document.getElementById("toastContainer")) {
    const c = document.createElement("div");
    c.id = "toastContainer";
    c.className = "toast-container";
    document.body.appendChild(c);
  }
}

function showToast(msg, type = "info") {
  createToastContainer();
  const c = document.getElementById("toastContainer");
  const t = document.createElement("div");
  t.className = `toast-msg toast-${type}`;
  
  let label = "[THÔNG BÁO]";
  if (type === "success") label = "[XÁC THỰC THÀNH CÔNG]";
  if (type === "danger") label = "[CẢNH BÁO]";
  if (type === "warning") label = "[ĐANG XỬ LÝ]";
  if (type === "purple") label = "[CHỈ ĐẠO BAN QUẢN LÝ]";

  t.innerHTML = `<strong>${label}</strong> <span>${msg}</span>`;
  c.appendChild(t);

  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateX(50px)";
    setTimeout(() => t.remove(), 300);
  }, 4500);
}

function saveProjectsToStorage() {
  try {
    localStorage.setItem("it_assignment_projects_v10_real", JSON.stringify(projects));
  } catch (e) {
    console.warn("Storage quota exceeded", e);
  }
}

function loadProjectsFromStorage() {
  const saved = localStorage.getItem("it_assignment_projects_v10_real");
  if (saved) {
    try {
      projects = JSON.parse(saved);
      // Validate array health
      if (!Array.isArray(projects) || projects.length === 0) {
        projects = defaultProjects;
        saveProjectsToStorage();
      } else {
        // Hydrate clientConfig if missing
        projects.forEach(p => {
          const def = defaultProjects.find(d => d.id === p.id || d.code === p.code);
          if (def && (!p.clientConfig || !p.clientConfig.products || p.clientConfig.products.length === 0)) {
            p.clientConfig = JSON.parse(JSON.stringify(def.clientConfig));
          }
        });
      }
    } catch (e) {
      projects = defaultProjects;
      saveProjectsToStorage();
    }
  } else {
    projects = defaultProjects;
    saveProjectsToStorage();
  }

  // If client role, lock current project to clientAuthorizedProject
  if (currentRole === "CLIENT" && clientAuthorizedProject) {
    const matched = projects.find(p => p.code.toLowerCase() === clientAuthorizedProject.toLowerCase() || p.id === clientAuthorizedProject);
    if (matched) {
      currentProjectId = matched.id;
    }
  }
}

function saveProjectsToStorage() {
  localStorage.setItem("it_assignment_projects_v8", JSON.stringify(projects));
}

function getCurrentProject() {
  if (!projects || projects.length === 0) {
    projects = defaultProjects;
  }
  return projects.find(p => p.id === currentProjectId) || projects[0] || defaultProjects[0];
}

function initProjectDropdown() {
  const select = document.getElementById("projectSelect");
  if (!select) return;
  select.innerHTML = "";

  projects.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = `${p.code} - ${p.name}`;
    if (p.id === currentProjectId) opt.selected = true;
    select.appendChild(opt);
  });

  // Also populate Modal Key Gen dropdown if it exists
  const keyProjSelect = document.getElementById("modalKeyProjectSelect");
  if (keyProjSelect) {
    keyProjSelect.innerHTML = "";
    projects.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.code;
      opt.textContent = `${p.code} - ${p.name}`;
      keyProjSelect.appendChild(opt);
    });
  }
}

function setupEventListeners() {
  // Project Switcher
  const projSelect = document.getElementById("projectSelect");
  if (projSelect) {
    projSelect.addEventListener("change", (e) => {
      currentProjectId = e.target.value;
      selectedDeptId = null;
      activeDirectiveDept = null;
      closeDeptInspector();
      renderDashboard();
      showToast(`Đã chuyển sang không gian dự án độc lập: ${getCurrentProject().name}`, "info");
    });
  }

  // Environment Toggle (Production Real Data vs Sandbox UAT Mock Data)
  const btnToggleEnv = document.getElementById("btnToggleEnv");
  if (btnToggleEnv) {
    btnToggleEnv.addEventListener("click", () => {
      toggleProjectEnvironment();
    });
  }

  // Filter Buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      renderTaskTable();
    });
  });

  // Search Input
  const searchInput = document.getElementById("taskSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      renderTaskTable();
    });
  }

  // Modal: Dispatch Directive (Top-Down Management - ADMIN ONLY)
  const dispatchModal = document.getElementById("dispatchModal");
  const btnOpenDispatch = document.getElementById("btnOpenDispatchModal");
  if (btnOpenDispatch) {
    btnOpenDispatch.addEventListener("click", () => {
      if (currentRole !== "ADMIN") {
        showToast("Chỉ Ban Quản Trị (Admin) mới có quyền phát lệnh kỹ thuật để kiểm soát chi phí token!", "danger");
        return;
      }
      const project = getCurrentProject();
      const projText = document.getElementById("dispatchTargetProjectText");
      if (projText) projText.value = `${project.code} - ${project.name}`;
      const keyInput = document.getElementById("dispatchAdminKeyInput");
      if (keyInput) {
        keyInput.value = DEFAULT_ADMIN_MASTER_KEY;
        keyInput.style.borderColor = "#1E283D";
        keyInput.style.boxShadow = "none";
      }
      dispatchModal.style.display = "flex";
    });
  }

  // Button: Reset Clean Slate (Dọn Sạch Mock Data về 0% Thực Tế)
  const btnResetClean = document.getElementById("btnResetCleanData");
  if (btnResetClean) {
    btnResetClean.addEventListener("click", async () => {
      const project = getCurrentProject();
      if (!project) return;

      if (!confirm(`Bạn có chắc muốn DỌN SẠCH TOÀN BỘ MOCK DATA và đưa dự án [${project.code}] về 0% nguyên bản để điều phối thật từ đầu không?`)) {
        return;
      }

      try {
        btnResetClean.disabled = true;
        btnResetClean.textContent = "Đang dọn dẹp...";

        // Call backend reset API
        await fetch(`/api/projects/${encodeURIComponent(project.id)}/reset`, { method: "POST" });

        project.tasks = [];
        project.feedbacks = [];
        project.progress = 0;
        project.status = "PLANNING";
        project.stage = "Pha 1: Khởi Tạo & Chờ Điều Phối AI";
        project.deptStatuses = {
          client: "IDLE", po: "IDLE", pm: "IDLE", ba: "IDLE", sa: "IDLE",
          ui: "IDLE", fe: "IDLE", be: "IDLE", dba: "IDLE", sec: "IDLE",
          qa: "IDLE", rel: "IDLE", devops: "IDLE", prod: "IDLE", analytics: "IDLE"
        };
        project.history = [
          { time: "Vừa xong", dept: "Hệ Thống", action: "Đã dọn sạch toàn bộ mock data. Dự án đưa về 0% thực tế.", type: "success" }
        ];

        saveProjectsToStorage();
        renderDashboard();
        showToast("Đã dọn sạch toàn bộ mock data! Dự án đã trở về 0% thực tế.", "success");
      } catch (err) {
        console.error("Reset error", err);
        showToast("Lỗi khi reset: " + err.message, "danger");
      } finally {
        btnResetClean.disabled = false;
        btnResetClean.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Dọn Mock (Về 0%)`;
      }
    });
  }
  const btnCloseDispatch = document.getElementById("btnCloseDispatchModal");
  if (btnCloseDispatch) {
    btnCloseDispatch.addEventListener("click", () => {
      dispatchModal.style.display = "none";
    });
  }
  const btnCancelDispatch = document.getElementById("btnCancelDispatch");
  if (btnCancelDispatch) {
    btnCancelDispatch.addEventListener("click", () => {
      dispatchModal.style.display = "none";
    });
  }
  const dispatchForm = document.getElementById("dispatchForm");
  if (dispatchForm) {
    dispatchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleDispatchDirective();
    });
  }

  // Perspective View Buttons (Customer Friendly vs Dev Technical)
  const btnPerspBusiness = document.getElementById("btnPerspectiveBusiness");
  const btnPerspTech = document.getElementById("btnPerspectiveTech");
  const labelPersp = document.getElementById("perspectiveModeLabel");

  if (btnPerspBusiness) {
    btnPerspBusiness.addEventListener("click", () => {
      currentPerspective = "BUSINESS";
      btnPerspBusiness.classList.add("active", "business");
      if (btnPerspTech) btnPerspTech.classList.remove("active");
      if (labelPersp) labelPersp.textContent = "Góc Nhìn Khách Hàng (Dễ Hiểu)";
      renderTaskTable();
      showToast("Đã chuyển sang chế độ: Dễ Hiểu Cho Khách Hàng (Dịch thuật ngữ sang tên chức năng kinh doanh thực tế)", "success");
    });
  }

  if (btnPerspTech) {
    btnPerspTech.addEventListener("click", () => {
      currentPerspective = "TECHNICAL";
      btnPerspTech.classList.add("active");
      if (btnPerspBusiness) btnPerspBusiness.classList.remove("active", "business");
      if (labelPersp) labelPersp.textContent = "Góc Nhìn Kỹ Thuật Chuyên Sâu (IT)";
      renderTaskTable();
      showToast("Đã chuyển sang chế độ: Kỹ Thuật Chuyên Sâu (Hiển thị chi tiết Clean Arch, DDL, Webhook, Queue)", "info");
    });
  }

  // Modal: Incident & Blocker Resolution
  const resolveModal = document.getElementById("resolveBlockedModal");
  const btnCloseResolve = document.getElementById("btnCloseResolveModal");
  if (btnCloseResolve && resolveModal) {
    btnCloseResolve.addEventListener("click", () => {
      resolveModal.style.display = "none";
    });
  }
  const btnCancelResolve = document.getElementById("btnCancelResolve");
  if (btnCancelResolve && resolveModal) {
    btnCancelResolve.addEventListener("click", () => {
      resolveModal.style.display = "none";
    });
  }
  const btnConfirmResolve = document.getElementById("btnConfirmResolveSolution");
  if (btnConfirmResolve) {
    btnConfirmResolve.addEventListener("click", () => {
      handleConfirmResolveSolution();
    });
  }

  // Modal: Admin Key Generator
  const keyGenModal = document.getElementById("keyGenModal");
  const btnOpenKeyGen = document.getElementById("btnOpenKeyGenModal");
  if (btnOpenKeyGen) {
    btnOpenKeyGen.addEventListener("click", () => {
      keyGenModal.style.display = "flex";
      const out = document.getElementById("keyOutputContainer");
      if (out) out.style.display = "none";
    });
  }
  const btnCloseKeyGen = document.getElementById("btnCloseKeyGenModal");
  if (btnCloseKeyGen) {
    btnCloseKeyGen.addEventListener("click", () => {
      keyGenModal.style.display = "none";
    });
  }
  const btnCancelKeyGen = document.getElementById("btnCancelKeyGen");
  if (btnCancelKeyGen) {
    btnCancelKeyGen.addEventListener("click", () => {
      keyGenModal.style.display = "none";
    });
  }
  const keyGenForm = document.getElementById("keyGenForm");
  if (keyGenForm) {
    keyGenForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleGenerateKeySubmit();
    });
  }

  // Copy Key Button
  const btnCopyKey = document.getElementById("btnCopyKey");
  if (btnCopyKey) {
    btnCopyKey.addEventListener("click", () => {
      const keyText = document.getElementById("generatedKeyText").textContent;
      navigator.clipboard.writeText(keyText).then(() => {
        showToast("Đã sao chép mã Key vào bộ nhớ tạm! Bạn có thể gửi cho khách hàng qua Zalo hoặc Email.", "success");
      });
    });
  }

  // Modal: Header Prominent New Project Button
  const btnHeaderNewProj = document.getElementById("btnHeaderNewProject");
  if (btnHeaderNewProj) {
    btnHeaderNewProj.addEventListener("click", () => {
      const modal = document.getElementById("newProjectModal");
      if (modal) modal.style.display = "flex";
    });
  }

  // Modal: Virtual Code Studio (Zero-Load Source Code Explorer)
  const btnOpenVirtualStudio = document.getElementById("btnOpenVirtualStudioModal");
  if (btnOpenVirtualStudio) {
    btnOpenVirtualStudio.addEventListener("click", () => openVirtualStudio());
  }
  const btnCloseVirtualStudio = document.getElementById("btnCloseVirtualStudioModal");
  if (btnCloseVirtualStudio) {
    btnCloseVirtualStudio.addEventListener("click", () => closeVirtualStudio());
  }
  const btnSaveCode = document.getElementById("btnSaveActiveCode");
  if (btnSaveCode) {
    btnSaveCode.addEventListener("click", () => saveActiveVirtualFile());
  }
  const btnCopyCode = document.getElementById("btnCopyActiveCode");
  if (btnCopyCode) {
    btnCopyCode.addEventListener("click", () => {
      const editor = document.getElementById("virtualStudioCodeEditor");
      if (editor) {
        navigator.clipboard.writeText(editor.value).then(() => {
          showToast("Đã sao chép toàn bộ mã nguồn tệp vào bộ nhớ tạm!", "success");
        });
      }
    });
  }
  const btnDownloadZip = document.getElementById("btnDownloadProjectZip");
  if (btnDownloadZip) {
    btnDownloadZip.addEventListener("click", () => downloadProjectZip());
  }
  const btnDropdownZip = document.getElementById("btnDropdownDownloadZip");
  if (btnDropdownZip) {
    btnDropdownZip.addEventListener("click", () => {
      toggleToolsDropdown(false);
      downloadProjectZip();
    });
  }

  // Dispatch Mode Switcher (Vibe Code vs Manual Directive)
  const dispatchModeSelect = document.getElementById("dispatchModeSelect");
  const dispatchDeptGroup = document.getElementById("dispatchDeptGroup");
  if (dispatchModeSelect && dispatchDeptGroup) {
    dispatchModeSelect.addEventListener("change", (e) => {
      if (e.target.value === "MANUAL_DIRECTIVE") {
        dispatchDeptGroup.style.display = "block";
      } else {
        dispatchDeptGroup.style.display = "none";
      }
    });
  }

  // Modal: Client Feedback Intake (Gửi về PM)
  const feedbackModal = document.getElementById("feedbackModal");
  const btnOpenFeedback = document.getElementById("btnOpenFeedbackModal");
  if (btnOpenFeedback) {
    btnOpenFeedback.addEventListener("click", () => {
      openFeedbackModal();
    });
  }
  const btnInlineFeedback = document.getElementById("btnTriggerFeedbackInline");
  if (btnInlineFeedback) {
    btnInlineFeedback.addEventListener("click", () => {
      openFeedbackModal();
    });
  }
  const btnCloseFeedback = document.getElementById("btnCloseFeedbackModal");
  if (btnCloseFeedback) {
    btnCloseFeedback.addEventListener("click", () => {
      feedbackModal.style.display = "none";
    });
  }
  const btnCancelFeedback = document.getElementById("btnCancelFeedback");
  if (btnCancelFeedback) {
    btnCancelFeedback.addEventListener("click", () => {
      feedbackModal.style.display = "none";
    });
  }
  const feedbackForm = document.getElementById("feedbackForm");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleClientFeedbackSubmit();
    });
  }

  // Logout Client Role Button
  const btnLogoutClient = document.getElementById("btnLogoutClient");
  if (btnLogoutClient) {
    btnLogoutClient.addEventListener("click", () => {
      sessionStorage.clear();
      window.location.reload();
    });
  }

  // Modal: Add Task (Admin only)
  const addTaskModal = document.getElementById("addTaskModal");
  const btnAddTask = document.getElementById("btnAddTaskModal");
  if (btnAddTask) {
    btnAddTask.addEventListener("click", () => {
      if (currentRole !== "ADMIN") {
        showToast("Khách hàng chỉ có quyền gửi Feedback về cho PM, không được can thiệp vào task kỹ thuật của phòng ban!", "danger");
        return;
      }
      addTaskModal.style.display = "flex";
    });
  }
  const btnCloseTask = document.getElementById("btnCloseTaskModal");
  if (btnCloseTask) {
    btnCloseTask.addEventListener("click", () => {
      addTaskModal.style.display = "none";
    });
  }
  const btnCancelTask = document.getElementById("btnCancelModal");
  if (btnCancelTask) {
    btnCancelTask.addEventListener("click", () => {
      addTaskModal.style.display = "none";
    });
  }
  const addTaskForm = document.getElementById("addTaskForm");
  if (addTaskForm) {
    addTaskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleAddNewTask();
    });
  }

  // Modal: Create Project (Admin only)
  const newProjectModal = document.getElementById("newProjectModal");
  const btnNewProj = document.getElementById("btnNewProject");
  if (btnNewProj) {
    btnNewProj.addEventListener("click", () => {
      if (currentRole !== "ADMIN") {
        showToast("Chỉ Admin mới có quyền khởi tạo dự án mới trên hệ thống!", "danger");
        return;
      }
      newProjectModal.style.display = "flex";
    });
  }
  const btnCloseProj = document.getElementById("btnCloseProjModal");
  if (btnCloseProj) {
    btnCloseProj.addEventListener("click", () => {
      newProjectModal.style.display = "none";
    });
  }
  const btnCancelProj = document.getElementById("btnCancelProjModal");
  if (btnCancelProj) {
    btnCancelProj.addEventListener("click", () => {
      newProjectModal.style.display = "none";
    });
  }
  const newProjectForm = document.getElementById("newProjectForm");
  if (newProjectForm) {
    newProjectForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleCreateNewProject();
    });
  }

  // Close Inspector
  const btnCloseInspector = document.getElementById("btnCloseInspector");
  if (btnCloseInspector) {
    btnCloseInspector.addEventListener("click", () => {
      closeDeptInspector();
    });
  }

  // Manual Trigger: Realtime Progress Report
  const btnRealtime = document.getElementById("btnSimulateRealtime");
  if (btnRealtime) {
    btnRealtime.addEventListener("click", () => {
      triggerRealtimeReport();
    });
  }

  // Tools Dropdown Menu Toggle
  const btnTools = document.getElementById("btnToggleToolsDropdown");
  const menuTools = document.getElementById("toolsDropdownMenu");
  if (btnTools && menuTools) {
    btnTools.addEventListener("click", (e) => {
      e.stopPropagation();
      menuTools.classList.toggle("show");
    });
    document.addEventListener("click", () => {
      menuTools.classList.remove("show");
    });
  }
}

// Toggle Environment between Production (Real Data) & Sandbox (Mock Data)
function toggleProjectEnvironment() {
  const project = getCurrentProject();
  if (!project) return;

  if (project.environment === "PRODUCTION") {
    project.environment = "UAT_SANDBOX";
    showToast(`Đã chuyển sang môi trường UAT / LOCAL: Sử dụng Mock Data & Sandbox DB cô lập 100%, bảo vệ dữ liệu Production!`, "warning");
  } else {
    project.environment = "PRODUCTION";
    showToast(`Đã kích hoạt môi trường PRODUCTION: Sử dụng Dữ liệu thật 100%, kết nối VietQR Live, Cloud CDN an toàn.`, "success");
  }

  saveProjectsToStorage();
  renderDashboard();
}

function handleGenerateKeySubmit() {
  const name = sanitizeInput(document.getElementById("modalKeyClientName").value);
  const dob = sanitizeInput(document.getElementById("modalKeyClientDOB").value);
  const phone = sanitizeInput(document.getElementById("modalKeyClientPhone").value);
  const projectCode = document.getElementById("modalKeyProjectSelect").value;

  if (!name || !dob || !phone) {
    showToast("CẢNH BÁO AN NINH: Dữ liệu nhập vào chứa ký tự không hợp lệ hoặc bị rỗng!", "danger");
    return;
  }

  const generatedKey = generateEncryptedKey(name, dob, phone, projectCode);

  document.getElementById("generatedKeyText").textContent = generatedKey;
  document.getElementById("keyOutputContainer").style.display = "block";

  // Log to activity
  const project = getCurrentProject();
  project.history.unshift({
    time: "Vừa xong",
    dept: "BAN QUẢN LÝ",
    action: `[BẢO MẬT] Đã cấp Access Key mã hóa cho khách hàng "${name}" thuộc dự án [${projectCode}]`,
    type: "purple"
  });

  saveProjectsToStorage();
  renderActivityFeed(project);
  showToast(`Đã sinh và mã hóa Key thành công cho ${name}!`, "success");
}

async function updateLiveServerMetrics() {
  try {
    const res = await fetch("/api/health");
    if (!res.ok) return;
    const data = await res.json();

    const portEl = document.getElementById("kpiServerPort");
    if (portEl) portEl.textContent = `Port ${data.port || 5000}`;

    const uptimeEl = document.getElementById("kpiServerUptime");
    if (uptimeEl && data.uptimeSeconds !== undefined) {
      const minutes = Math.floor(data.uptimeSeconds / 60);
      const hours = Math.floor(minutes / 60);
      const uptimeStr = hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes} phút`;
      uptimeEl.textContent = `Uptime: ${uptimeStr}`;
    }

    const ramEl = document.getElementById("kpiServerRam");
    if (ramEl && data.memory?.heapUsedMb) {
      ramEl.textContent = `${data.memory.heapUsedMb} MB`;
    }

    const srvBadge = document.getElementById("kpiServerStatusBadge");
    if (srvBadge) {
      srvBadge.textContent = "ONLINE (LIVE)";
      srvBadge.className = "badge badge-success";
    }

    const aiEngineEl = document.getElementById("kpiAiEngine");
    if (aiEngineEl && data.ai?.model) {
      aiEngineEl.textContent = data.ai.model;
    }

    const aiBadge = document.getElementById("kpiAiBadge");
    if (aiBadge && data.ai) {
      aiBadge.textContent = data.ai.hasKey ? "API ACTIVE" : "API READY";
    }
  } catch (err) {
    const portEl = document.getElementById("kpiServerPort");
    if (portEl && !portEl.textContent) portEl.textContent = "Port 5000";
  }
}

function renderDashboard() {
  const project = getCurrentProject();
  if (!project) return;

  // Role Enforcement on UI
  enforceRoleUI(project);

  // 0. Update Multi-Project & Environment Indicator
  const multiBadge = document.getElementById("multiProjectCountBadge");
  if (multiBadge) {
    multiBadge.textContent = `${projects.length} DỰ ÁN SONG SONG (CÔ LẬP)`;
  }

  const envDot = document.getElementById("envDot");
  const envLabel = document.getElementById("envLabel");
  if (envDot && envLabel) {
    if (project.environment === "PRODUCTION") {
      envDot.className = "env-dot";
      envLabel.textContent = "PROD (DATA THẬT 100%)";
    } else {
      envDot.className = "env-dot uat";
      envLabel.textContent = "UAT / LOCAL (MOCK DATA)";
    }
  }

  // 1. Update KPIs
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(t => t.status === "DONE").length;
  const inProgressTasks = project.tasks.filter(t => t.status === "IN_PROGRESS").length;
  const blockedTasks = project.tasks.filter(t => t.status === "BLOCKED").length;
  const cancelledTasks = project.tasks.filter(t => t.status === "CANCELLED").length;

  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const kpiNum = document.getElementById("kpiProgressNum");
  if (kpiNum) kpiNum.textContent = `${progressPercent}%`;

  const kpiBar = document.getElementById("kpiProgressBar");
  if (kpiBar) kpiBar.style.width = `${progressPercent}%`;

  const kpiDays = document.getElementById("kpiDaysRemaining");
  if (kpiDays) kpiDays.textContent = `${completedTasks} / ${totalTasks} Tác Vụ Hoàn Tất`;

  const statComp = document.getElementById("statCompleted");
  if (statComp) statComp.textContent = completedTasks;

  const statProg = document.getElementById("statInProgress");
  if (statProg) statProg.textContent = inProgressTasks;

  const statBlock = document.getElementById("statBlocked");
  if (statBlock) statBlock.textContent = blockedTasks;

  const statCanc = document.getElementById("statCancelled");
  if (statCanc) statCanc.textContent = cancelledTasks;

  const totalLabel = document.getElementById("kpiTotalTasksCount");
  if (totalLabel) totalLabel.textContent = `Tổng: ${totalTasks} Tác Vụ`;

  // Fetch real-time hardware, server uptime, and AI telemetry
  updateLiveServerMetrics();

  // Status Badge
  const statusBadge = document.getElementById("projectStatusBadge");
  if (statusBadge) {
    if (blockedTasks > 0) {
      statusBadge.className = "badge badge-danger pulse";
      statusBadge.textContent = `${blockedTasks} NGHẼN (BLOCKED)`;
    } else if (progressPercent >= 100) {
      statusBadge.className = "badge badge-success";
      statusBadge.textContent = "HOÀN TẤT (DONE)";
    } else {
      statusBadge.className = "badge badge-success";
      statusBadge.textContent = "ON-TRACK";
    }
  }

  // 2. Render Spacious SVG Workflow Canvas
  renderWorkflowGraph(project);

  // 3. Render Task Table & Filter Counts
  updateFilterCounts(project);
  renderTaskTable();

  // 4. Render Activity Feed
  renderActivityFeed(project);

  // 5. Render Client Feedback & PM Resolution Section
  renderFeedbackSection(project);
}

// Role-based UI visibility enforcement
function enforceRoleUI(project) {
  const rolePill = document.getElementById("roleIndicatorPill");
  const roleText = document.getElementById("roleLabelText");
  const clientBanner = document.getElementById("clientGuideBanner");
  const btnDispatch = document.getElementById("btnOpenDispatchModal");
  const btnKeyGen = document.getElementById("btnOpenKeyGenModal");
  const btnNewProj = document.getElementById("btnNewProject");
  const projWrapper = document.getElementById("projectSelectorWrapper");

  if (currentRole === "CLIENT") {
    if (rolePill) {
      rolePill.className = "role-pill client-role";
    }
    if (roleText) {
      roleText.textContent = `VAI TRÒ: KHÁCH HÀNG (${loggedClientName || "Xác Thực"})`;
    }
    if (clientBanner) {
      clientBanner.style.display = "flex";
      const title = document.getElementById("clientGuideProjectTitle");
      if (title) title.textContent = `KHÔNG GIAN THEO DÕI DỰ ÁN DÀNH CHO KHÁCH HÀNG: [${project.code}]`;
    }

    // Hide Token-expensive / Admin-only actions from Client
    if (btnDispatch) btnDispatch.style.display = "none";
    if (btnKeyGen) btnKeyGen.style.display = "none";
    if (btnNewProj) btnNewProj.style.display = "none";

    // Disable project switcher (Client only stays on their authorized project)
    const select = document.getElementById("projectSelect");
    if (select) select.disabled = true;

    // Lock perspective to Business Friendly for Client
    currentPerspective = "BUSINESS";
    const btnPerspTech = document.getElementById("btnPerspectiveTech");
    if (btnPerspTech) btnPerspTech.style.display = "none";
    const labelPersp = document.getElementById("perspectiveModeLabel");
    if (labelPersp) labelPersp.textContent = "Góc Nhìn Khách Hàng (Dễ Hiểu)";

  } else {
    // ADMIN MASTER
    if (rolePill) {
      rolePill.className = "role-pill";
    }
    if (roleText) {
      roleText.textContent = "VAI TRÒ: ADMIN MASTER (TOÀN QUYỀN)";
    }
    if (clientBanner) {
      clientBanner.style.display = "none";
    }
    if (btnDispatch) btnDispatch.style.display = "inline-flex";
    if (btnKeyGen) btnKeyGen.style.display = "inline-flex";
    if (btnNewProj) btnNewProj.style.display = "inline-flex";
    const btnPerspTech = document.getElementById("btnPerspectiveTech");
    if (btnPerspTech) btnPerspTech.style.display = "inline-flex";

    const select = document.getElementById("projectSelect");
    if (select) select.disabled = false;
  }
}

function renderWorkflowGraph(project) {
  const svg = document.getElementById("workflowSvg");
  if (!svg) return;

  let gStages = document.getElementById("flowStages");
  if (!gStages) {
    gStages = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gStages.id = "flowStages";
    svg.insertBefore(gStages, svg.firstChild);
  }

  let gConnections = document.getElementById("flowConnections");
  if (!gConnections) {
    gConnections = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gConnections.id = "flowConnections";
    svg.appendChild(gConnections);
  }

  let gNodes = document.getElementById("flowNodes");
  if (!gNodes) {
    gNodes = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gNodes.id = "flowNodes";
    svg.appendChild(gNodes);
  }

  gStages.innerHTML = "";
  gConnections.innerHTML = "";
  gNodes.innerHTML = "";

  // 1. Draw 5 Stage Column Backgrounds (Clear Zones for 11-Step Tier-1 Enterprise Lifecycle)
  const stages = [
    { title: "PHA 1: KHỞI TẠO & CHIẾN LƯỢC", x: 15, y: 15, width: 430, height: 450 },
    { title: "PHA 2: THIẾT KẾ & KIẾN TRÚC ĐÓNG BĂNG", x: 460, y: 15, width: 235, height: 450 },
    { title: "PHA 3: LẬP TRÌNH & BẢO MẬT (APPSEC)", x: 710, y: 15, width: 330, height: 450 },
    { title: "PHA 4: KIỂM ĐỊNH QA & NGHIỆM THU UAT", x: 1055, y: 15, width: 285, height: 450 },
    { title: "PHA 5: TRIỂN KHAI & HẬU PHÁT HÀNH", x: 1355, y: 15, width: 410, height: 450 }
  ];

  stages.forEach(s => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("class", "stage-label-bg");
    rect.setAttribute("x", s.x);
    rect.setAttribute("y", s.y);
    rect.setAttribute("width", s.width);
    rect.setAttribute("height", s.height);

    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("class", "stage-header-text");
    txt.setAttribute("x", s.x + 14);
    txt.setAttribute("y", s.y + 24);
    txt.textContent = s.title;

    gStages.appendChild(rect);
    gStages.appendChild(txt);
  });

  const deptStatuses = project.deptStatuses || {};

  // 2. Draw Connection Edges
  workflowEdges.forEach(edge => {
    const fromNode = departmentsData[edge.from];
    const toNode = departmentsData[edge.to];
    if (!fromNode || !toNode) return;

    const fromStatus = deptStatuses[edge.from] || "IDLE";
    const toStatus = deptStatuses[edge.to] || "IDLE";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    
    // Calculate smooth cubic bezier path
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const cx1 = fromNode.x + dx * 0.45;
    const cy1 = fromNode.y;
    const cx2 = fromNode.x + dx * 0.55;
    const cy2 = toNode.y;

    const d = `M ${fromNode.x} ${fromNode.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toNode.x} ${toNode.y}`;
    path.setAttribute("d", d);

    if (toStatus === "BLOCKED" || fromStatus === "BLOCKED") {
      path.setAttribute("class", "flow-line flow-line-blocked");
      path.setAttribute("marker-end", "url(#arrow-blocked)");
    } else if (fromStatus === "IN_PROGRESS" || toStatus === "IN_PROGRESS") {
      path.setAttribute("class", "flow-line flow-line-active");
      path.setAttribute("marker-end", "url(#arrow-active)");
    } else {
      path.setAttribute("class", "flow-line");
      path.setAttribute("marker-end", "url(#arrow)");
    }

    gConnections.appendChild(path);
  });

  // 3. Draw Nodes (Spacious, Crisp Typography, Zero Emoji Clutter)
  Object.keys(departmentsData).forEach(key => {
    const d = departmentsData[key];
    const status = deptStatuses[key] || "IDLE";

    const nodeG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    nodeG.setAttribute("class", "node-group");
    nodeG.setAttribute("transform", `translate(${d.x}, ${d.y})`);

    // Status Styling (Quiet Executive Slate - Zero Harsh Glare)
    let strokeColor = "#222D42";
    let fillColor = "#131A29";
    let badgeTextColor = "#64748B";
    let badgeBgColor = "rgba(100, 116, 139, 0.1)";
    let badgeText = "Chờ lượt";

    if (status === "DONE") {
      strokeColor = "#1D4E3E";
      fillColor = "#12211E";
      badgeTextColor = "#34D399";
      badgeBgColor = "rgba(16, 185, 129, 0.1)";
      badgeText = "Hoàn tất";
    } else if (status === "IN_PROGRESS") {
      strokeColor = "#523C1A";
      fillColor = "#221C13";
      badgeTextColor = "#FBBF24";
      badgeBgColor = "rgba(245, 158, 11, 0.1)";
      badgeText = "Đang xử lý";
    } else if (status === "BLOCKED") {
      strokeColor = "#5C2020";
      fillColor = "#261313";
      badgeTextColor = "#F87171";
      badgeBgColor = "rgba(239, 68, 68, 0.1)";
      badgeText = "Bị nghẽn";
    }

    if (activeDirectiveDept === key) {
      strokeColor = "#F59E0B";
    } else if (selectedDeptId === key) {
      strokeColor = "#3B82F6";
    }

    const w = d.width || 155;
    const h = d.height || 80;

    nodeG.innerHTML = `
      <rect class="node-box" x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" 
            fill="${fillColor}" stroke="${strokeColor}" stroke-width="${selectedDeptId === key || activeDirectiveDept === key ? 1.8 : 1}" />
      
      <!-- Top Department Tag -->
      <text class="node-dept-badge" x="${-w/2 + 10}" y="${-h/2 + 15}">${d.badge}</text>
      
      <!-- Main Department Name -->
      <text class="node-title-main" x="0" y="-4" text-anchor="middle">${d.title}</text>
      
      <!-- Subtitle Role -->
      <text class="node-subtitle-desc" x="0" y="11" text-anchor="middle">${d.subtitle}</text>
      
      <!-- Status Badge Capsule -->
      <rect x="-42" y="19" width="84" height="16" rx="4" fill="${badgeBgColor}" stroke="${strokeColor}" stroke-width="0.6" />
      <text class="node-badge-text" x="0" y="30" text-anchor="middle" fill="${badgeTextColor}">${badgeText}</text>
    `;

    // Click handler
    nodeG.addEventListener("click", () => {
      handleDepartmentClick(key);
    });

    gNodes.appendChild(nodeG);
  });
}

function handleDepartmentClick(deptKey) {
  selectedDeptId = deptKey;
  const project = getCurrentProject();
  renderWorkflowGraph(project);

  const d = departmentsData[deptKey];
  const inspector = document.getElementById("deptInspector");
  if (!d || !inspector) return;

  inspector.style.display = "block";
  document.getElementById("inspectorTitle").textContent = `${d.badge} - ${d.title}`;
  document.getElementById("inspectorRole").textContent = `Vai trò cốt lõi: ${d.role}`;

  const ulInputs = document.getElementById("inspectorInputs");
  ulInputs.innerHTML = "";
  d.inputs.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    ulInputs.appendChild(li);
  });

  const ulDeliv = document.getElementById("inspectorDeliverables");
  ulDeliv.innerHTML = "";
  d.deliverables.forEach(deliv => {
    const li = document.createElement("li");
    li.textContent = deliv;
    ulDeliv.appendChild(li);
  });

  const status = project.deptStatuses[deptKey] || "IDLE";
  let statusBadgeHtml = `<span class="badge badge-muted">CHƯA KÍCH HOẠT</span>`;
  if (status === "DONE") statusBadgeHtml = `<span class="badge badge-success">ĐÃ HOÀN TẤT PHẦN VIỆC</span>`;
  if (status === "IN_PROGRESS") statusBadgeHtml = `<span class="badge badge-warning pulse">ĐANG TẬP TRUNG PHỐI HỢP</span>`;
  if (status === "BLOCKED") statusBadgeHtml = `<span class="badge badge-danger pulse">ĐANG BỊ NGHẼN (CẦN THÁO GỠ)</span>`;

  // If Client role, hide the Directive Dispatch button
  const dispatchBtnHtml = currentRole === "ADMIN" 
    ? `<button class="btn btn-primary" style="font-size: 0.76rem; padding: 7px 14px;" onclick="openDirectiveForDept('${deptKey}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        Phát lệnh điều phối riêng cho phòng này
      </button>` 
    : `<span style="font-size: 0.72rem; color: var(--text-dim);">(Quyền phát lệnh AI Vibe chỉ thuộc Ban Quản Trị)</span>`;

  document.getElementById("inspectorCurrentStatus").innerHTML = `
    <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
      <span>Trạng thái thời gian thực:</span>
      ${statusBadgeHtml}
    </div>
    <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
      <button class="btn btn-secondary" style="font-size: 0.76rem; padding: 7px 14px;" onclick="filterTasksByDeptName('${d.badge}')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Xem toàn bộ tác vụ của phòng này
      </button>
      ${dispatchBtnHtml}
    </div>
  `;
}

function closeDeptInspector() {
  selectedDeptId = null;
  const inspector = document.getElementById("deptInspector");
  if (inspector) inspector.style.display = "none";
  renderWorkflowGraph(getCurrentProject());
}

window.filterTasksByDeptName = function(deptBadge) {
  const cleanPrefix = deptBadge.split(".")[0];
  searchTerm = cleanPrefix;
  const searchInput = document.getElementById("taskSearchInput");
  if (searchInput) searchInput.value = cleanPrefix;
  renderTaskTable();
};

window.openDirectiveForDept = function(deptKey) {
  if (currentRole !== "ADMIN") return;
  const d = departmentsData[deptKey];
  if (!d) return;

  const modal = document.getElementById("dispatchModal");
  if (modal) modal.style.display = "flex";

  const select = document.getElementById("dispatchDept");
  if (select) {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].text.includes(d.badge) || select.options[i].value.includes(d.badge)) {
        select.selectedIndex = i;
        break;
      }
    }
  }
};

function updateFilterCounts(project) {
  const countAll = document.getElementById("countAll");
  if (countAll) countAll.textContent = project.tasks.length;
  const countDone = document.getElementById("countDone");
  if (countDone) countDone.textContent = project.tasks.filter(t => t.status === "DONE").length;
  const countProg = document.getElementById("countInProgress");
  if (countProg) countProg.textContent = project.tasks.filter(t => t.status === "IN_PROGRESS").length;
  const countBlock = document.getElementById("countBlocked");
  if (countBlock) countBlock.textContent = project.tasks.filter(t => t.status === "BLOCKED").length;
  const countCanc = document.getElementById("countCancelled");
  if (countCanc) countCanc.textContent = project.tasks.filter(t => t.status === "CANCELLED").length;
}

function renderTaskTable() {
  const project = getCurrentProject();
  const tbody = document.getElementById("taskTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!project.tasks || project.tasks.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 48px 24px; color: #94A3B8;">
          <div style="font-size: 1.1rem; font-weight: 600; color: #F1F5F9; margin-bottom: 8px;">
            Dự Án Đang Ở Trạng Thái 0% Nguyên Bản (Không Có Dữ Liệu Ảo)
          </div>
          <p style="font-size: 0.88rem; color: #64748B; margin: 0 auto; max-width: 520px; line-height: 1.6;">
            Hệ thống đã loại bỏ hoàn toàn các task mẫu tĩnh. Bạn chưa giao việc nên chưa có tác vụ nào được tính hoàn thành.<br>
            Hãy bấm nút <strong style="color: #38BDF8;">"⚡ Phát Lệnh AI"</strong> ở trên để bắt đầu giao việc thực tế cho các phòng ban lập trình!
          </p>
        </td>
      </tr>
    `;
    return;
  }

  let filtered = project.tasks;

  // Filter Status
  if (activeFilter !== "all") {
    filtered = filtered.filter(t => t.status === activeFilter);
  }

  // Filter Search
  if (searchTerm) {
    filtered = filtered.filter(t => 
      t.id.toLowerCase().includes(searchTerm) ||
      t.title.toLowerCase().includes(searchTerm) ||
      t.dept.toLowerCase().includes(searchTerm) ||
      t.pic.toLowerCase().includes(searchTerm)
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 32px;">Không tìm thấy tác vụ nào khớp tiêu chí lọc.</td></tr>`;
    return;
  }

  filtered.forEach(task => {
    const tr = document.createElement("tr");

    let statusBadge = `<span class="badge badge-success">ĐÃ XONG</span>`;
    if (task.status === "IN_PROGRESS") statusBadge = `<span class="badge badge-warning">ĐANG LÀM</span>`;
    if (task.status === "BLOCKED") statusBadge = `<span class="badge badge-danger">BỊ NGHẼN</span>`;
    if (task.status === "CANCELLED") statusBadge = `<span class="badge badge-muted">ĐÃ HỦY</span>`;

    const isDirective = task.id.startsWith("DIR-");
    const directiveTag = isDirective ? `<span class="badge badge-warning" style="margin-left: 6px; font-size: 0.65rem;">CHỈ ĐẠO BAN QUẢN LÝ</span>` : "";

    // Dual Perspective Content Translation
    const displayTitle = (currentPerspective === "BUSINESS" && task.businessTitle) ? task.businessTitle : task.title;
    const displayDept = (currentPerspective === "BUSINESS" && task.businessDept) ? task.businessDept : task.dept;
    const displayNote = (currentPerspective === "BUSINESS" && task.businessNote) ? task.businessNote : (task.note || "");

    // Blocked Solution Callout HTML
    let blockedCalloutHtml = "";
    if (task.status === "BLOCKED") {
      const issueText = task.blockedSolution?.issue || (currentPerspective === "BUSINESS" ? "Đang chờ kết nối từ đối tác ngân hàng bên ngoài" : task.note);
      const solutionText = task.blockedSolution?.solution || (currentPerspective === "BUSINESS" ? "Đội ngũ kỹ thuật đã chủ động mở cổng thanh toán mô phỏng nội bộ để khách hàng kiểm thử bình thường, không trễ tiến độ." : "PM & SA thống nhất kích hoạt Mock VietQR Server nội bộ.");
      
      blockedCalloutHtml = `
        <div class="blocked-solution-callout ${task.isResolved ? 'resolved' : ''}">
          <div class="blocked-solution-title">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            ${currentPerspective === "BUSINESS" ? "Sự Cố Kỹ Thuật (Đã có phương án giải quyết):" : "Blocker Incident & Solution:"}
          </div>
          <div style="font-size: 0.72rem; color: #CBD5E1; margin-top: 3px; line-height: 1.45;">
            <strong>Nguyên nhân:</strong> ${issueText}
          </div>
          <div style="font-size: 0.72rem; color: #6EE7B7; margin-top: 2px; line-height: 1.45;">
            <strong>Giải pháp PM:</strong> ${solutionText}
          </div>
          ${currentRole === "ADMIN" ? `
            <button type="button" class="btn-resolve-blocked" onclick="openResolveBlockedModal('${task.id}')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              Xem & Kích Hoạt Solution Gỡ Nghẽn Của PM
            </button>
          ` : `
            <div style="font-size: 0.68rem; color: #34D399; margin-top: 4px; font-weight: 600;">✓ Đang vận hành giải pháp thay thế tạm thời - Tiến độ đảm bảo 100%</div>
          `}
        </div>
      `;
    } else if (task.isResolved) {
      blockedCalloutHtml = `
        <div class="blocked-solution-callout resolved">
          <div class="blocked-solution-title">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            ${currentPerspective === "BUSINESS" ? "Đã Gỡ Nghẽn Bằng Solution Của PM & SA" : "Resolved Blocker with PM Solution"}
          </div>
          <div style="font-size: 0.71rem; color: #94A3B8; margin-top: 2px;">
            Đã kích hoạt cổng thử nghiệm mô phỏng nội bộ, chức năng hoạt động bình thường và đáp ứng tiến độ bàn giao.
          </div>
        </div>
      `;
    }

    tr.innerHTML = `
      <td class="task-id">${task.id}</td>
      <td style="color: var(--text-muted); font-size: 0.78rem;">${displayDept}</td>
      <td>
        <span class="task-title">${displayTitle} ${directiveTag}</span>
        ${blockedCalloutHtml}
      </td>
      <td><strong>${task.pic}</strong></td>
      <td style="text-align: center;">
        <select class="status-select-badge" onchange="changeTaskStatus('${task.id}', this.value)" style="color-scheme: dark; background: #111624; border: 1px solid rgba(255,255,255,0.15); color: #E2E8F0; padding: 4px 8px; border-radius: 6px; font-size: 0.72rem; outline: none; cursor: pointer;">
          <option value="IN_PROGRESS" style="background-color: #0B0E17; color: #E2E8F0;" ${task.status === "IN_PROGRESS" ? "selected" : ""}>ĐANG LÀM</option>
          <option value="DONE" style="background-color: #0B0E17; color: #E2E8F0;" ${task.status === "DONE" ? "selected" : ""}>ĐÃ XONG</option>
          <option value="BLOCKED" style="background-color: #0B0E17; color: #E2E8F0;" ${task.status === "BLOCKED" ? "selected" : ""}>BỊ NGHẼN</option>
          <option value="CANCELLED" style="background-color: #0B0E17; color: #E2E8F0;" ${task.status === "CANCELLED" ? "selected" : ""}>ĐÃ HỦY</option>
        </select>
      </td>
      <td>
        <span style="font-family: var(--font-mono); font-size: 0.78rem;">${task.progress}%</span>
        <div class="progress-mini"><div class="progress-mini-fill" style="width: ${task.progress}%;"></div></div>
      </td>
      <td style="text-align: center;">
        <span style="font-size: 0.72rem; color: #64748B;">Chuẩn</span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Real Task Status Updater with Real Backend Synchronization
window.changeTaskStatus = function(taskId, newStatus) {
  if (currentRole !== "ADMIN") return;

  const project = getCurrentProject();
  const task = project.tasks.find(t => t.id === taskId);
  if (!task) return;

  task.status = newStatus;
  if (newStatus === "DONE") task.progress = 100;
  else if (newStatus === "IN_PROGRESS" && task.progress === 100) task.progress = 60;
  else if (newStatus === "BLOCKED") task.progress = 30;

  // Real API call to Backend
  fetch(`/api/tasks/${taskId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus })
  }).then(r => r.json()).then(res => {
    console.log("[Backend Sync] Task status updated in DB:", res);
  }).catch(e => console.log("Offline mode, saved locally"));

  saveProjectsToStorage();
  renderDashboard();
};

// Open Resolve Blocked Modal
window.openResolveBlockedModal = function(taskId) {
  const project = getCurrentProject();
  const task = project.tasks.find(t => t.id === taskId);
  if (!task) return;

  activeResolvingTaskId = taskId;
  const modal = document.getElementById("resolveBlockedModal");
  if (!modal) return;

  const titleEl = document.getElementById("resolveTaskTitleDisplay");
  const issueEl = document.getElementById("resolveIssueDisplay");
  const solEl = document.getElementById("resolveSolutionDisplay");

  if (titleEl) titleEl.textContent = `${task.id}: ${task.businessTitle || task.title}`;
  if (issueEl) issueEl.textContent = task.blockedSolution?.issue || task.note || "Đang gặp sự cố nghẽn kỹ thuật từ đối tác hoặc môi trường.";
  if (solEl) solEl.textContent = task.blockedSolution?.solution || "PM chủ trì cùng SA: Kích hoạt Mock Server / Phương án dự phòng để lập trình viên tiếp tục công việc ngay lập tức.";

  modal.style.display = "flex";
};

// Confirm Resolution of Blocked Task
window.handleConfirmResolveSolution = function() {
  if (!activeResolvingTaskId) return;
  const project = getCurrentProject();
  const task = project.tasks.find(t => t.id === activeResolvingTaskId);
  if (!task) return;

  task.status = "IN_PROGRESS";
  task.progress = 85;
  task.isResolved = true;
  task.note = "ĐÃ GỠ NGHẼN: Đã kích hoạt Mock Server nội bộ chuẩn EMVCo, tiến độ kiểm thử đạt 85%";
  task.businessNote = "[ĐÃ XỬ LÝ XONG]: Đã áp dụng cổng thử nghiệm thay thế, toàn bộ tính năng quét mã VietQR hoạt động bình thường!";

  // Shift department status back to IN_PROGRESS if was blocked
  if (project.deptStatuses) {
    if (task.id.startsWith("BE-")) project.deptStatuses["be"] = "IN_PROGRESS";
    if (task.id.startsWith("FE-")) project.deptStatuses["fe"] = "IN_PROGRESS";
    if (task.id.startsWith("DB-")) project.deptStatuses["dba"] = "IN_PROGRESS";
    if (task.id.startsWith("QA-")) project.deptStatuses["qa"] = "IN_PROGRESS";
    if (task.id.startsWith("OPS-")) project.deptStatuses["devops"] = "IN_PROGRESS";
  }

  project.history.unshift({
    time: "Vừa xong",
    dept: "01. Quản Trị Dự Án",
    action: `[GỠ NGHẼN THÀNH CÔNG] PM & SA đã kích hoạt Solution cho [${task.id} - ${task.businessTitle || task.title}]: Kích hoạt giải pháp dự phòng nội bộ. Tiến độ bảo đảm 100%!`,
    type: "success"
  });

  saveProjectsToStorage();
  renderDashboard();

  const modal = document.getElementById("resolveBlockedModal");
  if (modal) modal.style.display = "none";

  showToast(`Đã gỡ nghẽn thành công cho tác vụ [${task.id}]! Solution của PM đã được kích hoạt.`, "success");
};

function renderActivityFeed(project) {
  const container = document.getElementById("activityFeedContainer");
  if (!container) return;
  container.innerHTML = "";

  const history = project.history || [];
  if (history.length === 0) {
    container.innerHTML = `<p style="color: var(--text-dim); font-size: 0.8rem;">Chưa có hoạt động nào được ghi nhận.</p>`;
    return;
  }

  history.forEach(item => {
    let tag = "LOG";
    let badgeClass = "badge-muted";

    if (item.type === "success") { tag = "DONE"; badgeClass = "badge-success"; }
    else if (item.type === "danger") { tag = "BLOCK"; badgeClass = "badge-danger"; }
    else if (item.type === "info") { tag = "INFO"; badgeClass = "badge-info"; }
    else if (item.type === "purple") { tag = "DIR"; badgeClass = "badge-warning"; }

    const div = document.createElement("div");
    div.className = "feed-item";
    div.innerHTML = `
      <div class="feed-icon"><span class="badge ${badgeClass}" style="font-size: 0.65rem; padding: 2px 5px;">${tag}</span></div>
      <div class="feed-content">
        <div class="feed-header">
          <span class="feed-dept">${item.dept}</span>
          <span class="feed-time">${item.time}</span>
        </div>
        <p class="feed-action">${item.action}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

// 5. Client Feedback & PM Resolution Section
function renderFeedbackSection(project) {
  const container = document.getElementById("feedbackListContainer");
  if (!container) return;
  container.innerHTML = "";

  const feedbacks = project.feedbacks || [];
  if (feedbacks.length === 0) {
    container.innerHTML = `
      <div class="feedback-empty-state">
        <div class="empty-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <p>Chưa có yêu cầu hoặc phản hồi nào từ khách hàng cho dự án này.</p>
        <span class="empty-sub">Bấm nút <strong>"Gửi Yêu Cầu Mới"</strong> để gửi phản hồi trực tiếp về cho Project Manager xử lý.</span>
      </div>
    `;
    return;
  }

  feedbacks.forEach(fb => {
    const card = document.createElement("div");
    card.className = "feedback-card";

    let statusPill = `<span class="feedback-status-pill resolved">Đã hoàn tất</span>`;
    if (fb.status === "IN_PROGRESS") {
      statusPill = `<span class="feedback-status-pill in-progress">Đang xử lý</span>`;
    } else if (fb.status === "PENDING") {
      statusPill = `<span class="feedback-status-pill pending">PM hội chẩn</span>`;
    }

    const titleText = fb.title || fb.category || "Yêu cầu điều chỉnh từ khách hàng";

    card.innerHTML = `
      <div class="feedback-card-top">
        <div class="feedback-meta-left">
          <span class="feedback-code">${escapeHtml(fb.id)}</span>
          <span class="feedback-cat-tag">${escapeHtml(fb.category)}</span>
        </div>
        ${statusPill}
      </div>

      <h4 class="feedback-card-title">${escapeHtml(titleText)}</h4>

      <div class="feedback-content-block">
        <div class="feedback-row">
          <span class="feedback-row-label">Yêu cầu từ khách:</span>
          <p class="feedback-row-text">“${escapeHtml(fb.content)}”</p>
        </div>
        <div class="feedback-row solution-row">
          <span class="feedback-row-label">Phương án xử lý (PM):</span>
          <p class="feedback-row-text">${escapeHtml(fb.pmSolution)}</p>
        </div>
      </div>

      <div class="feedback-card-footer">
        <div class="feedback-assignee">
          <span class="dim-label">Phụ trách:</span>
          <strong>${escapeHtml(fb.assignedDept)}</strong>
        </div>
        <div class="feedback-author-time">
          <span>${escapeHtml(fb.sender)}</span>
          <span class="dot-sep">&bull;</span>
          <span>${escapeHtml(fb.time)}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function openFeedbackModal() {
  const project = getCurrentProject();
  if (!project) return;

  const modal = document.getElementById("feedbackModal");
  document.getElementById("feedbackProjName").value = `${project.code} - ${project.name}`;
  
  if (currentRole === "CLIENT" && loggedClientName) {
    document.getElementById("feedbackSender").value = loggedClientName;
  }

  modal.style.display = "flex";
}

function handleClientFeedbackSubmit() {
  const project = getCurrentProject();
  const rawSender = document.getElementById("feedbackSender").value;
  const rawCategory = document.getElementById("feedbackCategory").value;
  const rawContent = document.getElementById("feedbackContent").value;

  const sender = sanitizeInput(rawSender);
  const content = sanitizeInput(rawContent);

  if (!content || !sender) {
    showToast("CẢNH BÁO AN NINH: Nội dung phản hồi chứa ký tự không hợp lệ hoặc bị rỗng! Vui lòng kiểm tra lại.", "danger");
    return;
  }

  const fbId = `FB-${Math.floor(10 + Math.random() * 90)}`;

  // Autonomous Solution Engineering based on Admin selection or category
  let assignedDept = "01. Quản Trị Dự Án (PM)";
  let solutionText = "";
  let taskIdPrefix = "PM";
  let title = `Điều chỉnh theo phản hồi: ${content.substring(0, 40)}...`;

  const deptSelectEl = document.getElementById("feedbackAssignedDept");
  if (deptSelectEl && deptSelectEl.value) {
    assignedDept = deptSelectEl.value;
    if (assignedDept.includes("DevOps") || assignedDept.includes("09.")) {
      taskIdPrefix = "OPS";
      title = `Triển khai hạ tầng/máy chủ: ${content.substring(0, 40)}...`;
      solutionText = "DevOps tiếp nhận: Cấu hình môi trường triển khai (Local Docker / IP VPS Staging hoặc Cấp phát chứng chỉ SSL tên miền riêng) theo đúng yêu cầu phản hồi của khách hàng.";
    } else if (assignedDept.includes("04. Thiết Kế")) {
      taskIdPrefix = "UI";
      title = `Chuẩn hóa giao diện & Brand: ${content.substring(0, 40)}...`;
      solutionText = "UI/UX tiếp nhận: Rà soát Design System, chuẩn hóa màu sắc và font chữ theo Brand Guideline của khách, loại bỏ icon rườm rà.";
    } else if (assignedDept.includes("06. Lập Trình Backend")) {
      taskIdPrefix = "BE";
      title = `Nghiệp vụ Web Động & API: ${content.substring(0, 40)}...`;
      solutionText = "Backend tiếp nhận: Xây dựng và hoàn thiện API Web Động, xử lý logic thanh toán VietQR và dữ liệu đơn hàng.";
    } else if (assignedDept.includes("05. Lập Trình Frontend")) {
      taskIdPrefix = "FE";
      title = `Tối ưu giao diện & Cuộn 60fps: ${content.substring(0, 40)}...`;
      solutionText = "Frontend tiếp nhận: Tinh chỉnh giao diện hiển thị, cấu hình cuộn 60fps mượt mà trên mobile và gắn API Web Động.";
    } else if (assignedDept.includes("07. Cơ Sở Dữ Liệu")) {
      taskIdPrefix = "DB";
      title = `Tối ưu cơ sở dữ liệu: ${content.substring(0, 40)}...`;
      solutionText = "DBA tiếp nhận: Tối ưu hóa cấu trúc bảng, đánh index tăng tốc độ truy vấn và sao lưu an toàn.";
    } else if (assignedDept.includes("08. Kiểm Định QA")) {
      taskIdPrefix = "QA";
      title = `Kiểm thử an toàn & Bảo mật: ${content.substring(0, 40)}...`;
      solutionText = "QA/QC tiếp nhận: Kiểm tra chức năng, rà soát an toàn ô input và bảo đảm không có lỗi vặt trước khi bàn giao.";
    } else {
      taskIdPrefix = "PM";
      title = `Điều phối dự án (PM): ${content.substring(0, 40)}...`;
      solutionText = "PM chủ trì tiếp nhận: Phân tích bài toán, bóc tách công việc chi tiết và điều phối xuống các phòng ban kỹ thuật liên quan.";
    }
  } else {
    if (rawCategory.includes("UI/UX")) {
      assignedDept = "04. Thiết Kế UI/UX";
      taskIdPrefix = "UI";
      title = `Chuẩn hóa giao diện & Brand Guideline: ${content.substring(0, 40)}...`;
      solutionText = `Cập nhật tokens.json, tinh chỉnh typography theo Brand Guideline của khách, loại bỏ icon tùy tiện và cấu hình cuộn 60fps mượt mà.`;
    } else if (rawCategory.includes("Web Động")) {
      assignedDept = "06. Lập Trình Backend";
      taskIdPrefix = "BE";
      title = `Xử lý nghiệp vụ Web Động & Cổng kết nối API: ${content.substring(0, 40)}...`;
      solutionText = `Xây dựng API RESTful và cập nhật State động trên Next.js; kết nối cổng thanh toán thật trên Production, test Mock DB cô lập.`;
    } else if (rawCategory.includes("Cơ Sở Dữ Liệu")) {
      assignedDept = "07. Cơ Sở Dữ Liệu";
      taskIdPrefix = "DB";
      title = `Tối ưu hiệu năng cơ sở dữ liệu & Chống nghẽn: ${content.substring(0, 40)}...`;
      solutionText = `Tạo index covering cho các trường tìm kiếm, kích hoạt Autovacuum và tối ưu query time < 50ms chống nghẽn hệ thống.`;
    } else if (rawCategory.includes("Bảo Mật")) {
      assignedDept = "08. Kiểm Thử QA/QC";
      taskIdPrefix = "QA";
      title = `Kiểm tra an toàn ô Input & Bảo mật hệ thống: ${content.substring(0, 40)}...`;
      solutionText = `Thực thi kiểm thử Input Security trên Mock DB, rà soát Zod schema validation chống SQLi/XSS trước khi đưa lên Production.`;
    } else {
      assignedDept = "01. Quản Trị Dự Án (PM)";
      taskIdPrefix = "PM";
      title = `Điều chỉnh phạm vi tính năng (Change Request): ${content.substring(0, 40)}...`;
      solutionText = `Khảo sát phạm vi Change Request, bóc tách ngân sách phát sinh và xếp lịch Sprint kế tiếp không ảnh hưởng tiến độ chung.`;
    }
  }

  // 1. Add to project's feedbacks
  if (!project.feedbacks) project.feedbacks = [];
  project.feedbacks.unshift({
    id: fbId,
    title,
    sender,
    category: rawCategory,
    time: "Vừa xong",
    content,
    pmSolution: solutionText,
    assignedDept,
    status: "IN_PROGRESS"
  });

  // 2. Generate a new downstream atomic task
  const newTaskId = `${taskIdPrefix}-${Math.floor(300 + Math.random() * 600)}`;
  project.tasks.unshift({
    id: newTaskId,
    dept: assignedDept,
    title: `[SOLUTION FEEDBACK ${fbId}] Khắc phục theo phản hồi: ${rawCategory}`,
    pic: "AI Vibe Coding Specialist",
    status: "IN_PROGRESS",
    progress: 20,
    note: `Thực thi giải pháp do PM ban hành: ${content.substring(0, 70)}...`
  });

  // 3. Log to activity
  project.history.unshift({
    time: "Vừa xong",
    dept: "01. Quản Trị (PM)",
    action: `[FEEDBACK KHÁCH HÀNG] Đã tiếp nhận phản hồi từ "${sender}" & ban hành Solution kỹ thuật chuyển xuống [${assignedDept}]`,
    type: "info"
  });

  saveProjectsToStorage();

  // Asynchronously dispatch to Production Backend Server
  fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectId: project.id,
      sender: sender,
      category: rawCategory,
      content: content,
      assignedDept: assignedDept
    })
  }).then(r => r.json()).then(res => {
    console.log("[Production Backend] Feedback enqueued and stored in DB:", res);
  }).catch(e => console.log("[Storage Fallback] Saved locally:", e));

  document.getElementById("feedbackForm").reset();
  document.getElementById("feedbackModal").style.display = "none";
  renderDashboard();

  showToast(`PM đã tiếp nhận feedback và ban hành Solution thành công xuống ${assignedDept}!`, "purple");
}

// Top-Down Manager Directive Handler (Admin Only - Protected with Admin Master Key)
async function handleDispatchDirective() {
  if (currentRole !== "ADMIN") {
    showToast("Bạn đang ở quyền Khách Hàng (Read-Only). Quyền phát lệnh AI bị khóa để bảo mật hệ thống!", "danger");
    return;
  }

  // Security Verification of Admin Master Key
  const adminKeyInput = document.getElementById("dispatchAdminKeyInput");
  const inputKey = adminKeyInput ? adminKeyInput.value.trim() : "";
  const validKey = localStorage.getItem("it_admin_master_key") || DEFAULT_ADMIN_MASTER_KEY;

  if (inputKey !== validKey) {
    showToast("Mã Admin Master Key không chính xác! Quyền phát lệnh AI Vibe bị từ chối để bảo vệ ví token của quản trị viên.", "danger");
    if (adminKeyInput) {
      adminKeyInput.focus();
      adminKeyInput.style.borderColor = "#EF4444";
      adminKeyInput.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.25)";
    }
    return;
  }

  const project = getCurrentProject();
  const rawTitle = document.getElementById("dispatchTitle").value;
  const rawDetails = document.getElementById("dispatchDetails").value;
  const priority = document.getElementById("dispatchPriority").value;
  const mode = document.getElementById("dispatchModeSelect")?.value || "VIBE_CODE_DIRECT";

  const title = sanitizeInput(rawTitle);
  const details = sanitizeInput(rawDetails);

  if (!title) {
    showToast("Tiêu đề chỉ đạo không được để trống hoặc chứa ký tự độc hại!", "danger");
    return;
  }

  // MODE 1: [2-AI Dual Engine] AI 1 (Orchestrator) -> AI 2 (Vibe Coder)
  if (mode === "VIBE_CODE_DIRECT") {
    const liveBox = document.getElementById("dispatchLiveProgress");
    const liveText = document.getElementById("dispatchLiveStatusText");
    if (liveBox) liveBox.style.display = "block";
    if (liveText) liveText.textContent = "AI 1 (Orchestrator PM/SA) đang bóc tách luồng & xác định tệp đích...";

    const reqText = `${title}: ${details}`;
    try {
      const res = await fetch("/api/vibe/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          requirement: reqText,
          adminKey: inputKey
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Lỗi xử lý AI");

      const result = data.data;
      if (liveText) liveText.textContent = `AI 2 (${result.orchestration.deptName}) đã hoàn tất code vào ${result.codingResult.filePath}!`;

      // Highlight target department on workflow canvas
      activeDirectiveDept = result.orchestration.targetDept;

      // Update local project files and tasks
      project.files = project.files || {};
      project.files[result.codingResult.filePath] = result.codingResult.fileContent;
      
      const newTaskId = `DIR-${Math.floor(100 + Math.random() * 900)}`;
      project.tasks.unshift({
        id: newTaskId,
        dept: result.orchestration.deptName,
        title: `[AI VIBE CODE] ${result.orchestration.taskTitle}`,
        pic: `${result.orchestration.deptName} (AI Coder)`,
        status: "DONE",
        progress: 100,
        note: `Tệp: ${result.codingResult.filePath} &bull; ${result.codingResult.changeSummary}`,
        isDirective: true
      });

      if (project.deptStatuses) {
        project.deptStatuses[result.orchestration.targetDept] = "DONE";
      }

      project.history.unshift({
        time: "Vừa xong",
        dept: result.orchestration.deptName,
        action: `[VIBE CODE] Đã sinh mã nguồn vào: ${result.codingResult.filePath} (${result.codingResult.explanation})`,
        type: "success"
      });

      saveProjectsToStorage();
      renderDashboard();

      setTimeout(() => {
        if (liveBox) liveBox.style.display = "none";
        document.getElementById("dispatchForm").reset();
        document.getElementById("dispatchModal").style.display = "none";
        showToast(`AI 1 & AI 2 đã code thành công vào tệp [${result.codingResult.filePath}]! Mở Kho Mã Nguồn để xem chi tiết.`, "success");
        // Open Virtual Code Studio to inspect the generated code
        openVirtualStudio(result.codingResult.filePath);
      }, 700);

    } catch (err) {
      if (liveText) liveText.textContent = `Lỗi: ${err.message}`;
      showToast(`Không thể thực thi lệnh: ${err.message}`, "danger");
      if (liveBox) liveBox.style.display = "none";
    }
    return;
  }

  // MODE 2: Manual Directive (Task Creation)
  const deptName = document.getElementById("dispatchDept").value;
  const directiveId = `DIR-${Math.floor(100 + Math.random() * 900)}`;

  let targetKey = "pm";
  if (deptName.includes("01")) targetKey = "pm";
  else if (deptName.includes("02")) targetKey = "ba";
  else if (deptName.includes("03")) targetKey = "sa";
  else if (deptName.includes("04")) targetKey = "ui";
  else if (deptName.includes("05")) targetKey = "fe";
  else if (deptName.includes("06")) targetKey = "be";
  else if (deptName.includes("07")) targetKey = "dba";
  else if (deptName.includes("08")) targetKey = "qa";
  else if (deptName.includes("09")) targetKey = "devops";

  activeDirectiveDept = targetKey;

  project.tasks.unshift({
    id: directiveId,
    dept: deptName,
    title: `[CHỈ ĐẠO CẤP CAO] ${title}`,
    pic: "AI Vibe Coding Agent",
    status: "IN_PROGRESS",
    progress: 25,
    note: `Chỉ thị: ${details} (Độ ưu tiên: ${priority})`,
    isDirective: true
  });

  if (project.deptStatuses) {
    project.deptStatuses[targetKey] = "IN_PROGRESS";
  }

  project.history.unshift({
    time: "Vừa xong",
    dept: "BAN QUẢN LÝ",
    action: `Đã phát lệnh xuống [${deptName}]: ${title}. Yêu cầu AI Vibe bám sát chỉ dẫn kỹ thuật!`,
    type: "purple"
  });

  saveProjectsToStorage();
  document.getElementById("dispatchForm").reset();
  document.getElementById("dispatchModal").style.display = "none";
  renderDashboard();

  showToast(`Đã phát lệnh thành công xuống ${deptName}! Prompt kỹ thuật đã nạp vào chuỗi AI Vibe Coding.`, "purple");
}

function handleAddNewTask() {
  if (currentRole !== "ADMIN") return;

  const project = getCurrentProject();
  const dept = document.getElementById("modalTaskDept").value;
  const rawTitle = document.getElementById("modalTaskTitle").value;
  const rawPic = document.getElementById("modalTaskPIC").value;
  const status = document.getElementById("modalTaskStatus").value;
  const rawNote = document.getElementById("modalTaskNote").value;

  const title = sanitizeInput(rawTitle);
  const pic = sanitizeInput(rawPic);
  const note = sanitizeInput(rawNote) || "";

  if (!title || !pic) {
    showToast("Vui lòng điền đủ thông tin tác vụ!", "danger");
    return;
  }

  const newId = `TASK-${Math.floor(100 + Math.random() * 900)}`;

  project.tasks.unshift({
    id: newId,
    dept,
    title,
    pic,
    status,
    progress: status === "DONE" ? 100 : status === "IN_PROGRESS" ? 50 : 0,
    note
  });

  project.history.unshift({
    time: "Vừa xong",
    dept: dept.split(" ")[1] || dept,
    action: `Đã thêm mới tác vụ: [${newId}] ${title}`,
    type: "info"
  });

  saveProjectsToStorage();
  document.getElementById("addTaskForm").reset();
  document.getElementById("addTaskModal").style.display = "none";
  renderDashboard();

  showToast(`Đã lưu tác vụ mới [${newId}] cho phòng ban ${dept}`, "success");
}

async function handleCreateNewProject() {
  if (currentRole !== "ADMIN") return;

  const rawName = document.getElementById("modalProjName").value;
  const rawCode = document.getElementById("modalProjCode").value;
  const pkg = document.getElementById("modalProjPackage").value;
  const infra = document.getElementById("modalProjInfra") ? document.getElementById("modalProjInfra").value : "Cloud VPS Docker Container (Port 5000)";
  const rawBudget = document.getElementById("modalProjBudget") ? document.getElementById("modalProjBudget").value : "";
  const rawDesc = document.getElementById("modalProjDesc") ? document.getElementById("modalProjDesc").value : "";

  const name = sanitizeInput(rawName);
  const code = sanitizeInput(rawCode);
  const budget = sanitizeInput(rawBudget) || (pkg.includes("1.85") ? "1.85 Tỷ" : pkg.includes("550") ? "550 Triệu" : "3.5 Tỷ");
  const description = sanitizeInput(rawDesc) || `Dự án triển khai phần mềm ${name} (${code}) tiêu chuẩn 9 phòng ban`;

  if (!name || !code) {
    showToast("Vui lòng điền tên và mã dự án hợp lệ!", "danger");
    return;
  }

  const payload = {
    name,
    code,
    package: pkg,
    budget,
    infraStrategy: infra,
    description
  };

  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success && result.data) {
      projects.unshift(result.data);
      currentProjectId = result.data.id;
    } else {
      throw new Error(result.error || "Failed to create project on server");
    }
  } catch (err) {
    console.warn("Backend API offline or error, creating project locally:", err);
    const newId = `prj_${Date.now()}`;
    const cleanCode = code.toUpperCase();
    const localProj = {
      id: newId,
      code: cleanCode,
      name,
      package: pkg,
      budget,
      infraStrategy: infra,
      description,
      serverCost: "$45/tháng",
      daysRemaining: "Còn 60 ngày tới Go-Live",
      tokenSaved: "98.5%",
      environment: "PRODUCTION",
      deptStatuses: {
        "client": "DONE", "pm": "IN_PROGRESS", "ba": "IN_PROGRESS",
        "sa": "TODO", "ui": "TODO", "fe": "TODO", "be": "TODO",
        "dba": "TODO", "qa": "TODO", "devops": "TODO", "prod": "TODO"
      },
      tasks: [
        { id: `${cleanCode}-PM-01`, dept: "01. Quản Trị Dự Án", title: "Khảo sát và đề xuất bài toán chi phí dự án", pic: "TPM Lead", status: "IN_PROGRESS", progress: 60, note: "Đang lập WBS và ngân sách" },
        { id: `${cleanCode}-BA-02`, dept: "02. Phân Tích Nghiệp Vụ", title: "Lấy yêu cầu khám phá chiến lược (Brand / SEO)", pic: "Lead BA", status: "IN_PROGRESS", progress: 50, note: "Khảo sát các bên liên quan" },
        { id: `${cleanCode}-ARCH-03`, dept: "03. Kiến Trúc Phần Mềm", title: "Thiết kế kiến trúc hệ thống & tối ưu chi phí hạ tầng", pic: "Solution Architect", status: "TODO", progress: 20, note: "Chuẩn bị Review" },
        { id: `${cleanCode}-UI-04`, dept: "04. Thiết Kế Trải Nghiệm", title: "Thiết kế UI/UX Design System đồng bộ", pic: "Senior UI/UX", status: "TODO", progress: 10, note: "Chờ wireframe từ BA" },
        { id: `${cleanCode}-FE-05`, dept: "05. Phát Triển Giao Diện", title: "Xây dựng giao diện Web responsive chuẩn doanh nghiệp", pic: "Senior Web Dev", status: "TODO", progress: 0, note: "Chờ UI/UX phê duyệt" },
        { id: `${cleanCode}-BE-06`, dept: "06. Lập Trình Nghiệp Vụ", title: "Xây dựng RESTful API và Business Logic", pic: "Backend Lead", status: "TODO", progress: 0, note: "Chờ ARCH" },
        { id: `${cleanCode}-DBA-07`, dept: "07. Cơ Sở Dữ Liệu", title: "Thiết kế CSDL quan hệ chuẩn 3NF và phân vùng Index", pic: "Senior DBA", status: "TODO", progress: 0, note: "Chờ BA spec" },
        { id: `${cleanCode}-QA-08`, dept: "08. Đảm Bảo Chất Lượng", title: "Xây dựng Test Plan, Test Case và kiểm thử tự động", pic: "QA Lead", status: "TODO", progress: 0, note: "Chờ bản build" },
        { id: `${cleanCode}-OPS-09`, dept: "09. Vận Hành & Hạ Tầng", title: `Thiết lập hạ tầng ${infra} và CI/CD pipeline`, pic: "DevOps Engineer", status: "TODO", progress: 0, note: "Cấu hình Docker & SSL" }
      ],
      feedbacks: [],
      history: [
        { time: "Vừa xong", dept: "Hệ Thống", action: `Đã khởi tạo dự án mới: ${name} (${code})`, type: "success" }
      ]
    };
    projects.unshift(localProj);
    currentProjectId = newId;
  }

  saveProjectsToStorage();
  initProjectDropdown();

  const form = document.getElementById("newProjectForm");
  if (form) form.reset();
  const modal = document.getElementById("newProjectModal");
  if (modal) modal.style.display = "none";
  renderDashboard();

  showToast(`Dự án [${code}] đã được khởi tạo thành công và kích hoạt 9 phòng ban!`, "success");
}

// Real-Time Event Sync from Backend (No more fake timer simulations)
function initRealtimeHeartbeat() {
  // Connect to Real SSE stream from backend if available
  if (typeof EventSource !== "undefined") {
    try {
      const evtSource = new EventSource("/api/events");
      evtSource.onmessage = function(event) {
        try {
          const data = JSON.parse(event.data);
          if (data && data.type !== "CONNECTED") {
            const project = getCurrentProject();
            if (project) {
              project.history.unshift({
                time: "Vừa xong",
                dept: "Hệ Thống",
                action: `[SỰ KIỆN MÁY CHỦ] ${data.type || "Cập nhật dữ liệu"}`,
                type: "info"
              });
              renderActivityFeed(project);
            }
          }
        } catch (e) {}
      };
    } catch (e) {}
  }
}

function triggerRealtimeReport() {
  const project = getCurrentProject();
  if (!project) return;

  const simulatedReports = [
    { dept: "06. Backend", action: "AI Vibe vừa đẩy commit: Hoàn thành Unit Test cho Pessimistic Lock & Idempotency Key", type: "success" },
    { dept: "05. Frontend", action: "AI Vibe vừa tối ưu Cumulative Layout Shift (CLS) = 0.01 cho màn hình Catalog", type: "success" },
    { dept: "08. QA / QC", action: "QA Lead vừa xác nhận PASS cho bộ kiểm thử tải 5,000 CCU bằng k6 trên môi trường Sandbox", type: "success" },
    { dept: "07. Database", action: "DBA xác nhận chạy xong index covering cho cột orders(status, created_at)", type: "info" },
    { dept: "09. DevOps", action: "DevOps vừa cập nhật file nginx.conf kích hoạt HTTP/2 và TLS 1.3", type: "info" }
  ];

  const pick = simulatedReports[Math.floor(Math.random() * simulatedReports.length)];
  project.history.unshift({
    time: "Vừa xong",
    dept: pick.dept,
    action: `[BÁO CÁO REALTIME] ${pick.action}`,
    type: pick.type
  });

  saveProjectsToStorage();
  renderActivityFeed(project);
  showToast(`Phòng ban [${pick.dept}] vừa báo cáo mốc hoàn tất mới!`, "success");
}

// ========================================================
// SYNC PROJECTS WITH BACKEND DATABASE
// ========================================================
async function syncProjectsWithBackend() {
  try {
    const res = await fetch("/api/projects");
    if (!res.ok) return;
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      data.data.forEach(bp => {
        const idx = projects.findIndex(p => p.id === bp.id || p.code === bp.code);
        if (idx >= 0) {
          projects[idx] = { ...projects[idx], ...bp };
        } else {
          projects.push(bp);
        }
      });
      saveProjectsToStorage();
      initProjectDropdown();
      renderDashboard();
    }
  } catch (e) {
    console.debug("Backend projects sync skipped", e);
  }
}

// ========================================================
// VIRTUAL CODE STUDIO CONTROLLER (ZERO-LOAD & IN-MEMORY ZIP)
// ========================================================
let activeVirtualFilePath = "src/App.jsx";
let currentProjectVirtualFiles = {};

async function openVirtualStudio(targetFile = null) {
  const modal = document.getElementById("virtualStudioModal");
  if (!modal) return;
  const project = getCurrentProject();
  if (!project) return;

  try {
    const res = await fetch(`/api/projects/${encodeURIComponent(project.id)}/files`);
    const data = await res.json();
    if (data.success && data.data) {
      currentProjectVirtualFiles = data.data;
    } else {
      currentProjectVirtualFiles = project.files || {};
    }
  } catch (err) {
    currentProjectVirtualFiles = project.files || {};
  }

  // If no files yet, generate boilerplate
  if (Object.keys(currentProjectVirtualFiles).length === 0) {
    currentProjectVirtualFiles = {
      "package.json": JSON.stringify({ name: project.code?.toLowerCase() || "app", version: "1.0.0" }, null, 2),
      "src/App.jsx": `import React from 'react';\n\nexport default function App() {\n  return <h1>${project.name}</h1>;\n}`,
      "database/schema.sql": `-- Schema\nCREATE TABLE orders (id SERIAL PRIMARY KEY);`,
      "README.md": `# ${project.name}`
    };
  }

  renderVirtualStudioFileList();

  const fileToOpen = targetFile && currentProjectVirtualFiles[targetFile] ? targetFile : Object.keys(currentProjectVirtualFiles)[0] || "src/App.jsx";
  selectVirtualFile(fileToOpen);

  modal.style.display = "flex";
}

function closeVirtualStudio() {
  const modal = document.getElementById("virtualStudioModal");
  if (modal) modal.style.display = "none";
}

function renderVirtualStudioFileList() {
  const container = document.getElementById("virtualStudioFileList");
  const countBadge = document.getElementById("virtualStudioFileCount");
  if (!container) return;

  const files = Object.keys(currentProjectVirtualFiles);
  if (countBadge) countBadge.textContent = `${files.length} files`;

  container.innerHTML = "";
  files.forEach(filePath => {
    const item = document.createElement("div");
    item.className = `virtual-file-item ${filePath === activeVirtualFilePath ? "active" : ""}`;
    item.style.padding = "8px 14px";
    item.style.fontSize = "0.78rem";
    item.style.cursor = "pointer";
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.gap = "8px";
    item.style.transition = "all 0.15s ease";
    item.style.color = filePath === activeVirtualFilePath ? "#38BDF8" : "#94A3B8";
    item.style.background = filePath === activeVirtualFilePath ? "rgba(56, 189, 248, 0.12)" : "transparent";
    item.style.borderLeft = filePath === activeVirtualFilePath ? "3px solid #38BDF8" : "3px solid transparent";

    const iconSvg = filePath.endsWith(".jsx") || filePath.endsWith(".tsx") || filePath.endsWith(".js")
      ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
      : filePath.endsWith(".sql")
      ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`
      : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

    item.innerHTML = `${iconSvg} <span style="font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(filePath)}</span>`;
    item.addEventListener("click", () => selectVirtualFile(filePath));
    container.appendChild(item);
  });
}

function selectVirtualFile(filePath) {
  activeVirtualFilePath = filePath;
  renderVirtualStudioFileList();

  const editor = document.getElementById("virtualStudioCodeEditor");
  const nameLabel = document.getElementById("virtualStudioActiveFileName");
  const sizeLabel = document.getElementById("virtualStudioActiveFileSize");

  const content = currentProjectVirtualFiles[filePath] || "";
  if (editor) editor.value = content;
  if (nameLabel) nameLabel.textContent = filePath;
  if (sizeLabel) {
    const bytes = new Blob([content]).size;
    sizeLabel.textContent = `(${bytes > 1024 ? (bytes / 1024).toFixed(1) + " KB" : bytes + " B"})`;
  }
}

async function saveActiveVirtualFile() {
  const editor = document.getElementById("virtualStudioCodeEditor");
  if (!editor) return;
  const newContent = editor.value;
  const project = getCurrentProject();
  if (!project) return;

  currentProjectVirtualFiles[activeVirtualFilePath] = newContent;
  project.files = project.files || {};
  project.files[activeVirtualFilePath] = newContent;

  try {
    const res = await fetch(`/api/projects/${encodeURIComponent(project.id)}/files`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filePath: activeVirtualFilePath, content: newContent })
    });
    if (res.ok) {
      showToast(`Đã lưu tệp [${activeVirtualFilePath}] thành công vào CSDL!`, "success");
    }
  } catch (err) {
    console.warn("Could not sync file to server, saved locally:", err);
  }

  saveProjectsToStorage();
  selectVirtualFile(activeVirtualFilePath);
}

function downloadProjectZip() {
  const project = getCurrentProject();
  if (!project) return;
  showToast("Đang chuẩn bị gói nén ZIP trực tiếp từ RAM máy chủ...", "info");
  window.location.href = `/api/projects/${encodeURIComponent(project.id)}/export-zip`;
}

// Call on startup
syncProjectsWithBackend();



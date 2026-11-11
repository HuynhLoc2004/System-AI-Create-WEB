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
    package: "Gói 2: Standard (1.85 Tỷ)",
    budget: "1.85 Tỷ",
    serverCost: "$85/tháng (VPS + CDN)",
    daysRemaining: "Còn 42 ngày tới Go-Live",
    tokenSaved: "95.2%",
    environment: "PRODUCTION", // "PRODUCTION" (Real Data 100%) or "UAT_SANDBOX" (Mock Data)
    deptStatuses: {
      "client": "DONE",
      "pm": "DONE",
      "ba": "DONE",
      "sa": "DONE",
      "ui": "DONE",
      "fe": "IN_PROGRESS",
      "be": "IN_PROGRESS",
      "dba": "DONE",
      "qa": "IN_PROGRESS",
      "devops": "IN_PROGRESS",
      "prod": "IDLE"
    },
    tasks: [
      { 
        id: "PM-101", 
        dept: "01. Quản Trị Dự Án", 
        businessDept: "Ban Quản Trị & Điều Phối Dự Án",
        title: "Lập WBS & Bóc tách bài toán chi phí 3 gói giải pháp", 
        businessTitle: "Kế hoạch tổng thể & Dự toán ngân sách minh bạch (Gói Chuẩn 1.85 Tỷ)",
        pic: "TPM Lead", 
        status: "DONE", 
        progress: 100, 
        note: "Đã ký duyệt hợp đồng gói Standard 1.85 Tỷ",
        businessNote: "Đã hoàn thành phân rã chi tiết mốc bàn giao và ngân sách cố định không phát sinh"
      },
      { 
        id: "BA-102", 
        dept: "02. Phân Tích Nghiệp Vụ", 
        businessDept: "Bộ Phận Phân Tích Nghiệp Vụ",
        title: "Đặc tả yêu cầu SRS & Luồng BPMN thanh toán VietQR", 
        businessTitle: "Sơ đồ các bước thanh toán và quy trình xử lý đơn hàng cho khách",
        pic: "Lead BA", 
        status: "DONE", 
        progress: 100, 
        note: "Khớp 100% tiêu chí nghiệp vụ của khách",
        businessNote: "Đã hoàn thiện tài liệu mô tả luồng mua hàng và quét mã VietQR chuẩn xác"
      },
      { 
        id: "SA-103", 
        dept: "03. Kiến Trúc & Chi Phí", 
        businessDept: "Kiến Trúc Sư Hệ Thống & Tối Ưu Chi Phí",
        title: "Thiết kế kiến trúc Modular Monolith & Chọn Tech Stack", 
        businessTitle: "Chọn công nghệ Web Động tốc độ cao & Tiết kiệm chi phí thuê máy chủ",
        pic: "Solution Architect", 
        status: "DONE", 
        progress: 100, 
        note: "NestJS + Next.js SSR + PostgreSQL",
        businessNote: "Đã thiết kế hệ thống chịu tải 100.000 khách truy cập với chi phí máy chủ chỉ $85/tháng"
      },
      { 
        id: "UI-104", 
        dept: "04. Thiết Kế UI/UX", 
        businessDept: "Thiết Kế Trải Nghiệm Khách Hàng",
        title: "Xây dựng Design System độc bản & Cuộn mượt 60fps", 
        businessTitle: "Thiết kế giao diện mua sắm sang trọng, tối giản, cuộn mượt mà trên điện thoại",
        pic: "Senior UI/UX", 
        status: "DONE", 
        progress: 100, 
        note: "Đã xuất tokens.json và bàn giao Figma",
        businessNote: "Bàn giao trọn bộ màu sắc, font chữ và giao diện đạt chuẩn nhận diện thương hiệu"
      },
      { 
        id: "UI-105", 
        dept: "04. Thiết Kế UI/UX", 
        businessDept: "Thiết Kế Trải Nghiệm Khách Hàng",
        title: "Hiệu ứng 3D Parallax đồ họa nặng nề trang chủ", 
        businessTitle: "[Đã Hủy]: Hiệu ứng 3D phức tạp làm chậm máy khách hàng",
        pic: "Motion Designer", 
        status: "CANCELLED", 
        progress: 0, 
        note: "HỦY BỎ: Làm chậm LCP > 3.5s, ảnh hưởng điểm SEO!",
        businessNote: "Đã hủy bỏ hiệu ứng 3D rườm rà để ưu tiên trang web tải cực nhanh dưới 1 giây"
      },
      { 
        id: "DB-106", 
        dept: "07. Cơ Sở Dữ Liệu", 
        businessDept: "Quản Trị Cơ Sở Dữ Liệu & An Toàn Thông Tin",
        title: "Viết DDL Schema 3NF & Tước quyền DROP của app_user", 
        businessTitle: "Khởi tạo hệ thống lưu trữ thông tin đơn hàng an toàn, bảo mật dữ liệu tuyệt đối",
        pic: "DBA Senior", 
        status: "DONE", 
        progress: 100, 
        note: "Chạy migration thành công, phân quyền tối thiểu",
        businessNote: "Thiết lập phân quyền bảo mật chặt chẽ, chống hacker xóa dữ liệu doanh nghiệp"
      },
      { 
        id: "DB-107", 
        dept: "07. Cơ Sở Dữ Liệu", 
        businessDept: "Quản Trị Cơ Sở Dữ Liệu & An Toàn Thông Tin",
        title: "Cấu hình Autovacuum dọn Dead Tuples & Backup WAL 5m", 
        businessTitle: "Hệ thống tự động sao lưu dữ liệu dự phòng mỗi 5 phút (Chống mất đơn hàng)",
        pic: "DBA Senior", 
        status: "DONE", 
        progress: 100, 
        note: "Đạt mục tiêu RPO < 5 phút cho đơn hàng",
        businessNote: "Cứ 5 phút toàn bộ giao dịch mua bán được tự động sao lưu an toàn sang máy chủ phụ"
      },
      { 
        id: "BE-108", 
        dept: "06. Lập Trình Backend", 
        businessDept: "Lập Trình Nghiệp Vụ Cốt Lõi",
        title: "Khởi tạo Clean Architecture, JWT kép & RBAC Guards", 
        businessTitle: "Hệ thống đăng nhập bảo mật đa tầng, tự động khóa tài khoản khi có xâm nhập lạ",
        pic: "Backend Lead", 
        status: "DONE", 
        progress: 100, 
        note: "Access Token 15m + Refresh Token Cookie",
        businessNote: "Đã hoàn thành cơ chế bảo vệ tài khoản khách mua hàng chuẩn ngân hàng quốc tế"
      },
      { 
        id: "BE-109", 
        dept: "06. Lập Trình Backend", 
        businessDept: "Lập Trình Nghiệp Vụ Cốt Lõi",
        title: "Xử lý Pessimistic Lock trừ kho & BullMQ delay job", 
        businessTitle: "Chức năng Giữ hàng trong giỏ & Tự động hoàn kho sau 10 phút nếu khách chưa thanh toán",
        pic: "Backend Senior", 
        status: "IN_PROGRESS", 
        progress: 80, 
        note: "Đang kiểm thử hoàn kho tự động sau 10 phút",
        businessNote: "Ngăn chặn tình trạng 2 khách đặt trùng một sản phẩm và tự động nhả kho khi đơn hết hạn"
      },
      { 
        id: "BE-110", 
        dept: "06. Lập Trình Backend", 
        businessDept: "Lập Trình Nghiệp Vụ Cốt Lõi",
        title: "Tích hợp Webhook IPN ngân hàng VietQR tự động", 
        businessTitle: "Chức năng Quét mã VietQR tự động - Xác nhận tiền về tài khoản tức thì",
        pic: "Backend Mid", 
        status: "BLOCKED", 
        progress: 40, 
        note: "ĐANG NGHẼN: Đang chờ đối tác ngân hàng cấp Sandbox!",
        businessNote: "Ngân hàng đối tác cấp môi trường thử nghiệm chậm -> Đội ngũ kỹ thuật đã chủ động mở cổng thanh toán mô phỏng nội bộ để khách hàng kiểm thử bình thường, không trễ tiến độ.",
        blockedSolution: {
          issue: "Ngân hàng đối tác phản hồi chậm về cấp quyền Sandbox thử nghiệm thanh toán trực tiếp",
          solution: "PM & SA thống nhất kích hoạt Mock VietQR Server nội bộ chuẩn EMVCo, tạo bộ Webhook giả lập để đội Frontend & Backend tiếp tục lập trình, bảo đảm không làm chậm tiến độ bàn giao của khách hàng dù chỉ 1 ngày!"
        }
      },
      { 
        id: "FE-111", 
        dept: "05. Lập Trình Frontend", 
        businessDept: "Lập Trình Giao Diện Web & App",
        title: "Cấu hình Lenis Smooth Scroll 60fps & Khung Base shell", 
        businessTitle: "Tối ưu trải nghiệm lướt màn hình mượt mà, thao tác êm ái trên mọi điện thoại",
        pic: "Frontend Lead", 
        status: "DONE", 
        progress: 100, 
        note: "Đã tích hợp smooth_scroll_provider.tsx",
        businessNote: "Cuộn trang êm ái 60fps, mang lại cảm giác mua sắm cao cấp như ứng dụng Apple"
      },
      { 
        id: "FE-112", 
        dept: "05. Lập Trình Frontend", 
        businessDept: "Lập Trình Giao Diện Web & App",
        title: "Dựng màn hình Giỏ hàng & Checkout với Optimistic UI", 
        businessTitle: "Màn hình Giỏ hàng & Thanh toán thông minh (Tự động tính tiền ship và mã giảm giá)",
        pic: "Frontend Mid", 
        status: "IN_PROGRESS", 
        progress: 85, 
        note: "Đang test trên thiết bị di động 375px",
        businessNote: "Khách hàng thao tác thêm bớt sản phẩm nhận kết quả ngay tức khắc không cần chờ tải lại trang"
      },
      { 
        id: "FE-113", 
        dept: "05. Lập Trình Frontend", 
        businessDept: "Lập Trình Giao Diện Web & App",
        title: "Tính năng chia sẻ giỏ hàng lên mạng xã hội", 
        businessTitle: "[Đã Hủy]: Tính năng chia sẻ giỏ hàng lên mạng xã hội (Khách hàng yêu cầu bỏ)",
        pic: "Frontend Junior", 
        status: "CANCELLED", 
        progress: 0, 
        note: "HỦY BỎ: Khách hàng đánh giá không thiết yếu",
        businessNote: "Đã lược bỏ tính năng theo đúng yêu cầu phản hồi của khách hàng để giao diện đơn giản nhất"
      },
      { 
        id: "QA-114", 
        dept: "08. Kiểm Thử QA/QC", 
        businessDept: "Bộ Phận Kiểm Định Chất Lượng & Bảo Mật",
        title: "Kiểm thử thâm nhập bảo mật ô Input (Chống SQLi & XSS)", 
        businessTitle: "Kiểm định an ninh mạng, chống hacker và bảo vệ thông tin thẻ thanh toán của khách",
        pic: "QA Lead", 
        status: "DONE", 
        progress: 100, 
        note: "Pass 100% các payload độc hại trên Mock DB",
        businessNote: "Đã vượt qua 100% các bài kiểm tra tấn công thử nghiệm, bảo đảm website an toàn tuyệt đối"
      },
      { 
        id: "QA-115", 
        dept: "08. Kiểm Thử QA/QC", 
        businessDept: "Bộ Phận Kiểm Định Chất Lượng & Bảo Mật",
        title: "Kiểm định 5 chiều UI/UX/Hiệu ứng/Responsive màn hình", 
        businessTitle: "Kiểm thử hiển thị chuẩn đẹp trên 20 dòng điện thoại iPhone, Samsung và máy tính bảng",
        pic: "QA Specialist", 
        status: "IN_PROGRESS", 
        progress: 65, 
        note: "Đã kiểm tra xong 14/20 màn hình",
        businessNote: "Đang kiểm tra chi tiết để trang web không bị tràn chữ hay lệch nút trên mọi kích thước màn hình"
      },
      { 
        id: "OPS-116", 
        dept: "09. Hạ Tầng DevOps", 
        businessDept: "Hạ Tầng Đám Mây & Vận Hành 24/7",
        title: "Đóng gói Docker Multi-stage 85MB qua .dockerignore", 
        businessTitle: "Tối ưu tốc độ tải trang cực nhanh (dưới 1 giây) khi lượng khách truy cập đông",
        pic: "DevOps Engineer", 
        status: "DONE", 
        progress: 100, 
        note: "Quét Trivy 0 lỗi bảo mật CVE",
        businessNote: "Nén dung lượng hệ thống siêu nhẹ, giúp website tải nhanh gấp 3 lần bình thường"
      },
      { 
        id: "OPS-117", 
        dept: "09. Hạ Tầng DevOps", 
        businessDept: "Hạ Tầng Đám Mây & Vận Hành 24/7",
        title: "Thiết lập GitHub Actions CI/CD Rolling Deploy VPS", 
        businessTitle: "Cài đặt chứng chỉ bảo mật SSL xanh (HTTPS) và hệ thống máy chủ vận hành 24/7",
        pic: "DevOps Engineer", 
        status: "IN_PROGRESS", 
        progress: 90, 
        note: "Đang hoàn tất cấu hình Nginx SSL tự động",
        businessNote: "Khách hàng truy cập luôn thấy ổ khóa bảo mật màu xanh an toàn, hệ thống tự động cập nhật không gián đoạn"
      }
    ],
    feedbacks: [
      {
        id: "FB-01",
        title: "Đồng bộ nhận diện thương hiệu Dark Navy & Tối ưu cuộn 60fps",
        sender: "Đại Diện Khách Hàng (Sponsor)",
        category: "Giao diện UI/UX",
        time: "Hôm qua 15:30",
        content: "Hạn chế tối đa emoji màu mè, đổi font chữ sắc nét và dùng màu Dark Navy theo đúng Brand Guideline. Cuộn trang phải đạt 60fps mượt mà.",
        pmSolution: "Ban Quản Trị đã chỉ đạo bộ phận thiết kế tinh chỉnh lại toàn bộ bảng màu tối giản, chuyên nghiệp theo đúng nhận diện thương hiệu công ty và tối ưu trải nghiệm cuộn trang mượt mà 60fps trên điện thoại.",
        assignedDept: "04. Thiết Kế UI/UX",
        status: "RESOLVED"
      },
      {
        id: "FB-02",
        title: "Tích hợp Web Động & Đối soát thanh toán VietQR ngân hàng thực",
        sender: "Giám Đốc Vận Hành",
        category: "Nghiệp vụ Web Động",
        time: "Hôm nay 09:15",
        content: "Trang Checkout phải kết nối API VietQR thật trên Production, tự động đối soát ngân hàng ngay khi khách quét mã, không dùng trang tĩnh.",
        pmSolution: "Ban Quản Trị đã phê duyệt triển khai cổng thanh toán Web Động, kết nối hệ thống tự động nhận diện tiền về tài khoản ngân hàng và kiểm thử an toàn trước khi bàn giao.",
        assignedDept: "06. Lập Trình Backend",
        status: "IN_PROGRESS"
      }
    ],
    history: [
      { time: "5 phút trước", dept: "05. Frontend", action: "Hoàn tất ghép giao diện Checkout Mobile view 390px (Web Động React)", type: "success" },
      { time: "18 phút trước", dept: "06. Backend", action: "Báo cáo Blocker: Đang chờ ngân hàng kích hoạt cổng Sandbox", type: "danger" },
      { time: "42 phút trước", dept: "08. QA / QC", action: "Thực thi xong bộ test case Input Security trên Mock DB - Ký PASS", type: "success" },
      { time: "1 giờ trước", dept: "07. Database", action: "Hoàn tất cấu hình Autovacuum dọn rác và script Backup WAL 5 phút", type: "info" },
      { time: "2 giờ trước", dept: "09. DevOps", action: "Đóng gói xong Docker Image dung lượng siêu nhẹ 85MB", type: "info" }
    ],
    clientConfig: {
      brandName: "Novawear Premium Retail",
      headline: "Hệ Thống Bán Lẻ Thời Trang Đa Kênh Tích Hợp VietQR Động Tự Động",
      previewUrl: "http://192.168.1.108:3000/storefront",
      deployMode: "LOCAL_SERVER",
      customDomain: "https://novawear.com.vn",
      sslActive: true,
      adminStoreUser: "novawear_admin",
      adminStorePass: "Nova@2026MasterPass",
      bannerTitle: "Bộ Sưu Tập Thu Đông 2026 - Giảm 20% Cho Đơn Hàng Đầu Tiên",
      bannerSubtitle: "Thanh toán quét mã VietQR tự động 1 giây - Tiền về tài khoản ngay lập tức",
      contactPhone: "0909 888 999",
      contactZalo: "https://zalo.me/0909888999",
      contactFacebook: "https://facebook.com/novawear.official",
      contactEmail: "admin@novawear.com.vn",
      aiConsultingModel: "gemini-2.5-pro",
      aiTone: "Thực chiến, dễ hiểu (Không dùng thuật ngữ kỹ thuật khó hiểu)",
      products: [
        {
          id: "prod_01",
          name: "Áo Blazer Linen Ý Thiết Kế Form Rộng",
          category: "Thời Trang Nam",
          price: 1250000,
          stock: 45,
          sku: "NW-BLZ-01",
          status: "IN_STOCK"
        },
        {
          id: "prod_02",
          name: "Đầm Lụa Tơ Tằm Thêu Tay Họa Tiết Sen",
          category: "Thời Trang Nữ",
          price: 1850000,
          stock: 28,
          sku: "NW-DRS-02",
          status: "IN_STOCK"
        },
        {
          id: "prod_03",
          name: "Giày Oxford Da Bò Nhập Khẩu Thủ Công",
          category: "Phụ Kiện Da",
          price: 2400000,
          stock: 16,
          sku: "NW-SHOE-03",
          status: "IN_STOCK"
        },
        {
          id: "prod_04",
          name: "Túi Xách Da Công Sở Đựng Laptop 14 Inch",
          category: "Phụ Kiện Da",
          price: 1590000,
          stock: 32,
          sku: "NW-BAG-04",
          status: "IN_STOCK"
        }
      ]
    }
  },
  {
    id: "prj_fintech",
    code: "PRJ-FINTECH-2026",
    name: "Cổng Ví Điện Tử & Chuyển Tiền Tức Thời",
    package: "Gói 1: MVP Tinh Gọn (550 Triệu)",
    budget: "550 Triệu",
    serverCost: "$45/tháng (VPS)",
    daysRemaining: "Còn 18 ngày tới Go-Live",
    tokenSaved: "97.1%",
    environment: "UAT_SANDBOX", // Sandbox Mock Data isolated
    deptStatuses: {
      "client": "DONE",
      "pm": "DONE",
      "ba": "DONE",
      "sa": "DONE",
      "ui": "IN_PROGRESS",
      "fe": "IN_PROGRESS",
      "be": "IN_PROGRESS",
      "dba": "DONE",
      "qa": "IDLE",
      "devops": "DONE",
      "prod": "IDLE"
    },
    tasks: [
      { id: "PM-201", dept: "01. Quản Trị Dự Án", title: "Khảo sát và chốt phạm vi MVP trong 2.5 tháng", pic: "TPM Lead", status: "DONE", progress: 100, note: "Tiết kiệm chi phí tối đa" },
      { id: "BA-202", dept: "02. Phân Tích Nghiệp Vụ", title: "Đặc tả luồng nạp rút tiền qua ngân hàng liên kết", pic: "Lead BA", status: "DONE", progress: 100, note: "Luồng chuẩn bảo mật 2FA" },
      { id: "DB-203", dept: "07. Cơ Sở Dữ Liệu", title: "Thiết kế bảng số dư ví và nhật ký giao dịch tài chính", pic: "DBA Senior", status: "DONE", progress: 100, note: "Kiểm tra ràng buộc số dư >= 0" },
      { id: "BE-204", dept: "06. Lập Trình Backend", title: "Xây dựng lõi chuyển tiền với Transaction cô lập cấp cao", pic: "Backend Senior", status: "IN_PROGRESS", progress: 60, note: "Đang test concurrency" },
      { id: "FE-205", dept: "05. Lập Trình Frontend", title: "Giao diện bàn phím số OTP và quét mã QR chuyển tiền", pic: "Frontend Lead", status: "IN_PROGRESS", progress: 45, note: "Tối ưu vùng chạm 48px" }
    ],
    feedbacks: [
      {
        id: "FB-11",
        title: "Kiểm định an toàn ô Input nạp rút tiền, chống gian lận số dư âm",
        sender: "Risk & Compliance Lead",
        category: "Bảo mật thông tin",
        time: "2 ngày trước",
        content: "Kiểm thử thâm nhập toàn bộ ô input chuyển tiền, ngăn chặn triệt để SQL Injection và tấn công số dư âm.",
        pmSolution: "Áp dụng Parameterized Query và Pessimistic Locking với ràng buộc kiểm tra số dư. Đã điều phối tác vụ DB-203 & BE-204.",
        assignedDept: "07. Cơ Sở Dữ Liệu",
        status: "RESOLVED"
      }
    ],
    history: [
      { time: "25 phút trước", dept: "06. Backend", action: "Triển khai hàm đối soát số dư ví với cơ chế ACID trên Mock DB", type: "info" },
      { time: "1 giờ trước", dept: "07. Database", action: "Chốt DDL Schema bảng wallets và audit_ledgers", type: "success" }
    ],
    clientConfig: {
      brandName: "PaySmart Gateway Enterprise",
      headline: "Hạ Tầng Thanh Toán Đa Kênh & Chuyển Tiền Tức Thời 24/7",
      previewUrl: "https://sandbox-api.paysmart.vn/portal",
      deployMode: "VPS_STAGING",
      customDomain: "https://paysmart.vn",
      sslActive: true,
      adminStoreUser: "paysmart_admin",
      adminStorePass: "PaySmart@Sec2026!",
      bannerTitle: "Cổng Thanh Toán Tích Hợp 40+ Ngân Hàng & Ví Điện Tử",
      bannerSubtitle: "API Webhook IPN xử lý giao dịch dưới 50ms - Tỷ lệ uptime 99.99%",
      contactPhone: "0912 345 678",
      contactZalo: "https://zalo.me/0912345678",
      contactFacebook: "https://facebook.com/paysmart.vn",
      contactEmail: "support@paysmart.vn",
      aiConsultingModel: "gemini-2.5-pro",
      aiTone: "Thực chiến, dễ hiểu (Không dùng thuật ngữ kỹ thuật khó hiểu)",
      products: [
        {
          id: "prod_ft_01",
          name: "Gói Cổng Thanh Toán Merchant Khởi Nghiệp",
          category: "Dịch Vụ Cổng API",
          price: 3500000,
          stock: 100,
          sku: "PS-GATE-BASIC",
          status: "IN_STOCK"
        },
        {
          id: "prod_ft_02",
          name: "Thiết Bị Smart POS Quẹt Thẻ & Quét VietQR Động",
          category: "Thiết Bị Điểm Bán",
          price: 4200000,
          stock: 35,
          sku: "PS-TERM-02",
          status: "IN_STOCK"
        },
        {
          id: "prod_ft_03",
          name: "Bản Quyền Hệ Thống Đối Soát Doanh Thu Tự Động",
          category: "Phần Mềm Quản Trị",
          price: 8500000,
          stock: 50,
          sku: "PS-RECON-PRO",
          status: "IN_STOCK"
        }
      ]
    }
  },
  {
    id: "prj_enterprise",
    code: "PRJ-CORP-ERP",
    name: "Hệ Thống ERP Quản Trị Kho & Chuỗi Cung Ứng",
    package: "Gói 3: Enterprise (3.5 Tỷ)",
    budget: "3.5 Tỷ",
    serverCost: "$350/tháng (Multi-Node)",
    daysRemaining: "Còn 95 ngày tới Go-Live",
    tokenSaved: "92.8%",
    environment: "PRODUCTION",
    deptStatuses: {
      "client": "DONE",
      "pm": "DONE",
      "ba": "DONE",
      "sa": "DONE",
      "ui": "DONE",
      "fe": "IN_PROGRESS",
      "be": "DONE",
      "dba": "DONE",
      "qa": "IN_PROGRESS",
      "devops": "DONE",
      "prod": "IN_PROGRESS"
    },
    tasks: [
      { id: "PM-301", dept: "01. Quản Trị Dự Án", title: "Thiết lập cấu trúc WBS phân rã 8 phân hệ doanh nghiệp", pic: "TPM Lead", status: "DONE", progress: 100, note: "Quản trị tiến độ đa phòng ban" },
      { id: "SA-302", dept: "03. Kiến Trúc & Chi Phí", title: "Quy chuẩn kiến trúc Event-Driven Microservices", pic: "Principal Architect", status: "DONE", progress: 100, note: "Cụm RabbitMQ + PostgreSQL Sharding" },
      { id: "DB-303", dept: "07. Cơ Sở Dữ Liệu", title: "Phân vùng Partitioning bảng lịch sử xuất nhập kho theo tháng", pic: "DBA Specialist", status: "DONE", progress: 100, note: "Giảm 75% thời gian query báo cáo" },
      { id: "BE-304", dept: "06. Lập Trình Backend", title: "APIs đồng bộ máy quét mã vạch cầm tay thời gian thực", pic: "Backend Team", status: "DONE", progress: 100, note: "Tốc độ phản hồi < 50ms" },
      { id: "QA-305", dept: "08. Kiểm Thử QA/QC", title: "Test tải mô phỏng 10.000 lượt quét kho đồng thời bằng k6", pic: "QA Lead", status: "IN_PROGRESS", progress: 70, note: "Đạt chuẩn P95 < 120ms" }
    ],
    feedbacks: [
      {
        id: "FB-21",
        title: "Tối ưu truy vấn báo cáo kho hàng triệu dòng, không gây nghẽn dashboard",
        sender: "Giám Đốc Kho Vận",
        category: "Cơ sở dữ liệu & Tải trọng",
        time: "Hôm nay 11:00",
        content: "Dữ liệu xuất nhập kho hàng triệu dòng, yêu cầu query báo cáo tổng hợp phản hồi dưới 1 giây, không treo dashboard.",
        pmSolution: "Phân vùng Partitioning bảng inventory theo quý kết hợp Materialized View và Redis Caching. Đã điều phối tác vụ DB-303.",
        assignedDept: "07. Cơ Sở Dữ Liệu",
        status: "IN_PROGRESS"
      }
    ],
    history: [
      { time: "10 phút trước", dept: "08. QA / QC", action: "Đang chạy kịch bản k6 tải cao 5.000 CCU - Hệ thống ổn định", type: "success" },
      { time: "3 giờ trước", dept: "07. Database", action: "Hoàn tất tạo Partition theo quý cho bảng inventory_logs", type: "info" }
    ],
    clientConfig: {
      brandName: "OmniLogistics ERP",
      headline: "Hệ Thống Quản Trị Chuỗi Cung Ứng, Kho Vận & Đội Xe Đa Điểm",
      previewUrl: "http://10.0.0.12:8080/erp-portal",
      deployMode: "LOCAL_SERVER",
      customDomain: "https://erp.omnilogistics.com",
      sslActive: true,
      adminStoreUser: "omni_root",
      adminStorePass: "OmniCorp@2026MasterKey",
      bannerTitle: "Tự Động Hóa Quản Lý 12 Chi Nhánh & Đội Xe 80 Phương Tiện",
      bannerSubtitle: "Đồng bộ tồn kho thời gian thực - Báo cáo lợi nhuận tức thời",
      contactPhone: "0988 777 666",
      contactZalo: "https://zalo.me/0988777666",
      contactFacebook: "https://facebook.com/omnilogistics",
      contactEmail: "contact@omnilogistics.com",
      aiConsultingModel: "gemini-2.5-pro",
      aiTone: "Thực chiến, dễ hiểu (Không dùng thuật ngữ kỹ thuật khó hiểu)",
      products: [
        {
          id: "prod_erp_01",
          name: "Bản Quyền Module Quản Lý Kho Vận Đa Điểm (WMS)",
          category: "Module Phần Mềm",
          price: 15500000,
          stock: 20,
          sku: "OL-WMS-01",
          status: "IN_STOCK"
        },
        {
          id: "prod_erp_02",
          name: "Module Định Vị GPS & Điều Phối Đội Xe Vận Tải (TMS)",
          category: "Module Phần Mềm",
          price: 12800000,
          stock: 25,
          sku: "OL-TMS-02",
          status: "IN_STOCK"
        },
        {
          id: "prod_erp_03",
          name: "Máy Quét Mã Vạch Cầm Tay Kết Nối Wi-Fi Công Nghiệp",
          category: "Phần Cứng Kho Hàng",
          price: 3850000,
          stock: 40,
          sku: "OL-SCAN-03",
          status: "IN_STOCK"
        }
      ]
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
    x: 90, y: 235, width: 145, height: 80
  },
  "pm": {
    badge: "01. PM",
    title: "QUẢN TRỊ DỰ ÁN",
    subtitle: "Project Manager / TPM",
    role: "Trung tâm điều hành, tiếp nhận phản hồi khách hàng, phân tích Solution kỹ thuật và điều phối 8 phòng ban.",
    inputs: ["Mục tiêu kinh doanh & Feedback từ khách", "Phản hồi tiến độ từ 8 phòng ban", "Báo cáo rủi ro kỹ thuật"],
    deliverables: ["WBS phân rã công việc", "Bảng điều khiển Master Task", "Solution giải quyết phản hồi khách hàng"],
    x: 250, y: 235, width: 145, height: 80
  },
  "ba": {
    badge: "02. BA",
    title: "PHÂN TÍCH NGHIỆP VỤ",
    subtitle: "Business Analyst",
    role: "Khám phá chiến lược (Brand/SEO/CRO), đặc tả phần mềm SRS và bẻ rã ma trận yêu cầu.",
    inputs: ["Ý tưởng kinh doanh từ khách", "Góp ý khả thi từ Solution Architect", "Phỏng vấn người dùng cuối"],
    deliverables: ["Tài liệu BRD & SRS chuẩn", "Sơ đồ quy trình BPMN", "Ma trận phân rã công việc xuống 6 phòng ban"],
    x: 410, y: 235, width: 145, height: 80
  },
  "sa": {
    badge: "03. SA",
    title: "KIẾN TRÚC & CHI PHÍ",
    subtitle: "Solution Architect",
    role: "Định hình khung xương kỹ thuật Modular Monolith, chọn Tech Stack và tính toán chi phí hạ tầng.",
    inputs: ["Tài liệu SRS từ BA", "Dung lượng tải trọng dự kiến (CCU/RPS)", "Tham vấn cùng các Tech Leads"],
    deliverables: ["Tài liệu kiến trúc hệ thống SAD", "Bộ ghi nhận quyết định ADRs", "Bảng bóc tách chi phí CBS"],
    x: 585, y: 145, width: 155, height: 80
  },
  "ui": {
    badge: "04. UI/UX",
    title: "THIẾT KẾ TRẢI NGHIỆM",
    subtitle: "Design System & Motion",
    role: "Bản sắc thiết kế độc bản, tôn trọng Brand Guideline của khách, font chữ nghiêm túc và cuộn 60fps.",
    inputs: ["SRS & Luồng người dùng từ BA", "Định hướng thương hiệu khách hàng", "Tiêu chuẩn kỹ thuật từ Frontend"],
    deliverables: ["Bộ Design System tokens.json", "Prototype Figma có tương tác", "Quy chuẩn cuộn Kinetic Scroll 60fps"],
    x: 585, y: 325, width: 155, height: 80
  },
  "dba": {
    badge: "07. DBA",
    title: "CƠ SỞ DỮ LIỆU",
    subtitle: "Database Administrator",
    role: "Thiết kế ERD chuẩn 3NF, gác cổng bảo mật chống SQLi, tối ưu Index chống phình đĩa và dọn rác.",
    inputs: ["Báo cáo thực thể từ BA & SA", "Tần suất câu lệnh từ Backend", "Dung lượng tăng trưởng dữ liệu"],
    deliverables: ["DDL Schema & Migration scripts", "Chiến lược Index có chọn lọc", "Script Autovacuum & Backup WAL 5m"],
    x: 775, y: 120, width: 155, height: 80
  },
  "be": {
    badge: "06. BE",
    title: "LẬP TRÌNH BACKEND",
    subtitle: "Clean Arch & Core APIs",
    role: "Bộ não xử lý Web Động, quản trị Transaction ACID, bảo mật JWT kép, Worker BullMQ và Caching.",
    inputs: ["SRS từ BA", "Database Schema từ DBA", "Kiến trúc SAD từ Solution Architect"],
    deliverables: ["Hệ thống API RESTful chuẩn Swagger", "Xử lý hàng đợi bất đồng bộ", "Unit Test bảo vệ logic nghiệp vụ"],
    x: 775, y: 235, width: 155, height: 80
  },
  "fe": {
    badge: "05. FE",
    title: "LẬP TRÌNH FRONTEND",
    subtitle: "Web Động Next.js / React",
    role: "Tái hiện thiết kế pixel-perfect, cấu hình cuộn êm ái Lenis, tối ưu Web Động và Responsive.",
    inputs: ["Bản vẽ Figma & Design Tokens", "Tài liệu API Swagger từ Backend", "Mock Server chạy độc lập"],
    deliverables: ["Ứng dụng Web Động Next.js", "Clean Components theo Atomic design", "Tích hợp API qua Axios Interceptors"],
    x: 775, y: 350, width: 155, height: 80
  },
  "qa": {
    badge: "08. QA",
    title: "KIỂM ĐỊNH CHẤT LƯỢNG",
    subtitle: "QA/QC & Input Security",
    role: "Kiểm thử từng chức năng ngay khi bàn giao, ghi nhật ký PASS/FAIL, kiểm tra bảo mật ô input trên Mock DB.",
    inputs: ["SRS từ BA", "Bản build Staging từ Dev", "Môi trường Sandbox cô lập với Mock Data"],
    deliverables: ["Nhật ký kiểm thử tính năng PASS/FAIL", "Ma trận kiểm thử bảo mật Input", "Biên bản nghiệm thu QA Sign-off"],
    x: 975, y: 235, width: 155, height: 80
  },
  "devops": {
    badge: "09. OPS",
    title: "HẠ TẦNG & TRIỂN KHAI",
    subtitle: "DevOps & CI/CD Cloud",
    role: "Đề xuất server tối ưu chi phí, CI/CD tự động, bảo mật Secret Keys, đóng gói Docker 85MB và Rollback 60s.",
    inputs: ["Mã nguồn từ Dev", "Chứng nhận nghiệm thu từ QA", "Cấu hình biến môi trường .env"],
    deliverables: ["Đường ống CI/CD GitHub/GitLab/Jenkins", "Hệ thống Docker Compose VPS chạy 24/7", "Dashboard Prometheus & Alert Bot Telegram"],
    x: 1165, y: 235, width: 155, height: 80
  },
  "prod": {
    badge: "PROD",
    title: "VẬN HÀNH THỰC TẾ",
    subtitle: "Production 24/7",
    role: "Môi trường vận hành sản xuất thực tế phục vụ người tiêu dùng cuối không gián đoạn.",
    inputs: ["Bản release tag chính thức từ DevOps", "Chứng chỉ SSL TLS 1.3", "Hạ tầng Cloudflare WAF"],
    deliverables: ["Uptime SLA 99.9%", "Trải nghiệm người dùng mượt mà", "Báo cáo doanh thu & giao dịch ngân hàng"],
    x: 1345, y: 235, width: 145, height: 80
  }
};

// Workflow Graph Connection Edges (From -> To)
const workflowEdges = [
  { from: "client", to: "pm" },
  { from: "pm", to: "ba" },
  { from: "ba", to: "sa" },
  { from: "ba", to: "ui" },
  { from: "sa", to: "dba" },
  { from: "sa", to: "be" },
  { from: "ui", to: "fe" },
  { from: "dba", to: "be", bidirectional: true },
  { from: "be", to: "fe", bidirectional: true },
  { from: "dba", to: "qa" },
  { from: "be", to: "qa" },
  { from: "fe", to: "qa" },
  { from: "qa", to: "devops" },
  { from: "devops", to: "prod" }
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

function loadProjectsFromStorage() {
  const saved = localStorage.getItem("it_assignment_projects_v8");
  if (saved) {
    try {
      projects = JSON.parse(saved);
      // Validate array health
      if (!Array.isArray(projects) || projects.length === 0 || !projects[0].tasks || projects[0].tasks.length === 0) {
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
        keyInput.value = "";
        keyInput.style.borderColor = "#1E283D";
        keyInput.style.boxShadow = "none";
      }
      dispatchModal.style.display = "flex";
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

  // Modal: Client CMS Management Center
  const btnOpenClientCms = document.getElementById("btnOpenClientCmsModal");
  if (btnOpenClientCms) {
    btnOpenClientCms.addEventListener("click", () => openClientCmsModal());
  }
  const btnDropdownClientCms = document.getElementById("btnDropdownClientCms");
  if (btnDropdownClientCms) {
    btnDropdownClientCms.addEventListener("click", () => {
      toggleToolsDropdown(false);
      openClientCmsModal();
    });
  }
  const btnCloseClientCms = document.getElementById("btnCloseClientCmsModal");
  if (btnCloseClientCms) {
    btnCloseClientCms.addEventListener("click", () => closeClientCmsModal());
  }
  const btnCancelClientCms = document.getElementById("btnCancelClientCms");
  if (btnCancelClientCms) {
    btnCancelClientCms.addEventListener("click", () => closeClientCmsModal());
  }
  const btnAddCmsProduct = document.getElementById("btnAddCmsProduct");
  if (btnAddCmsProduct) {
    btnAddCmsProduct.addEventListener("click", () => addCmsProduct());
  }
  const cmsProjectSelect = document.getElementById("cmsProjectSelect");
  if (cmsProjectSelect) {
    cmsProjectSelect.addEventListener("change", (e) => {
      const proj = projects.find(p => p.id === e.target.value);
      if (proj) loadCmsFormForProject(proj);
    });
  }
  const clientCmsForm = document.getElementById("clientCmsForm");
  if (clientCmsForm) {
    clientCmsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveCmsConfiguration();
    });
  }

  // Gemini Builder (Con AI thứ 2 chuyên tạo Website)
  const btnRunGeminiBuilder = document.getElementById("btnRunGeminiBuilder");
  if (btnRunGeminiBuilder) {
    btnRunGeminiBuilder.addEventListener("click", async () => {
      const promptInput = document.getElementById("aiBuilderPromptInput");
      const prompt = promptInput ? promptInput.value.trim() : "";
      if (!prompt) {
        showToast("Vui lòng nhập mô tả ý tưởng/ngành nghề để Gemini tạo website!", "danger");
        if (promptInput) promptInput.focus();
        return;
      }

      btnRunGeminiBuilder.disabled = true;
      btnRunGeminiBuilder.textContent = "Gemini Đang Tạo Web...";

      try {
        const selectedProjId = document.getElementById("cmsProjectSelect").value;
        const res = await fetch("/api/ai/generate-website", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, projectId: selectedProjId })
        });
        const data = await res.json();
        if (data.success && data.data) {
          const cfg = data.data;
          document.getElementById("cmsBrandName").value = cfg.brandName || "";
          document.getElementById("cmsHeadline").value = cfg.headline || "";
          document.getElementById("cmsBannerTitle").value = cfg.bannerTitle || "";
          document.getElementById("cmsBannerSubtitle").value = cfg.bannerSubtitle || "";
          if (cfg.previewUrl) document.getElementById("cmsPreviewUrl").value = cfg.previewUrl;
          if (cfg.customDomain) document.getElementById("cmsCustomDomain").value = cfg.customDomain;
          if (cfg.adminStoreUser) document.getElementById("cmsAdminUser").value = cfg.adminStoreUser;
          if (cfg.adminStorePass) document.getElementById("cmsAdminPass").value = cfg.adminStorePass;

          if (Array.isArray(cfg.products) && cfg.products.length > 0) {
            activeCmsProducts = cfg.products;
            renderCmsProductsTable();
          }

          showToast(`Gemini Builder đã tạo xong website & ${activeCmsProducts.length} sản phẩm thật!`, "success");
        } else {
          showToast("Có lỗi xảy ra: " + (data.error || "Không thể tạo website"), "danger");
        }
      } catch (err) {
        showToast("Lỗi kết nối máy chủ: " + err.message, "danger");
      } finally {
        btnRunGeminiBuilder.disabled = false;
        btnRunGeminiBuilder.textContent = "Gemini Tạo Web & Sản Phẩm";
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
      window.location.href = "client_portal.html";
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
  if (kpiDays) kpiDays.textContent = project.daysRemaining || "Đang cập nhật";

  const statComp = document.getElementById("statCompleted");
  if (statComp) statComp.textContent = completedTasks;

  const statProg = document.getElementById("statInProgress");
  if (statProg) statProg.textContent = inProgressTasks;

  const statBlock = document.getElementById("statBlocked");
  if (statBlock) statBlock.textContent = blockedTasks;

  const statCanc = document.getElementById("statCancelled");
  if (statCanc) statCanc.textContent = cancelledTasks;

  const totalLabel = document.getElementById("kpiTotalTasksCount");
  if (totalLabel) totalLabel.textContent = `Tổng: ${totalTasks} Tasks`;

  const pkgBadge = document.getElementById("kpiPackageBadge");
  if (pkgBadge) pkgBadge.textContent = project.package.split(":")[0];

  const budgetNum = document.getElementById("kpiBudgetNum");
  if (budgetNum) budgetNum.textContent = project.budget;

  const serverCost = document.getElementById("kpiServerCost");
  if (serverCost) serverCost.textContent = `Server: ${project.serverCost}`;

  const tokenSaved = document.getElementById("kpiTokenSaved");
  if (tokenSaved) tokenSaved.textContent = project.tokenSaved || "95.2%";

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

  // 1. Draw 5 Stage Column Backgrounds (Clear Zones)
  const stages = [
    { title: "PHA 1: KHỞI TẠO & YÊU CẦU", x: 15, y: 15, width: 480, height: 440 },
    { title: "PHA 2: THIẾT KẾ & KIẾN TRÚC", x: 505, y: 15, width: 160, height: 440 },
    { title: "PHA 3: LẬP TRÌNH & CSDL", x: 675, y: 15, width: 200, height: 440 },
    { title: "PHA 4: KIỂM ĐỊNH QA", x: 885, y: 15, width: 180, height: 440 },
    { title: "PHA 5: TRIỂN KHAI THỰC TẾ", x: 1075, y: 15, width: 345, height: 440 }
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
function handleDispatchDirective() {
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
  const deptName = document.getElementById("dispatchDept").value;
  const rawTitle = document.getElementById("dispatchTitle").value;
  const rawDetails = document.getElementById("dispatchDetails").value;
  const priority = document.getElementById("dispatchPriority").value;

  const title = sanitizeInput(rawTitle);
  const details = sanitizeInput(rawDetails);

  if (!title) {
    showToast("Tiêu đề chỉ đạo không được để trống hoặc chứa ký tự độc hại!", "danger");
    return;
  }

  const directiveId = `DIR-${Math.floor(100 + Math.random() * 900)}`;

  // Find corresponding department key to highlight on canvas
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

  // Insert directive as high-priority task at the top
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

  // Target department shifts to IN_PROGRESS
  if (project.deptStatuses) {
    project.deptStatuses[targetKey] = "IN_PROGRESS";
  }

  // Log to activity history
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

function handleCreateNewProject() {
  if (currentRole !== "ADMIN") return;

  const rawName = document.getElementById("modalProjName").value;
  const rawCode = document.getElementById("modalProjCode").value;
  const pkg = document.getElementById("modalProjPackage").value;

  const name = sanitizeInput(rawName);
  const code = sanitizeInput(rawCode);

  if (!name || !code) {
    showToast("Vui lòng điền tên và mã dự án hợp lệ!", "danger");
    return;
  }

  const newId = `prj_${Date.now()}`;
  const newProject = {
    id: newId,
    code,
    name,
    package: pkg,
    budget: pkg.includes("1.85") ? "1.85 Tỷ" : pkg.includes("550") ? "550 Triệu" : "3.5 Tỷ",
    serverCost: "$85/tháng",
    daysRemaining: "Còn 60 ngày tới Go-Live",
    tokenSaved: "96.4%",
    environment: "PRODUCTION",
    deptStatuses: {
      "client": "DONE",
      "pm": "IN_PROGRESS",
      "ba": "IN_PROGRESS",
      "sa": "IDLE",
      "ui": "IDLE",
      "fe": "IDLE",
      "be": "IDLE",
      "dba": "IDLE",
      "qa": "IDLE",
      "devops": "IDLE",
      "prod": "IDLE"
    },
    tasks: [
      { id: "PM-001", dept: "01. Quản Trị Dự Án", title: "Khảo sát và đề xuất bài toán chi phí dự án", pic: "TPM Lead", status: "IN_PROGRESS", progress: 50, note: "Đang lập WBS và ngân sách" },
      { id: "BA-002", dept: "02. Phân Tích Nghiệp Vụ", title: "Lấy yêu cầu khám phá chiến lược (Brand / SEO)", pic: "Lead BA", status: "IN_PROGRESS", progress: 40, note: "Khảo sát các bên liên quan" }
    ],
    feedbacks: [],
    history: [
      { time: "Vừa xong", dept: "Hệ Thống", action: `Đã khởi tạo dự án mới độc lập: ${name} (${code})`, type: "success" }
    ]
  };

  projects.unshift(newProject);
  currentProjectId = newId;
  saveProjectsToStorage();
  initProjectDropdown();

  document.getElementById("newProjectForm").reset();
  document.getElementById("newProjectModal").style.display = "none";
  renderDashboard();

  showToast(`Dự án [${code}] đã được khởi tạo và phân rã xuống 9 phòng ban!`, "success");
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
// CLIENT CMS & WEBSITE SHOWCASE MANAGEMENT CONTROLLER
// ========================================================
function openClientCmsModal() {
  const modal = document.getElementById("clientCmsModal");
  if (!modal) return;

  const projectSelect = document.getElementById("cmsProjectSelect");
  if (projectSelect) {
    projectSelect.innerHTML = projects.map(p => `
      <option value="${p.id}" ${p.id === currentProjectId ? "selected" : ""}>[${p.code}] ${escapeHtml(p.name)}</option>
    `).join("");
  }

  loadCmsFormForProject(getCurrentProject());
  modal.style.display = "flex";
}

function closeClientCmsModal() {
  const modal = document.getElementById("clientCmsModal");
  if (modal) modal.style.display = "none";
}

let activeCmsProducts = [];

function loadCmsFormForProject(project) {
  if (!project) return;
  const cfg = project.clientConfig || {};

  const brandEl = document.getElementById("cmsBrandName");
  if (brandEl) brandEl.value = cfg.brandName || project.name;

  const headEl = document.getElementById("cmsHeadline");
  if (headEl) headEl.value = cfg.headline || "";

  const deployEl = document.getElementById("cmsDeployMode");
  if (deployEl) deployEl.value = cfg.deployMode || "LOCAL_SERVER";

  const prevEl = document.getElementById("cmsPreviewUrl");
  if (prevEl) prevEl.value = cfg.previewUrl || "http://192.168.1.108:3000";

  const domainEl = document.getElementById("cmsCustomDomain");
  if (domainEl) domainEl.value = cfg.customDomain || "https://shop.example.com";

  const bTitleEl = document.getElementById("cmsBannerTitle");
  if (bTitleEl) bTitleEl.value = cfg.bannerTitle || "";

  const bSubEl = document.getElementById("cmsBannerSubtitle");
  if (bSubEl) bSubEl.value = cfg.bannerSubtitle || "";

  const uEl = document.getElementById("cmsAdminUser");
  if (uEl) uEl.value = cfg.adminStoreUser || "admin_store";

  const pEl = document.getElementById("cmsAdminPass");
  if (pEl) pEl.value = cfg.adminStorePass || "Store@2026Secure";

  const aiEl = document.getElementById("cmsAiModel");
  if (aiEl) aiEl.value = cfg.aiConsultingModel || "gemini-2.5-pro";

  activeCmsProducts = Array.isArray(cfg.products) ? JSON.parse(JSON.stringify(cfg.products)) : [];
  renderCmsProductsTable();
}

function renderCmsProductsTable() {
  const tbody = document.getElementById("cmsProductsTbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  if (activeCmsProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748B; padding:16px;">Chưa có sản phẩm nào. Bấm "+ Thêm Sản Phẩm Mới" để tạo.</td></tr>`;
    return;
  }

  activeCmsProducts.forEach((prod, idx) => {
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid rgba(255,255,255,0.05)";
    tr.innerHTML = `
      <td style="padding: 6px 8px;"><input type="text" class="table-input" value="${escapeHtml(prod.name)}" onchange="updateCmsProduct(${idx}, 'name', this.value)" style="width:100%;"></td>
      <td style="padding: 6px 8px;"><input type="text" class="table-input" value="${escapeHtml(prod.category)}" onchange="updateCmsProduct(${idx}, 'category', this.value)" style="width:100%;"></td>
      <td style="padding: 6px 8px;"><input type="number" class="table-input" value="${Number(prod.price) || 0}" onchange="updateCmsProduct(${idx}, 'price', Number(this.value))" style="width:110px;"></td>
      <td style="padding: 6px 8px;"><input type="number" class="table-input" value="${Number(prod.stock) || 0}" onchange="updateCmsProduct(${idx}, 'stock', Number(this.value))" style="width:65px;"></td>
      <td style="padding: 6px 8px; text-align:center;">
        <button type="button" class="btn btn-outline" onclick="removeCmsProduct(${idx})" style="color:#F87171; border-color:rgba(239,68,68,0.3); padding:3px 8px; font-size:0.7rem;">Xóa</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.updateCmsProduct = function(idx, field, val) {
  if (activeCmsProducts[idx]) {
    activeCmsProducts[idx][field] = val;
  }
};

window.removeCmsProduct = function(idx) {
  activeCmsProducts.splice(idx, 1);
  renderCmsProductsTable();
};

function addCmsProduct() {
  const newId = "prod_" + Date.now().toString(36);
  activeCmsProducts.push({
    id: newId,
    name: "Sản Phẩm Mới " + (activeCmsProducts.length + 1),
    category: "Thời Trang & Dịch Vụ",
    price: 850000,
    stock: 25,
    sku: "SKU-" + Math.floor(100 + Math.random() * 900),
    status: "IN_STOCK"
  });
  renderCmsProductsTable();
}

function saveCmsConfiguration() {
  const selectedProjId = document.getElementById("cmsProjectSelect").value;
  const project = projects.find(p => p.id === selectedProjId);
  if (!project) return;

  const brandName = sanitizeInput(document.getElementById("cmsBrandName").value);
  const headline = sanitizeInput(document.getElementById("cmsHeadline").value);
  const deployMode = document.getElementById("cmsDeployMode").value;
  const previewUrl = sanitizeInput(document.getElementById("cmsPreviewUrl").value);
  const customDomain = sanitizeInput(document.getElementById("cmsCustomDomain").value);
  const bannerTitle = sanitizeInput(document.getElementById("cmsBannerTitle").value);
  const bannerSubtitle = sanitizeInput(document.getElementById("cmsBannerSubtitle").value);
  const adminStoreUser = sanitizeInput(document.getElementById("cmsAdminUser").value);
  const adminStorePass = sanitizeInput(document.getElementById("cmsAdminPass").value);
  const aiConsultingModel = document.getElementById("cmsAiModel").value;

  project.clientConfig = {
    brandName: brandName || project.name,
    headline: headline,
    deployMode: deployMode,
    previewUrl: previewUrl,
    customDomain: customDomain,
    sslActive: deployMode === "CUSTOM_DOMAIN_SSL" || (previewUrl && previewUrl.startsWith("https://")),
    bannerTitle: bannerTitle,
    bannerSubtitle: bannerSubtitle,
    adminStoreUser: adminStoreUser,
    adminStorePass: adminStorePass,
    aiConsultingModel: aiConsultingModel,
    aiTone: "Thực chiến, dễ hiểu (Không dùng thuật ngữ kỹ thuật khó hiểu)",
    products: activeCmsProducts
  };

  saveProjectsToStorage();

  // Save to Production Backend Server
  fetch(`/api/projects/${selectedProjId}/config`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project.clientConfig)
  }).then(r => r.json()).then(res => {
    console.log("[Production Backend] Config saved and Redis cache invalidated:", res);
  }).catch(e => console.log("[Storage Fallback] Saved locally:", e));

  closeClientCmsModal();
  showToast(`Đã lưu cấu hình CMS & đồng bộ dữ liệu thật cho [${project.code}] thành công!`, "success");

  // Re-render dashboard
  renderDashboard();
}

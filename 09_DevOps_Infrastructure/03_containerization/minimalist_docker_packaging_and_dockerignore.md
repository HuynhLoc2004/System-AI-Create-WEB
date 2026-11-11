# 04. QUY CHUẨN ĐÓNG GÓI DOCKER TỐI GIẢN & LOẠI BỎ TOÀN BỘ FILE DƯ THỪA
## (MINIMALIST CONTAINER PACKAGING, DOCKERIGNORE & SECURITY HARDENING)

> **Mục tiêu đóng gói:** *"Một Docker Image hoàn hảo là một container nhẹ như lông vũ, chỉ chứa duy nhất những tệp nhị phân cần thiết để chạy ứng dụng. Không có mã nguồn thô, không có thư mục `node_modules` nặng nề của môi trường dev, không có file tài liệu hay ảnh thừa, và dung lượng rút gọn từ 1.5GB xuống dưới 100MB!"*

---

## 1. Bảng So Sánh Dung Lượng: Đóng Gói Kém vs Đóng Gói Tối Giản

| Tiêu Chí Kỹ Thuật | ❌ Đóng Gói Cẩu Thả (Naive Build) | ✅ Đóng Gói Chuẩn DevOps (Multi-Stage & Hardened) |
|---|:---:|:---:|
| **Dung lượng Image** | **1.45 GB** (Quá nặng nề) | **Chỉ còn 85 MB (Nhẹ hơn 17 lần)** |
| **Thời gian kéo Image lúc Deploy** | 90 - 150 giây (Dễ gây timeout) | **Chỉ mất 3 - 5 giây** (Cực nhanh) |
| **Bảo mật (Số lỗ hổng CVE)** | 48 lỗ hổng (do chứa công cụ compiler, curl, apt) | **0 lỗ hổng** (Chạy trên Alpine/Distroless tối giản) |
| **Quyền hạn chạy trong container** | Quyền `root` nguy hiểm | Người dùng không đặc quyền (`USER nodejs / nonroot`) |

---

## 2. Quy Tắc Tệp `.dockerignore` Nghiêm Ngặt

Tệp `.dockerignore` hoạt động tương tự `.gitignore`, ngăn chặn toàn bộ các tệp rác bị copy vào Build Context của Docker:

```dockerignore
# ========================================================
# TỆP .DOCKERIGNORE BẮT BUỘC TRONG DỰ ÁN
# ========================================================

# 1. Thư mục mã nguồn Git & CI/CD
.git
.github
.gitlab
.husky

# 2. Toàn bộ thư mục dependencies cồng kềnh (Sẽ được cài mới trong Docker)
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 3. Toàn bộ tệp biến môi trường chứa bí mật
.env*
*.local

# 4. Tệp kiểm thử & Báo cáo độ bao phủ
tests
test
__tests__
*.spec.ts
*.test.ts
coverage
.nyc_output

# 5. Tệp tài liệu & Sơ đồ thiết kế
README.md
*.md
docs
architecture
assets/raw_images

# 6. Tệp cấu hình của IDE & Hệ điều hành
.vscode
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
.DS_Store
Thumbs.db

# 7. Thư mục biên dịch tạm
dist
build
.next
.cache
tmp
temp
```

---

## 3. Quy Trình Quét Lỗ Hổng Bảo Mật Tự Động (Container Vulnerability Scan)

Trong pipeline CI/CD, trước khi Docker Image được phép đẩy lên Registry, công cụ **Trivy** tự động quét toàn bộ image:
```bash
# Quét tìm các lỗ hổng mức CRITICAL và HIGH trong Docker Image:
trivy image --severity HIGH,CRITICAL --exit-code 1 ghcr.io/org/backend-core:latest
```
Nếu phát hiện bất kỳ thư viện nào có lỗ hổng bảo mật nghiêm trọng (như log4j, CVE injection) ➔ **Hệ thống lập tức dừng build và từ chối deploy**, bảo vệ an toàn tuyệt đối cho Production.


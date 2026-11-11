# KẾ HOẠCH DỰ ÁN & CÁC CỘT MỐC (PROJECT PLAN & MILESTONES)

## 1. Danh Sách Các Cột Mốc Chính (Key Milestones)

| Milestone | Tên Cột Mốc | Thời Hạn Mục Tiêu | Trách Nhiệm Phê Duyệt | Điều Kiện Nghiệm Thu Cột Mốc (Exit Criteria) |
|---|---|---|---|---|
| **M1** | Kickoff & Scope Alignment | Tuần 2 | TPM, BA, Stakeholders | Ký duyệt Project Charter & Khảo sát sơ bộ hoàn tất |
| **M2** | Requirements Sign-off | Tuần 4 | BA, TPM, Stakeholders | Ký duyệt BRD, SRS và luồng nghiệp vụ đầy đủ |
| **M3** | Architecture & UI/UX Sign-off | Tuần 7 | SA, UI/UX, TPM | Hoàn thiện Figma Prototype & Tài liệu kiến trúc SAD |
| **M4** | MVP Core Backend & DB Ready | Tuần 12 | BE Lead, DBA, SA | 80% APIs lõi chạy ổn định trên Staging, DB migrated |
| **M5** | Alpha Release (Internal Integration) | Tuần 18 | FE Lead, BE Lead, QA | Tích hợp hoàn tất FE - BE, chạy thông suốt luồng chính |
| **M6** | Beta Release & UAT | Tuần 22 | QA Lead, TPM, Khách hàng | Khách hàng thực hiện nghiệm thu UAT, 0 lỗi blocker |
| **M7** | Go-Live Production | Tuần 24 | TPM, DevOps, Toàn đội | Triển khai chính thức lên Production, vận hành an toàn |

---

## 2. Kế Hoạch Chu Kỳ Sprints (Sprint Schedule)
* Mỗi Sprint có chu kỳ **2 tuần** (10 ngày làm việc).
* Tổng cộng: **12 Sprints**.

```
Sprint 01 - 02: Thu thập yêu cầu, BRD, SRS, Thiết lập Git repo & Kiến trúc ban đầu.
Sprint 03 - 04: Chốt Figma Design System, Wireframes, Thiết kế ERD, Setup CI/CD cơ bản.
Sprint 05 - 06: Phát triển Auth, Core Data Entities, Màn hình Dashboard & Quản lý người dùng.
Sprint 07 - 08: Nghiệp vụ giao dịch cốt lõi, Tích hợp cổng thanh toán, Xử lý Worker nền.
Sprint 09 - 10: Hoàn thiện tính năng nâng cao, Báo cáo thống kê, Tích hợp đa thiết bị.
Sprint 11: Kiểm thử toàn diện (Regression, Load test 5,000 CCU, Security scan), Sửa lỗi bug.
Sprint 12: UAT khách hàng, diễn tập chuyển đổi dữ liệu (Dry-run Migration), Official Go-Live.
```


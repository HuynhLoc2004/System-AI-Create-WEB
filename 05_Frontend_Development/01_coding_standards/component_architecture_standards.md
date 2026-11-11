# TIÊU CHUẨN CẤU TRÚC MÃ NGUỒN FRONTEND & CLEAN CODE

## 1. Cấu Trúc Thư Mục Chuẩn Dạng Feature-Based (Feature Folder Structure)

```
src/
  ├── app/                  # Next.js App Router (Routing, Layouts, Pages)
  │     ├── (auth)/         # Nhóm route công khai: login, register
  │     ├── (dashboard)/    # Nhóm route quản trị nội bộ
  │     └── api/            # Route Handlers nội bộ
  ├── components/           # UI Components dùng chung toàn ứng dụng (Atoms/Molecules)
  │     ├── ui/             # Nút bấm, Ô nhập, Modal, Dropdown (Shadcn pattern)
  │     └── feedback/       # Toast, Skeleton, ErrorBoundary
  ├── features/             # Đóng gói logic theo từng phân hệ nghiệp vụ độc lập
  │     ├── auth/           # components, api, hooks, types cho Auth
  │     ├── orders/         # components, api, hooks, types cho Orders
  │     └── products/       # components, api, hooks, types cho Products
  ├── hooks/                # Custom React Hooks dùng chung (useMediaQuery, useDebounce)
  ├── lib/                  # Khởi tạo công cụ (axiosInstance, queryClient, utils)
  └── types/                # TypeScript Interfaces & Types dùng chung
```

---

## 2. Các Quy Tắc Clean Code Bắt Buộc
1. **Tuyệt đối không dùng kiểu dữ liệu `any`:** 100% Props, State và API Response phải có TypeScript Interface hoặc Type rõ ràng.
2. **Kích thước file không quá 250 dòng:** Nếu một component vượt quá 250 dòng, bắt buộc phải bóc tách thành các Sub-components hoặc tách logic vào Custom Hook riêng.
3. **Quản lý Form nghiêm ngặt:** Bắt buộc kết hợp **React Hook Form** + **Zod Schema Validation**. Mọi thông báo lỗi phải hiển thị trực quan dưới từng trường nhập liệu.


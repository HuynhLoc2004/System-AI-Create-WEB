# 02. QUAN SÁT VÀ BẮT LỖI NGOẠI LỆ THỜI GIAN THỰC (RUNTIME OBSERVABILITY VIA SENTRY & LOGROCKET)
**Phòng Ban:** 13. Đo Lường Hành Vi & Vận Hành Hậu Phát Hành (Product Analytics & Post-Launch Support)  
**Tiêu Chuẩn:** Zero-Blindspot Error Monitoring & Fast Remediation  
**Mục Tiêu:** Bắt được lỗi JavaScript Client-side hoặc lỗi API Server ngay khi người dùng gặp phải, trước cả khi khách hàng kịp gọi điện phàn nàn.

---

## 1. NGUYÊN TẮC: "PHÁT HIỆN LỖI TRƯỚC KHI KHÁCH KỊP BÁO"
Trong môi trường sản xuất thực tế:
- 90% khách hàng gặp lỗi (trắng màn hình, không bấm được nút) sẽ **âm thầm thoát web** và mua của đối thủ chứ không bao giờ báo lỗi cho bạn.
- Hệ thống bắt buộc phải có cơ chế Global Error Boundary tự động gửi Stack Trace về Server.

---

## 2. TRIỂN KHAI REACT ERROR BOUNDARY TIÊU CHUẨN

```jsx
import React from 'react';

export class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Tự động đẩy lỗi lên Sentry / Server Telemetry
        fetch('/api/telemetry/errors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                url: window.location.href,
                userAgent: navigator.userAgent
            })
        }).catch(() => {});
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-900 text-white rounded-xl">
                    <h3 className="text-xl font-bold text-amber-400">Đã có gián đoạn hiển thị nhỏ</h3>
                    <p className="text-slate-400 mt-2 text-sm">Hệ thống đã tự động ghi nhận báo cáo kỹ thuật. Bạn vui lòng tải lại trang nhé!</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition"
                    >
                        Tải lại trang ngay
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
```

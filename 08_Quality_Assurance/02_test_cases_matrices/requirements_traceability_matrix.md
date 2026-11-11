# MA TRẬN TRUY XUẤT NGUỒN GỐC YÊU CẦU (REQUIREMENTS TRACEABILITY MATRIX - RTM)

Ma trận RTM liên kết 2 chiều giữa tài liệu yêu cầu nghiệp vụ của BA (SRS) và các kịch bản kiểm thử của QA:

| Mã Yêu Cầu (SRS ID) | Mô Tả Yêu Cầu Nghiệp Vụ | Mã Kịch Bản Test (Test Case ID) | Loại Kiểm Thử | Trạng Thái Thực Thi | Kết Quả (Pass/Fail) |
|---|---|---|:---:|:---:|:---:|
| **FR-AUTH-01** | Đăng nhập qua Số điện thoại + OTP SMS | `TC-AUTH-001`, `TC-AUTH-002` | Functional / Positive & Negative | Đã thực thi | **PASS** |
| **FR-AUTH-02** | Cơ chế JWT Cookie & Tự động Refresh Token | `TC-AUTH-003`, `TC-SEC-001` | Security / Token Expiry | Đã thực thi | **PASS** |
| **FR-INV-02** | Khóa tồn kho tạm 10 phút khi ấn Checkout | `TC-ORD-010`, `TC-ORD-011` | Functional / Concurrency | Đã thực thi | **PASS** |
| **FR-PAY-01** | Quét mã VietQR động thanh toán tự động | `TC-PAY-001`, `TC-PAY-002` | Functional / E2E Integration | Đã thực thi | **PASS** |
| **FR-PAY-02** | Xử lý Webhook Idempotency (Chống trùng đơn) | `TC-PAY-005` | Edge Case / Concurrency | Đã thực thi | **PASS** |
| **NFR-01** | Phản hồi API < 200ms & Tải 5.000 CCU | `TC-PERF-001` | Performance / Stress Test | Đã thực thi | **PASS (P95=142ms)** |


# KIẾN TRÚC ĐƯỜNG ỐNG CI/CD TỰ ĐỘNG HÓA (CONTINUOUS INTEGRATION & DEPLOYMENT)

```mermaid
flowchart LR
    Dev["Developer Git Push"] --> Trigger{"Nhánh Git?"}
    
    Trigger -->|Nhánh 'staging'| CI_Staging["Chạy Test ➔ Build Image ➔ Deploy Môi Trường STAGING"]
    Trigger -->|Nhánh 'main' (Tagged v*)| CI_Prod["Chạy Test Toàn Diện ➔ Quét Lỗ Hổng ➔ Deploy PRODUCTION"]

    subgraph CI_Pipeline ["Quy Trình Tự Động Trong CI"]
        Lint["1. Linting & TypeCheck"]
        Test["2. Chạy Unit & Integration Test"]
        Build["3. Multi-stage Docker Build"]
        Security["4. Quét lỗ hổng container (Trivy)"]
    end

    CI_Prod --> Lint --> Test --> Build --> Security --> Deploy["Zero-Downtime Deploy (Rolling Restart)"]
    Deploy --> Notify["Bot Telegram thông báo kết quả Deploy"]
```

---

## Các Quy Tắc Bảo Vệ Nhánh (Branch Protection Rules)
1. **Tuyệt đối cấm `git push --force`** lên nhánh `main` và `staging`.
2. Mọi thay đổi bắt buộc phải thông qua **Pull Request (PR)**.
3. PR chỉ được phép gộp (Merge) khi:
   - CI Pipeline chạy xanh 100% (Pass toàn bộ Test và Lint).
   - Có tối thiểu 1 phê duyệt (Approval) từ Tech Lead hoặc Code Owner.


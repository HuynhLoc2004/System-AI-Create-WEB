# KIẾN TRÚC MÃ NGUỒN KHÔNG TRỌNG LƯỢNG (ZERO-LOAD ARCHITECTURE)
## DÀNH CHO SOLUTION ARCHITECT & LEAD INFRASTRUCTURE

> [!NOTE]
> Tài liệu chuẩn kỹ thuật quy định phương thức lưu trữ, bóc tách ngữ cảnh (Context Pruning) và bảo vệ máy chủ VPS khỏi cạn kiệt tài nguyên (OOM và Inodes Exhaustion).

---

## 1. THIẾT KẾ CƠ SỞ DỮ LIỆU CHUẨN JSONB CHO MÃ NGUỒN

Thay vì sử dụng hệ thống tệp tin phân cấp (`fs.writeFileSync`) gây nghẽn I/O ổ đĩa, toàn bộ mã nguồn của mỗi dự án được định dạng thành một đối tượng JSONB duy nhất trong bảng CSDL:

```sql
-- DDL Schema chuẩn hóa cho Virtual Workspace
CREATE TABLE IF NOT EXISTS project_workspaces (
    project_id VARCHAR(64) PRIMARY KEY,
    project_code VARCHAR(32) NOT NULL,
    total_files INT DEFAULT 0,
    size_bytes INT DEFAULT 0,
    files JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index GIN để truy vấn đường dẫn file tức thì
CREATE INDEX idx_project_files_gin ON project_workspaces USING GIN (files);
```

### Cấu Trúc Khối Dữ Liệu `files` (JSONB)
```json
{
  "package.json": "{\n  \"name\": \"fintech-hub\",\n  \"version\": \"1.0.0\",\n  \"dependencies\": {\n    \"react\": \"^18.3.1\",\n    \"lucide-react\": \"^0.383.0\"\n  }\n}",
  "src/App.jsx": "import React from 'react';\n\nexport default function App() {\n  return <div>App Running</div>;\n}",
  "src/components/Header.jsx": "import React from 'react';\n\nexport const Header = () => <header>Logo</header>;",
  "database/schema.sql": "CREATE TABLE orders (id SERIAL PRIMARY KEY, amount NUMERIC(15,2));"
}
```

---

## 2. CHIẾN LƯỢC CẮT LỚP NGỮ CẢNH (CONTEXT PRUNING) CHO AI

Để đảm bảo AI xử lý trong thời gian dưới 2 giây và tiết kiệm 95% chi phí token:

1. **Giai đoạn 1 (Orchestration):**
   - Chỉ truyền mảng các khóa: `Object.keys(project.files)` (File Tree danh mục ~ 100 tokens).
   - AI Orchestrator phân tích và quyết định file nào cần sửa hoặc file mới cần tạo.
2. **Giai đoạn 2 (Precision Coding):**
   - Chỉ truyền nội dung của ĐÚNG 1 file đích (`targetFileContent`) kèm yêu cầu kỹ thuật ngắn gọn.
   - AI Coder sinh trực tiếp nội dung mới của file đó mà không phải nạp toàn bộ mã nguồn của dự án.

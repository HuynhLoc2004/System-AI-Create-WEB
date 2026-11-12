import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#0F172A', color: '#F8FAFC', minHeight: '100vh' }}>
      <header style={{ borderBottom: '1px solid #1E293B', paddingBottom: '1.25rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, color: '#38BDF8', fontSize: '1.6rem', fontWeight: 700 }}>Sàn Bán Lẻ Đa Kênh & VietQR Động</h1>
          <p style={{ color: '#94A3B8', margin: '6px 0 0 0', fontSize: '0.85rem' }}>Mã dự án: <code style={{ color: '#34D399', background: '#0B1120', padding: '2px 6px', borderRadius: '4px' }}>RETAIL</code> &bull; Tiêu chuẩn 9 phòng ban IT-Assignment</p>
        </div>
        <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>Zero-Load Production Ready</span>
      </header>

      <main style={{ maxWidth: '900px' }}>
        <div style={{ background: '#1E293B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155', marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0, color: '#F1F5F9', fontSize: '1.15rem' }}>Kiến Trúc Không Trọng Lượng (Zero-Load)</h3>
          <p style={{ color: '#CBD5E1', lineHeight: 1.6, fontSize: '0.9rem' }}>
            Toàn bộ mã nguồn dự án được quản trị trực tiếp dạng Virtual File Tree (JSONB) trong cơ sở dữ liệu.
            Server không cần tải node_modules, máy chủ VPS đạt mức tải CPU 0% khi người dùng xem trước và kiểm thử.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
            <button onClick={() => setActiveTab('overview')} style={{ background: activeTab === 'overview' ? '#2563EB' : '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Tổng Quan Nghiệp Vụ</button>
            <button onClick={() => setActiveTab('tech')} style={{ background: activeTab === 'tech' ? '#2563EB' : '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Thông Số Kỹ Thuật</button>
          </div>
        </div>

        {activeTab === 'tech' && (
          <div style={{ background: '#0B1120', padding: '1.25rem', borderRadius: '8px', border: '1px solid #1E293B', fontFamily: 'monospace', fontSize: '0.82rem', color: '#A5B4FC' }}>
            <div>&bull; Ngân Sách Dự Toán: May đo thực tế</div>
            <div>&bull; Hạ Tầng Triển Khai: Virtual File Tree JSONB (0% CPU VPS)</div>
            <div>&bull; Cơ Chế Nén: In-Memory JSZip Streaming</div>
            <div>&bull; Lưu Trữ Code: PostgreSQL / DB JSONB (0% Inodes Pollution)</div>
          </div>
        )}
      </main>
    </div>
  );
}
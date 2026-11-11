/**
 * DETERMINISTIC QUALITY GATE ENGINE (Pure Regex & AST Checker)
 * Tiêu chuẩn: Tier-1 Production Code Gate (Chạy cơ học bằng CPU thuần < 5ms, 0 Token AI)
 */

// 1. Danh mục Package an toàn được phép sử dụng (Curated Safe Whitelist)
export const PACKAGE_WHITELIST = new Set([
  'react', 'react-dom', 'lucide-react', 'clsx', 'tailwind-merge',
  'axios', 'zustand', '@tanstack/react-query', 'zod', 'date-fns',
  'express', 'cors', 'dotenv', 'ioredis', 'pg', 'jszip', 'helmet', 'bcryptjs', 'jsonwebtoken'
]);

export class QualityGateEngine {
  /**
   * Gate 1: Quét lộ Secret / API Key bằng mẫu Regex nghiêm ngặt
   */
  static auditSecrets(files) {
    const violations = [];
    const SECRET_PATTERNS = [
      { name: 'Google API Key', regex: /AIzaSy[A-Za-z0-9_-]{33}/g },
      { name: 'Stripe Secret Key', regex: /sk_live_[0-9a-zA-Z]{24}/g },
      { name: 'Hardcoded Database Password', regex: /(postgres|mysql):\/\/[^:]+:([^@]+)@/g },
      { name: 'Weak/Hardcoded JWT Secret', regex: /jwt_secret\s*=\s*['"][a-zA-Z0-9]{1,31}['"]/g },
      { name: 'Generic Hardcoded API Secret', regex: /(api_key|secret_key|private_key)\s*[:=]\s*['"][a-zA-Z0-9_\-]{20,}['"]/gi }
    ];

    for (const [filePath, content] of Object.entries(files)) {
      if (!content || typeof content !== 'string') continue;
      const lines = content.split('\n');
      lines.forEach((lineText, idx) => {
        // Bỏ qua comment giải thích hoặc ví dụ mẫu
        if (lineText.trim().startsWith('//') || lineText.trim().startsWith('*') || lineText.includes('your_') || lineText.includes('example')) {
          return;
        }

        for (const pattern of SECRET_PATTERNS) {
          pattern.regex.lastIndex = 0; // Reset regex state
          if (pattern.regex.test(lineText)) {
            violations.push({
              file: filePath,
              line: idx + 1,
              message: `Phát hiện rò rỉ ${pattern.name} tại dòng ${idx + 1}`
            });
          }
        }
      });
    }

    return {
      gateName: 'SECRET_SCANNER',
      passed: violations.length === 0,
      violations
    };
  }

  /**
   * Gate 2: Kiểm soát chuỗi cung ứng (Package Whitelist)
   */
  static auditDependencies(packageJsonStr) {
    const violations = [];
    try {
      const pkg = typeof packageJsonStr === 'string' ? JSON.parse(packageJsonStr) : packageJsonStr;
      const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

      for (const depName of Object.keys(allDeps)) {
        if (!PACKAGE_WHITELIST.has(depName)) {
          violations.push({
            file: 'package.json',
            message: `Thư viện [${depName}] không nằm trong Curated Safe Whitelist.`
          });
        }
      }
    } catch {
      violations.push({ file: 'package.json', message: 'Cú pháp package.json không hợp lệ.' });
    }

    return {
      gateName: 'SUPPLY_CHAIN_GUARD',
      passed: violations.length === 0,
      violations
    };
  }

  /**
   * Gate 3: Bundle Sizer & Cú pháp cơ bản (JSX unclosed tags, max bundle size)
   */
  static auditSyntaxAndSize(files) {
    const violations = [];
    let totalSize = 0;

    for (const [filePath, content] of Object.entries(files)) {
      if (!content || typeof content !== 'string') continue;
      totalSize += Buffer.byteLength(content, 'utf8');

      // Kiểm tra sơ bộ thẻ JSX bị bỏ lửng (dành cho file .tsx/.jsx)
      if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
        const openDivs = (content.match(/<div(\s|>)/g) || []).length;
        const closeDivs = (content.match(/<\/div>/g) || []).length;
        if (openDivs !== closeDivs) {
          violations.push({
            file: filePath,
            message: `Lỗi thẻ JSX: Có ${openDivs} thẻ <div mở nhưng có ${closeDivs} thẻ </div> đóng.`
          });
        }
      }
    }

    const MAX_BUNDLE_SIZE = 500 * 1024; // 500KB
    if (totalSize > MAX_BUNDLE_SIZE) {
      violations.push({
        file: 'Root Bundle',
        message: `Tổng kích thước code (${(totalSize / 1024).toFixed(2)}KB) vượt quá ngưỡng cho phép (500KB).`
      });
    }

    return {
      gateName: 'SYNTAX_AND_BUNDLE_SIZER',
      passed: violations.length === 0,
      violations
    };
  }

  /**
   * Hàm kiểm định tổng hợp (Master Quality Audit)
   */
  static auditAll(files) {
    const secretResult = this.auditSecrets(files);
    let depResult = { gateName: 'SUPPLY_CHAIN_GUARD', passed: true, violations: [] };
    if (files['package.json']) {
      depResult = this.auditDependencies(files['package.json']);
    }
    const syntaxResult = this.auditSyntaxAndSize(files);

    const allViolations = [
      ...secretResult.violations,
      ...depResult.violations,
      ...syntaxResult.violations
    ];

    return {
      passed: secretResult.passed && depResult.passed && syntaxResult.passed,
      results: [secretResult, depResult, syntaxResult],
      violations: allViolations
    };
  }
}


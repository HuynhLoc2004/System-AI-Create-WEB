# KỊCH BẢN KIỂM THỬ TỰ ĐỘNG HÓA E2E VỚI PLAYWRIGHT

Kịch bản tự động hóa kiểm tra luồng Đăng nhập OTP và Tạo đơn hàng mẫu:

```typescript
import { test, expect } from "@playwright/test";

test.describe("E2E Checkout Flow & VietQR Generation", () => {
  test.beforeEach(async ({ page }) => {
    // Điều hướng tới môi trường Staging
    await page.goto(process.env.STAGING_URL || "https://staging.domain.com");
  });

  test("Khách hàng đăng nhập, thêm hàng vào giỏ và sinh mã VietQR thành công", async ({ page }) => {
    // 1. Mở trang đăng nhập
    await page.click('text="Đăng nhập"');
    await expect(page).toHaveURL(/.*login/);

    // 2. Điền số điện thoại thử nghiệm
    await page.fill('input[name="phone"]', "0901234567");
    await page.click('button:has-text("Nhận mã OTP")');

    // 3. Nhập mã OTP Sandbox (999999)
    await page.fill('input[name="otp"]', "999999");
    await page.click('button:has-text("Xác nhận")');

    // 4. Kiểm tra đã đăng nhập thành công
    await expect(page.locator('[data-testid="user-greeting"]')).toContainText("Trần Khách Mẫu");

    // 5. Chọn mua sản phẩm Flagship
    await page.goto("/products/dien-thoai-thong-minh-flagship-2026");
    await page.click('button:has-text("Thêm vào giỏ hàng")');

    // 6. Đi tới giỏ hàng & Checkout
    await page.click('[data-testid="cart-icon"]');
    await page.click('button:has-text("Tiến hành thanh toán")');

    // 7. Chọn phương thức VietQR và xác nhận đặt hàng
    await page.check('input[value="VIETQR"]');
    await page.click('button:has-text("Đặt hàng ngay")');

    // 8. Khẳng định mã QR xuất hiện và đồng hồ đếm ngược bắt đầu chạy
    const qrImage = page.locator('[data-testid="vietqr-image"]');
    await expect(qrImage).toBeVisible();

    const countdownTimer = page.locator('[data-testid="checkout-countdown"]');
    await expect(countdownTimer).toContainText("10:");
  });
});
```


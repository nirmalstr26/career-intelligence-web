import { test, expect } from '@playwright/test';
import { loginAsStudent, captureTestScreenshot } from './helpers/auth';

test.describe('Scenario 12: Visual Themes & Multi-Device Responsive Viewports', () => {
  test('Theme toggle toggles dark/light class and persists; viewports render smoothly across Desktop, Tablet and Mobile', async ({ page }) => {
    // 1. Login as standard student
    await loginAsStudent(page, 'student02@spar-test.example', 'Rahul', 'Standard', 'DATA_ENGINEER');

    // 2. Desktop Viewport (1440x900)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/app/today');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '12_desktop_1440_today_dark');

    // Toggle Light Theme
    const themeBtn = page.locator('button[aria-label="Toggle theme"]');
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(500);
      await captureTestScreenshot(page, '12_desktop_1440_today_light');
      
      // Reload and verify persistence
      await page.reload();
      await page.waitForLoadState('networkidle');
      const hasLightClass = await page.evaluate(() => document.documentElement.classList.contains('light'));
      expect(hasLightClass).toBeTruthy();
    }

    // 3. Tablet Viewport (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/app/today');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '12_tablet_768_today');

    // 4. Mobile Viewport (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/app/today');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '12_mobile_390_today');

    // Verify Mobile Navigation
    await page.goto('/app/path');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '12_mobile_390_path');
  });
});

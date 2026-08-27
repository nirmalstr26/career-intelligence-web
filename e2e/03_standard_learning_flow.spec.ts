import { test, expect } from '@playwright/test';
import { loginAsStudent, captureTestScreenshot } from './helpers/auth';

test.describe('Scenario 03: Rahul Standard — Golden Path Learning Progression', () => {
  test('Rahul accesses Today cockpit, reviews active curriculum track and navigates to module practice', async ({ page }) => {
    // 1. Login as Rahul Standard
    await loginAsStudent(page, 'student02@spar-test.example', 'Rahul', 'Standard', 'DATA_ENGINEER', 3, 2027);

    // 2. Inspect Today Cockpit
    await page.goto('/app/today');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
    await captureTestScreenshot(page, '03_rahul_today_cockpit');

    // 3. Navigate to Path
    await page.goto('/app/path');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Roadmap');
    await captureTestScreenshot(page, '03_rahul_curriculum_path');

    // 4. Navigate to Practice Center
    await page.goto('/app/practice');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Practice, Projects & Interview Defense');
    await captureTestScreenshot(page, '03_rahul_practice_studio');
  });
});

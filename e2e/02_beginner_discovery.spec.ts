import { test, expect } from '@playwright/test';
import { loginAsStudent, captureTestScreenshot } from './helpers/auth';

test.describe('Scenario 02: Asha Beginner — Discovery & Guided Pathway', () => {
  test('First-year student explores guided roadmap and career discovery without excessive pressure', async ({ page }) => {
    // Login as Asha
    await loginAsStudent(page, 'student01@spar-test.example', 'Asha', 'Beginner', 'DATA_ENGINEER', 1, 2030);

    // Visit Guided Roadmap / Path
    await page.goto('/app/path');
    await page.waitForLoadState('networkidle');

    // Verify roadmap headers and guided view
    await expect(page.locator('h1')).toContainText('Roadmap');
    await captureTestScreenshot(page, '02_asha_guided_path');

    // Visit SPAR Coach
    await page.goto('/app/coach');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('SPAR AI Career Coach');
    await captureTestScreenshot(page, '02_asha_spar_coach');
  });
});

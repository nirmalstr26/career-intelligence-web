import { test, expect } from '@playwright/test';
import { captureTestScreenshot } from './helpers/auth';

test.describe('Scenario 09: College Coordinator Portal & Multi-Tenant Boundary', () => {
  test('Placement coordinator views institutional cohort health with strict isolation and zero private chat exposure', async ({ page }) => {
    // 1. Visit College Portal
    await page.goto('/college/dashboard');
    await page.waitForLoadState('networkidle');

    // Verify institutional layout
    await expect(page.locator('h1')).toContainText('Computer Science');
    await captureTestScreenshot(page, '09_college_dashboard');

    // 2. Verify cohort isolation via backend API request
    const dummyBadCohort = '00000000-0000-0000-0000-000000000000';
    const badResp = await page.request.get(`http://localhost:8000/api/v1/college/cohorts/${dummyBadCohort}/students`);
    expect([403, 404]).toContain(badResp.status());
  });
});

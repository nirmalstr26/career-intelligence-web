import { test, expect } from '@playwright/test';
import { loginAsStudent, captureTestScreenshot } from './helpers/auth';

test.describe('Scenario 11: Rohan PlacementReady — Opportunity Matching & Offer Lifecycle', () => {
  test('Rohan inspects matched opportunities, reviews fit explanations and tracks application lifecycle to offer stage', async ({ page }) => {
    // 1. Login as Rohan PlacementReady
    const studentData = await loginAsStudent(page, 'student10@spar-test.example', 'Rohan', 'PlacementReady', 'DATA_ENGINEER', 4, 2026);
    const studentId = studentData.student.id;

    // 2. Visit Opportunities Page
    await page.goto('/app/opportunities');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Opportunity Matching');
    await captureTestScreenshot(page, '11_rohan_opportunities_view');

    // 3. Create job application and transition stages
    const appResp = await page.request.post(`http://localhost:8000/api/v1/students/${studentId}/opportunities/applications`, {
      data: {
        company: 'SPAR Automated Solutions',
        role: 'Junior Analytics Engineer',
        status: 'APPLIED',
        salary_or_stipend: '₹40,000 / month',
      }
    });
    expect(appResp.ok()).toBeTruthy();
    const appData = await appResp.json();

    // Move to INTERVIEW
    await page.request.put(`http://localhost:8000/api/v1/students/${studentId}/opportunities/applications/${appData.id}/status`, {
      data: { status: 'INTERVIEW', notes: 'Technical round passed.' }
    });

    // Move to OFFER
    await page.request.put(`http://localhost:8000/api/v1/students/${studentId}/opportunities/applications/${appData.id}/status`, {
      data: { status: 'OFFER', notes: 'Offer letter received.' }
    });

    // 4. View Progress Growth Story
    await page.goto('/app/progress');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '11_rohan_offer_pipeline');
  });
});

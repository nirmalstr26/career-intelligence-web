import { test, expect } from '@playwright/test';
import { loginAsStudent, captureTestScreenshot } from './helpers/auth';

test.describe('Scenario 05: Arjun Advanced — Accelerated Pathway & Readiness Gating Analysis', () => {
  test('Arjun has perfect diagnostic scores but is properly gated from 95%+ readiness until project & interview evidence are verified', async ({ page }) => {
    // 1. Login as Arjun Advanced
    const studentData = await loginAsStudent(page, 'student04@spar-test.example', 'Arjun', 'Advanced', 'DATA_ENGINEER', 4, 2026);
    const studentId = studentData.student.id;

    // 2. Fetch readiness via backend
    const readResp = await page.request.get(`http://localhost:8000/api/v1/students/${studentId}/readiness`);
    expect(readResp.ok()).toBeTruthy();
    const readinessData = await readResp.json();
    
    // Gating check: Without project/interview evidence, placement readiness is capped at <= 65%
    const placementScore = readinessData.placement_readiness.readiness_score;
    expect(placementScore).toBeLessThanOrEqual(65);

    // 3. Inspect Today cockpit
    await page.goto('/app/today');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '05_arjun_advanced_today');

    // 4. Inspect Progress Growth Story
    await page.goto('/app/progress');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Readiness Story');
    await captureTestScreenshot(page, '05_arjun_progress_evidence');
  });
});

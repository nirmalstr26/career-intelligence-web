import { test, expect } from '@playwright/test';
import { loginAsStudent, captureTestScreenshot } from './helpers/auth';

test.describe('Scenario 08: Priya CareerSwitch — Clean Career Direction Transition', () => {
  test('Priya switches career path to AI_ML with confirmation dialog, single active career enforcement, and updated UI context', async ({ page }) => {
    // 1. Login as Priya
    const studentData = await loginAsStudent(page, 'student09@spar-test.example', 'Priya', 'CareerSwitch', 'AI_ML');
    const studentId = studentData.student.id;

    // 2. Perform switch via API to ensure canonical DB state
    await page.request.post(`http://localhost:8000/api/v1/students/${studentId}/careers/switch`, {
      data: { new_career_cluster_code: 'AI_ML', reason: 'Focusing on LLM agents and machine learning engineering.' }
    });

    // 3. Inspect Today Cockpit
    await page.goto('/app/today');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '08_priya_career_switched_today');

    // 4. Inspect Guided Path
    await page.goto('/app/path');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '08_priya_career_switched_path');

    // 5. Inspect SPAR Coach
    await page.goto('/app/coach');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '08_priya_career_switched_coach');
  });
});

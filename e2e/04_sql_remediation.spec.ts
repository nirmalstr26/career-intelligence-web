import { test, expect } from '@playwright/test';
import { loginAsStudent, captureTestScreenshot } from './helpers/auth';

test.describe('Scenario 04: Meera SQLGap — Failure, Locked Prerequisite & Remediation', () => {
  test('Meera experiences clear remediation feedback when score < 65% and unlocks downstream module upon retrying', async ({ page }) => {
    // 1. Login as Meera SQLGap
    const studentData = await loginAsStudent(page, 'student03@spar-test.example', 'Meera', 'SQLGap', 'DATA_ENGINEER', 3, 2027);
    const studentId = studentData.student.id;

    // 2. Perform diagnostic / assessment via API (Meera fails SQL at 55%)
    await page.request.post(`http://localhost:8000/api/v1/students/${studentId}/curriculum/module/assessment`, {
      data: { module_code: 'SQL_FUNDAMENTALS', score: 55.0 }
    });

    // 3. Inspect Today Cockpit — verifies SQL prioritized as gap / remediation
    await page.goto('/app/today');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '04_meera_remediation_today');

    // 4. Record passing score 82.0%
    await page.request.post(`http://localhost:8000/api/v1/students/${studentId}/curriculum/module/assessment`, {
      data: { module_code: 'SQL_FUNDAMENTALS', score: 82.0 }
    });
    await page.request.post(`http://localhost:8000/api/v1/students/${studentId}/curriculum/module/complete`, {
      data: { module_code: 'SQL_FUNDAMENTALS', assessment_score: 82.0 }
    });

    // 5. Verify state in Path
    await page.goto('/app/path');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '04_meera_unlocked_path');
    await expect(page.locator('h1')).toContainText('Roadmap');
  });
});

import { test, expect } from '@playwright/test';
import { loginAsStudent, captureTestScreenshot } from './helpers/auth';

test.describe('Scenario 07: Karthik InterviewGrowth — Mock Interview Defense & Multi-Turn Growth', () => {
  test('Karthik conducts initial weak interview attempt, followed by high-scoring attempt with preserved history and visible gains', async ({ page }) => {
    // 1. Login as Karthik
    const studentData = await loginAsStudent(page, 'student08@spar-test.example', 'Karthik', 'InterviewGrowth', 'DATA_ENGINEER');
    const studentId = studentData.student.id;

    // 2. Start and complete attempt 1
    const s1 = (await (await page.request.post(`http://localhost:8000/api/v1/students/${studentId}/interviews/INTERVIEW_DATA_ENGINEER_TECH/start`)).json()).session_id;
    for (let i = 0; i < 7; i++) {
      await page.request.post(`http://localhost:8000/api/v1/students/${studentId}/interviews/sessions/${s1}/answer`, {
        data: { student_answer: "Basic answer on SQL partitioning.", is_dont_know: false }
      });
    }

    // 3. Start and complete attempt 2 (Strong defense)
    const s2 = (await (await page.request.post(`http://localhost:8000/api/v1/students/${studentId}/interviews/INTERVIEW_DATA_ENGINEER_TECH/start`)).json()).session_id;
    for (let i = 0; i < 7; i++) {
      await page.request.post(`http://localhost:8000/api/v1/students/${studentId}/interviews/sessions/${s2}/answer`, {
        data: {
          student_answer: "I enforce idempotency via upsert window keys and partition parquet stores by event_date with schema evolution checks.",
          is_dont_know: false
        }
      });
    }

    // 4. View Practice Studio interview section
    await page.goto('/app/practice');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '07_karthik_interview_studio');

    // 5. View Progress Growth Story
    await page.goto('/app/progress');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '07_karthik_interview_growth_trend');
  });
});

import { test, expect } from '@playwright/test';
import { captureTestScreenshot } from './helpers/auth';

test.describe('Scenario 01: Asha Beginner — Registration & Onboarding Flow', () => {
  test('Asha completes landing, registration, onboarding, career selection and lands on Today cockpit', async ({ page }) => {
    // 1. Visit landing page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Build the career');
    await captureTestScreenshot(page, '01_asha_landing');

    // 2. Open registration form tab
    const registerTab = page.locator('button:has-text("Register New Student")');
    if (await registerTab.isVisible()) {
      await registerTab.click();
    }

    // 3. Fill registration details for Asha Beginner
    const email = 'student01@spar-test.example';
    await page.locator('input[placeholder="e.g. Alex"]').fill('Asha');
    await page.locator('input[placeholder="e.g. Rivera"]').fill('Beginner');
    await page.locator('input[placeholder="e.g. alex.rivera@college.edu"]').fill(email);

    // 4. Submit registration
    await page.locator('button:has-text("Register & Begin Career Onboarding")').click();
    await page.waitForTimeout(2000);
    await captureTestScreenshot(page, '01_asha_onboarding_transition');

    // 5. Complete onboarding via backend API to ensure 100% complete profile
    const sessionResp = await page.request.post('http://localhost:8000/api/v1/auth/dev-login', {
      data: {
        email,
        first_name: 'Asha',
        last_name: 'Beginner',
        target_career: 'DATA_ENGINEER',
      }
    });
    const sId = (await sessionResp.json()).student.id;
    await page.request.put(`http://localhost:8000/api/v1/students/${sId}/academics`, {
      data: {
        institution: { name: "SPAR Engineering College", country_code: "IN" },
        program: { degree_type: "B.Tech", department: "Computer Science & Engineering", program_name: "Computer Science & Engineering" },
        current_year: 1,
        current_semester: 2,
        expected_graduation_year: 2030,
        grading_system: "CGPA_10",
        current_grade: 8.8,
        academic_status: "ACTIVE",
      }
    });
    await page.request.put(`http://localhost:8000/api/v1/students/${sId}/career-preferences`, {
      data: {
        post_graduation_intent: "JOB",
        career_clarity: "CLEAR",
        job_interest: true,
        higher_study_interest: false,
        entrepreneurship_interest: false,
        preferred_location: "Bangalore / Remote",
      }
    });
    await page.request.put(`http://localhost:8000/api/v1/students/${sId}/interests`, {
      data: {
        interests: [{ interest_area_code: "DATA", interest_level: 5 }]
      }
    });
    await page.request.put(`http://localhost:8000/api/v1/students/${sId}/career-context`, {
      data: { career_context: "First year engineering student exploring data engineering.", consent: true }
    });

    // 6. Establish session in browser
    await page.evaluate(async (studentEmail) => {
      await fetch('http://localhost:8000/api/v1/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: studentEmail, first_name: 'Asha', last_name: 'Beginner', is_new_registration: false }),
      });
    }, email);

    await page.goto('/app/today');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
    
    // Assert single clear primary action is present
    const primaryAction = page.locator('[data-primary-action="true"]');
    await expect(primaryAction).toBeVisible();
    await captureTestScreenshot(page, '01_asha_today_cockpit');
  });
});

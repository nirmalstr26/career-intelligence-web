import { Page, expect } from '@playwright/test';

export async function loginAsStudent(
  page: Page,
  email: string,
  firstName: string = 'Test',
  lastName: string = 'Student',
  targetCareer: string = 'DATA_ENGINEER',
  currentYear: number = 3,
  graduationYear: number = 2027
) {
  // 1. Prepare backend profile via API
  const resp = await page.request.post('http://localhost:8000/api/v1/auth/dev-login', {
    data: {
      email,
      first_name: firstName,
      last_name: lastName,
      is_new_registration: false,
      target_career: targetCareer,
    },
  });
  expect(resp.ok()).toBeTruthy();
  const data = await resp.json();
  const sId = data.student.id;

  // 2. Complete full 100% onboarding in database
  await page.request.put(`http://localhost:8000/api/v1/students/${sId}/academics`, {
    data: {
      institution: { name: "SPAR Engineering College", country_code: "IN" },
      program: { degree_type: "B.Tech", department: "Computer Science & Engineering", program_name: "Computer Science & Engineering" },
      current_year: currentYear,
      current_semester: Math.min(8, currentYear * 2),
      expected_graduation_year: graduationYear,
      grading_system: "CGPA_10",
      current_grade: 8.5,
      academic_status: graduationYear >= 2026 ? "ACTIVE" : "GRADUATED",
    }
  });

  await page.request.put(`http://localhost:8000/api/v1/students/${sId}/career-preferences`, {
    data: {
      post_graduation_intent: "JOB",
      career_clarity: targetCareer ? "CLEAR" : "EXPLORING",
      job_interest: true,
      higher_study_interest: false,
      entrepreneurship_interest: false,
      preferred_location: "Bangalore / Remote",
    }
  });

  await page.request.put(`http://localhost:8000/api/v1/students/${sId}/interests`, {
    data: {
      interests: [
        { interest_area_code: "DATA", interest_level: 5 },
        { interest_area_code: "SOFTWARE", interest_level: 4 },
      ]
    }
  });

  await page.request.put(`http://localhost:8000/api/v1/students/${sId}/career-context`, {
    data: { career_context: `Targeting ${targetCareer || 'technology'} engineering roles.` }
  });

  // 3. Establish authenticated session directly in the browser
  await page.goto('/');
  await page.evaluate(async (studentEmail) => {
    await fetch('http://localhost:8000/api/v1/auth/dev-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: studentEmail,
        first_name: 'Test',
        last_name: 'Student',
        is_new_registration: false,
      }),
    });
  }, email);

  await page.goto('/app/today');
  await page.waitForLoadState('networkidle');
  return data;
}

export async function captureTestScreenshot(page: Page, screenshotName: string) {
  await page.screenshot({
    path: `/Users/Nirmal.Kumaravel@brillio.com/mycode/career-intelligence-web/e2e/screenshots/${screenshotName}.png`,
    fullPage: true,
  });
}

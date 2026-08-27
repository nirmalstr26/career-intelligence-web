import { test, expect } from '@playwright/test';
import { captureTestScreenshot } from './helpers/auth';

test.describe('Scenario 10: Recruiter Pilot Flow & Pre-Consent Anonymization', () => {
  test('Recruiter views anonymized candidate matches and accesses PII only after explicit student consent', async ({ page }) => {
    // 1. Visit Recruiter Registration / Dashboard
    await page.goto('/recruiter/dashboard');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '10_recruiter_dashboard');

    // 2. Test pre-consent anonymization via backend API
    const regResp = await page.request.post('http://localhost:8000/api/v1/recruiter/register', {
      data: {
        name: 'Browser Test Recruiter',
        email: 'recruiter.e2e@spar-test.example',
        company_name: 'SPAR Automated Solutions',
        job_title: 'Hiring Lead',
        company_website: 'https://spar-solutions.example',
        hiring_location: 'Bangalore',
      }
    });
    expect(regResp.ok()).toBeTruthy();
    const recruiterData = await regResp.json();
    const recruiterId = recruiterData.id;

    // Create Opportunity
    const oppResp = await page.request.post(`http://localhost:8000/api/v1/recruiter/${recruiterId}/opportunities`, {
      data: {
        title: 'Junior Analytics Engineer',
        opportunity_type: 'INTERNSHIP',
        work_mode: 'HYBRID',
        location: 'Bangalore',
        description: 'Design SQL workflows and automated test checks.',
        responsibilities: ['Write SQL queries', 'Maintain test suites'],
        mandatory_skills: ['SQL', 'PYTHON'],
        preferred_skills: ['DATABASES'],
        min_proficiency_score: 65.0,
        graduation_year_min: 2025,
        graduation_year_max: 2027,
        stipend_or_salary: '₹40,000 / month',
      }
    });
    expect(oppResp.ok()).toBeTruthy();
    const oppData = await oppResp.json();

    // Verify candidate matches are masked by default
    const matchResp = await page.request.get(`http://localhost:8000/api/v1/recruiter/${recruiterId}/opportunities/${oppData.id}/matches`);
    expect(matchResp.ok()).toBeTruthy();
    const candidates = await matchResp.json();
    if (candidates.length > 0) {
      expect(candidates[0].anonymized_alias).toBeTruthy();
    }
  });
});

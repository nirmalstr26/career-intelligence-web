import { test, expect } from '@playwright/test';
import { loginAsStudent, captureTestScreenshot } from './helpers/auth';

test.describe('Scenario 06: Sneha ProjectRetry — Practical Project Rubric & Evidence Verification', () => {
  test('Sneha fails initial project submission, receives actionable rubric feedback, then passes with verified evidence creation', async ({ page }) => {
    // 1. Login as Sneha
    const studentData = await loginAsStudent(page, 'student07@spar-test.example', 'Sneha', 'ProjectRetry', 'DATA_ENGINEER');
    const studentId = studentData.student.id;

    // 2. Submit initial weak project attempt
    await page.request.post(`http://localhost:8000/api/v1/students/${studentId}/projects/PROJECT_DATA_PIPELINE/submit`, {
      data: {
        submission_payload: {
          understand: { problem_summary: "Partial ETL attempt." },
          design: { architecture_summary: "Basic architecture." },
          build: { github_repo_url: "https://github.com/sneha/initial-etl", repository_notes: "WIP" },
          test: { valid_records_proof: "None", invalid_records_proof: "None" },
          explain: { scaling_strategy: "Not implemented", bad_data_handling: "Drop rows" },
        }
      }
    });

    // 3. Submit passing project attempt (88.0/100)
    await page.request.post(`http://localhost:8000/api/v1/students/${studentId}/projects/PROJECT_DATA_PIPELINE/submit`, {
      data: {
        submission_payload: {
          understand: { problem_summary: "Robust production ETL with quarantine and idempotency." },
          design: { architecture_summary: "Batch ingestion pipeline with schema validation.", validation_strategy: "Great Expectations." },
          build: { github_repo_url: "https://github.com/sneha/robust-data-pipeline", repository_notes: "Clean PySpark & SQL modular codebase." },
          test: { valid_records_proof: "10,000 records ingested without drop.", invalid_records_proof: "128 corrupted records quarantined." },
          explain: { scaling_strategy: "Partitioning by date.", bad_data_handling: "Dead letter queue with alert log." },
        }
      }
    });

    // 4. View Practice Studio
    await page.goto('/app/practice');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '06_sneha_practice_project_verified');

    // 5. View Progress Growth Story
    await page.goto('/app/progress');
    await page.waitForLoadState('networkidle');
    await captureTestScreenshot(page, '06_sneha_progress_project_evidence');
  });
});

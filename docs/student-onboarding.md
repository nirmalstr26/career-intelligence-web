# Student Onboarding, Home & Diagnostic

After a student signs in with Google for the first time, a `User` + `Student` are
created with only the identity completion weight, so `onboarding_required` is
`true`. The frontend then walks them through a resumable 5-step onboarding, lands
them on a data-driven home, and offers a diagnostic that feeds their Career
Intelligence.

## Flow

```
Google sign-in ──▶ onboarding_required?
                     │ yes ──▶ /onboarding (5 steps) ──▶ /app/home
                     │ no  ─────────────────────────────▶ /app/home
```

`onboarding_required` is derived from the profile completion the backend computes
(identity 20 + academics 30 + career intent 20 + interests 20 + context 10 = 100).
A profile is `COMPLETE` only at 100, so the **career context** step is required to
finish onboarding.

## Onboarding steps — `src/components/onboarding/OnboardingFlow.tsx`

Each step validates locally, then **persists to the backend before advancing**, so
progress is durable. On mount the flow loads `GET /students/{id}/profile` to
prefill fields and **resume** at the first incomplete section.

| Step | UI | Backend write |
| --- | --- | --- |
| About you | first/last name, country, city, state, phone | `PATCH /students/{id}` |
| Academics | institution, program, year/semester, grading, status | `PUT /students/{id}/academics` |
| Career intent | post-graduation intent, clarity, interests, location | `PUT /students/{id}/career-preferences` |
| Interests | pick areas + level (Low/Medium/High) | `PUT /students/{id}/interests` |
| Context & consent | free-text goals + consent | `PUT /students/{id}/career-context` + `POST /students/{id}/consents` |

Interest areas are loaded from `GET /interest-areas`. Consents recorded on finish:
`TERMS_OF_SERVICE`, `PRIVACY_POLICY`, `CAREER_PROFILE_PROCESSING`, `AI_ANALYSIS`
(version `1.0`).

### Completion handoff

On the final step the flow saves context + consents and shows the "You're all set"
screen **without** refreshing the session (so the onboarding guard doesn't redirect
early). When the student clicks **Go to my dashboard**, `refreshSession()` runs —
flipping `onboarding_required` to `false` — and navigates to `/app/home`.

## Home — `src/routes/app/home.tsx`

Reads `GET /students/{id}/career-intelligence` (the "career digital twin") for the
authenticated student and renders:

- welcome + profile completion + intelligence refresh status,
- **next best action**,
- career landscape (alignment meters), career direction,
- placement readiness ring, top strengths.

For a freshly-onboarded student with no assessment signals yet, the home shows a
prominent empty state: **Start diagnostic** → `/app/diagnostic`.

The other app tabs reuse the same Career Intelligence payload: **Career**
(landscape + primary readiness), **Missions** (next action, priority gaps, needs
validation), **Evidence** (verified strengths + career-graph summary), and
**Profile** (full profile + sign out).

## Diagnostic — `src/routes/app/diagnostic.tsx`

A self-contained flow (`intro → in_progress → results`):

1. `GET /assessments` — list active assessments; the student picks one.
2. `POST /students/{id}/assessments/{assessmentId}/attempts` — starts an attempt
   and returns the questions (answer keys are never sent).
3. Per question, `PUT /assessment-attempts/{attemptId}/responses/{questionId}`
   saves the selected option key(s) (supports single/multi-select; resumable).
4. `POST /assessment-attempts/{attemptId}/complete` — scores the attempt, returns
   per-skill results, and **auto-refreshes Career Intelligence** on the backend.

On completion the frontend invalidates the cached
`["career-intelligence", studentId]` query so the home/dashboard refetch and show
the newly computed signals.

## Authorization

Every one of these student-scoped calls is protected by `require_student_access`
on the backend: the session's student must match the path `student_id`, otherwise
`403 STUDENT_ACCESS_FORBIDDEN`. The frontend always uses the id from the verified
session (`useAuth().student.id`), never a user-supplied id.

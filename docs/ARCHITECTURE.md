# KAUSHAL — Architecture & Data Flow

"Don't claim your skills. Prove them."

Kaushal is a proof-of-work multidisciplinary talent discovery and hiring platform. This document outlines the end-to-end architecture connecting the React client with the Express backend, MongoDB database, and AI evaluation services.

---

## 1. High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Vite)                     │
│  Candidate Shell · Reviewer Shell · Recruiter Shell · Admin  │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTP / JSON API (Bearer Token)
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                  CENTRAL API CLIENT & HOOKS                  │
│     useAuth · useJobs · useApplications · useProofGraph      │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                   EXPRESS BACKEND SERVICES                   │
│   Auth & RBAC Middleware · Job DNA Engine · Assessment Gen   │
│   Eligibility Engine · AI Evaluation · Human Review Queue    │
│   Role Fit & Shortlist Engine · Interview Suite · Audit Log  │
└──────────────────────────────┬───────────────────────────────┘
                               │ Mongoose ORM
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                      MONGODB DATABASE                        │
│   Users · Orgs · Jobs · Assessments · Applications · Reviews │
│   Projects · ADRs · AutomatedChecks · CapabilityScores       │
│   ProofGraph · Interviews · Notifications · AuditLogs        │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Master Product Flow

1. **JOB REQUISITION**: Recruiter creates a job with domain, profession, experience, and department.
2. **JOB DNA**: AI analyzes the job description to extract mandatory technical dimensions and constraint requirements.
3. **COMPETENCY MODEL**: Recruiter reviews and tunes competency weights (enforcing 100% mathematical sum).
4. **ASSESSMENT GENERATION**: AI drafts versioned practical scenarios, deliverables, and structured rubrics.
5. **CANDIDATE APPLICATION**: Candidate applies; objective eligibility engine verifies domain prerequisites.
6. **EVIDENCE & SUBMISSION**: Candidate submits real Git repositories, 3D CAD/FEA models, or audit workpapers with Architectural Decision Records (ADRs).
7. **EVALUATION & INTEGRITY**: Automated container tests verify resilience; AI evaluates submission against rubric.
8. **HUMAN REVIEW**: Calibrated peer reviewers evaluate submissions with consensus agreement tracking.
9. **SHORTLIST & ROLE FIT**: Authoritative backend calculates role-fit scores and generates evidence-backed shortlist justifications.
10. **INTERVIEW & SCORECARD**: AI generates candidate-specific defense questions; recruiter records structured scorecard ratings.
11. **FINAL HR DECISION**: HR records Select / Hold / Reject decisions with decision memo logged to immutable audit records.
12. **ANALYTICS & FEEDBACK**: Real-time pipeline funnel, reviewer calibration, and time-to-proof metrics computed dynamically.

---

## 3. Directory Layout

```
proofline/
├── client/
│   ├── src/
│   │   ├── components/       # Modals (Job DNA, Assessment Gen, Evidence Explorer, Interview, Decision)
│   │   ├── designs/          # Role Shells (Candidate, Reviewer, Recruiter)
│   │   ├── context/          # Career & Role Providers
│   │   ├── data/             # Static Career Taxonomy & Rubric metadata
│   │   ├── hooks/            # Live Data Hooks (useJobs, useApplications, useCapabilities)
│   │   ├── services/         # API Service Facades (job, assessment, application, review)
│   │   ├── types/            # Central TypeScript Contracts
│   │   └── lib/api.ts        # Central Axios/Fetch Client with Token Interceptor
│   └── docs/                 # Contract Documentation
└── server/
    ├── config/               # Database & Environment configuration
    ├── controllers/          # Express Route Controllers
    ├── middleware/           # JWT Authentication, RBAC, Rate Limiting, Audit
    ├── models/               # Mongoose Schemas (Job, Assessment, Application, User, etc.)
    ├── routes/               # Modular REST endpoints
    ├── services/             # Business Logic & AI Engines
    └── scripts/              # Database Seeder & Diagnostics
```

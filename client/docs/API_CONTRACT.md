# Kaushal Platform — Backend API Contract & Specification

**Platform Tagline:** *"Don't claim your skills. Prove them."*  
**Base URL:** `/api` (configured via `VITE_API_URL` environment variable)  
**Security & Auth:** Bearer JWT Token in `Authorization` header (`Authorization: Bearer <token>`) and HttpOnly session cookies.

---

## Table of Contents
1. [Authentication (`/auth`)](#1-authentication)
2. [Users & Profile (`/users`)](#2-users--profile)
3. [Career Domains & Taxonomy (`/domains`)](#3-career-domains--taxonomy)
4. [Challenges (`/challenges`)](#4-challenges)
5. [Submissions & Workspace (`/submissions`)](#5-submissions--workspace)
6. [Reviews & Rubrics (`/reviews`)](#6-reviews--rubrics)
7. [Capabilities & Proof Strength (`/capabilities`)](#7-capabilities--proof-strength)
8. [ProofGraph™ (`/proof-graph`)](#8-proofgraph)
9. [Proof Passport™ (`/proof-passport`)](#9-proof-passport)
10. [Recruiter Discovery (`/candidates`)](#10-recruiter-discovery)
11. [Outreach & Opportunities (`/opportunities`)](#11-outreach--opportunities)
12. [Notifications & Activity (`/notifications`)](#12-notifications--activity)
13. [Error Model & HTTP Status Codes](#13-error-model--http-status-codes)

---

## 1. Authentication

### `POST /auth/register`
- **Purpose:** Register a new user with platform role and optional career domain.
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "name": "Ananya Sharma",
    "email": "ananya@kaushal.dev",
    "password": "securePassword123!",
    "role": "CANDIDATE", // "CANDIDATE" | "REVIEWER" | "RECRUITER"
    "domain": "Technology",
    "profession": "Software Developer"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "usr_78942",
        "name": "Ananya Sharma",
        "email": "ananya@kaushal.dev",
        "role": "CANDIDATE",
        "careerDomain": "Technology",
        "profession": "Software Developer"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
  }
  ```
- **Errors:** `400 Bad Request`, `409 Conflict` (Email already registered), `422 Unprocessable Entity`.

---

### `POST /auth/login`
- **Purpose:** Authenticate existing user with email and password.
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "email": "ananya@kaushal.dev",
    "password": "securePassword123!"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "usr_78942",
        "name": "Ananya Sharma",
        "email": "ananya@kaushal.dev",
        "role": "CANDIDATE",
        "careerDomain": "Technology",
        "profession": "Software Developer"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
  }
  ```
- **Errors:** `401 Unauthorized` (Invalid credentials), `429 Too Many Requests`.

---

### `GET /auth/me`
- **Purpose:** Retrieve the currently authenticated user's profile and active platform role.
- **Auth:** Required (`Bearer <token>` or session cookie)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "usr_78942",
        "name": "Ananya Sharma",
        "email": "ananya@kaushal.dev",
        "role": "CANDIDATE",
        "careerDomain": "Technology",
        "profession": "Software Developer",
        "proofScore": 89,
        "isVerified": true
      }
    }
  }
  ```
- **Errors:** `401 Unauthorized`.

---

### `POST /auth/logout`
- **Purpose:** Invalidate current JWT session and clear session cookies.
- **Auth:** Required
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

## 2. Users & Profile

### `PATCH /users/me`
- **Purpose:** Update candidate or recruiter profile settings.
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "headline": "Backend Engineer · Distributed Systems",
    "bio": "Specializing in high-throughput systems, lock-free structures & Redis.",
    "location": "Bangalore, Remote OK",
    "skills": ["Go", "Redis", "PostgreSQL", "Kafka"]
  }
  ```
- **Response `200 OK`:** Returns updated `user` object.

---

## 3. Career Domains & Taxonomy

### `GET /domains`
- **Purpose:** Retrieve the 8 career domains, proof taxonomy, and list of supported professions.
- **Auth:** Public
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "tech",
        "name": "Technology",
        "tagline": "Show the code behind your claims.",
        "color": "#4f46e5",
        "professions": ["Software Developer", "Web Developer", "Data Analyst", "UI/UX Designer", "QA Tester", "Cybersecurity Analyst", "Cloud Engineer"]
      },
      {
        "id": "creative",
        "name": "Creative",
        "tagline": "Show the work behind your creativity.",
        "color": "#db2777",
        "professions": ["Graphic Designer", "Video Editor", "Photographer", "Animator", "Musician", "Content Creator"]
      }
    ]
  }
  ```

---

## 4. Challenges

### `GET /challenges`
- **Purpose:** Query the challenge marketplace filtered by career domain, profession, difficulty, or search term.
- **Auth:** Public / Optional User Context
- **Query Parameters:**
  - `domain`: string (e.g. `Technology`, `Creative`, `Finance & Banking`)
  - `profession`: string (e.g. `Software Developer`, `Graphic Designer`, `Musician`)
  - `difficulty`: string (`Beginner` | `Intermediate` | `Advanced` | `Expert`)
  - `search`: string (free text keyword search)
  - `page`: integer (default: `1`)
  - `limit`: integer (default: `20`)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "chl_9824",
        "title": "High-Concurrency Ticket Booking API",
        "tagline": "Build a zero-overselling booking engine with optimistic locking and atomic CAS.",
        "domainName": "Technology",
        "profession": "Software Developer",
        "difficulty": "Advanced",
        "diffColor": "#4f46e5",
        "effort": "3-4 hours",
        "tools": ["Go", "Redis", "PostgreSQL", "Docker"],
        "proves": ["Race Condition Handling", "Atomic Transactions", "Redis CAS"],
        "verifiedByCount": 38,
        "featured": true,
        "scenario": "Under a simulated 50,000 requests/sec flash sale spike, zero tickets may be double-booked.",
        "deliverables": ["Production Go backend", "ADR justifying state engine", "Hermetic container test suite"]
      }
    ]
  }
  ```

### `GET /challenges/:id`
- **Purpose:** Retrieve complete challenge specifications, constraints, scenario briefs, and rubrics.
- **Auth:** Public

---

## 5. Submissions & Workspace

### `POST /submissions`
- **Purpose:** Start working on a challenge and initialize a sandboxed workspace session.
- **Auth:** Required (`CANDIDATE`)
- **Request Body:**
  ```json
  {
    "challengeId": "chl_9824"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "sub_41029",
      "challengeId": "chl_9824",
      "challengeTitle": "High-Concurrency Ticket Booking API",
      "candidateId": "usr_78942",
      "status": "DRAFT",
      "progressPercent": 0,
      "deliverables": [],
      "adrs": []
    }
  }
  ```

### `PATCH /submissions/:id`
- **Purpose:** Save incremental workspace progress, update draft ADRs, or sync files.
- **Auth:** Required (`CANDIDATE`)

### `POST /submissions/:id/submit`
- **Purpose:** Finalize and dispatch deliverables for peer review and rubric audit.
- **Auth:** Required (`CANDIDATE`)
- **Request Body:**
  ```json
  {
    "deliverables": [
      { "name": "main.go", "type": "CODE", "url": "https://kaushal-evidence/usr_78942/main.go" },
      { "name": "benchmark_results.json", "type": "BENCHMARK", "url": "https://kaushal-evidence/usr_78942/bench.json" }
    ],
    "adrs": [
      {
        "id": "ADR-001",
        "title": "Redis Lua CAS for Zero-Lock Contention",
        "decision": "Leveraged atomic Lua scripts over PostgreSQL row-level locks.",
        "status": "ACCEPTED"
      }
    ]
  }
  ```
- **Response `200 OK`:** Updates `status` to `"IN_REVIEW"`.

---

## 6. Reviews & Rubrics

### `GET /reviews/queue`
- **Purpose:** Retrieve anonymous submissions pending evaluation for peer reviewers.
- **Auth:** Required (`REVIEWER` or `ADMIN`)
- **Query Parameters:**
  - `domain`: string (e.g. `Technology`, `Creative`, `Finance & Banking`)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "sub_41029",
        "title": "High-Concurrency Ticket Booking API",
        "candidate": "Anonymous Candidate #084",
        "profession": "Software Developer",
        "domain": "Technology",
        "difficulty": "Advanced",
        "deliverablesSummary": "Go Repository + ADR-001 + 24 Container Tests",
        "waitingHours": 2,
        "priority": "HIGH"
      }
    ]
  }
  ```

### `POST /reviews`
- **Purpose:** Submit rubric evaluation scores and expert feedback notes for a submission.
- **Auth:** Required (`REVIEWER`)
- **Request Body:**
  ```json
  {
    "submissionId": "sub_41029",
    "scores": [
      { "criterionId": "correctness", "score": 5, "maxScore": 5, "notes": "No race conditions found under 50k workers." },
      { "criterionId": "architecture", "score": 5, "maxScore": 5, "notes": "Clean boundary isolation." },
      { "criterionId": "testing", "score": 4, "maxScore": 5, "notes": "Fuzz testing coverage is thorough." }
    ],
    "decision": "APPROVE", // "APPROVE" | "REQUEST_CHANGES" | "REJECT"
    "summaryFeedback": "Exceptional concurrency implementation. ADR justification is airtight."
  }
  ```

---

## 7. Capabilities & Proof Strength

### `GET /users/:id/capabilities` or `GET /users/me/capabilities`
- **Purpose:** Compute real-time verified capability scores derived from submissions, reviews, and defense rounds.
- **Auth:** Public / Authenticated
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "userId": "usr_78942",
      "proofScore": 89,
      "verifiedProjectsCount": 4,
      "expertReviewsCount": 6,
      "defenseRoundsCount": 2,
      "confidenceLevel": "HIGH",
      "capabilities": [
        { "label": "Distributed Systems", "score": 92, "verifiedDeliverablesCount": 3, "expertReviewsCount": 5 },
        { "label": "Backend Architecture", "score": 88, "verifiedDeliverablesCount": 4, "expertReviewsCount": 6 },
        { "label": "Testing & Verification", "score": 95, "verifiedDeliverablesCount": 4, "expertReviewsCount": 6 }
      ]
    }
  }
  ```

---

## 8. ProofGraph™

### `GET /users/:id/proof-graph` or `GET /users/me/proof-graph`
- **Purpose:** Retrieve the node-edge constellation graph representing all verified deliverables, decision logs, and defense rounds.
- **Auth:** Public / Authenticated
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "userId": "usr_78942",
      "professionName": "Software Developer",
      "nodes": [
        { "id": "cap-dist", "label": "Distributed Systems", "type": "CAPABILITY", "score": 92, "x": 430, "y": 290, "color": "#4f46e5", "evidenceItems": ["3 Projects", "5 Reviews"] },
        { "id": "proj-ticket", "label": "Ticket Booking API", "type": "PROJECT", "x": 270, "y": 180, "color": "#0284c7", "evidenceItems": ["Git Commit Hash", "24/24 Container Tests"] }
      ],
      "edges": [
        { "from": "cap-dist", "to": "proj-ticket" }
      ]
    }
  }
  ```

---

## 9. Proof Passport™

### `GET /users/:id/proof-passport` or `GET /users/me/proof-passport`
- **Purpose:** Retrieve candidate's cryptographic verifiable credential passport.
- **Auth:** Public / Authenticated
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "passportId": "KSH-SOF-94A2X",
      "cryptographicHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "proofScore": 89,
      "capabilities": [
        { "label": "Distributed Systems", "score": 92 },
        { "label": "Backend Architecture", "score": 88 }
      ],
      "verifiedDeliverables": [
        {
          "id": "del_102",
          "title": "High-Concurrency Ticket Booking API",
          "domain": "Technology",
          "score": 92,
          "verifiedAt": "Feb 2025"
        }
      ],
      "publicShareToken": "ksh-74892",
      "issuedAt": "2025-02-15T00:00:00Z"
    }
  }
  ```

---

## 10. Recruiter Discovery

### `GET /candidates`
- **Purpose:** Talent intelligence search engine querying verified candidates across any career domain.
- **Auth:** Required (`RECRUITER` or `ADMIN`)
- **Query Parameters:**
  - `domain`: string (e.g. `Technology`, `Creative`, `Finance & Banking`)
  - `profession`: string
  - `capability`: string
  - `search`: string
  - `minProofScore`: integer
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "usr_78942",
        "name": "Ananya Sharma",
        "profession": "Software Developer",
        "domain": "Technology",
        "headline": "Backend Engineer · Distributed Systems & Concurrency",
        "proofScore": 89,
        "confidence": "HIGH",
        "verifiedProjects": 4,
        "expertReviews": 3,
        "defenseRounds": 2,
        "capabilities": [
          { "label": "Distributed Systems", "score": 92 },
          { "label": "Backend Architecture", "score": 88 }
        ],
        "recentProof": {
          "title": "High-Concurrency Ticket API",
          "status": "Verified",
          "difficulty": "Advanced"
        },
        "keyDecision": "Redis Lua CAS instead of PostgreSQL row-locks",
        "location": "Bangalore, Remote OK",
        "tags": ["Go", "Redis", "PostgreSQL", "gRPC"]
      }
    ]
  }
  ```

---

## 11. Outreach & Opportunities

### `POST /opportunities`
- **Purpose:** Send direct invitation from recruiter to candidate based on verified proof evidence.
- **Auth:** Required (`RECRUITER`)
- **Request Body:**
  ```json
  {
    "candidateId": "usr_78942",
    "roleTitle": "Staff Backend Engineer",
    "message": "We reviewed your High-Concurrency Ticket API submission and want to connect."
  }
  ```

---

## 12. Notifications & Activity

### `GET /notifications`
- **Purpose:** Retrieve candidate/reviewer/recruiter alerts and review status updates.
- **Auth:** Required

### `PATCH /notifications/:id/read`
- **Purpose:** Mark notification as read.
- **Auth:** Required

---

## 13. Error Model & HTTP Status Codes

All API errors return a standard JSON payload:
```json
{
  "success": false,
  "error": "Human-readable description of error.",
  "code": "RESOURCE_NOT_FOUND",
  "status": 404
}
```

| HTTP Status | Meaning & Standard Trigger |
|---|---|
| `400 Bad Request` | Malformed JSON body or invalid request syntax. |
| `401 Unauthorized` | Missing or expired JWT authentication token. |
| `403 Forbidden` | Accessing a resource belonging to a different role or candidate. |
| `404 Not Found` | The requested challenge, submission, or user does not exist. |
| `409 Conflict` | Unique constraint violation (e.g. duplicate email registration). |
| `422 Unprocessable Entity` | Field validation error (e.g. invalid score range). |
| `429 Too Many Requests` | Rate limit exceeded. |
| `500 Internal Server Error` | Unexpected backend failure. |

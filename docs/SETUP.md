# KAUSHAL — Quickstart & Local Setup Guide

## Prerequisites
- Node.js (v18+)
- MongoDB (running on `mongodb://127.0.0.1:27017`)
- npm or yarn

---

## 1. Installation

From the root directory:
```bash
npm install
npm --prefix client install
```

---

## 2. Environment Configuration

Copy the example environment files:
```bash
cp .env.example .env
cp client/.env.example client/.env
```

Ensure `.env` contains:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/proofline
JWT_SECRET=your_jwt_secret_for_development_2026
CLIENT_URL=http://localhost:5173
```

---

## 3. Seed Database with Real Workflow Data

Populate MongoDB with organizations, verified candidates, challenges, jobs, assessments, applications, interviews, and audit logs:
```bash
npm run seed
```

### Demo Accounts Created:
| Role | Email | Password |
|---|---|---|
| **Candidate** | `arjun.candidate@proofline.dev` | `ProofWork2026!` |
| **Candidate** | `priya.candidate@proofline.dev` | `ProofWork2026!` |
| **Reviewer** | `vikram.reviewer@proofline.dev` | `ProofWork2026!` |
| **Recruiter** | `rachel@stripe.com` | `ProofWork2026!` |
| **Admin** | `admin@proofline.dev` | `ProofWork2026!` |

---

## 4. Run Development Servers

Run backend and frontend concurrently:
```bash
npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001/api`
- **Healthcheck**: `http://localhost:5001/health`

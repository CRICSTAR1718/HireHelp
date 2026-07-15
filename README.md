# HireHelp
HireHelp is a merged modular monolith that combines the backend behavior from the former `CandidatePortal`, `RecruitmentPortal`, `AdministrationPortal`, and `InterviewManagement` services into one Node.js application. The `ai-evaluation-service` remains a separate process and is called through `server/clients/ai-evaluation.client.ts`.

## What is included

- A single Express app in `server/app.ts` with the server entry point in `server/index.ts`.
- One router composition layer in `server/routes.ts`.
- Centralized configuration, logging, and constants in `server/config/`.
- A single Postgres connection and merged Drizzle schema set in `server/database/`.
- An in-process event bus in `server/events/`.
- Shared authentication, RBAC, validation, JWT, and password helpers in `server/common/`.
- Four feature areas under `server/modules/`:
  - `candidates/` for auth, profile, resume, applications, dashboard, notifications, interview status, and jobs.
  - `recruitment/` for requisitions, jobs, forms, pipeline, feedback, offers, applications, approvals, and logs.
  - `admin-rbac/` for auth, users, roles, permissions, departments, audit, configuration, approvals, and health.
  - `interviews/` for assignment, scheduling, calendar, interviewer, meeting links, feedback, and reminders.

## Current structure

```text
server/
├── app.ts
├── index.ts
├── routes.ts
├── clients/
├── common/
├── config/
├── database/
├── events/
└── modules/
    ├── admin-rbac/
    ├── candidates/
    ├── interviews/
    └── recruitment/
```

## Scripts

- `npm run dev` starts the server in watch mode.
- `npm run start` runs the server once.
- `npm run typecheck` runs the TypeScript compiler without emitting files.
- `npm run test` runs Jest.
- `npm run lint` runs ESLint.
- `npm run db:generate` generates Drizzle migrations.
- `npm run db:migrate` applies Drizzle migrations.
- `npm run db:seed` seeds the database.
- `npm run db:studio` opens Drizzle Studio.

## Setup

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

The seed script creates the bootstrap admin account defined by `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` if those variables are set, otherwise it uses the default seed credentials in the code. Change the admin password after first login.

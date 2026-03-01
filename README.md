# Level 4 Week 2 Assignment

Two-phase API project using Express with `projects` (primary) and `tasks` (related).

- Phase 1: In-memory CRUD
- Phase 2: Supabase Postgres + Prisma ORM v7

This branch (`feat/b`) is the Phase 2 implementation.

## Tech Stack

- JavaScript (ES Modules)
- Express
- Prisma ORM v7
- Supabase Postgres
- JWT auth
- Vitest + Supertest

## Project Structure

- `src/` API code (routes/controllers/middleware/repositories/db)
- `tests/` integration tests
- `prisma/` schema, migrations, seed
- `docs/` extra documentation (`rls-notes.md`)
- `.github/workflows/ci.yml` CI pipeline

## Setup

1. Install dependencies

```bash
npm install
```

2. Create `.env` from example

```bash
copy .env.example .env
```

3. Add your Supabase Session Pooler URL to `DATABASE_URL` (port `5432`)

4. Generate Prisma client

```bash
npm run db:generate
```

5. Create/apply local migration

```bash
npm run db:migrate:dev
```

6. Seed database

```bash
npm run db:seed
```

7. Start dev server

```bash
npm run dev
```

## Scripts

- `npm run db:generate`
- `npm run db:migrate:dev`
- `npm run db:migrate:deploy`
- `npm run db:seed`
- `npm run db:reset`
- `npm run test:run`

## Response Format

Success:

```json
{ "ok": true, "data": {}, "meta": {} }
```

Error:

```json
{
  "ok": false,
  "error": {
    "code": "SOME_CODE",
    "message": "Human readable message",
    "details": null,
    "requestId": "uuid"
  }
}
```

## Auth Endpoints

- `POST /auth/register`
- `POST /auth/login`

Protected routes require:

`Authorization: Bearer <token>`

## Resource Endpoints

Projects:

- `GET /projects?limit=10&offset=0`
- `GET /projects?includeCounts=true`
- `GET /projects?authorId=<uuid>`
- `POST /projects` (auth required)
- `GET /projects/:id`
- `GET /projects/:id?include=tasks,author`
- `PUT /projects/:id` (auth required + owner only)
- `DELETE /projects/:id` (auth required + owner only)

Tasks:

- `GET /projects/:id/tasks`
- `POST /projects/:id/tasks` (auth required)
- `PUT /tasks/:id` (auth required + owner only)
- `DELETE /tasks/:id` (auth required + owner only)

## Prisma Error Mapping

Global error handler maps:

- unique constraint -> `409`
- foreign key constraint -> `409`
- record not found -> `404`

## Testing

Tests are DB integration tests. Set:

```env
RUN_INTEGRATION_TESTS=true
```

Then run:

```bash
npm run test:run
```

## Postman

- `postman_collection.json`

Collection includes register/login + project/task flows.

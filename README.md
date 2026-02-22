# Level 4 Week 2 - Checkpoint A (Phase 1)

Express REST API for `projects` and `tasks` with in-memory storage, JWT auth, ownership checks, validation middleware, and a global response envelope.

## Tech

- JavaScript (ES Modules)
- Express
- JWT (`jsonwebtoken`)
- Vitest + Supertest

## Setup

1. Install dependencies

```bash
npm install
```

2. Configure environment

```bash
copy .env.example .env
```

3. Run dev server

```bash
npm run dev
```

4. Run tests

```bash
npm test
```

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

## Auth

- `POST /auth/register`
- `POST /auth/login`
- Protected routes require `Authorization: Bearer <token>`

Example register request:

```http
POST /auth/register
Content-Type: application/json

{ "email": "alice@example.com", "password": "secret123" }
```

Example register response:

```json
{ "ok": true, "data": { "token": "<jwt>" }, "meta": {} }
```

## Endpoints

### Projects (Primary)

- `GET /projects?limit=10&offset=0`
- `POST /projects` (auth required)
- `GET /projects/:id`
- `PUT /projects/:id` (auth required, owner only)
- `DELETE /projects/:id` (auth required, owner only)

### Tasks (Related)

- `GET /projects/:id/tasks`
- `POST /projects/:id/tasks` (auth required)
- `PUT /tasks/:id` (auth required, owner only)
- `DELETE /tasks/:id` (auth required, owner only)

### Health

- `GET /health`

## Notes for Phase 1

- Data is in-memory only (resets when server restarts).
- IDs are generated with `crypto.randomUUID()`.
- Status codes used: `200`, `201`, `400`, `401`, `403`, `404`, `409`.
- Postman collection: `postman_collection.json`

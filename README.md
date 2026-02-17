# level-4-week-2-assignment

This is a simple Express.js backend application for managing projects and tasks. It’s structured with clean separation of concerns: controllers, repositories, routes, and middleware.

## How To Run

1. Install dependencies

```
npm install
```

2. Start the server:

```
npm run start
```

## API Endpoints

### Health Check

1. GET /health
   Returns { status: 'ok' } — useful for monitoring.

### Projects

1. POST /projects
   Create a new project.

2. GET /projects
   Get all projects.

3. GET /projects/:id
   Get a specific project.

4. PUT /projects/:id
   Update a project.

5. DELETE /projects/:id
   Delete a project.

### Tasks

1. POST /tasks
   Create a new task.

2. GET /tasks
   Get all tasks.

3. GET /tasks/:id
   Get a specific task.

4. PUT /tasks/:id
   Update a task.

5. DELETE /tasks/:id
   Delete a task.

## How It Works

Repositories (repositories/) handle data access .
Controllers (controllers/) handle business logic and call repositories.
Routes (routes/) define the URL paths and map them to controller functions.
Middleware (middleware/) handles common concerns like error handling, not found, and response formatting.
Utils (utils/) contain helpers:
env.js — for reading environment variables.
jwt.js — for token-based authentication .
Input validators — for validating project/task data before processing.
createApp.js — the core app creator that sets up Express, middleware, and routes.
server.js — starts the Express app and listens on a port.

## Configuration

The app uses environment variables (via env.js) for configuration. You can set them based on the .env.example provided.

## Testing

```
npm run test
```

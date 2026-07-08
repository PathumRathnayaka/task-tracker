# Task Tracker

A full-stack task management app with authentication, role-based access, and
real-time updates.

- **Backend** — Spring Boot 4 (Java 21), Spring Security with JWT, JPA/PostgreSQL,
  STOMP over WebSocket.
- **Frontend** — React 19 + TypeScript (Vite), React Router, React Hook Form + Zod,
  Tailwind CSS, Axios.

## Features

- Register and log in with JWT-based authentication.
- Roles: regular users manage their own tasks; admins see and manage all tasks
  and users.
- Task CRUD with title, description, status, priority, and due date.
- Task list with pagination and filtering by status (and by owner for admins).
- Client and server-side validation.
- Live task updates pushed over WebSocket.

## Getting started

### Prerequisites

- Java 21 and Maven (the Maven wrapper is included)
- Node.js 20+
- PostgreSQL

### Backend

```bash
cd backend
cp .env.example .env      # adjust database credentials and JWT secret
./mvnw spring-boot:run
```

The API runs on `http://localhost:8080`. Swagger UI is available at
`http://localhost:8080/swagger-ui.html`.

On first startup the application seeds a default administrator so the
admin-only features can be tried immediately:

| Username | Password |
| --- | --- |
| `admin` | `Admin@12345` |

Registration always creates regular users; the admin account is provisioned
through this seed and can be overridden with the `ADMIN_*` environment
variables. Change the password before deploying anywhere public.

### Frontend

```bash
cd frontend
cp .env.example .env      # point at the backend if it is not on localhost:8080
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## Configuration

Backend (`backend/.env`):

| Variable | Description |
| --- | --- |
| `DB_URL` | JDBC URL for PostgreSQL |
| `DB_USERNAME` / `DB_PASSWORD` | Database credentials |
| `JWT_SECRET` | Base64-encoded signing key |
| `JWT_EXPIRATION_MS` | Token lifetime in milliseconds |
| `ADMIN_USERNAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded administrator account |
| `APP_CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins |

Frontend (`frontend/.env`):

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the REST API |
| `VITE_WS_URL` | WebSocket (SockJS) endpoint |

## API overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Authenticate and receive a token |
| `GET` | `/api/tasks` | List tasks (paginated, filterable) |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/{id}` | Update a task |
| `DELETE` | `/api/tasks/{id}` | Delete a task |
| `GET` | `/api/admin/users` | List users (admin only) |
| `DELETE` | `/api/admin/users/{id}` | Delete a user (admin only) |

Task changes are broadcast to `/topic/tasks/created`, `/topic/tasks/updated`,
and `/topic/tasks/deleted`.

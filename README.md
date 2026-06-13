# RentFlow Monorepo

RentFlow monorepo migrated from the existing repositories with `git subtree`.
The application source code, package manifests, Go module, Dockerfile, config
files, and runtime behavior remain inside each app folder.

## Apps

| App | Source repository | Monorepo path |
| --- | --- | --- |
| Customer web app | `fulltank-garage/RentFlow-Web-App` | `apps/customer` |
| Admin dashboard | `fulltank-garage/RentFlow-Admin-Dashboard` | `apps/admin` |
| Partner dashboard | `fulltank-garage/RentFlow-Partner-Dashboard` | `apps/partner` |
| API | `fulltank-garage/RentFlow-Api` | `apps/api` |

## Prerequisites

- Node.js 22 or newer for the Next.js apps
- npm
- Go 1.25.5 or newer for the API
- Docker and Docker Compose for containerized local development

## Environment Files

Copy the example files before running locally when you need to override defaults:

```powershell
Copy-Item apps\customer\.env.example apps\customer\.env.local
Copy-Item apps\admin\.env.example apps\admin\.env.local
Copy-Item apps\partner\.env.example apps\partner\.env.local
Copy-Item apps\api\.env.example apps\api\.env
```

## Run Locally

Run each app independently from its own folder.

### Customer

```powershell
cd apps\customer
npm install
npm run dev -- --port 3000
```

Customer app: <http://localhost:3000>

### Admin

```powershell
cd apps\admin
npm install
npm run dev -- --port 3001
```

Admin dashboard: <http://localhost:3001>

### Partner

```powershell
cd apps\partner
npm install
npm run dev -- --port 3002
```

Partner dashboard: <http://localhost:3002>

### API

```powershell
cd apps\api
Copy-Item .env.example .env
go mod download
go run .
```

API: <http://localhost:8080>

The API also keeps its original app-local Docker Compose file:

```powershell
cd apps\api
Copy-Item .env.example .env
docker compose up --build
```

## Run The Full Stack With Root Docker Compose

```powershell
docker compose up --build
```

Default local ports:

| Service | URL |
| --- | --- |
| Customer | <http://localhost:3000> |
| Admin | <http://localhost:3001> |
| Partner | <http://localhost:3002> |
| API | <http://localhost:8080> |
| Postgres | `localhost:5433` |
| Redis | `localhost:6380` |

## Build And Check

```powershell
cd apps\customer
npm ci
npm run lint
npm run build
```

```powershell
cd apps\admin
npm ci
npm run lint
npm run build
```

```powershell
cd apps\partner
npm ci
npm run lint
npm run build
```

```powershell
cd apps\api
go test ./...
go build ./...
```

## Folder Structure

```text
rentflow/
├── apps/
│   ├── customer/
│   ├── admin/
│   ├── partner/
│   └── api/
├── packages/
│   ├── shared-types/
│   └── shared-utils/
├── docs/
├── infra/
├── docker-compose.yml
├── README.md
└── .github/
    └── workflows/
```

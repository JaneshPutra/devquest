# DevQuest — Monorepo

A full-stack monorepo built with [Turborepo](https://turbo.build/), [Next.js 14](https://nextjs.org/), and [NestJS](https://nestjs.com/).

## Structure

```
devquest/
├── apps/
│   ├── web/          # Next.js 14 App Router (Frontend)
│   └── api/          # NestJS (Backend REST API)
├── packages/
│   ├── config/       # Shared tsconfig & ESLint configs
│   ├── types/        # Shared TypeScript interfaces
│   └── ui/           # Shared UI components
├── turbo.json        # Turborepo pipeline config
└── package.json      # Root workspace manifest
```

## Tech Stack

| Layer     | Technology                                 |
|-----------|--------------------------------------------|
| Frontend  | Next.js 14, App Router, TypeScript         |
| Styling   | Tailwind CSS, shadcn/ui                    |
| Backend   | NestJS, TypeScript                         |
| Database  | PostgreSQL via Prisma ORM                  |
| Monorepo  | Turborepo, npm Workspaces                  |

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 10.0.0
- **PostgreSQL** (for the API)

## Local Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd devquest
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the `.env.example` files and fill in your values:

```bash
# Root
cp .env.example .env

# Web app
cp apps/web/.env.example apps/web/.env.local

# API
cp apps/api/.env.example apps/api/.env
```

> **apps/api/.env** — make sure `DATABASE_URL` points to your running PostgreSQL instance.

### 4. Run Prisma migrations (first time)

```bash
cd apps/api
npx prisma migrate dev
cd ../..
```

### 5. Start development servers

```bash
npm run dev
# or
npx turbo dev
```

This runs **both** apps concurrently:
- **Web** → http://localhost:3000
- **API** → http://localhost:3001

## Available Scripts

| Command          | Description                              |
|------------------|------------------------------------------|
| `npm run dev`    | Start all apps in development mode       |
| `npm run build`  | Build all apps for production            |
| `npm run lint`   | Lint all apps and packages               |

## Packages

### `@repo/config`
Shared TypeScript (`tsconfig`) and ESLint configurations used across all apps.

### `@repo/types`
Shared TypeScript interfaces and types (to be populated as the project grows).

### `@repo/ui`
Shared React component library (to be populated as the project grows).

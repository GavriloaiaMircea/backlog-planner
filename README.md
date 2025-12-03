# Backlog Planner (Gaming Schedule Planner)

A focused time-management and monthly planning app for games. Instead of just tracking a backlog, Backlog Planner helps you plan each month with realistic constraints, execute the plan, and gracefully roll unfinished games forward.

## Core Vision

- Master Backlog: Pool of all games you want to play.
- Monthly Plan: Create plans like "December 2025" and drag games in.
- Execution: Track progress and status during the month.
- Rollover: Move unfinished games to next month or back to backlog.

## Tech Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS (`/frontend`)
- Backend: C# .NET 8 Web API following Clean Architecture (`/backend`)
- Database: MVP uses in-memory/JSON; planned migration to SQL Server/PostgreSQL via EF Core
- Monorepo: Managed from `/backlog-planner`

## Domain Model (MVP)

Game

- `Id`: Guid
- `Title`: string
- `Platform`: enum [PC, Steam Deck, Console, Multiplayer]
- `Status`: enum [Backlog, Playing, Completed, Dropped]
- `PlannedMonth`: nullable string (e.g., `YYYY-MM` like `2025-12`), or null when in backlog
- `Rating`: nullable 1–10
- `CompletionStatus`: percentage or boolean

Additional planning entities (roadmap): Monthly plan, constraints/presets, rollover actions.

## Scheduler Workflow

- Dashboard
  - Left: Master Backlog (unscheduled games)
  - Center/Right: Current Month Plan (active focus)
- Planning Constraints
  - User defines slots (e.g., 3 PC games + 1 Steam Deck)
  - UI visualizes overbooking vs capacity
- Presets
  - Default constraints (e.g., 2 Multiplayer + 1 Singleplayer)
- Rollover
  - End-of-month wizard to move/drop unfinished titles

## Future Roadmap

- Steam Integration
  - Backend proxies Steam Web API and securely handles API keys
  - Frontend never touches Steam directly
- Smart Rollover
  - Guided decisions for unfinished games (move to next month or drop)
- Data Analysis
  - Compare Time To Beat vs available hours; warn on unrealistic plans
- Persistence
  - Transition from in-memory to EF Core with SQL Server/PostgreSQL

## Architecture & Standards

- Clean Architecture on backend: Controller → Service → Repository
- DTOs only for API contracts; do not serialize EF/Entity classes directly
- Frontend: React Hooks + strict TypeScript, no class components

## Project Structure

```
BacklogPlanner.sln
backend/
  BacklogPlanner.API.csproj
  Program.cs
  appsettings.json
  appsettings.Development.json
  Properties/launchSettings.json
frontend/
  package.json
  vite.config.ts
  src/
    main.tsx
    App.tsx
    styles
```

## Getting Started

Prerequisites

- Node.js 18+ and npm or pnpm
- .NET SDK 8.0+

Install

```bash
# From repo root
# Frontend
cd frontend
npm install

# Backend
cd ../backend
dotnet restore
```

Run (Dev)

```bash
# Frontend dev server
cd frontend
npm run dev

# Backend API
cd ../backend
dotnet run
```

Environment

- Frontend dev server runs on Vite default (e.g., http://localhost:5173)
- Backend runs on ASP.NET defaults (e.g., http://localhost:5000 / https://localhost:7000) as per `launchSettings.json`
- Configure app settings in `backend/appsettings.Development.json`

## API Contracts (MVP)

- Use DTOs for game listing, plan creation, and status updates
- JSON-based storage initially; replaceable with EF Core repositories

## Contributing

- Keep changes minimal and focused
- Follow TypeScript strictness on the frontend and DTO-only responses on the backend
- Prefer small PRs with clear descriptions

## License

Proprietary. All rights reserved.

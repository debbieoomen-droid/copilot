# Project Guidelines — Rabobank Case Summary

## Architecture

- Monorepo with two independent halves — **do not blur the boundary between them**:
  - `project/frontend/` — vanilla HTML/CSS/JavaScript (ES2022 modules), no build step, served via VS Code Live Server. See `project/frontend/.github/copilot-instructions.md` for frontend-specific rules.
  - `project/backend/` — Java 17 + Spring Boot 3, REST API on `/api/v1/`. See `project/backend/.github/copilot-instructions.md` for backend-specific rules.
- The frontend runs standalone against in-memory mock data (`project/frontend/js/data.js`) by default; flip `USE_REAL_BACKEND` in `project/frontend/js/config.js` to call the Spring Boot backend on `localhost:8080` instead.
- Keep frontend and backend concerns separate: don't introduce backend-only patterns (JPA, Spring annotations) into `project/frontend/`, and don't introduce DOM/browser assumptions into `project/backend/`.

## Code Style

- Backend: constructor injection, service-layer business rules, DTOs as records — see `project/backend/.github/copilot-instructions.md`.
- Frontend: DOM API over `innerHTML`, named exports, no framework — see `project/frontend/.github/copilot-instructions.md`.
- Avoid introducing new build tooling in either half unless a feature explicitly requires it.

## Build and Test

- Frontend: open `project/frontend/index.html` via VS Code Live Server (`http://localhost:5500`). No install needed to browse; `npm install && npm test` (vitest) for the test suite.
- Backend: `cd project/backend && mvn test` for the JUnit 5 suite. `mvn spring-boot:run` starts the API on `http://localhost:8080` — only needed if you want the frontend to talk to it.

## Conventions

- Case data (mock or seeded) must stay stable and human-editable:
  - Use `YYYY-MM-DD` dates.
  - IBANs are always masked before reaching any UI or log.
- Do not add real customer data or confidential content to sample cases, anywhere in this repo.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hanok is a full-stack e-commerce app for a Korean cafe: React 19 + TypeScript frontend, Spring Boot 3.4 + Java 21 backend. Handles product browsing, cart management, and order placement with scheduled pickup.

## Communication Guidelines

The developer is a junior developer. Responses should be educational:

- **Explain WHY, not just WHAT**: Tradeoffs, decisions, patterns (DRY, SOLID), similar codebase examples
- **Simplify terminology**: Define terms, use analogies, concrete examples from the codebase
- **Teach best practices**: Naming conventions, error handling, type safety, when to extract logic
- **Foster understanding**: Underlying concepts, documentation references, clarifying questions

## Full-Stack Integration

- Frontend: port 5173, Backend API: port 8080
- CORS configured in `backend/.../config/CorsConfig.java` for localhost:5173
- API base URL: `http://localhost:8080/api` (configurable via `VITE_API_BASE_URL`)
- Both layers validate against the same business rules (pickup dates, regions). Frontend fetches config from backend for consistency.

## API Endpoints

**Products**: `GET /api/products` (list/filter), `GET /api/products/categories`, `GET /api/products/by-slug/{slug}`, `POST /api/products`, `PATCH /api/products/{id}`

**Orders**: `POST /api/orders/card-payment`, `POST /api/orders/tokenized-payment`, `GET /api/orders/basket?itemIds=1,2&quantities=3,1`

**Config**: `GET /api/config/pickup-rules`, `GET /api/config/valid-regions`

## Git Commit Message Format

Format: `<type>(<scope>): <description>` with optional body.

**Types**: `feat`, `fix`, `refactor`, `docs`

**Scope**: `<layer>/<component-or-area>` — PascalCase for components (`PickupMap`), lowercase for areas (`checkout`, `utils`). Always include layer (`frontend/`, `backend/`) unless `docs`. Breaking changes: `!` after scope.

**Description**: Capital letter, imperative mood, no period, under 72 chars. Common verbs: Add, Update, Remove, Fix, Refactor, Optimize.

**Body** (optional): Blank line after description, explain why/how/tradeoffs, wrap at 72 chars.

Examples:
```
feat(frontend/PickupMap): Add expandable fullscreen map
fix(backend/OrderService): Correct pickup date validation edge case
```

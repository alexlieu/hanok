# Frontend CLAUDE.md

Guidance for the React frontend.

## Tech Stack

React 19, TypeScript, Vite 6.3, React Router v7, TailwindCSS 4.0, React Hook Form, Zod, React Aria Components

## Commands

```bash
npm run dev              # Dev server (http://localhost:5173)
npm run build            # Production build (tsc + Vite)
npm run lint             # ESLint
npm run storybook        # Storybook (http://localhost:6006)
```

## Architecture

**State Management**: Context API + reducer in `BasketProvider` (`src/store/`). Local storage persistence. Optimistic updates with backend sync — local state updates immediately, `GET /api/orders/basket` validates and returns prices (backend is source of truth), rollback on error. Maintain this pattern.

**Routing**: React Router v7 with loader pattern. Loaders prefetch data before rendering (in `src/utils/loader.ts`). Slug-based URLs: `/products/{categorySlug}/{productSlug}`.

**Validation**: Zod schemas in `src/schemas/`, composed for complex forms. Dynamic validation from backend config (unavailable dates, regions). React Hook Form + `zodResolver(schema)`. Backend errors override client-side and display at field level.

**API Layer**: Centralized client in `src/utils/api/apiClient.ts`. Type-safe `api.get<T>()`, `api.post<T>()`. Custom `ApiError` with status codes. Transforms backend validation errors to form format.

**Components**: Pages in `src/pages/`, feature components in `src/components/{basket,checkout,product,products}/`, reusable UI in `src/components/ui/`. React Aria Components for WCAG accessibility.

## Testing

Storybook + Vitest browser tests. Stories in `src/stories/`. Includes a11y addon.

## Visual Design

**Tone**: Playful sophistication — like a well-designed Korean cafe, not a theme park. Modern and minimal with warm, friendly accents. Korean cultural elements inspire structure (grids, symmetry, balance), never decoration.

**Detail level**: 4/10. Most of the UI should be quiet. Reserve visual interest for interactive elements and focal points.

**Reference sites** (study these for tone, not to copy):
- **Shupatto** (https://www.shupatto.com/en/) — snappy micro-interactions, playful sophistication
- **The Gentlewoman** (https://thegentlewoman.co.uk/club) — whitespace, content-first
- **A24 Shop** (https://shop.a24films.com/) — gallery-like product presentation

### Design Constraints

- Color tokens and font definitions live in `src/App.css` — always reference these, never hardcode values
- Foundation colors (80% of UI), accent colors (20%). **Max 2-3 accent colors per page**
- Primary font: M PLUS Rounded 1c. No additional font families, no decorative fonts, no weights below 400
- WCAG AA: 4.5:1 contrast for body, 3:1 for large text. Visible focus indicators. Never rely on color alone. Min 14px font, line-height 1.5+. Respect `prefers-reduced-motion`
- Whitespace is a design element — generous gaps, consistent spacing, comfortable reading width
- Consistent grids, aligned elements, uniform spacing. No decorative patterns

### Animation Constraints

- Only animate `transform`, `opacity`, `filter` (GPU-composited properties)
- 0.2-0.5s duration — snappy, never sluggish
- Hover: lift (`translateY` 2-4px) or subtle shadow. Press: scale (0.98)
- Never: page load animations, continuous animations, decorative motion, animating layout properties (`width`/`height`/`top`/`left`)

### Component Conventions

Match existing components for styling patterns — check `src/components/ui/` before introducing new conventions. Key patterns: `border-2` on inputs/buttons, `ring-3` focus rings, subtle shadows on cards, product photos provide color.

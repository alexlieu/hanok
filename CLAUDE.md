# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hanok is a full-stack e-commerce application for a Korean cafe. It features a React 19 frontend with TypeScript and a Spring Boot 3.4 backend with Java 21. The application handles product browsing, shopping cart management, and order placement with scheduled pickup functionality.

## Communication Guidelines for Claude Code

The developer is a junior developer. Responses should be educational and help them grow their skills:

- **Explain WHY, not just WHAT**: Explain tradeoffs between approaches, justify decisions (performance, maintainability, readability), reference patterns (DRY, SOLID), and point to similar patterns in the codebase
- **Simplify terminology**: Define technical terms, use analogies, explain acronyms, and provide concrete examples from the codebase
- **Teach best practices**: Explain naming conventions, highlight error handling and type safety opportunities, suggest when to extract reusable logic
- **Foster understanding**: Explain underlying concepts so they can be applied elsewhere, reference documentation, ask clarifying questions
- **Emphasize code quality**: Teach readability (descriptive naming), maintainability (DRY principle), documentation, performance considerations, and helpful error messages

## Visual Design Guidelines

This application has a distinct visual identity inspired by Korean desserts and hanok architecture, balanced with modern minimalism. The goal is to create a **playful yet accessible** experience that feels **contemporary and culturally grounded** without being themed or touristy.

**Design philosophy**: Modern/minimalist with playful accents (4/10 detail scale), warm and friendly tone, Korean cultural elements as structural inspiration (not decoration), generous whitespace, and clean hierarchy.

**Note**: These are conceptual frameworks, not rigid rules. The design is evolving.

### Design References

**Shupatto** (https://www.shupatto.com/en/): Snappy animations (0.4-0.8s), smooth rotation/scaling effects, playful sophistication
**The Gentlewoman** (https://thegentlewoman.co.uk/club): Strategic whitespace, refined simplicity, content-first approach
**A24 Shop** (https://shop.a24films.com/): Gallery-like grid structure, sophisticated minimalism, product presentation

**Common themes**: Generous whitespace, clean typography, minimal decoration, content as focal point, purposeful interactions

### Typography

**Primary font**: M PLUS Rounded 1c - rounded/friendly forms, versatile weight range (400-900), modern yet playful

**Hierarchy**: Headings (700-800), Subheadings (500-700), Body (400), UI labels (500)

**Refinements**: Product names use `letter-spacing: -0.02em`, prices use `font-variant-numeric: tabular-nums`

**Optional**: DM Sans for body text if needed. Avoid multiple font families, decorative fonts, or thin weights (<400)

### Color System

**Tokens** (in `/frontend/src/App.css`):
- **Foundation** (80%): `default-bg` #F3F3F3 (light gray), `brand-colour-5` #6B8083 (slate gray-blue)
- **Accents** (20%): Green #5CB962 (success/CTAs), Orange #f2561d (active/energy), Blue #5A92B6 (info/links), Purple #7B559F (rare accent)
- **Functional**: Error red #d63e20, Focus blue #0A65DB

**Usage**: Foundation for most UI (background, primary/secondary text, borders). Accents for strategic pops. **Never use more than 2-3 accent colors per page**.

**Accessibility**: WCAG AA contrast (4.5:1 body, 3:1 large text), don't rely on color alone, visible focus indicators

### Layout & Structure

**Hanok-inspired grid** (conceptual): Geometric precision, symmetry, repeated modules. Apply as structural principles: consistent grids, aligned elements, uniform spacing, subtle divisions (borders or whitespace).

**Practical**: Product grids with consistent columns, aligned form layouts, separated page sections, uniform card aspect ratios.

**Avoid**: Decorative patterns, literal traditional copying, over-structuring. Adapt to content needs - the principle is consistency and balance.

### Visual Details & Polish

**Add interest to** (4/10 detail):

**Interactive elements** - Subtle shadows, micro-animations on hover (lift with `translateY(-2px)`, subtle scale, rotation), 0.2s transitions. Provides tactile feedback (Shupatto-inspired).

```css
&:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  transition: all 0.2s ease-out;
}
```

**Section dividers** - Thin borders (`border-bottom: 1px solid var(--color-brand-colour-5)`, low opacity)

**Active states** - Color + underline for clear feedback

**Keep simple**: Navigation, body text, background, whitespace

**Rule**: Detail and micro-animations on interactive elements and focal points. Keep structural elements minimal.

### Animation & Micro-interactions

**Inspiration**: Shupatto - snappy, choreographed, purposeful. **Feel**: Playful sophistication.

**Timing**: 0.2-0.5s (quick feedback, no sluggishness). Current patterns: `point-left/right-hover` (0.5s), focus transitions (0.2s)

**Movement**: Rotation + scaling, smooth transforms (`transform` and `opacity`), lift on hover (`translateY` 2-4px), scale on press (0.98)

**Easing**: `cubic-bezier(0.35, 0.91, 0.33, 0.97)`, `ease-out` (exits/hover), `ease-in-out` (state changes)

**Use on**: Hover states, focus indicators, active feedback, add-to-basket confirmations, scroll-based reveals

**Avoid**: Page load animations, continuous animations, decorative animations, animating `width`/`height`/`top`/`left`

**Performance**: Only animate `transform`, `opacity`, `filter` (GPU-accelerated). Test on mobile.

### Component Styling Patterns

**Buttons**: `border-2`, subtle hover states, primary buttons (experiment green vs. neutral), clear focus rings (`ring-3`)
**Form inputs**: `border-2`, brand color focus states, `error-red` + text labels, `brand-colour-5` placeholders
**Cards**: Minimal borders/whitespace separation, consistent aspect ratios, subtle shadows, let product photos add color

### Spacing & Accessibility

**Whitespace**: Design element, not empty space. Generous gaps between sections, consistent spacing, comfortable reading width.

**Accessibility** (WCAG AA): Contrast ratios (4.5:1 body, 3:1 large), visible focus indicators, don't rely on color alone, min 14px font size, line-height 1.5+, respect `prefers-reduced-motion`

### Design Evolution

**Working well**: Whitespace, M PLUS Rounded 1c typography, minimal navigation, structured forms

**Still developing**: Color per page, CTA button styling, animation choreography

**Questions for new elements**: (1) Serves user or just looks nice? (2) Aligns with "playful sophistication"? (3) Would Shupatto do this? (4) Respects 4/10 detail level?

## Git Commit Message Format

Follows **Conventional Commits**: `<type>(<scope>): <description>` with optional body/footer.

**Types** (lowercase): `feat`, `fix`, `refactor`, `docs`

**Scope** format: `<layer>/<component-or-area>` - Use PascalCase for components (`PickupMap`), lowercase for areas (`checkout`, `types`, `utils`). Always include layer (`frontend/`, `backend/`) unless it's a `docs` commit.

**Breaking changes**: Add `!` after scope: `feat(frontend/checkout)!: Remove phone field`

**Description rules**:
1. Capital letter, imperative mood ("Add" not "Added")
2. No period at end
3. Under 72 characters when possible
4. Common verbs: Add, Update, Remove, Fix, Refactor, Optimize

**Body** (optional, recommended for complex changes): Explain why, how, tradeoffs, context. Leave blank line after description. Wrap at 72 chars. Use prose, bullets, or mix both for clarity.

**Examples**:
```
feat(frontend/PickupMap): Add expandable fullscreen map
fix(frontend/DatePicker): Correct focus styling on date segments
```

**With body**:
```
feat(frontend/checkout): Add debounced validation to email field

Implements custom useDebounce hook to delay validation until user stops
typing. This prevents error flickering and reduces unnecessary validation
calls during active typing.

Applied to both email and phone fields with 300ms delay for consistency.
```

**Why this matters**: Consistent history, easy searching (`git log --grep`), automation potential (changelogs, semantic versioning), better code reviews, debugging aid.

## Common Commands

### Frontend (React + Vite)

```bash
cd frontend
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Build for production (runs TypeScript compiler then Vite build)
npm run lint             # Run ESLint
npm run preview          # Preview production build
npm run storybook        # Run Storybook component library (http://localhost:6006)
npm run build-storybook  # Build Storybook for deployment
```

Frontend tests are integrated with Storybook using Vitest + Playwright browser testing.

### Backend (Spring Boot + Maven)

```bash
cd backend
./mvnw spring-boot:run   # Start backend server (http://localhost:8080)
./mvnw test              # Run all tests
./mvnw clean install     # Clean build and install
```

**Important**: The backend uses H2 in-memory database which resets on each restart. Access the H2 console at http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:hanok`, username: `hanok`, no password).

## Architecture Overview

### Full-Stack Integration

- Frontend dev server runs on port 5173, backend API on port 8080
- CORS is enabled for `http://localhost:5173` in backend controllers
- API base URL: `http://localhost:8080/api` (configurable via `VITE_API_BASE_URL`)
- Both frontend and backend validate against the same business rules (pickup dates, regions, etc.)

### Frontend Architecture

**Tech Stack**: React 19.2, TypeScript, Vite 6.3, React Router v7, TailwindCSS 4.0, React Hook Form, Zod validation

**Key Patterns**:

1. **State Management**: Context API with reducer pattern

   - `BasketProvider` (`/frontend/src/store/`) manages cart state with local storage persistence
   - Optimistic updates with backend synchronization and rollback on failure
   - Every basket mutation triggers `GET /api/orders/basket` to validate items and calculate prices

2. **Routing & Data Loading**: React Router v7 with loader pattern

   - Loaders prefetch data before route rendering (defined in `/frontend/src/utils/loader.ts`)
   - Example: `checkoutLoader` fetches pickup rules, basket, and valid regions in parallel
   - Routes use slug-based URLs (e.g., `/products/desserts/cream-cheese-rice-brownies`)

3. **Validation Strategy**: Dual validation (client + server)

   - **Client**: Zod schemas with runtime configuration
     - Schemas in `/frontend/src/schemas/` compose for complex forms
     - Dynamic validation based on backend config (unavailable dates, allowed regions)
   - **Server**: Backend validates again and frontend displays backend errors in forms
   - Backend errors override client-side validation when conflicts occur

4. **API Layer**: Centralized client in `/frontend/src/utils/api/apiClient.ts`

   - Type-safe generic methods: `api.get<T>()`, `api.post<T>()`
   - Custom `ApiError` class with status codes
   - Transforms backend validation errors to frontend format

5. **Component Architecture**:
   - **Pages** (`/frontend/src/pages/`): Route-level components
   - **Feature Components** (`/frontend/src/components/{basket,checkout,product,products}/`): Domain-specific
   - **UI Components** (`/frontend/src/components/ui/`): Reusable, generic components
   - Uses React Aria Components for accessibility (WCAG compliance)

**Directory Structure**:

```
/frontend/src/
├── pages/          # Home, Products, Product, Basket, Checkout, OrderConfirmation
├── components/     # Feature-organized components + reusable ui/
├── store/          # BasketContext and BasketProvider
├── schemas/        # Zod validation schemas
├── types/          # TypeScript type definitions
├── utils/          # API client, hooks, loaders
├── services/       # Business logic (order.service.ts)
└── stories/        # Storybook stories
```

### Backend Architecture

**Tech Stack**: Spring Boot 3.4.3, Java 21, Spring Data JPA, H2 database, Maven, Jakarta Bean Validation

**Key Patterns**:

1. **Layered Architecture**: Controller → Service → Repository → Entity

   - **Controller** (`@RestController`): RESTful endpoints, request validation
   - **Service** (`@Service`): Business logic, transaction boundaries
   - **Repository** (`@Repository`): Spring Data JPA repositories with custom JPQL queries
   - **Entity** (`@Entity`): JPA entities with lifecycle hooks

2. **Validation Architecture**: Multi-level validation

   - **Annotation-based**: Jakarta Bean Validation (`@NotNull`, `@Email`, etc.)
   - **Custom validators**:
     - `@ValidPhoneNumber`: Uses Google libphonenumber
     - `@ValidPickupDate`: Validates against store config (holidays, opening hours)
     - `@AtLeastOneRequired`: Ensures email OR phone is provided
     - `@StateProvinceRegionLogic`: Country-specific address validation
   - **Validation groups** (`ValidationGroups` interface): Conditional validation based on payment type
     - `OrderChecks`, `PaymentChecks`, `CardChecks`, `TokenChecks`
     - Groups allow different validation rules for card vs tokenized payments
   - **Error handling**: `GlobalExceptionHandler` maps exceptions to structured error responses

3. **Domain Model**:

   - **Product**: Product → ProductVariant (1:Many) with size/flavour combinations
   - **Orders**: CustomerOrder → OrderItem (1:Many) → Payment (1:1)
   - **Order statuses**: PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED
   - **Pickup slots**: Enum for scheduled pickup times

4. **Configuration-Driven Business Rules** (`application.properties`):
   - Pickup cutoff time: 14:00 London time
   - Minimum lead time: 3 days
   - Booking window: 3 months maximum
   - Store opening hours: Configurable per weekday
   - Parsed at startup by `StoreConfig.java` using `@ConfigurationProperties`

**Directory Structure**:

```
/backend/src/main/java/com/alex_lieu/hanok/
├── controller/          # REST endpoints + GlobalExceptionHandler
├── service/             # OrderProcessingService, BasketService, PaymentService, etc.
├── repository/          # JPA repositories
├── entity/              # JPA entities (Product, CustomerOrder, Payment, etc.)
├── dto/                 # DTOs organized by feature (basket/, order/, payment/, config/)
├── validation/          # Custom validators + validation groups
├── enums/               # Category, PickupSlot, OrderStatus, etc.
├── exceptions/          # Custom exceptions (order/, product/)
└── config/              # StoreConfig, HolidayDataLoader, MessageSourceConfig
```

### API Endpoints

**Products**:

- `GET /api/products` - List/filter products (category, price, availability, sort)
- `GET /api/products/categories` - Get category counts
- `GET /api/products/by-slug/{slug}` - Get product by URL slug
- `POST /api/products` - Create product
- `PATCH /api/products/{id}` - Update product

**Orders**:

- `POST /api/orders/card-payment` - Place order with card payment
- `POST /api/orders/tokenized-payment` - Place order with saved payment token
- `GET /api/orders/basket?itemIds=1,2&quantities=3,1` - Validate basket items and calculate totals

**Configuration**:

- `GET /api/config/pickup-rules` - Get pickup date/time rules (cutoff, lead time, holidays)
- `GET /api/config/valid-regions` - Get allowed states/provinces for billing addresses

## Code Modification Guidelines

**Products**: Soft deletion via `active` flag. Update with `PATCH /api/products/{id}`. Variants use size/flavour combinations. Slugs auto-generated.

**Basket**: Optimistic updates → Local state updates immediately → API validates → Backend response updates state (prices are source of truth) → Rollback on error. Maintain this pattern.

**Validation**:
- Frontend: Zod schemas in `/frontend/src/schemas/`, use factories for dynamic validation
- Backend: Custom validators in `/validation/`, add groups to `ValidationGroups`, apply with `@Validated`, messages in `ValidationMessages.properties`

**Forms**: React Hook Form + `zodResolver(schema)`. Backend errors displayed at field level. Multi-step forms compose schemas.

**Maps**: Leaflet in `/components/checkout/PickupMap.tsx`. Uses `React.memo`, `useCallback`, Framer Motion animations.

## Development Workflow

**Running Full Stack**:
1. Backend: `cd backend && ./mvnw spring-boot:run` (http://localhost:8080, H2 console: /h2-console)
2. Frontend: `cd frontend && npm run dev` (http://localhost:5173)

**Storybook**: `cd frontend && npm run storybook` - Stories in `/frontend/src/stories/`, includes a11y addon, Vitest + Playwright tests

**Database**: H2 in-memory (resets on restart), seed data in `/backend/src/main/resources/data.sql`, console at http://localhost:8080/h2-console (JDBC: `jdbc:h2:mem:hanok`, user: `hanok`, no password)

## Testing Strategy

**Frontend**: Storybook + Vitest browser tests, Playwright E2E (configured), test files: `/frontend/src/**/*.test.ts`
**Backend**: JUnit 5 + Mockito, test files: `/backend/src/test/java/`, run with `./mvnw test`

## Important Configuration Files

- `/frontend/vite.config.ts` - Vite build config, Vitest setup
- `/frontend/eslint.config.js` - ESLint configuration
- `/frontend/tsconfig.json` - TypeScript configuration
- `/backend/pom.xml` - Maven dependencies and build config
- `/backend/src/main/resources/application.properties` - Spring Boot config (database, pickup rules, store hours)
- `/backend/src/main/resources/ValidationMessages.properties` - Custom validation error messages

## Key Implementation Details

**Optimistic UI**: Basket updates local state immediately, syncs asynchronously with backend, rolls back on error. Backend is source of truth.

**Configuration-Driven Validation**: Frontend and backend validate against same store config (pickup dates, regions). Frontend fetches from backend for consistency.

**Accessibility**: React Aria Components for WCAG compliance. Semantic HTML, keyboard navigation, screen reader friendly, automatic focus management. Test with Storybook a11y addon.

**Slug-Based URLs**: `/products/{categorySlug}/{productSlug}` (e.g., `/products/desserts/cream-cheese-rice-brownies`). Lowercase with hyphens.

**Payment**: Card (direct details) or Tokenized (saved token). Validation groups determine required fields. BillingAddress validation is country-specific.

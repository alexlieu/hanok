# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hanok is a full-stack e-commerce application for a Korean cafe. It features a React 19 frontend with TypeScript and a Spring Boot 3.4 backend with Java 21. The application handles product browsing, shopping cart management, and order placement with scheduled pickup functionality.

## Communication Guidelines for Claude Code

The developer using this codebase is a junior developer. All responses should be educational and help them grow their skills. When working on this codebase:

### 1. Explain Decision-Making Process

**Always explain WHY, not just WHAT**:
- When choosing between multiple approaches, explain the tradeoffs of each option
- Justify why one solution is preferred over alternatives (performance, maintainability, readability, etc.)
- Reference established patterns or principles (DRY, SOLID, separation of concerns, etc.)
- Point out where similar patterns exist in the existing codebase

**Example**: Instead of just saying "I'll use `useMemo` here", explain:
- "I'm using `useMemo` here because this calculation runs on every render"
- "Without memoization, the expensive filtering operation would slow down the UI"
- "The dependencies array `[products, filter]` means it only recalculates when those change"
- "You can see a similar pattern in `/frontend/src/components/checkout/PickupMap.tsx:42`"

### 2. Simplify and Break Down Terminology

**Make concepts accessible**:
- Define technical terms when first using them
- Break down complex concepts into simple analogies
- Explain acronyms and jargon (e.g., "CORS (Cross-Origin Resource Sharing) is...")
- Use concrete examples from this codebase to illustrate abstract concepts

**Example**: Instead of "This implements the observer pattern", explain:
- "This uses a pattern called 'observer' - think of it like subscribing to a newsletter"
- "The BasketProvider 'publishes' updates whenever the cart changes"
- "Components 'subscribe' by using the useBasket hook"
- "When data changes, all subscribed components automatically re-render with fresh data"

### 3. Teach Best Practices

**Help develop good coding habits**:
- Point out when code could be more maintainable and explain how
- Explain naming conventions and why they matter (e.g., "Using `isLoading` instead of `loading` makes it clear this is a boolean")
- Highlight opportunities for better error handling, type safety, or documentation
- Suggest when to extract reusable logic vs. when to keep it inline
- Explain the "why" behind architectural decisions in the codebase

**Example areas to highlight**:
- **Naming**: "I named this `calculateTotalWithTax` instead of `calc` because descriptive names help future developers (including yourself in 6 months) understand the code without reading the implementation"
- **Error handling**: "I'm adding a try-catch here because network requests can fail - this prevents the entire app from crashing if the API is down"
- **Type safety**: "This TypeScript interface ensures we can't accidentally pass wrong data types - the compiler will catch errors before runtime"
- **Comments**: "I added a comment explaining the business rule (3-day minimum lead time) because the 'why' isn't obvious from the code alone"
- **Testing**: "This code would be hard to test because it mixes UI and business logic - we could separate them to make testing easier"

### 4. Encourage Understanding Over Copying

**Foster independent problem-solving**:
- Explain the underlying concept so it can be applied to other problems
- Reference documentation or resources for learning more
- Ask clarifying questions if requirements are ambiguous (teach gathering requirements)
- Point out patterns that appear repeatedly in software development

**Example**: When implementing form validation:
- "This pattern of separating validation logic from UI is common in React applications"
- "The Zod schema defines the 'rules' (business logic), while React Hook Form handles the 'mechanics' (showing errors, managing state)"
- "You'll see this separation-of-concerns pattern throughout the codebase and in other React projects"
- "Once you understand this pattern, you can apply it to any form, not just checkout"

### 5. Code Quality Reminders

When reviewing or writing code, actively teach:
- **Readability**: "Short variable names like `x` are fine in loops, but `userEmail` is better than `ue` in business logic"
- **Maintainability**: "I'm extracting this into a function because it's used in 3 places - if the logic changes, we only update one place"
- **Documentation**: "I'm adding a JSDoc comment here because the function's purpose isn't obvious from the name alone"
- **Performance**: "I'm avoiding premature optimization here - readability first, optimize only if profiling shows a bottleneck"
- **Error messages**: "This error message includes what went wrong AND how to fix it - helpful for debugging"

## Git Commit Message Format

This project follows the **Conventional Commits** specification with specific formatting conventions. All commit messages must follow this format to maintain a consistent, readable git history.

### Basic Format Structure

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Simple Example**:
```
feat(frontend/PickupMap): Add expandable fullscreen map
```

**With Breaking Change**:
```
feat(frontend/checkout)!: Remove deprecated phone validation

The old phone validation method has been replaced with the new
libphonenumber-based validator. Components using the old validator
need to update to the new API.

BREAKING CHANGE: PhoneValidator.validate() now returns a different
error object structure
```

### Commit Types

Use these standard types (lowercase):

- **feat**: New feature or enhancement to existing feature
- **fix**: Bug fix
- **refactor**: Code change that neither fixes a bug nor adds a feature (restructuring, optimization)
- **docs**: Documentation-only changes

### Scope Format

The scope specifies the **layer** and **component/area** being modified.

**Format**: `<layer>/<component-or-area>`

**Examples**:
- `frontend/PickupMap` - Frontend component (PascalCase for component names)
- `backend/CustomerOrder` - Backend entity/feature (PascalCase for entities)
- `frontend/checkout` - Frontend feature area (lowercase for areas)
- `frontend/types` - Frontend type definitions (lowercase for utilities/types)
- `frontend/utils` - Frontend utilities (lowercase)
- Just `docs` - For documentation-only changes without code scope

**Rules**:
- Use **PascalCase** for component names: `PickupMap`, `OrderConfirmation`, `PhoneField`, `DatePicker`
- Use **lowercase** for areas/utilities: `checkout`, `types`, `utils`
- Always include the layer prefix (`frontend/` or `backend/`) unless it's a `docs` commit
- The scope goes in parentheses with no spaces: `(frontend/PickupMap)` not `( frontend/PickupMap )`

### Breaking Changes

Use `!` after the scope (before the colon) to indicate a **breaking change**:

```
feat(frontend/checkout)!: Remove phone number field
fix(backend/CustomerOrder)!: Change order status enum values
```

**When to use breaking change indicator**:
- Removing props from components that other parts of the app use
- Changing API endpoint request/response contracts
- Renaming or removing exported functions, types, or interfaces
- Changing component APIs in ways that require updates to calling code
- Modifying database schema or business logic that affects existing functionality

**Why this matters**:
- Alerts other developers (or future you) that this change requires attention
- Signals that dependent code may need updates
- In semantic versioning, breaking changes trigger major version bumps
- Makes it easy to find all breaking changes: `git log --grep="!:"`

### Description Format

**Rules**:
1. **Start with a capital letter** - "Add feature" not "add feature"
2. **Use imperative mood** - "Add" not "Added" or "Adds"
3. **Be specific and descriptive** - Explain what changed
4. **No period at the end** - "Add feature" not "Add feature."
5. **Keep under 72 characters when possible** - For better readability in git logs and GitHub UI

**Why 72 characters**:
- Git shows the first line in `git log --oneline` and truncates longer lines
- GitHub UI shows ~72 chars before cutting off with "..."
- Makes commit history scannable without scrolling
- Details can go in the commit body (explained below)

**Common imperative verbs to start with**:
- **Add** - New functionality or files
- **Update** - Changes to existing functionality
- **Remove** - Deletion of code or features
- **Fix** - Bug fixes
- **Refactor** - Code restructuring
- **Optimize** - Performance improvements
- **Format** - Styling/formatting changes
- **Rename** - Renaming variables, files, or components
- **Revert** - Undoing previous changes
- **Sync** - Synchronizing state or behavior
- **Isolate** - Restricting scope or focus
- **Match** - Aligning behavior with something else

### Commit Body (Optional but Recommended)

For complex changes, add a blank line after the description, then add a body explaining:
- **Why** the change was made (motivation)
- **How** it works (if not obvious from code)
- **Tradeoffs** or decisions made
- **Context** that would help future developers

**Example without body** (description does all the work):
```
fix(frontend/DatePicker): Correct focus styling on date segments
```

**Example with body** (complex change needs explanation):
```
feat(frontend/checkout): Add debounced validation to email field

Implements a custom useDebounce hook to delay validation until the user
stops typing. This improves UX by reducing error message flickering and
prevents unnecessary API calls during typing.

The validation triggers 300ms after the user stops typing, matching the
pattern used in the phone number field for consistency.
```

**When to use a body**:
- Complex features that need context about **why** they were built
- Bug fixes where the cause isn't obvious from the description
- Changes involving tradeoffs or alternative approaches considered
- Refactoring that affects multiple files or patterns
- Performance optimizations explaining what was slow and how it's fixed

**Formatting the body**:
- Leave one blank line between description and body
- Wrap lines at 72 characters
- Use paragraphs to separate different points
- Use bullet points or lists if helpful

**Why this helps**:
- Keeps the first line short and scannable
- Provides context that helps during code reviews
- Helps future developers (including yourself in 6 months) understand decisions
- Makes debugging easier when you need to understand why code changed

### Choosing Between Prose and Bullets

The commit body can use prose paragraphs, bullet points, or both. Choose the format based on what you're communicating, not a rigid rule. **Mixing formats in the same commit is perfectly fine** - use what makes the content clearest.

**Use prose (paragraphs) for**:
- Narrative explanations of why you made a decision
- Describing tradeoffs you considered
- Explaining context about the problem
- Showing how different parts relate to each other

**Example with prose**:
```
refactor(frontend/BasketProvider): Optimize basket sync with backend

Changed from syncing on every state update to debounced syncing every
500ms. This reduces API calls from ~10 per basket operation to 1.

The optimistic UI update still happens immediately, so UX is unchanged.
Backend remains source of truth with rollback on validation errors.
```

**Use bullet points for**:
- Multiple independent changes in one commit
- Lists of affected components or files
- Step-by-step processes
- Breaking changes that require specific updates

**Example with bullets**:
```
feat(frontend/checkout): Add comprehensive form validation

Implements client-side validation with backend sync:

- Email field: debounced validation (300ms delay)
- Phone field: libphonenumber validation with country detection
- Address: conditional validation based on country (UK/US)
- Payment: different validation groups for card vs token

All fields show errors on blur or after first submit attempt.
```

**Mix prose and bullets when helpful**:
```
feat(frontend/checkout): Add comprehensive form validation

Implements comprehensive client-side validation to reduce server load
and provide immediate user feedback. This prevents invalid submissions
and improves UX by catching errors before the payment step.

Changes include:
- Email field: debounced validation (300ms delay)
- Phone field: libphonenumber with country detection
- Address: conditional validation (UK postcode, US state/ZIP required)
- Payment: validation groups for card vs tokenized payments

The validation strategy matches backend rules to ensure consistency.
Errors display on blur or after first submit to avoid interrupting
users who are still typing.
```

**Key principle**: Focus on clarity, not format consistency. The reader cares about understanding what changed and why, not whether you used bullets or prose. Use whichever format (or combination) makes your explanation clearest.

**Quick decision framework**:
- Single concept/change → Prose explaining why
- Multiple related changes → Brief prose intro + bullet list
- Complex refactoring → Prose explaining problem/solution
- Breaking changes → Prose explanation + bullets for what needs updating

### Real Examples from This Project

**Good examples following the format**:

```
feat(frontend/PickupMap): Add expandable fullscreen map to pickup map
fix(frontend/PickupMap): Align expand/close button with map controls
refactor(frontend/PickupMap): Optimize re-renders with React.memo
feat(backend/CustomerOrder): Return pickup slot label in OrderSuccessDto
feat(frontend/utils): Add debounce utility function
docs: Add CLAUDE.md with codebase architecture guide
```

**Examples with bodies** (for complex changes):

```
feat(frontend/checkout): Add debounced validation to form fields

Implements custom useDebounce hook to delay validation until user stops
typing. This prevents error flickering and reduces unnecessary validation
calls during active typing.

Applied to both email and phone fields with 300ms delay for consistency.
```

```
refactor(frontend/BasketProvider): Optimize basket sync with backend

Changed from syncing on every state update to debounced syncing every
500ms. This reduces API calls from ~10 per basket operation to 1.

The optimistic UI update still happens immediately, so UX is unchanged.
Backend remains source of truth with rollback on validation errors.
```

### Why This Format Matters

Understanding the reasoning behind this convention helps you appreciate its value:

**Consistency**:
- Makes git history readable and easy to scan
- You can quickly find all features, fixes, or refactors by type
- `git log --oneline --grep="feat(frontend"` shows all frontend features
- Team members (or future you) can understand the project evolution quickly

**Context at a Glance**:
- The scope tells you exactly where to look for changes without opening files
- `feat(frontend/PickupMap)` immediately tells you it's a new feature in the PickupMap component
- The `!` breaking change indicator prevents surprises during updates

**Automation Potential**:
- Tools can generate changelogs automatically from conventional commits
- Can trigger different CI/CD pipelines based on commit type
- Semantic versioning tools can determine version bumps (feat = minor, fix = patch, feat! = major)
- GitHub Actions can label PRs automatically based on commit types

**Better Code Reviews**:
- Reviewers know what kind of change to expect from the type
- The body provides context without needing to ask questions
- Breaking changes are clearly marked and get extra scrutiny

**Debugging Aid**:
- `git log --grep="fix.*PickupMap"` finds all bug fixes in that component
- `git blame` shows meaningful context for each line change
- Bisecting bugs is easier when commits are clearly categorized

When Claude Code creates commits, it will follow this exact format including breaking change indicators and bodies for complex changes to maintain consistency with your project's history.

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

### Adding/Modifying Products

Product entities support soft deletion via an `active` flag. When updating products:
- Use `PATCH /api/products/{id}` endpoint to update existing products
- Variants are tied to products with size/flavour combinations
- Products are indexed by category and name for performance
- Slugs are auto-generated for URL-friendly routing

### Basket Synchronization Flow

The basket uses optimistic updates with backend validation:
1. User action triggers `BasketProvider` action (ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY)
2. Local state updates immediately for fast UI response
3. API calls `GET /api/orders/basket` with all item IDs and quantities
4. Backend validates items exist, calculates prices, returns updated basket
5. Frontend updates state with backend response (prices are source of truth)
6. On error, state rolls back to previous version

When modifying basket logic, maintain this pattern to ensure consistency.

### Adding New Validation Rules

**Frontend**:
- Add Zod schemas in `/frontend/src/schemas/`
- For dynamic validation (e.g., date ranges), use schema factories that accept runtime config
- Example: `createCheckoutSchema(unavailableDates, validDateRange, validRegions)`

**Backend**:
- Create custom validator in `/backend/src/main/java/com/alex_lieu/hanok/validation/`
- Add validation groups to `ValidationGroups` interface if conditional validation is needed
- Apply groups at controller level using `@Validated` annotation
- Add error messages to `ValidationMessages.properties`

### Form Handling

Forms use React Hook Form + Zod resolver:
- Define schema in `/frontend/src/schemas/`
- Use `useForm()` with `zodResolver(schema)`
- Backend validation errors are transformed and displayed at field level
- Multi-step forms (e.g., checkout) compose multiple schemas

### Working with Maps

The pickup location uses Leaflet via react-leaflet:
- Map component in `/frontend/src/components/checkout/PickupMap.tsx`
- Uses `React.memo` and `useCallback` for performance optimization
- Map expands/collapses with seamless animations (Framer Motion)
- Map controls aligned consistently with expand/close button

## Development Workflow

### Running the Full Stack

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   Backend runs on http://localhost:8080
   H2 console: http://localhost:8080/h2-console

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on http://localhost:5173

3. **Access Application**: Navigate to http://localhost:5173

### Working with Storybook

Storybook provides component documentation and visual testing:
```bash
cd frontend
npm run storybook
```

- Stories are in `/frontend/src/stories/`
- Includes accessibility addon (`@storybook/addon-a11y`)
- Tests run via Vitest + Playwright browser integration
- Component stories serve as living documentation

### Database Management

- **Development**: H2 in-memory database (data lost on restart)
- **Seed Data**: `/backend/src/main/resources/data.sql` runs on startup
- **Schema**: Auto-generated from JPA entities via `spring.jpa.hibernate.ddl-auto=update`
- **Console Access**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:hanok`
  - Username: `hanok`
  - Password: (empty)

To reset the database, restart the backend server.

## Testing Strategy

### Frontend Testing

- **Component Testing**: Storybook stories + Vitest browser tests
- **E2E Testing**: Playwright (configured but test files not yet created)
- Test files would go in `/frontend/src/**/*.test.ts` or `/frontend/src/**/*.spec.ts`

### Backend Testing

- **Unit Tests**: JUnit 5 + Mockito
- Test files in `/backend/src/test/java/com/alex_lieu/hanok/`
- Run with `./mvnw test`
- Example: `CardNumberValidatorTest.java` tests custom validators

## Important Configuration Files

- `/frontend/vite.config.ts` - Vite build config, Vitest setup
- `/frontend/eslint.config.js` - ESLint configuration
- `/frontend/tsconfig.json` - TypeScript configuration
- `/backend/pom.xml` - Maven dependencies and build config
- `/backend/src/main/resources/application.properties` - Spring Boot config (database, pickup rules, store hours)
- `/backend/src/main/resources/ValidationMessages.properties` - Custom validation error messages

## Key Implementation Details

### Optimistic UI with Rollback

The basket implements optimistic updates for better perceived performance:
- Actions update local state immediately
- Backend sync happens asynchronously
- On backend error, state rolls back to previous version
- This pattern ensures fast UI while maintaining backend as source of truth

### Configuration-Driven Validation

Both frontend and backend validate against the same store configuration:
- Pickup dates validated against holidays, opening hours, minimum lead time
- Billing addresses validated against allowed regions (states/provinces)
- Frontend fetches config from backend to ensure consistency
- This prevents hardcoding business rules in multiple places

### Accessibility-First Components

The frontend uses React Aria Components for WCAG compliance:
- Semantic HTML with proper ARIA attributes
- Keyboard navigation support built-in
- Screen reader friendly
- Focus management handled automatically
- Test with Storybook's a11y addon

### Slug-Based URLs

Products are accessible via SEO-friendly URLs:
- Format: `/products/{categorySlug}/{productSlug}`
- Example: `/products/desserts/cream-cheese-rice-brownies`
- Backend converts slugs to product names for queries
- Slugs are lowercase with hyphens replacing spaces

### Payment Processing

The system supports two payment types:
- **Card Payment**: Direct card details (number, CVV, expiry)
- **Tokenized Payment**: Saved payment token reference
- Validation groups determine which fields are required
- BillingAddress validation is country-specific (UK requires postcode, US requires state/ZIP)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hanok is a full-stack e-commerce application for a Korean cafe. It features a React 19 frontend with TypeScript and a Spring Boot 3.4 backend with Java 21. The application handles product browsing, shopping cart management, and order placement with scheduled pickup functionality.

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

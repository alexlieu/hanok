# Backend CLAUDE.md

Guidance for the Spring Boot backend.

## Tech Stack

Spring Boot 3.4.3, Java 21, Spring Data JPA, H2 in-memory database, Maven, Jakarta Bean Validation

## Commands

```bash
./mvnw spring-boot:run                    # Start server (http://localhost:8080)
./mvnw test                               # Run all tests
./mvnw test -Dtest=ClassName              # Run single test class
./mvnw test -Dtest=ClassName#methodName   # Run single test method
./mvnw clean install                      # Clean build
```

## Database

H2 in-memory — resets on restart. Seed data in `src/main/resources/data.sql`. Console: http://localhost:8080/h2-console (JDBC: `jdbc:h2:mem:hanok`, user: `hanok`, no password).

## Architecture

Layered: Controller -> Service -> Repository -> Entity. Package: `com.alex_lieu.hanok`.

- `controller/` — REST endpoints + `GlobalExceptionHandler`
- `service/` — Business logic, transaction boundaries
- `repository/` — Spring Data JPA, custom JPQL queries
- `entity/` — JPA entities with lifecycle hooks
- `dto/` — Organized by feature (basket/, order/, payment/, config/)
- `validation/` — Custom validators + validation groups
- `enums/` — Category, PickupSlot, OrderStatus, etc.
- `exceptions/` — Custom exceptions (order/, product/)
- `config/` — StoreConfig, HolidayDataLoader, CorsConfig

## Validation

- Jakarta Bean Validation annotations (`@NotNull`, `@Email`, etc.)
- Custom validators: `@ValidPhoneNumber` (libphonenumber), `@ValidPickupDate` (store config), `@AtLeastOneRequired` (email OR phone), `@StateProvinceRegionLogic` (country-specific address)
- Validation groups in `ValidationGroups`: `OrderChecks`, `PaymentChecks`, `CardChecks`, `TokenChecks` — different rules for card vs tokenized payments
- Error messages in `ValidationMessages.properties`
- `GlobalExceptionHandler` maps exceptions to structured error responses

## Domain Model

- Product -> ProductVariant (1:Many) — size/flavour combinations, soft deletion via `active` flag, auto-generated slugs
- CustomerOrder -> OrderItem (1:Many) -> Payment (1:1)
- Order statuses: PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED

## Configuration-Driven Business Rules

In `application.properties`, parsed by `StoreConfig.java` (`@ConfigurationProperties`): pickup cutoff 14:00 London time, min lead time 3 days, booking window 3 months, configurable store hours per weekday.

## Testing

JUnit 5 + Mockito. Tests in `src/test/java/`.

# Rabobank Copilot Instructions — Java 17 / Spring Boot 3

This file provides GitHub Copilot with the Rabobank coding standards used
throughout the backend labs. Place it in `.github/` so Copilot picks it up
automatically in VS Code (requires "Use Instruction Files" enabled).

---

## Language & Environment

- **Runtime:** Java 17, Spring Boot 3.
- **Build tool:** Maven (`mvn spring-boot:run`, `mvn test`).
- **Database:** H2 in-memory for development; keep queries PostgreSQL-compatible.
- **Language:** Dutch in log messages and domain comments (e.g. "zaak", "klant"); English in class/method names and public API docs.

---

## Package Structure

```
nl.rabobank.casesummary
├── controller/   ← REST endpoints (@RestController)
├── service/      ← Business logic (@Service)
├── repository/   ← Spring Data JPA repositories
├── model/        ← JPA entities
├── dto/          ← Data Transfer Objects (Java records)
├── validation/   ← Custom validators (e.g. @ValidIban)
└── config/       ← CORS, DataLoader, bean configuration
```

Keep this layering strict: controllers never talk to repositories directly — always go through a service.

---

## REST API Conventions

- All endpoints versioned under `/api/v1/...`.
- Return types are `ResponseEntity<T>`, never a bare DTO.
- Validate request bodies with `@Valid` + `jakarta.validation` annotations on record fields.
- Use `@RequestParam(defaultValue = ...)` for optional pagination params; sort explicitly with `Sort.by(...)`.
- DTOs are Java `record`s — no mutable request/response classes.

---

## Data Access & Queries

- Use Spring Data JPA repository methods or `@Query` — never build SQL by string concatenation.
- Any raw/native query must use parameter binding (`:param`), not string interpolation.
- Business rules (status transitions, timestamps) belong in the **service** layer, not the repository or controller.

---

## Security

| Rule | Reason |
|------|--------|
| Never concatenate user input into a query string | SQL injection prevention |
| Mask IBAN before it leaves the service layer (`maskIban()` pattern in `CaseService`) | PII protection |
| Log case/customer IDs, never full names or raw IBANs | Privacy |
| Validate all `@RequestBody` input with `@Valid` | Input sanitisation |
| Keep CORS origins explicit in `CorsConfig`, never `*` | API hardening |

---

## Error Handling

- Domain exceptions (e.g. `CaseNotFoundException`) are handled centrally in `GlobalExceptionHandler` — do not add local try/catch blocks in controllers for expected failure cases.
- Throw `IllegalStateException` (or a dedicated domain exception) for invalid state transitions, e.g. reopening a closed case.

---

## Testing

- Unit tests use **JUnit 5 + Mockito**, under `src/test/java`, mirroring the main package structure.
- Mock the repository layer when testing a service; don't hit the real H2 database in unit tests.
- Every bug-fix or new business rule should ship with a test that would have failed before the fix.

---

## Conventions

- Constructor injection only — no `@Autowired` on fields.
- Logger via `LoggerFactory.getLogger(ThisClass.class)`, never `System.out.println`.
- Do not add real customer data (names, IBANs, case content) to sample/seed data.

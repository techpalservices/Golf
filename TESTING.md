<div align="center">

# TeeTime — Test Documentation

Complete reference for the testing strategy, automated test suites, and the CI pipeline of the TeeTime project.

</div>

---

## Table of Contents

- [Testing Strategy](#testing-strategy)
- [Test Suites](#test-suites)
- [How to Run the Tests](#how-to-run-the-tests)
- [Test Configuration](#test-configuration)
- [CI Pipeline](#ci-pipeline)
- [Bugs Found Through Testing](#bugs-found-through-testing)
- [Known Gaps & Future Work](#known-gaps--future-work)

---

## Testing Strategy

The project follows the **test pyramid**:

| Level | Scope | Tools | Status |
|---|---|---|---|
| **Unit tests** | One service class in isolation — all collaborators mocked | JUnit 5, Mockito, AssertJ | 27 tests |
| **Integration tests** | Real HTTP request through the full Spring Security chain + real persistence | MockMvc, Spring Boot Test, H2 | 7 tests |
| **Build gate (frontend)** | TypeScript type-checking + production build on every push | `tsc -b`, Vite | In CI |
| **API / manual testing** | Exploratory testing of all endpoints and roles | Postman | Done during development |
| **E2E tests** | Full user journeys in a real browser | Playwright | Planned |

**Priorities applied:** the highest-risk business rules were tested first — reservation conflict/capacity logic, JWT authentication, role-based access control, and the membership lifecycle.

---

## Test Suites

All backend tests live in `backend/src/test/java/com/golf/golf_project/`.

### 1. `reservations/services/ReservationServiceTest` — 10 tests

Pure unit tests (Mockito, no database, no Spring context) covering the booking business rules:

- Unauthenticated requests are rejected
- Only `ROLE_PLAYER` can book
- Unknown course → 404
- One reservation per player per club per day
- CLOSED time slots are rejected
- Capacity: a full slot (4/4) rejects additional players (PENDING + ACCEPTED count; REJECTED free their seats)
- Non-members are saved as **PENDING** and the club owner is notified
- Active members of the club are **auto-ACCEPTED** and confirmed instantly
- Manager rejection saves REJECTED and notifies the player
- A manager who does not own the club cannot update reservations

### 2. `auth/providers/JwtTokenProviderTest` — 7 tests

Unit tests with **real HMAC256 signing** (only repositories are mocked):

- Access token contains subject, role claim, issuer and ~10 min expiry
- No issuer is emitted when none is provided
- Refresh token is persisted, bound to the user, valid ~7 days, not revoked
- Two refresh tokens are never identical (unique `jti` claim)
- MFA token carries `ROLE_PRE_AUTH` and the purpose claim
- Tokens signed with a foreign secret are rejected
- Expired tokens are rejected

### 3. `memberships/services/MembershipRequestServiceTest` — 10 tests

Unit tests of the membership request lifecycle:

- Auth / role guards for creating and listing requests
- Unknown membership plan → error
- Successful request is saved as **PENDING** and the club owner is notified
- **Accept** links the player to the membership (both sides of the relation) and notifies the player
- Unknown request → error
- **Reject** sets REJECTED and notifies the player
- Managers without a club, and non-managers, cannot list requests

### 4. `SecurityAuthorizationIntegrationTest` — 6 tests

Integration tests booting the **real application** on an in-memory H2 database and exercising the complete chain `JwtAuthorizationFilter → SecurityConfig → @PreAuthorize` against `POST /users/all` (admin-only):

| Scenario | Expected |
|---|---|
| No token | 403 |
| Forged token (wrong signature, claims ADMIN) | 401 |
| Expired token | 401 |
| Valid PLAYER token | 403 |
| Valid ADMIN token | 200 |
| Public endpoint (`/v3/api-docs`) without token | 200 |

### 5. `GolfProjectApplicationTests` — 1 test

Context smoke test: the full application context boots on the `test` profile.

**Total: 34 automated tests.**

---

## How to Run the Tests

### Backend (all 34 tests)

```bash
cd backend
./mvnw test                # Linux / macOS
.\mvnw.cmd test            # Windows
```

Run a single class:

```bash
./mvnw test -Dtest=ReservationServiceTest
```

> **Windows note:** `JAVA_HOME` must point to a JDK. If it is not set globally:
> ```powershell
> $env:JAVA_HOME='C:\Users\<you>\.jdks\<jdk-folder>'
> ```

No PostgreSQL, no `.env`, no external services are required — the tests are fully self-contained.

### Frontend (build gate)

```bash
cd frontend
npm ci
npm run build              # runs tsc -b (type-check) then vite build
```

---

## Test Configuration

The integration/context tests run on the **`test` profile** (`src/test/resources/application-test.properties`):

- **H2 in-memory database** (`jdbc:h2:mem:testdb`) — the real PostgreSQL is never touched; the schema is created by Hibernate (`create-drop`) and dropped after the run
- `spring.sql.init.mode=never` — `data.sql` contains PostgreSQL-specific constraints that H2 cannot execute
- A fixed `jwt.secret` plus stub mail/OAuth2 properties — no `.env` needed (the `DotenvConfig` initializer ignores missing `.env` files)
- `CLIENT_URL` / `SERVER_URL` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` are provided explicitly (see [bugs found](#bugs-found-through-testing))

Unit tests do not load Spring at all — Spring's `@Value` fields are injected manually via `ReflectionTestUtils` where needed.

---

## CI Pipeline

`.github/workflows/tests.yml` runs on **every push and pull request** to `main` / `master` / `develop`:

| Job | Steps |
|---|---|
| **Backend — unit & integration tests** | JDK 21 (Temurin) + Maven cache → `./mvnw -B test` → surefire reports uploaded as artifact on failure |
| **Frontend — type-check & build** | Node 22 + npm cache → `npm ci` → `npm run build` (`tsc -b && vite build`) |

The pipeline requires **no secrets and no services**: the backend job is hermetic thanks to the `test` profile, and the frontend job only compiles.

---

## Bugs Found Through Testing

Real defects uncovered by the test phase — each one is fixed in the codebase:

| # | Severity | Bug | Impact |
|---|---|---|---|
| 1 | **High** | `GlobalExceptionHandler` imported `java.nio.file.AccessDeniedException` (file-system exception) instead of `org.springframework.security.access.AccessDeniedException` | Every `@PreAuthorize` denial returned **500** instead of **403** in production |
| 2 | Medium | `@Value("${ADMIN_PASSWORD:#{Admin52341}}")` — the default contains `#{`, which Spring parses as SpEL | Application fails to start if the env var is unset (e.g. fresh CI environment) |
| 3 | Medium | `JwtTokenProvider.generateAccessToken` does not null-check the user lookup | Unknown username produces an NPE (500) instead of a clean 401 |
| 4 | Low | Services throw raw `IllegalArgumentException` instead of the project's `BusinessException` / `ResourceNotFoundException` | Inconsistent HTTP status codes (500 instead of 400/404) |
| 5 | Medium | Frontend pages compared `membership.status === 'YEARLY'` although `status` is `EMStatus` (ACTIVE/SUSPENDED) — the UI expects a billing-type field the API does not provide | Wrong/misleading plan duration display |
| 6 | Low | Club detail & search pages run on hardcoded mock data whose field names did not match the API types (`logo`, `coverImage`, `location`, `courseNumber`…) | Silent drift between UI and API contract; 68 TypeScript build errors |
| 7 | Low | `UsersPage` imported a non-existent module (`@/features/user/types.ts`) | Broken admin page build |

---

## Known Gaps & Future Work

- **Frontend unit tests** — Vitest + React Testing Library; priority targets: the Zustand auth store, Zod form validation, and the status-mapping utilities
- **E2E tests** — Playwright journeys: player login → book a tee time → see it in "My Reservations"
- **Testcontainers** — replace H2 with a real PostgreSQL container to also validate `data.sql` and PostgreSQL-specific behavior
- **Coverage reporting** — JaCoCo plugin for a measurable coverage metric
- **Postman collection** — export the manual API test collection into the repository for reproducibility

---

<div align="center">
Back to the <a href="./README.md">main README</a>
</div>


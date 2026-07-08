# TeeTime Executive — Backend Project Context

## Project Overview

Premium golf club management platform backend for the Moroccan market. Built with Java Spring Boot as a modular monolith. Serves a React + Vite frontend (separate repo) with REST APIs. Handles authentication, club management, tee time bookings, memberships, tournaments, shop, campus packages, and notifications.

## Tech Stack

- **Language:** Java 21 (LTS)
- **Framework:** Spring Boot 3.3+
- **Architecture:** Modular monolith (feature-based packages)
- **Database:** PostgreSQL 16
- **ORM:** Spring Data JPA + Hibernate
- **Auth:** Spring Security + JWT (http-only cookies)
- **File Storage:** MinIO (avatars, club logos, product images, documents)
- **Payments:** Stripe (shop orders, campus bookings, membership fees)
- **API Docs:** OpenAPI/Swagger (springdoc-openapi)
- **DTO Mapping:** MapStruct
- **Boilerplate:** Lombok
- **Build:** Maven
- **Validation:** Jakarta Validation (Bean Validation)
- **Migrations:** Flyway (optional, can use JPA ddl-auto initially)

## Architecture — Modular Monolith

### Feature-Based Package Structure

Each business feature is a self-contained module with its own Controller, Service, Repository, Entity, DTO, and Mapper. Shared code lives in `common/`.

### Package Structure

```
src/main/java/com/teetime/golfclub/
├── GolfclubApplication.java     # Main entry point
│
├── auth/                        # Authentication & Security
│   ├── controller/               # AuthController (login, register, refresh, logout)
│   ├── service/                   # AuthService, JwtService, UserDetailsService
│   ├── security/                  # SecurityConfig, JwtFilter, CookieAuthFilter
│   ├── dto/                       # LoginRequest, RegisterRequest, TokenResponse
│   └── entity/                    # RefreshToken, PasswordResetToken, EmailVerificationToken
│
├── users/                       # User management
│   ├── controller/               # UserController (admin CRUD, suspend, reactivate)
│   ├── service/                   # UserService
│   ├── repository/                # UserRepository
│   ├── dto/                       # UserResponse, UpdateUserRequest, UserListResponse
│   ├── mapper/                    # UserMapper (MapStruct)
│   └── entity/                    # User
│
├── clubs/                       # Club management
│   ├── controller/               # ClubController, AdminClubController
│   ├── service/                   # ClubService, ClubSettingsService
│   ├── repository/                # ClubRepository
│   ├── dto/                       # ClubResponse, CreateClubRequest, UpdateClubRequest
│   ├── mapper/                    # ClubMapper
│   └── entity/                    # Club
│
├── courses/                     # Course & slot management
│   ├── controller/               # CourseController, SlotController
│   ├── service/                   # CourseService, SlotService, SlotGenerationService
│   ├── repository/                # CourseRepository, TimeSlotRepository
│   ├── dto/                       # CourseResponse, CreateCourseRequest, SlotResponse, GenerateSlotsRequest
│   ├── mapper/                    # CourseMapper, SlotMapper
│   └── entity/                    # Course, TimeSlot
│
├── reservations/                # Booking system
│   ├── controller/               # ReservationController, BookingRequestController
│   ├── service/                   # ReservationService, BookingApprovalService, OverlapCheckService
│   ├── repository/                # ReservationRepository
│   ├── dto/                       # ReservationResponse, CreateReservationRequest, AlternativeSlotResponse
│   ├── mapper/                    # ReservationMapper
│   └── entity/                    # Reservation
│
├── memberships/                 # Club memberships
│   ├── controller/               # MembershipController
│   ├── service/                   # MembershipService
│   ├── repository/                # MembershipRepository
│   ├── dto/                       # MembershipResponse, JoinClubRequest
│   ├── mapper/                    # MembershipMapper
│   └── entity/                    # Membership
│
├── tournaments/                 # Tournaments (announcement + slot blocking)
│   ├── controller/               # TournamentController
│   ├── service/                   # TournamentService, SlotBlockingService
│   ├── repository/                # TournamentRepository
│   ├── dto/                       # TournamentResponse, CreateTournamentRequest
│   ├── mapper/                    # TournamentMapper
│   └── entity/                    # Tournament
│
├── shop/                        # Shop: products, cart, orders, reviews
│   ├── controller/               # ProductController, CartController, OrderController, ReviewController
│   ├── service/                   # ProductService, CartService, OrderService, StripeService, ReviewService
│   ├── repository/                # ProductRepository, CartRepository, CartItemRepository, OrderRepository, OrderItemRepository, ReviewRepository
│   ├── dto/                       # ProductResponse, CartResponse, OrderResponse, CreateOrderRequest, ReviewRequest
│   ├── mapper/                    # ProductMapper, OrderMapper
│   └── entity/                    # Product, Cart, CartItem, Order, OrderItem, Review
│
├── campus/                      # Campus packages & bookings
│   ├── controller/               # PackageController, CampusBookingController
│   ├── service/                   # PackageService, CampusBookingService
│   ├── repository/                # PackageRepository, CampusBookingRepository
│   ├── dto/                       # PackageResponse, CampusBookingResponse, CreateBookingRequest
│   ├── mapper/                    # PackageMapper, CampusBookingMapper
│   └── entity/                    # Package, CampusBooking
│
├── notifications/                # In-app notifications
│   ├── controller/               # NotificationController
│   ├── service/                   # NotificationService, EmailService
│   ├── repository/                # NotificationRepository
│   ├── dto/                       # NotificationResponse
│   ├── mapper/                    # NotificationMapper
│   └── entity/                    # Notification
│
├── dashboard/                   # Dashboard stats (player, manager, admin)
│   ├── controller/               # DashboardController
│   ├── service/                   # PlayerDashboardService, ManagerDashboardService, AdminDashboardService
│   ├── dto/                       # KpiResponse, ChartData, PendingActionResponse, ActivityLogResponse, ClubPerformanceResponse
│   └── repository/                # DashboardRepository (custom queries)
│
├── storage/                     # MinIO file storage
│   ├── controller/               # UploadController (avatars, logos, images)
│   ├── service/                   # MinioService
│   └── config/                    # MinioConfig
│
└── common/                      # Shared code
    ├── entity/                   # BaseEntity (id, createdAt, updatedAt, deletedAt)
    ├── enums/                    # Role, UserStatus, ClubStatus, CourseStatus, SlotStatus, ReservationStatus, Visibility, MembershipStatus, TournamentStatus, OrderStatus, ProductStatus, ProductCategory, PackageStatus, CampusBookingStatus, NotificationType
    ├── exception/                 # GlobalExceptionHandler, ResourceNotFoundException, BusinessException, ValidationException
    ├── dto/                       # ApiResponse, PaginatedResponse, ErrorResponse
    ├── config/                    # WebConfig, CorsConfig, JacksonConfig, SecurityConfig
    ├── util/                      # DateUtils, ValidationUtils, Constants
    └── security/                  # SecurityUtils (getCurrentUser, hasRole)
```

## Data Flow Pattern

```
HTTP Request → Controller → Service → Repository → Database
                    ↓            ↓
                   DTO        Entity
                    ↓            ↓
                Response     JPA Mapping
```

### Layer Responsibilities

1. **Controller** — Receives HTTP requests, validates input, calls Service, returns DTOs. No business logic.
2. **Service** — Business logic, transactions, orchestration. Calls Repositories. Returns Entities or DTOs.
3. **Repository** — Data access (Spring Data JPA interfaces). No business logic.
4. **Entity** — JPA-mapped database tables. No logic except simple validation.
5. **DTO** — Data Transfer Objects for API requests/responses. No JPA annotations.
6. **Mapper** — MapStruct interface that converts Entity ↔ DTO.

### Example

```java
// Controller
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;

    @GetMapping("/my")
    public ApiResponse<List<ReservationResponse>> getMyReservations() {
        return ApiResponse.success(reservationService.getMyReservations());
    }

    @PostMapping
    public ApiResponse<ReservationResponse> create(@Valid @RequestBody CreateReservationRequest req) {
        return ApiResponse.success(reservationService.create(req));
    }
}

// Service
@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final ReservationMapper reservationMapper;
    private final SecurityUtils securityUtils;

    public List<ReservationResponse> getMyReservations() {
        User user = securityUtils.getCurrentUser();
        return reservationRepository.findByUserId(user.getId())
            .stream().map(reservationMapper::toResponse).toList();
    }
}

// Repository
public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
    List<Reservation> findByUserId(UUID userId);
}

// Mapper (MapStruct)
@Mapper(componentModel = "spring")
public interface ReservationMapper {
    ReservationResponse toResponse(Reservation entity);
    Reservation toEntity(CreateReservationRequest request);
}
```

## Authentication & Security

### JWT with http-only Cookies

- Access token: 15 min expiry, stored in http-only cookie, stateless (no DB lookup)
- Refresh token: 7 days (or 30 days with "remember me"), stored in http-only cookie + DB (for revocation)
- Cookie settings: http-only, Secure (production), SameSite=Lax
- CSRF: CSRF token for state-changing requests (POST/PUT/PATCH/DELETE)

### Security Flow

```
Login → Validate credentials → Generate access + refresh tokens
      → Save refresh token to DB → Set both as http-only cookies → Return user info

Request → JwtFilter reads access token from cookie → Validates signature + expiry
        → Sets SecurityContext → Controller processes request

Token expired → 401 → Frontend calls /auth/refresh → New access token → Retry

Logout → Delete refresh token from DB → Clear cookies
```

### Role-Based Access Control (RBAC)

- `@PreAuthorize("hasRole('PLAYER')")` — player-only endpoints
- `@PreAuthorize("hasRole('MANAGER')")` — manager-only endpoints
- `@PreAuthorize("hasRole('ADMIN')")` — admin-only endpoints
- Resource ownership checks in Service layer (e.g., manager can only access their own club)

## Database

- PostgreSQL 16
- All tables use UUID primary keys
- Soft deletes via `deletedAt` column (nullable) — never hard delete
- Audit columns: `createdAt`, `updatedAt` (in BaseEntity)
- Timestamps stored as UTC, converted to local timezone in DTOs

### Naming Conventions

- Tables: snake_case (e.g., `time_slots`, `reservations`)
- Columns: snake_case (e.g., `created_at`, `user_id`)
- Entities: PascalCase (e.g., `TimeSlot`, `Reservation`)
- Fields: camelCase (e.g., `createdAt`, `userId`)

### Key Entities

- User (with role: PLAYER, MANAGER, ADMIN, INFLUENCER)
- Club (with settings: approval modes, cancellation policy)
- Course (18 or 9 holes, duration, green fee, interval)
- TimeSlot (belongs to Course, max 4 players)
- Reservation (belongs to TimeSlot + User, occupiedPlaces, visibility, status)
- Membership (User ↔ Club many-to-many)
- Tournament (belongs to Club, blocks TimeSlots, announcement only)
- Product, Cart, CartItem, Order, OrderItem, Review
- Package, CampusBooking
- Notification
- AuditLog

## API Design

### REST Conventions

- Base URL: `/api`
- Versioning: `/api/v1/...` (optional, can skip v1 initially)
- Resource-based URLs: `/api/clubs`, `/api/reservations`, `/api/products`
- HTTP methods: GET (read), POST (create), PATCH (update), DELETE (soft delete)
- Status codes: 200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 422 (Validation Error), 500 (Server Error)

### Response Format

```json
// Success
{
  "success": true,
  "data": { ... },
  "message": "Operation completed"
}

// Error
{
  "success": false,
  "message": "Resource not found",
  "error": {
    "code": "NOT_FOUND",
    "details": { ... }
  }
}

// Paginated
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "size": 20,
    "total": 142,
    "totalPages": 8
  }
}
```

### API Endpoints Overview

```
# Auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
POST   /api/auth/resend-verification

# Users (admin)
GET    /api/users
POST   /api/users
GET    /api/users/{id}
PATCH  /api/users/{id}
DELETE /api/users/{id}
PATCH  /api/users/{id}/suspend
PATCH  /api/users/{id}/reactivate
PATCH  /api/users/{id}/assign-club

# Clubs
GET    /api/clubs
GET    /api/clubs/{id}
POST   /api/clubs (admin)
PATCH  /api/clubs/{id} (admin/manager)
DELETE /api/clubs/{id} (admin, soft delete)
GET    /api/clubs/my-club (manager)
PATCH  /api/clubs/my-club (manager)
GET    /api/clubs/search (public, with filters)

# Courses & Slots
GET    /api/clubs/{clubId}/courses
POST   /api/clubs/{clubId}/courses (manager)
PATCH  /api/courses/{id} (manager)
DELETE /api/courses/{id} (manager, soft delete)
GET    /api/courses/{courseId}/slots
POST   /api/courses/{courseId}/slots/generate (manager)
PATCH  /api/slots/{id}/block (manager)
PATCH  /api/slots/{id}/unblock (manager)

# Reservations
GET    /api/reservations/my (player)
GET    /api/reservations/pending (manager)
POST   /api/reservations (player)
PATCH  /api/reservations/{id}/cancel (player)
PATCH  /api/reservations/{id}/approve (manager)
PATCH  /api/reservations/{id}/reject (manager)
GET    /api/reservations/alternatives (rejected, ±30 min)

# Memberships
GET    /api/memberships/my (player)
POST   /api/memberships/join (player)
DELETE /api/memberships/{id} (player, leave club)
GET    /api/memberships/club (manager, list members)
PATCH  /api/memberships/{id}/suspend (manager)
PATCH  /api/memberships/{id}/reinstate (manager)

# Tournaments
GET    /api/tournaments
GET    /api/tournaments/club/{clubId}
POST   /api/tournaments (manager)
PATCH  /api/tournaments/{id}/status (manager)

# Shop
GET    /api/products
GET    /api/products/{id}
POST   /api/products (admin)
PATCH  /api/products/{id} (admin)
DELETE /api/products/{id} (admin, soft delete)
GET    /api/cart (player)
POST   /api/cart/items (player)
PATCH  /api/cart/items/{id} (player)
DELETE /api/cart/items/{id} (player)
POST   /api/orders (player)
GET    /api/orders/my (player)
GET    /api/orders (admin)
PATCH  /api/orders/{id}/status (admin)
POST   /api/orders/{id}/refund (admin)
POST   /api/products/{id}/reviews (player)
GET    /api/products/{id}/reviews

# Campus
GET    /api/packages
GET    /api/packages/{id}
POST   /api/packages (manager)
PATCH  /api/packages/{id} (manager)
DELETE /api/packages/{id} (manager, soft delete)
POST   /api/campus-bookings (player)
GET    /api/campus-bookings/my (player)

# Notifications
GET    /api/notifications
PATCH  /api/notifications/{id}/read
PATCH  /api/notifications/read-all
DELETE /api/notifications/{id}

# Dashboard
GET    /api/dashboard/player
GET    /api/dashboard/manager
GET    /api/dashboard/admin

# Storage
POST   /api/upload/avatar
POST   /api/upload/club-logo
POST   /api/upload/club-images
POST   /api/upload/product-images
```

## Key Business Rules

- Member booking → auto-confirmed (no manager approval)
- Guest booking → pending (manager approves, unless club setting = AUTOMATIC)
- Pending does NOT block the slot — multiple pending allowed on same slot
- Manager accepts one → others auto-rejected if they no longer fit
- 18-hole/9-hole overlap prevention — check [startTime, startTime + duration] doesn't overlap on same course
- Optimistic locking — `@Version` on Reservation to prevent race conditions
- Alternative slot suggestions — on rejection, find ±30 min alternatives on same course/date
- Soft deletes — never hard delete users, clubs, reservations (use deletedAt)
- Cascade delete prohibition — deleting a club does NOT delete the manager; deleting a manager does NOT delete the club
- Multi-club membership — one player can join multiple clubs
- Tournament = announcement + slot blocker — no registration, no scoring
- Price snapshots — OrderItem and CampusBooking freeze prices at time of purchase

## Coding Conventions

- **Language:** English for all code, comments, and API messages. French only in frontend.
- **Naming:** camelCase for fields/methods, PascalCase for classes/interfaces/enums, UPPER_SNAKE for constants
- **Packages:** lowercase, feature-based (e.g., `com.teetime.golfclub.reservations`)
- **Entities:** JPA entities with Lombok (`@Entity`, `@Getter`, `@Setter`, `@NoArgsConstructor`)
- **DTOs:** Records for request/response DTOs (Java 21 feature)
- **Services:** `@Service` with `@RequiredArgsConstructor` for constructor injection
- **Controllers:** `@RestController` with `@RequestMapping`, return `ApiResponse<T>`
- **Validation:** `@Valid` on request bodies, Jakarta Validation annotations (`@NotBlank`, `@Email`, `@Size`, etc.)
- **Exceptions:** Throw domain exceptions (`ResourceNotFoundException`, `BusinessException`), handled by `GlobalExceptionHandler`
- **Transactions:** `@Transactional` on service methods that modify data
- **Security:** `@PreAuthorize` on controller methods, ownership checks in service layer
- **No any equivalent** — everything is typed, no raw types, no unchecked casts
- **Soft delete** — use `@Where(clause = "deleted_at IS NULL")` or `@SQLRestriction` (Hibernate 6)

## Environment Variables

```
# Database
DB_URL=jdbc:postgresql://localhost:5432/golfclub
DB_USERNAME=golfclub
DB_PASSWORD=golfclub123

# JWT
JWT_SECRET=your-secret-key-min-256-bits
JWT_ACCESS_TOKEN_EXPIRY=900000        # 15 min (ms)
JWT_REFRESH_TOKEN_EXPIRY=604800000    # 7 days (ms)
JWT_REMEMBER_ME_EXPIRY=2592000000     # 30 days (ms)

# MinIO
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_AVATARS=avatars
MINIO_BUCKET_CLUB_LOGOS=club-logos
MINIO_BUCKET_CLUB_IMAGES=club-images
MINIO_BUCKET_PRODUCT_IMAGES=product-images

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
APP_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## Commands

```
mvn spring-boot:run       # Start dev server (port 8080)
mvn clean package         # Build JAR
mvn test                  # Run tests
mvn flyway:migrate        # Run DB migrations (if using Flyway)
```

## Key Architectural Decisions

- **Modular monolith, not microservices** — solo developer, 2-month timeline. Feature-based packages with clean boundaries. Can extract to microservices later.
- **Java 21 + Spring Boot 3.3** — virtual threads, records, pattern matching. Modern and fast.
- **JWT in http-only cookies** — XSS protection. CSRF token for state-changing requests.
- **Soft deletes everywhere** — never lose data. `deletedAt` column + Hibernate `@SQLRestriction`.
- **MapStruct for DTO mapping** — compile-time, type-safe, no reflection.
- **Records for DTOs** — immutable, concise, perfect for API contracts.
- **UUID primary keys** — globally unique, no sequential ID guessing.
- **Flyway for migrations** (optional initially) — versioned DB schema changes.
- **Global exception handler** — consistent error responses across all endpoints.
- **Feature-based packages** — everything for a feature in one package. Don't scatter across technical layers.

## Current State

- Project scaffolded (Spring Initializr)
- Dependencies configured (JPA, Security, PostgreSQL, MinIO, Stripe, OpenAPI, MapStruct, Lombok)
- Database configured (PostgreSQL connection)
- Security configured (JWT + http-only cookies + CSRF)
- Common module (BaseEntity, enums, ApiResponse, GlobalExceptionHandler)
- Auth feature (register, login, refresh, logout, password reset, email verify)
- User entity + repository
- Club entity + CRUD
- Course + TimeSlot entities + slot generation
- Reservation entity + booking logic + overlap check + optimistic locking
- Membership entity + join/leave/approve
- Tournament entity + slot blocking
- Shop (Product, Cart, Order, Review) + Stripe
- Campus (Package, CampusBooking) + Stripe
- Notification entity + service
- Dashboard stats (player, manager, admin)
- MinIO storage integration
- AGENTS.md created (this file)
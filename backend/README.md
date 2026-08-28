# TeeTime Backend Documentation

> Part of the TeeTime Golf Club Management System. See the [Main README](../README.md) for project overview and [Frontend Documentation](../frontend/README.md) for the client application.

<div align="center">
  
  ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-brightgreen.svg)
  ![Java](https://img.shields.io/badge/Java-21-orange.svg)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791.svg)
  ![Maven](https://img.shields.io/badge/Maven-3.8+-red.svg)
  
  **Spring Boot backend for TeeTime Golf Club Management System**

</div>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Security](#security)
- [Configuration](#configuration)
- [Testing](#testing)

---

## Overview

The TeeTime backend is a robust REST API built with Spring Boot that handles all business logic, data persistence, authentication, and real-time notifications for the golf club management system.

### Key Features

- **RESTful API**: Clean and well-documented endpoints
- **JWT Authentication**: Secure token-based auth with 2FA support
- **Role-Based Access Control**: Admin, Manager, and Player roles
- **Real-time Notifications**: WebSocket integration (STOMP)
- **Email Service**: Automated email notifications
- **File Upload**: Support for images and documents
- **Database Migrations**: JPA/Hibernate entity management
- **Validation**: Input validation with Bean Validation
- **Exception Handling**: Global exception handling
- **CORS Configuration**: Configurable cross-origin resource sharing

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Spring Boot** | 4.1.0 | Application framework |
| **Java** | 21 | Programming language |
| **Spring Security** | 7.1.0 | Authentication & authorization |
| **Spring Data JPA** | Latest | Data persistence |
| **PostgreSQL** | 14+ | Database |
| **Lombok** | Latest | Reduce boilerplate code |
| **Spring WebSocket** | Latest | Real-time communication |
| **Spring Mail** | Latest | Email notifications |
| **Maven** | 3.8+ | Build tool |
| **JWT** | Latest | Token-based authentication |

---

##  Architecture

### Layered Architecture

```

         Controllers Layer               
    (REST Endpoints, Request Mapping)    

                   

          Services Layer                 
     (Business Logic, Validation)        

                   

       Repositories Layer                
    (Data Access, JPA Queries)           

                   

          Database Layer                 
         (PostgreSQL)                    

```

### Package Structure

```
com.golf.golf_project/
 auth/                    # Authentication & JWT
    controllers/
    services/
    filters/
    dto/
 users/                   # User management
    controllers/
    services/
    repositories/
    entities/
    dto/
 clubs/                   # Club management
    controllers/
    services/
    repositories/
    entities/
    dto/
 courses/                 # Course management
 memberships/             # Membership system
 reservations/            # Booking system
 timeSlots/              # Time slot management
 tournaments/            # Tournament system
 notifications/          # Real-time notifications
 config/                 # Configuration classes
 exeptions/              # Exception handling
 shared/                 # Shared utilities
```

---

##  Getting Started

### Prerequisites

- Java 21 or higher
- Maven 3.8+ or use the included wrapper
- PostgreSQL 14+
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/teetime-golf.git
   cd teetime-golf/backend
   ```

2. **Set up PostgreSQL database**
   ```bash
   createdb golf_db
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file:
   ```properties
   DB_URL=jdbc:postgresql://localhost:5432/golf_db
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key_here
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_app_password
   ```

4. **Run the application**

   Using Maven Wrapper (Recommended):
   ```bash
   ./mvnw spring-boot:run
   ```

   Or with Maven:
   ```bash
   mvn spring-boot:run
   ```

5. **Access the API**
   ```
   http://localhost:8081
   ```

### Build for Production

```bash
./mvnw clean package -DskipTests
java -jar target/golf_project-0.0.1-SNAPSHOT.jar
```

---

##  Project Structure

```
backend/
 src/
    main/
       java/com/golf/golf_project/
          auth/
             controllers/
                AuthController.java
             services/
                AuthService.java
                JwtService.java
             filters/
                JwtAuthorizationFilter.java
             dto/
                 LoginRequest.java
                 RegisterRequest.java
         
          users/
             controllers/UserController.java
             services/UserService.java
             repositories/UserRepository.java
             entities/User.java
             dto/
         
          clubs/
          courses/
          memberships/
          reservations/
          timeSlots/
          tournaments/
          notifications/
         
          config/
             SecurityConfig.java
             CorsConfig.java
             WebSocketConfig.java
             DotenvConfig.java
         
          exeptions/
             GlobalExceptionHandler.java
             entities/
                 BusinessException.java
                 ResourceNotFoundException.java
         
          shared/
              utils/
      
       resources/
           application.properties
           templates/          # Email templates
   
    test/                      # Unit and integration tests

 uploads/                       # File upload directory
 pom.xml                       # Maven dependencies
 .env                          # Environment variables
 .env.example                  # Environment template
 Dockerfile                    # Docker configuration
 README.md                     # This file
```

---

##  Database Schema

### Core Entities

#### Users
```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    gender VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,
    avatar_url VARCHAR(255),
    bio TEXT,
    birth_date DATE,
    is_totp_enabled BOOLEAN DEFAULT FALSE,
    totp_secret VARCHAR(255),
    role_id UUID REFERENCES roles(role_id),
    club_id UUID REFERENCES clubs(club_id),
    membership_id UUID REFERENCES memberships(membership_id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Clubs
```sql
CREATE TABLE clubs (
    club_id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(255),
    cover_url VARCHAR(255),
    gallery_url VARCHAR(255),
    dd_ns_number NUMERIC,
    dd_ew_number NUMERIC,
    open_time TIME,
    close_time TIME,
    status VARCHAR(20) NOT NULL,
    owner_id UUID REFERENCES users(user_id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Reservations
```sql
CREATE TABLE reservations (
    reservation_id UUID PRIMARY KEY,
    status VARCHAR(20) NOT NULL,
    number_of_players INTEGER NOT NULL,
    user_id UUID REFERENCES users(user_id) NOT NULL,
    time_slot_id UUID REFERENCES time_slots(time_slot_id) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Memberships
```sql
CREATE TABLE memberships (
    membership_id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    status VARCHAR(20) NOT NULL,
    club_id UUID REFERENCES clubs(club_id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Relationships

- **One-to-Many**: Club  Courses, Club  Memberships
- **One-to-Many**: Course  TimeSlots
- **One-to-Many**: TimeSlot  Reservations
- **Many-to-One**: User  Role, User  Club, User  Membership
- **One-to-Many**: Tournament  Participants

---

##  API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/logout` | User logout | Yes |
| POST | `/auth/refresh` | Refresh JWT token | Yes |
| POST | `/auth/verify-2fa` | Verify 2FA code | Yes |

### Users

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/users` | Get all users | ADMIN |
| GET | `/users/{id}` | Get user by ID | ALL |
| PUT | `/users/{id}` | Update user | OWNER/ADMIN |
| DELETE | `/users/{id}` | Delete user | ADMIN |
| POST | `/users/search` | Search users | ADMIN |

### Clubs

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/clubs/add` | Create club | ADMIN |
| GET | `/clubs/{id}` | Get club by ID | ALL |
| POST | `/clubs/search` | Search clubs | ALL |
| PUT | `/clubs/update` | Update club | MANAGER/ADMIN |
| PUT | `/clubs/reassign` | Reassign club manager | ADMIN |

### Courses

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/courses/add` | Create course | MANAGER |
| GET | `/courses/{id}` | Get course by ID | ALL |
| POST | `/courses/search` | Search courses | ALL |
| PUT | `/courses/update` | Update course | MANAGER |

### Memberships

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/memberships/add` | Create membership | MANAGER |
| POST | `/memberships/all` | Get all memberships | ALL |
| POST | `/memberships/getMyMemberships` | Get manager's memberships | MANAGER |
| POST | `/memberships/player/clubs` | Get player's clubs | PLAYER |
| PATCH | `/memberships/update` | Update membership | MANAGER |

### Reservations

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/reservations/add` | Create reservation | PLAYER |
| GET | `/reservations/club` | Get club reservations | MANAGER |
| POST | `/reservations/player/list` | Get player reservations | PLAYER |
| PUT | `/reservations/update-status` | Update reservation status | MANAGER |

### Time Slots

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/time-slots/add` | Create time slot | MANAGER |
| POST | `/time-slots/search` | Search available slots | ALL |
| PUT | `/time-slots/update` | Update time slot | MANAGER |

### Tournaments

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/tournaments/add` | Create tournament | MANAGER |
| POST | `/tournaments/search` | Search tournaments | ALL |
| PUT | `/tournaments/update` | Update tournament | MANAGER |
| POST | `/tournaments/register` | Register for tournament | PLAYER |

### Notifications

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/notifications` | Get user notifications | ALL |
| PUT | `/notifications/{id}/read` | Mark as read | ALL |
| WS | `/topic/notifications/{username}` | WebSocket subscription | ALL |

---

##  Security

### Authentication Flow

1. **User Registration**
   - User provides credentials
   - Password is hashed with BCrypt
   - User record created in database

2. **User Login**
   - Credentials validated
   - JWT access token generated (expires in 24h)
   - JWT refresh token generated (expires in 7 days)
   - Tokens returned to client

3. **Protected Request**
   - Client includes JWT in Authorization header: `Bearer <token>`
   - JwtAuthorizationFilter validates token
   - SecurityContext populated with user details
   - Request proceeds if authorized

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full system access, user management, club management |
| **MANAGER** | Manage own club, courses, memberships, reservations, tournaments |
| **PLAYER** | View clubs, make reservations, subscribe to memberships, join tournaments |

### 2FA (Two-Factor Authentication)

- Optional TOTP-based 2FA
- QR code generation for authenticator apps
- Verification required on login when enabled

---

##  Configuration

### Application Properties

```properties
# Server Configuration
server.port=8081

# Database Configuration
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# Mail Configuration
spring.mail.host=${MAIL_HOST}
spring.mail.port=${MAIL_PORT}
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### CORS Configuration

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        // ...
    }
}
```

---

##  Testing

### Run Tests

```bash
./mvnw test
```

### Test Coverage

```bash
./mvnw clean test jacoco:report
```

### Integration Tests

```bash
./mvnw verify
```

---

##  Deployment

### Build JAR

```bash
./mvnw clean package -DskipTests
```

### Run JAR

```bash
java -jar target/golf_project-0.0.1-SNAPSHOT.jar
```

### Docker

```bash
docker build -t teetime-backend .
docker run -p 8081:8081 teetime-backend
```

---

##  Troubleshooting

### Common Issues

**Database Connection Error**
```
Solution: Check DB_URL, DB_USERNAME, DB_PASSWORD in .env file
```

**Port Already in Use**
```
Solution: Change server.port in application.properties or kill the process using port 8081
```

**JWT Token Invalid**
```
Solution: Ensure JWT_SECRET is set and consistent between restarts
```

---

##  Additional Resources

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Security Documentation](https://docs.spring.io/spring-security/reference/)
- [Spring Data JPA Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)

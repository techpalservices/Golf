<div align="center">
  <img src="./frontend/public/teetime-logo.png" alt="TeeTime Logo" width="300" height="300"/>
  
  # TeeTime - Golf Club Management System
  
  [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
  [![React](https://img.shields.io/badge/React-19.2.7-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-blue.svg)](https://www.typescriptlang.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791.svg)](https://www.postgresql.org/)
  
**A comprehensive golf club management platform for clubs, managers, and players**

  [Quick Start](#quick-start)  [Documentation](#documentation)  [Tech Stack](#tech-stack)  [Architecture](#architecture)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**TeeTime** is a modern, full-stack golf club management system that streamlines operations for golf clubs, managers, and players — covering reservations, memberships, tournaments, and multi-club administration.

- **Multi-tenant System**: Support for multiple golf clubs with isolated data
- **Role-based Access Control**: Three distinct user roles (Admin, Manager, Player)
- **Smart Reservation System**: Time slot management with conflict detection and prevention
- **Secure Authentication**: JWT-based authentication with optional two-factor authentication
- **Real-time Notifications**: WebSocket-based push notifications for instant updates

> This README is intentionally **high-level** — detailed content lives in the dedicated guides listed in the [Documentation](#documentation) section.

---

## Documentation

| Guide | Contents |
|---|---|
| **[Backend Documentation](./backend/README.md)** | Backend architecture, full API endpoints reference, database schema, installation & environment variables |
| **[Frontend Documentation](./frontend/README.md)** | Frontend component architecture, feature modules, state management, routing, API integration |
| **[Test Documentation](./TESTING.md)** | Testing strategy, the 34 automated backend test suites, how to run the tests, CI pipeline, bugs found & fixed |

---

## Tech Stack

### Backend
- **Framework**: Spring Boot 4.1.0
- **Language**: Java 21
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **Real-time**: WebSocket (STOMP)
- **Email**: Spring Mail
- **Build Tool**: Maven

### Frontend
- **Framework**: React 19.2.7
- **Language**: TypeScript 6.0.2
- **Build Tool**: Vite 8.1.1
- **UI Library**: Tailwind CSS 4.3.2
- **State Management**: Zustand
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

### DevOps
- **Containerization**: Docker
- **Container Orchestration**: Docker Compose
- **Version Control**: Git

---

## Architecture

```

                         Frontend                              
  React + TypeScript + Tailwind CSS + Vite                   
               
     Admin        Manager        Player                 
    Dashboard     Dashboard     Dashboard               
               

                        REST API + WebSocket

                      Backend                                 
      Spring Boot + Spring Security + JPA                    
             
    Auth      Clubs     Booking   Members             
    Service   Service   Service   Service             
             

                        JDBC

                     PostgreSQL                                
              Relational Database                             

```

---

## Quick Start

### Prerequisites

- **Java 21** or higher
- **Node.js 18+** and npm
- **PostgreSQL 14+**
- **Maven 3.8+** (or use Maven Wrapper)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/teetime-golf.git
   cd teetime-golf
   ```

2. **Set up the database**
   ```bash
   createdb golf_db
   ```

3. **Configure Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials and settings
   ```

4. **Configure Frontend**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your API URL
   ```

5. **Run Backend**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   # Backend runs on http://localhost:8081
   ```

6. **Run Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

7. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8081`

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

This will start all services (Frontend, Backend, Database) in containers.

> For database setup, `.env` variables and their explanation, see the [Backend Documentation](./backend/README.md) and [Frontend Documentation](./frontend/README.md).

---

## Project Structure

```
TeeTime/
 backend/                  # Spring Boot backend (Java 21, Maven)
    src/main/              # Application code & configuration
    src/test/              # Unit & integration tests
    pom.xml                # Maven dependencies
    README.md              # Backend documentation

 frontend/                 # React frontend (TypeScript, Vite)
    src/                   # Feature-based modules, components, stores
    package.json           # NPM dependencies
    README.md              # Frontend documentation

 TESTING.md                # Test documentation
 uploads/                  # File uploads directory (runtime)
 docker-compose.yml        # Docker composition
 README.md                 # This file
```

---

## API & Environment

- **API endpoints** (full reference: all categories, base URL, request/response) — see the [Backend Documentation](./backend/README.md#api-endpoints)
- **Environment variables** (`DB_URL`, `JWT_SECRET`, OAuth2 client IDs, mail, file uploads…) — see the [Backend Documentation](./backend/README.md)

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push <remote> feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Authors

- **Your Team** - Initial work

---

## Acknowledgments

- Spring Boot team for the amazing framework
- React team for the powerful frontend library
- All contributors who have helped with this project
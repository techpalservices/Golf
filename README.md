<div align="center">
  <img src="./frontend/public/teetime-logo.png" alt="TeeTime Logo" width="300" height="300"/>
  
  # TeeTime - Golf Club Management System
  
  [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
  [![React](https://img.shields.io/badge/React-19.2.7-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-blue.svg)](https://www.typescriptlang.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791.svg)](https://www.postgresql.org/)
  
**A comprehensive golf club management platform for clubs, managers, and players**

  [Features](#features)  [Quick Start](#quick-start)  [Documentation](#documentation)  [Tech Stack](#tech-stack)  [Architecture](#architecture)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**TeeTime** is a modern, full-stack golf club management system that streamlines operations for golf clubs, managers, and players. The platform provides comprehensive features for managing reservations, memberships, tournaments, courses, and more.

### Key Highlights

- **Multi-tenant System**: Support for multiple golf clubs with isolated data
- **Role-based Access Control**: Three distinct user roles (Admin, Manager, Player) with granular permissions
- **Smart Reservation System**: Time slot management with conflict detection and prevention
- **Membership Management**: Flexible membership plans with automated request handling
- **Tournament Management**: Complete tournament lifecycle from creation to completion
- **Real-time Notifications**: WebSocket-based push notifications for instant updates
- **Secure Authentication**: JWT-based authentication with optional two-factor authentication
- **Internationalization**: Multi-language support (English, French) with easy extensibility

---

## Features

### For Golf Club Managers
- **Dashboard Analytics**: Overview of reservations, members, and revenue
- **Club Management**: Manage club details, courses, and facilities
- **Reservation Management**: View and manage all club reservations
- **Membership Control**: Handle membership requests and subscriptions
- **Tournament Organization**: Create and manage tournaments
- **Time Slot Management**: Configure available playing times
- **Reporting**: Generate reports and insights

### For Players
- **Club Discovery**: Browse and search available golf clubs
- **Easy Booking**: Reserve tee times with real-time availability
- **Membership**: Subscribe to club memberships
- **Tournaments**: View and register for tournaments
- **My Reservations**: Track all bookings and history
- **My Clubs**: View clubs with active memberships
- **Notifications**: Real-time updates on reservations and tournaments

### For Administrators
- **Club Management**: Add, edit, and manage golf clubs
- **User Management**: Manage users and assign roles
- **System Configuration**: Configure system-wide settings
- **Analytics**: System-wide statistics and insights

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

---

## Documentation

### Detailed Documentation

- **[Backend Documentation](./backend/README.md)** - Complete backend architecture, API endpoints, and database schema
- **[Frontend Documentation](./frontend/README.md)** - Frontend structure, components, state management, and routing

### Implementation Guides

- **[Player Clubs Implementation](./PLAYER_CLUBS_IMPLEMENTATION_SUMMARY.md)** - Player membership features
- **[Player Reservations Implementation](./PLAYER_RESERVATIONS_IMPLEMENTATION_SUMMARY.md)** - Reservation system

---

## Project Structure

```
teetime-golf/
 backend/                 # Spring Boot backend application
    src/
       main/
          java/        # Java source code
             com/golf/golf_project/
                 auth/        # Authentication
                 clubs/       # Club management
                 courses/     # Course management
                 memberships/ # Membership system
                 reservations/# Booking system
                 tournaments/ # Tournament management
                 users/       # User management
                 ...
          resources/   # Configuration files
       test/            # Unit and integration tests
    pom.xml              # Maven dependencies
    README.md            # Backend documentation

 frontend/                # React frontend application
    src/
       api/             # API client and endpoints
       components/      # Reusable UI components
       features/        # Feature-based modules
          admin/       # Admin dashboard
          manager/     # Manager dashboard
          player/      # Player dashboard
          auth/        # Authentication
          clubs/       # Club features
          memberships/ # Membership features
          reservations/# Reservation features
          ...
       hooks/           # Custom React hooks
       store/           # State management (Zustand)
       types/           # TypeScript types
    package.json         # NPM dependencies
    README.md            # Frontend documentation

 uploads/                 # File uploads directory
 docker-compose.yml       # Docker composition
 README.md                # This file
```

---

## API Documentation

The backend exposes RESTful APIs for all operations:

### Base URL
```
http://localhost:8081
```

### Main Endpoints

| Category | Endpoint | Description |
|----------|----------|-------------|
| **Auth** | `/auth/*` | Authentication and authorization |
| **Users** | `/users/*` | User management |
| **Clubs** | `/clubs/*` | Golf club operations |
| **Courses** | `/courses/*` | Course management |
| **Memberships** | `/memberships/*` | Membership subscriptions |
| **Reservations** | `/reservations/*` | Booking management |
| **Time Slots** | `/time-slots/*` | Availability management |
| **Tournaments** | `/tournaments/*` | Tournament operations |
| **Notifications** | `/notifications/*` | Real-time notifications |

**Full API documentation available in [Backend README](./backend/README.md)**

---

## Environment Variables

### Backend (.env)
```env
DB_URL=jdbc:postgresql://localhost:5432/golf_db
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8081
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
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
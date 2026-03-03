# NIGUS Bank - Digital Banking Platform

A comprehensive digital banking solution built with a microservices architecture and micro-frontend pattern.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                  │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────────────────┤
│  user-mfe   │ account-mfe │ transaction │  card-mfe   │ admin_superadmin    │
│  (3000)     │   (3001)    │   (3002)    │   (3003)    │      (5173)         │
│  Landing,   │  Account    │ Transaction │   Card      │  Admin/SuperAdmin   │
│  Auth, User │ Management  │  History    │ Management  │    Dashboard        │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY (8080)                                │
│                    Spring Cloud Gateway + Rate Limiting                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DISCOVERY SERVICE (8761)                             │
│                             Netflix Eureka                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  user-service   │     │ account-service │     │transaction-svc  │
│     (5001)      │     │     (5000)      │     │     (5003)      │
│  Auth, Users    │     │    Accounts     │     │  Transactions   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  card-service   │   │  admin-service  │   │     MySQL       │
│     (5006)      │   │     (5005)      │   │   Databases     │
│     Cards       │   │   Admin/SA      │   │                 │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

---

## Integration Summary

### Backend Services

| Service | Port | Description | Status |
|---------|------|-------------|--------|
| discovery-service | 8761 | Eureka service registry | ✅ Configured |
| api-gateway | 8080 | API Gateway with routing and rate limiting | ✅ Routes updated |
| user-service | 5001 | User authentication and management | ✅ Configured |
| account-service | 5000 | Bank account management | ✅ Configured |
| transaction-service | 5003 | Transaction processing | ✅ Port fixed |
| card-service | 5006 | Card management | ✅ Newly created |
| admin-service | 5005 | Admin/SuperAdmin dashboard API | ✅ Newly created |

### Frontend MFEs

| MFE | Port | Description | Status |
|-----|------|-------------|--------|
| user-mfe | 3000 | Landing page, authentication, user profile, dashboard | ✅ Navigation added |
| account-mfe | 3001 | Account management dashboard | ✅ Configured |
| transaction-mfe | 3002 | Transaction history and operations | ✅ Port fixed |
| card-mfe | 3003 | Card management | ✅ Newly created |
| admin_superadmin-mfe | 5173 | Admin and SuperAdmin governance | ✅ API integrated |

---

## Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- MySQL 8.0+
- Maven 3.9+

### Database Setup

Create the required databases in MySQL:

```sql
CREATE DATABASE user_service;
CREATE DATABASE account_service;
CREATE DATABASE transaction_service;
CREATE DATABASE card_service;
CREATE DATABASE admin_service;
```

---

## Running the Application

### Backend Services (Start in Order)

**Step 1: Start Discovery Service first**
```bash
cd Backend/discovery-service
./mvnw spring-boot:run
```
Wait until Eureka is ready at http://localhost:8761

**Step 2: Start other services (can run in parallel)**
```bash
# Terminal 1 - User Service
cd Backend/user-service
./mvnw spring-boot:run

# Terminal 2 - Account Service
cd Backend/account-service
./mvnw spring-boot:run

# Terminal 3 - Transaction Service
cd Backend/transaction-service
./mvnw spring-boot:run

# Terminal 4 - Card Service
cd Backend/card-service
./mvnw spring-boot:run

# Terminal 5 - Admin Service
cd Backend/admin-service
./mvnw spring-boot:run
```

**Step 3: Start API Gateway (start last)**
```bash
cd Backend/api-gateway
./mvnw spring-boot:run
```

### Frontend MFEs (Run in Parallel)

```bash
# Terminal 1 - User MFE (Main entry point)
cd Frontend/user-mfe
npm install
npm run dev
# Runs on http://localhost:3000

# Terminal 2 - Account MFE
cd Frontend/account-mfe
npm install
npm run dev
# Runs on http://localhost:3001

# Terminal 3 - Transaction MFE
cd Frontend/transaction-mfe
npm install
npm run dev
# Runs on http://localhost:3002

# Terminal 4 - Card MFE
cd Frontend/card-mfe
npm install
npm run dev
# Runs on http://localhost:3003

# Terminal 5 - Admin/SuperAdmin MFE
cd Frontend/admin_superadmin-mfe
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## User Flows

### Customer Journey

1. **Landing Page** → http://localhost:3000
2. **Register/Login** → Create account or sign in
3. **Dashboard** → View profile and access banking services
4. **Navigate** → Click on service cards to access:
   - Accounts (http://localhost:3001)
   - Transactions (http://localhost:3002)
   - Cards (http://localhost:3003)

### Admin Journey

1. **Admin Portal** → http://localhost:5173
2. **Login** with Admin credentials:
   - Email: `admin@nigusbank.com`
   - Password: `Admin@123`
3. **Access Features**:
   - User Management
   - Account Management
   - Transaction Monitoring
   - Card Management
   - Audit Logs

### SuperAdmin Journey

1. **Admin Portal** → http://localhost:5173
2. **Login** with SuperAdmin credentials:
   - Email: `superadmin@nigusbank.com`
   - Password: `SuperAdmin@123`
3. **Access Features**:
   - Admin Management
   - System Configuration
   - Risk & Fraud Monitoring
   - Service Health Monitoring
   - Compliance Reports
   - Audit Logs

---

## API Documentation

Each backend service provides Swagger UI documentation:

| Service | Swagger URL |
|---------|-------------|
| User Service | http://localhost:5001/swagger-ui.html |
| Account Service | http://localhost:5000/swagger-ui.html |
| Transaction Service | http://localhost:5003/swagger-ui.html |
| Card Service | http://localhost:5006/swagger-ui.html |
| Admin Service | http://localhost:5005/swagger-ui.html |

---

## Authentication

The system uses JWT-based authentication:

### Token Storage
- **User token**: `nigus_token` (localStorage)
- **Admin token**: `admin_token` (localStorage)
- **Fallback support**: `account_token`, `token`

### Authentication Endpoints

**User Authentication (user-service:5001)**
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - User login
- `POST /auth/verify-otp` - Verify 2FA OTP

**Admin Authentication (admin-service:5005)**
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout
- `POST /api/admin/auth/change-password` - Change password

---

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.x
- **Cloud**: Spring Cloud 2023.0.0
- **Security**: Spring Security + JWT
- **Data**: Spring Data JPA + MySQL
- **Discovery**: Netflix Eureka
- **Communication**: OpenFeign
- **Documentation**: SpringDoc OpenAPI

### Frontend
- **Main Framework**: Next.js 16 (React 19)
- **Admin MFE**: Vite + React
- **Styling**: TailwindCSS
- **Language**: TypeScript/JavaScript
- **Icons**: Lucide React

---

## Environment Variables

### Backend Configuration

Each service uses `application.yml` with these key configurations:

```yaml
# Database
spring.datasource.url: jdbc:mysql://localhost:3306/{service_name}
spring.datasource.username: root
spring.datasource.password: your_password

# JWT
jwt.secret: your-secret-key
jwt.expiration: 86400000

# Eureka
eureka.client.service-url.defaultZone: http://localhost:8761/eureka/
```

### Frontend Configuration

**User MFE (.env)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

**Account MFE (.env)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Transaction MFE (.env)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5003
```

**Card MFE (.env)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5006
```

**Admin MFE (.env)**
```env
VITE_API_URL=http://localhost:5005
```

---

## API Gateway Routes

The API Gateway (port 8080) routes requests to backend services:

| Route Pattern | Target Service |
|---------------|----------------|
| `/auth/**` | user-service |
| `/api/user/**` | user-service |
| `/accounts/**` | account-service |
| `/transactions/**` | transaction-service |
| `/api/cards/**` | card-service |
| `/api/admin/**` | admin-service |

---

## Key Features

### card-service
- Create debit, credit, prepaid, and virtual cards
- Freeze/Unfreeze/Block card operations
- PIN management
- Spending and daily limit configuration
- Card number masking for security

### admin-service
- Admin/SuperAdmin authentication
- Admin user management (CRUD)
- System configuration management
- Fraud alert monitoring
- Service health monitoring
- Comprehensive audit logging
- Compliance report generation
- Dashboard statistics

### card-mfe
- Visual card display with gradient styling
- Card status indicators (Active, Frozen, Blocked)
- Create new card modal
- Quick actions (Freeze, Unfreeze, Block)
- Responsive design

### Dashboard Navigation
- Service cards for quick access to MFEs
- Visual icons for each service
- Hover effects and transitions

---

## Project Structure

```
NIGUS-bank/
├── Backend/
│   ├── discovery-service/    # Eureka Server
│   ├── api-gateway/          # Spring Cloud Gateway
│   ├── user-service/         # User & Auth
│   ├── account-service/      # Accounts
│   ├── transaction-service/  # Transactions
│   ├── card-service/         # Cards
│   └── admin-service/        # Admin Dashboard
│
├── Frontend/
│   ├── user-mfe/             # Landing & Auth (Next.js)
│   ├── account-mfe/          # Accounts (Next.js)
│   ├── transaction-mfe/      # Transactions (Next.js)
│   ├── card-mfe/             # Cards (Next.js)
│   └── admin_superadmin-mfe/ # Admin Portal (Vite)
│
└── README.md
```

---

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port
   lsof -i :PORT_NUMBER
   # Kill process
   kill -9 PID
   ```

2. **Database connection failed**
   - Ensure MySQL is running
   - Verify credentials in application.yml
   - Check if database exists

3. **Eureka not discovering services**
   - Ensure discovery-service is running first
   - Check eureka.client configuration
   - Verify network connectivity

4. **CORS errors**
   - Check API Gateway CORS configuration
   - Verify allowed origins include frontend ports

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is proprietary to NIGUS Bank.

---

**NIGUS Bank** - The Future of Banking in Ethiopia 🇪🇹

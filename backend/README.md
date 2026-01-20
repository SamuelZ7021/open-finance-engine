# Open Finance Engine - Backend API

A robust, production-ready backend for managing financial accounts and transactions using a **hexagonal architecture** with **Spring Boot 3.2.5** and **PostgreSQL**.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Security](#security)
- [Database](#database)
- [Contributing](#contributing)

---

## 🎯 Overview

The **Open Finance Engine** is a backend service designed to manage financial accounts and transactions securely. It implements:

- ✅ User authentication with JWT tokens and refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Account creation and management (with soft delete)
- ✅ Money transfers with double-entry accounting
- ✅ Transaction history tracking
- ✅ Comprehensive error handling with RFC 7807 Problem Details
- ✅ PostgreSQL persistence with Testcontainers for integration testing

**Key Features:**
- Follows **Clean Architecture** and **Hexagonal (Ports & Adapters)** patterns
- RESTful API with OpenAPI 3.0 documentation
- Input validation with custom error messages
- Centralized exception handling
- JWT-based security with token revocation
- Transaction logging and audit trails

---

## 🛠️ Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Language** | Java | 17 (LTS) |
| **Framework** | Spring Boot | 3.2.5 |
| **Build Tool** | Maven | 3.9.12+ |
| **Database** | PostgreSQL | 15 |
| **Authentication** | JWT (jsonwebtoken) | 0.12.3 |
| **Password Encoding** | BCrypt | Spring Security built-in |
| **Validation** | Jakarta Validation API | 3.0.2 |
| **API Documentation** | Springdoc OpenAPI | 2.0.2 |
| **Testing** | JUnit 5 | 5.9.2 |
| **Testing** | Testcontainers (PostgreSQL) | 1.19.4 |
| **ORM** | Spring Data JPA | Part of Spring Boot |
| **Lombok** | Code Generation | 1.18.30 |
| **Serialization** | Jackson | Part of Spring Boot |

**Why These Technologies?**
- **Java 17**: Latest LTS with modern language features (records, sealed classes)
- **Spring Boot 3.2.5**: Full Jakarta EE support, native compilation ready
- **PostgreSQL**: Robust relational database with strong ACID guarantees
- **JWT**: Stateless authentication, ideal for microservices
- **Testcontainers**: Real database testing without mocks
- **Jakarta Validation**: Standard validation framework for error handling

---

## 🏗️ Architecture

### Hexagonal (Ports & Adapters) Architecture

The application is organized into three main layers:

```
┌─────────────────────────────────────────┐
│       Adapters (Infrastructure)         │
│  Controllers, Repositories, Config      │
└────────────┬──────────────────────────┘
             │ (Ports)
┌────────────▼──────────────────────────┐
│    Application (Use Cases/Services)    │
│  Business Logic, Orchestration         │
└────────────┬──────────────────────────┘
             │ (Ports)
┌────────────▼──────────────────────────┐
│      Domain (Pure Business Logic)      │
│  Entities, Value Objects, Rules        │
└─────────────────────────────────────────┘
```

### Layer Responsibilities

**Domain Layer** (`domain/`)
- Pure business logic independent of frameworks
- Entities: `UserEntity`, `AccountEntity`, `TransactionEntity`
- Business Rules: account creation, transfer validation, double-entry accounting
- Exceptions: domain-specific errors like `InsufficientFundsException`
- Repositories (interfaces only): Define persistence contracts

**Application Layer** (`application/`)
- Use cases and service orchestration
- `AccountService`: Account CRUD operations
- `AuthService`: User authentication and authorization
- `TransferService`: Money transfer with validation
- `RefreshTokenService`: Token lifecycle management
- DTOs: Input validation and API contracts

**Infrastructure Layer** (`infrastructure/`)
- **Controllers**: REST endpoints (`AccountController`, `AuthController`, `TransferController`)
- **Repositories**: JPA implementations
- **Configuration**: Spring configuration, security, database
- **Security**: JWT token generation/validation, password encoding

### Benefits of This Architecture

- ✅ **Testability**: Core business logic tested independently
- ✅ **Flexibility**: Easily swap implementations (e.g., database, authentication)
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Scalability**: Ports make it easy to add new adapters (GraphQL, gRPC, etc.)

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/backend/
│   │   │   ├── BackendApplication.java          # Spring Boot entry point
│   │   │   │
│   │   │   ├── application/                      # Application/Use Case Layer
│   │   │   │   ├── dto/                         # Data Transfer Objects
│   │   │   │   │   ├── AccountResponse.java     # Account API response
│   │   │   │   │   ├── AuthRequest.java         # Login request
│   │   │   │   │   ├── AuthResponse.java        # Token response
│   │   │   │   │   ├── RegisterRequest.java     # Registration request
│   │   │   │   │   ├── TransferRequest.java     # Transfer request
│   │   │   │   │   ├── TransferCommand.java     # Transfer command
│   │   │   │   │   ├── TransactionResponse.java # Transaction response
│   │   │   │   │   └── TransactionLineResponse.java # Transaction detail
│   │   │   │   │
│   │   │   │   ├── port/                        # Ports (interfaces)
│   │   │   │   │   └── in/                      # Input ports
│   │   │   │   │
│   │   │   │   └── service/                     # Application Services
│   │   │   │       ├── AccountService.java      # Account use cases
│   │   │   │       ├── AuthService.java         # Authentication
│   │   │   │       ├── TransferService.java     # Transfer orchestration
│   │   │   │       └── RefreshTokenService.java # Token management
│   │   │   │
│   │   │   ├── domain/                           # Domain Layer
│   │   │   │   ├── exception/                   # Domain exceptions
│   │   │   │   │   └── AccountAccessDeniedException.java
│   │   │   │   │
│   │   │   │   ├── model/                       # Domain Entities
│   │   │   │   │   ├── UserEntity.java
│   │   │   │   │   ├── AccountEntity.java
│   │   │   │   │   ├── TransactionEntity.java
│   │   │   │   │   ├── RefreshTokenEntity.java
│   │   │   │   │   └── ...
│   │   │   │   │
│   │   │   │   └── repository/                  # Repository Interfaces
│   │   │   │       ├── UserRepository.java
│   │   │   │       ├── AccountRepository.java
│   │   │   │       └── TransactionRepository.java
│   │   │   │
│   │   │   └── infrastructure/                   # Infrastructure Layer
│   │   │       ├── adapter/
│   │   │       │   └── in/                      # Input Adapters
│   │   │       │       ├── AccountController.java    # Account endpoints
│   │   │       │       ├── AuthController.java       # Auth endpoints
│   │   │       │       ├── TransferController.java   # Transfer endpoints
│   │   │       │       └── TransactionController.java # History endpoints
│   │   │       │
│   │   │       ├── configuration/               # Spring Configuration
│   │   │       │   ├── ApplicationConfig.java   # Bean definitions
│   │   │       │   └── OpenApiConfig.java       # OpenAPI configuration
│   │   │       │
│   │   │       └── security/                    # Security Configuration
│   │   │           ├── config/
│   │   │           │   └── SecurityConfig.java  # Spring Security config
│   │   │           │
│   │   │           └── jwt/
│   │   │               ├── JwtTokenProvider.java    # Token generation
│   │   │               ├── JwtTokenValidator.java   # Token validation
│   │   │               └── JwtAuthenticationFilter.java # Auth filter
│   │   │
│   │   └── resources/
│   │       ├── application.yml                  # Application configuration
│   │       ├── application.properties           # Property overrides
│   │       └── db/migration/                    # Flyway migrations (if used)
│   │
│   └── test/
│       └── java/com/backend/
│           ├── BaseIntegrationTest.java         # Integration test base
│           ├── TestBackendApplication.java      # Test entry point
│           ├── TestcontainersConfiguration.java # Container setup
│           │
│           ├── application/
│           │   └── service/                     # Service tests
│           │
│           ├── domain/
│           │   └── model/                       # Entity tests
│           │
│           └── infrastructure/
│               └── adapter/
│                   └── in/                      # Controller tests
│
├── pom.xml                                      # Maven configuration
├── Dockerfile                                   # Docker image definition
├── docker-compose.yml                           # Local PostgreSQL setup
├── mvnw & mvnw.cmd                              # Maven wrapper
├── API_REFERENCE.md                             # API endpoint documentation
└── README.md                                    # This file
```

### Key Directories Explained

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| `application/dto/` | Input/output contracts for API | Validation annotations here |
| `application/service/` | Use case implementations | Business orchestration |
| `domain/model/` | Core entities | No framework dependencies |
| `domain/repository/` | Persistence contracts | Abstractions only |
| `infrastructure/adapter/in/` | REST controllers | Receive HTTP requests |
| `infrastructure/security/jwt/` | JWT handling | Token creation/validation |
| `resources/` | Configuration & migrations | Database schema, properties |
| `test/` | All test code | Integration & unit tests |

---

## 🚀 Setup & Installation

### Prerequisites

- **Java 17+** (LTS recommended)
- **Maven 3.9.12+**
- **PostgreSQL 15+**
- **Git**
- **Docker & Docker Compose** (optional, for PostgreSQL)

### 1. Clone the Repository

```bash
cd /home/samuel-zapata/open-finance-engine
git clone <repository-url>
cd backend
```

### 2. Set Up PostgreSQL

#### Option A: Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

This will start PostgreSQL on `localhost:5432` with:
- Database: `financedb`
- Username: `postgres`
- Password: `postgres`

#### Option B: Local PostgreSQL Installation

```bash
# Create database
createdb financedb

# Verify connection
psql -U postgres -d financedb -c "SELECT version();"
```

### 3. Configure Application

Create `src/main/resources/application-local.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/financedb
    username: postgres
    password: postgres
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  
  security:
    jwt:
      secret: your-secret-key-min-32-chars-recommended
      expiration: 86400000  # 24 hours in milliseconds
      refresh-expiration: 604800000  # 7 days in milliseconds
```

### 4. Build the Project

```bash
# Build without running tests
./mvnw clean package -DskipTests

# Build with tests (requires PostgreSQL running)
./mvnw clean package
```

---

## ▶️ Running the Application

### Development Mode

```bash
# Start PostgreSQL
docker-compose up -d

# Run the application
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

The API will be available at: `http://localhost:8080`

### Production Mode

```bash
# Build JAR
./mvnw clean package -DskipTests

# Run JAR
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Docker Deployment

```bash
# Build Docker image
docker build -t open-finance-engine:latest .

# Run container
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/financedb \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=postgres \
  open-finance-engine:latest
```

### Health Check

```bash
# Verify the application is running
curl http://localhost:8080/actuator/health
```

Expected response:
```json
{
  "status": "UP",
  "components": {
    "db": {"status": "UP"},
    "diskSpace": {"status": "UP"}
  }
}
```

---

## 🧪 Testing

### Running Tests

#### All Tests (Unit + Integration)
```bash
./mvnw test
```

#### Specific Test Class
```bash
./mvnw test -Dtest=AccountServiceTest
```

#### With Coverage Report
```bash
./mvnw clean test jacoco:report
# Open: target/site/jacoco/index.html
```

### Test Structure

```
test/
├── BaseIntegrationTest.java
│   └── Base class for integration tests with Testcontainers
│
├── application/service/
│   ├── AccountServiceTest.java       # Account use case tests
│   └── TransferServiceTest.java      # Transfer logic tests
│
├── domain/model/
│   ├── UserEntityTest.java           # Entity validation tests
│   └── AccountEntityTest.java
│
└── infrastructure/adapter/
    └── in/
        ├── AccountControllerTest.java    # REST endpoint tests
        ├── AuthControllerTest.java
        └── TransferControllerTest.java
```

### Key Testing Patterns

**Integration Tests** use Testcontainers to spin up a real PostgreSQL database:

```java
@SpringBootTest
class BaseIntegrationTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
        DockerImageName.parse("postgres:15")
    );
    
    @DynamicPropertySource
    static void registerDynamicProperties(DynamicPropertyRegistry registry) {
        // Automatically configure Spring Boot to use container
    }
}
```

**Unit Tests** test services and business logic in isolation:

```java
@ExtendWith(MockitoExtension.class)
class AccountServiceTest {
    @Mock
    AccountRepository repository;
    
    @InjectMocks
    AccountService service;
    
    @Test
    void testCreateAccount() {
        // Arrange, Act, Assert
    }
}
```

### Test Coverage Goals

- ✅ **Domain Logic**: 90%+ coverage (business rules must be bulletproof)
- ✅ **Application Services**: 85%+ coverage (use case orchestration)
- ✅ **Controllers**: 70%+ coverage (HTTP concerns)
- ✅ **Repositories**: Minimal (database access is tested via integration tests)

---

## 📡 API Reference

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication

All endpoints (except `/auth/register` and `/auth/login`) require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response Format

All responses follow a consistent JSON structure with metadata:

```json
{
  "data": { /* actual response data */ },
  "timestamp": "2026-01-14T18:48:58Z",
  "status": 200
}
```

### Error Response Format (RFC 7807 Problem Details)

```json
{
  "type": "https://example.com/errors/validation",
  "title": "Business Validation Error",
  "status": 400,
  "detail": "Descriptive error message",
  "timestamp": "2026-01-14T18:48:58Z",
  "fieldErrors": {
    "email": "Email must be valid",
    "password": "Password must be at least 8 characters"
  }
}
```

---

### Authentication Endpoints

#### POST /auth/register
Register a new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** 201 Created
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "createdAt": "2026-01-14T18:48:58Z"
}
```

**Errors:**
- `400`: Email already registered
- `400`: Password too weak
- `400`: Validation failed (missing fields)

**Validation Rules:**
- Email must be valid format
- Email must be unique
- Password: minimum 8 characters, must include uppercase, lowercase, number, special character

---

#### POST /auth/login
Authenticate user and receive JWT tokens

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** 200 OK
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "tokenType": "Bearer"
}
```

**Errors:**
- `401`: Invalid email or password
- `400`: Validation failed

**Token Details:**
- Access Token expires in: **24 hours**
- Refresh Token expires in: **7 days**
- Token encoding: **JWT with HS256**

---

#### POST /auth/refresh
Refresh expired access token using refresh token

**Headers:** 
```
Authorization: Bearer {refreshToken}
```

**Response:** 200 OK
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "tokenType": "Bearer"
}
```

**Errors:**
- `401`: Refresh token expired or invalid
- `401`: Missing authorization header

---

#### POST /auth/logout
Revoke refresh token and invalidate session

**Headers:** 
```
Authorization: Bearer {accessToken}
```

**Response:** 204 No Content

**Behavior:**
- Invalidates the refresh token
- Clears authentication cookies
- User must login again to get new tokens

---

### Account Endpoints

#### GET /accounts
List all accounts for authenticated user

**Headers:** 
```
Authorization: Bearer {accessToken}
```

**Response:** 200 OK
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "accountNumber": "ACC-001",
    "type": "ASSET",
    "balance": "5000.00",
    "currency": "USD",
    "active": true,
    "createdAt": "2026-01-14T18:48:58Z"
  }
]
```

---

#### GET /accounts/{id}
Get details of a specific account

**Headers:** 
```
Authorization: Bearer {accessToken}
```

**Response:** 200 OK
```json
{
  "id": "uuid",
  "accountNumber": "ACC-001",
  "type": "ASSET",
  "balance": "5000.00",
  "active": true
}
```

**Errors:**
- `404`: Account not found
- `403`: You are not the owner of this account

---

#### POST /accounts
Create a new account

**Headers:** 
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "accountNumber": "ACC-NEW",
  "type": "LIABILITY"
}
```

**Response:** 201 Created
```json
{
  "id": "uuid",
  "accountNumber": "ACC-NEW",
  "type": "LIABILITY",
  "balance": "0.00",
  "active": true
}
```

**Validation Rules:**
- `accountNumber`: Required, must be unique for user
- `type`: Required, must be one of: ASSET, LIABILITY, EQUITY, INCOME, EXPENSE

---

#### DELETE /accounts/{id}
Mark an account as inactive (soft delete)

**Headers:** 
```
Authorization: Bearer {accessToken}
```

**Response:** 204 No Content

**Errors:**
- `403`: You are not the owner of this account
- `404`: Account not found
- `409`: Account is already inactive

---

### Transfer Endpoints

#### POST /transfers
Perform a money transfer between accounts

**Headers:** 
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "sourceAccountId": "550e8400-e29b-41d4-a716-446655440000",
  "targetAccountId": "650e8400-e29b-41d4-a716-446655440001",
  "amount": "100.50",
  "description": "Payment for service"
}
```

**Response:** 201 Created
```json
{
  "id": "750e8400-e29b-41d4-a716-446655440002",
  "sourceAccountId": "550e8400-e29b-41d4-a716-446655440000",
  "targetAccountId": "650e8400-e29b-41d4-a716-446655440001",
  "amount": "100.50",
  "description": "Payment for service",
  "status": "COMPLETED",
  "createdAt": "2026-01-14T18:48:58Z"
}
```

**Validation Rules:**
- Amount must be positive
- Amount must have max 2 decimal places
- Source account must exist and be owned by user
- Target account must exist
- Source account must have sufficient funds
- Cannot transfer to same account
- Description is required and must be 1-500 characters

**Errors:**
- `400`: Validation failed (invalid amount, same account, etc.)
- `403`: You are not the owner of the source account
- `409`: Insufficient funds
- `404`: Account not found

**Double-Entry Accounting:**
Every transfer creates two transaction lines:
- **DEBIT** on source account (decreases balance)
- **CREDIT** on target account (increases balance)

---

### Transaction Endpoints

#### GET /transactions/history/{accountId}
Get transaction history for an account

**Headers:** 
```
Authorization: Bearer {accessToken}
```

**Response:** 200 OK
```json
[
  {
    "id": "750e8400-e29b-41d4-a716-446655440002",
    "timestamp": "2026-01-14T18:48:58Z",
    "description": "Transfer",
    "lines": [
      {
        "accountId": "550e8400-e29b-41d4-a716-446655440000",
        "amount": "100.50",
        "type": "DEBIT"
      },
      {
        "accountId": "650e8400-e29b-41d4-a716-446655440001",
        "amount": "100.50",
        "type": "CREDIT"
      }
    ]
  }
]
```

**Errors:**
- `403`: You are not the owner of this account
- `404`: Account not found

---

## 🚨 Error Handling

### Exception Hierarchy

```
Exception
├── RuntimeException
│   ├── IllegalArgumentException       → 400 Bad Request
│   ├── IllegalStateException          → 409 Conflict
│   ├── BadCredentialsException        → 401 Unauthorized
│   ├── AccessDeniedException          → 403 Forbidden
│   ├── EmptyResultDataAccessException → 404 Not Found
│   ├── DataIntegrityViolationException → 409 Conflict
│   ├── MethodArgumentNotValidException → 400 Bad Request
│   └── HttpMessageNotReadableException → 400 Bad Request
```

### Global Exception Handler

The `GlobalExceptionHandler` intercepts all exceptions and converts them to RFC 7807 Problem Detail responses:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> handleValidationException(
        MethodArgumentNotValidException ex) {
        // Returns 400 with field-level error details
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetail> handleAccessDenied(
        AccessDeniedException ex) {
        // Returns 403 for authorization failures
    }
    
    // ... 6 more exception handlers
}
```

### Common Error Scenarios

| Scenario | Status | Error Message |
|----------|--------|---------------|
| Invalid email format | 400 | `"email": "Email must be valid"` |
| Email already registered | 400 | `"Email must be unique"` |
| Wrong password | 401 | `"Invalid email or password"` |
| Account not found | 404 | `"Account not found"` |
| Insufficient funds | 409 | `"Insufficient funds"` |
| User not authorized | 403 | `"You are not the owner"` |
| Token expired | 401 | `"Token has expired"` |
| Invalid token | 401 | `"Invalid token"` |

---

## 🔒 Security

### JWT Token Structure

**Access Token:**
```
Header: { "alg": "HS256", "typ": "JWT" }
Payload: { 
  "sub": "user@example.com",
  "iat": 1705265338,
  "exp": 1705351738,
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
Signature: HMACSHA256(secret)
```

**Refresh Token:**
```
Header: { "alg": "HS256", "typ": "JWT" }
Payload: {
  "sub": "user@example.com",
  "iat": 1705265338,
  "exp": 1706128138,
  "tokenType": "REFRESH"
}
Signature: HMACSHA256(secret)
```

### Password Security

- **Algorithm**: BCrypt with work factor 10
- **Hash**: Irreversible, salted per password
- **Requirements**: Minimum 8 chars, uppercase, lowercase, number, special character
- **Storage**: Only hashes stored, never plaintext

### Token Security

- **HTTPS only**: Must use HTTPS in production
- **Secure cookies**: HttpOnly, Secure, SameSite=Strict flags
- **Short expiry**: Access token 24 hours, refresh token 7 days
- **Revocation**: Refresh tokens can be revoked via `/auth/logout`
- **Secret rotation**: Change JWT secret in `application.yml` periodically

### CORS Configuration

Default CORS allows requests from:
```
http://localhost:3000
http://localhost:5173
```

Customize in `SecurityConfig.java` for production.

### SQL Injection Prevention

All database queries use **parameterized queries** via Spring Data JPA:

```java
// ✅ Safe - parameterized
List<User> users = userRepository.findByEmail(email);

// ❌ Never do this
userRepository.findByQuery("SELECT * FROM users WHERE email = '" + email + "'");
```

---

## 🗄️ Database

### Schema Overview

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Accounts table (belongs to user)
CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  account_number VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL,
  balance DECIMAL(19,2) DEFAULT 0.00,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table (double-entry accounting)
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  description VARCHAR(500),
  transaction_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transaction lines (one per account affected)
CREATE TABLE transaction_lines (
  id UUID PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  account_id UUID NOT NULL REFERENCES accounts(id),
  amount DECIMAL(19,2) NOT NULL,
  type VARCHAR(10) NOT NULL, -- DEBIT or CREDIT
  created_at TIMESTAMP DEFAULT NOW()
);

-- Refresh tokens table
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexing Strategy

```sql
-- Foreign keys
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transaction_lines_transaction_id ON transaction_lines(transaction_id);
CREATE INDEX idx_transaction_lines_account_id ON transaction_lines(account_id);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- Search optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_accounts_number ON accounts(account_number);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);

-- Query optimization
CREATE INDEX idx_accounts_user_active ON accounts(user_id, active);
```

### Data Integrity Rules

1. **User Integrity**: 
   - Every user has unique email
   - Password must be hashed before storage

2. **Account Integrity**:
   - Every account belongs to one user
   - Balance cannot go negative
   - Account can only be soft-deleted (not removed)

3. **Transaction Integrity** (Double-Entry):
   - Every transaction has exactly 2 lines (debit + credit)
   - Debit amount = Credit amount
   - Both lines created in same transaction for atomicity

4. **Token Integrity**:
   - Refresh tokens can be revoked
   - Tokens are associated with users
   - Expired tokens are not valid for refreshing

---

## 🤝 Contributing

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/account-features
   ```

2. **Make Changes**
   ```bash
   # Follow existing code patterns
   # Add tests for new functionality
   # Keep commits small and atomic
   ```

3. **Run Tests Locally**
   ```bash
   ./mvnw clean test
   ```

4. **Build & Verify**
   ```bash
   ./mvnw clean package
   ```

5. **Commit & Push**
   ```bash
   git commit -m "feat: add account features with tests"
   git push origin feature/account-features
   ```

6. **Create Pull Request**
   - Reference related issues
   - Describe changes and testing
   - Request review

### Code Standards

- **Language**: English for code, comments, commit messages
- **Formatting**: Follow existing code style (2-space indentation)
- **Testing**: Every new feature must have unit tests
- **Documentation**: Update README if behavior changes
- **Error Handling**: Always provide descriptive error messages
- **Security**: Review code for injection, authentication, authorization issues

### Pre-Commit Checklist

- ✅ Code compiles without errors
- ✅ All tests pass
- ✅ No SonarQube critical issues
- ✅ Code follows team standards
- ✅ Security review completed
- ✅ Documentation updated

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/projects/spring-data-jpa)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Handbook](https://auth0.com/resources/ebooks/jwt-handbook)
- [Hexagonal Architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---
### Core Front-End Engineer
- Repositorio: [Front-End](https://github.com/SamuelZ7021/openFinance-frontend/tree/main)

## 👨‍💻 Autor
**Samuel Zapata**  
Full-Stack Developer | Open Finance Engine  
[GitHub](https://github.com/SamuelZ7021)



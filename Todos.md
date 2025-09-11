# Lara's Personal Training Platform - Development Roadmap

## Architectural Overview

This project showcases a professional, decoupled backend architecture designed for maintainability, testability, and flexibility. Key patterns and principles employed include:

- **Clean (Ports & Adapters) Architecture:** The core application logic is completely isolated from external concerns like frameworks and databases.
- **Pragmatic Web Layer:** The controller layer is coupled to the Fastify framework to leverage its performance and features, while the core business logic remains framework-agnostic.
- **Dependency Injection (IoC):** Dependencies are managed by an IoC container, promoting modularity and simplifying testing.
- **Schema-Based Validation:** All API input is rigorously validated using Zod schemas, ensuring data integrity and security.

---

## Phase 1: Core Backend Foundation

This phase establishes a professional, maintainable, and testable application foundation.

### Step 1: Code Quality & Data Layer (Completed)

- [x] **TDD:** Implement and test all repository methods for the primary data source (`DynamoDbUserRepo`).
- [x] **Integration Testing:** Create a separate suite of integration tests for the database repository.
- [x] **Code Quality:** Integrate `ESLint` and `Prettier` to enforce a consistent and professional codebase.

### Step 2: Refactor HTTP Layer & Implement Dependency Injection (Completed)

This major architectural task is now complete. The application has been refactored to use a hybrid model that leverages Fastify's native features while keeping business logic pure. A full Dependency Injection container (`InversifyJS`) has been implemented to manage object lifecycles and dependencies, significantly improving modularity and testability.

#### HOW-TO GUIDE: Implementing the Hybrid Architecture

**WHY:** To balance architectural purity with practical performance, allowing full use of the Fastify framework's features while keeping business logic pure.

- [x] **1. Update Controllers to be Fastify-Native**
  - Modify controller methods to accept `(request: FastifyRequest, reply: FastifyReply)`.
  - The controller will call the use case and use `reply` to send the response.

- [x] **2. Define a Framework-Specific Route Interface**
  - Create a `FastifyRoute` interface that includes framework-specific properties like `schema` and `preHandlers`.

- [x] **3. Create a Centralized Route Factory**
  - Create a `routes.ts` file that exports a `createRoutes(...)` function, which returns an array of all application routes.

- [x] **4. Simplify the `FastifyAdapter`**
  - Update the adapter to accept the `FastifyRoute[]` array and register them directly with Fastify, removing the old translation logic.

- [x] **5. Implement the DI Container (IoC)**
  - Introduce a DI container library (e.g., `InversifyJS`).
  - Create `inversify.config.ts` to define all dependency bindings.
  - Update `main.ts` to be the **Composition Root**: it should get the main server instance from the container and start it.

### Step 3: Implement Foundational Services (In Progress)

- [x] **Centralized Configuration:** Create an injectable `ConfigService`.
- [x] **Input Validation:** Create a reusable validation middleware using Zod.
- [x] **Health Check:** Add a `/health` endpoint.
- [ ] **Global Error Handling:** Implement a global error handler in the `FastifyAdapter`.
  - **Strategy:** Create a structured error handling system for consistent and clear API error responses.
    - **1. Custom Error Classes:** Develop a hierarchy of custom error classes (e.g., `AppError`, `NotFoundError`, `ValidationError`) to represent specific failure scenarios.
    - **2. Global Handler:** Implement a centralized error handler using Fastify's `setErrorHandler` to catch all unhandled exceptions.
    - **3. Consistent Responses:** The handler will inspect the error type and return a standardized JSON error response with the appropriate HTTP status code.
    - **4. Refactor:** Update use cases and domain logic to throw these specific, custom errors.
- [ ] **Request Logging:** Add a request logging middleware.

### Step 4: Implement Authentication & Authorization (Planned)

- [ ] Create `UserLogin` and `RefreshToken` use cases.
- [ ] Implement JWT-based authentication middleware.
- [ ] **Security:** Implement rate limiting.

### Step 5: Enhance Observability and Documentation (Planned)

- [ ] **API Documentation:** Integrate Swagger/OpenAPI.
- [ ] **Tracing:** Implement distributed tracing (e.g., OpenTelemetry).

---

## Phase 2: Admin & User Functionality (Planned)

- **Admin Dashboard:**
  - [ ] `GetAllClients` use case
  - [ ] `GetClientById` use case
  - [ ] `CreateTrainingSession` use case
  - [ ] `UpdateTrainingSession` use case
  - [ ] `DeleteTrainingSession` use case
  - [ ] Implement role-based access control (RBAC).
- **Client Dashboard:**
  - [ ] `GetMyProfile` use case
  - [ ] `GetMyTrainingSessions` use case
  - [ ] `GetMyActivePlan` use case
  - [ ] `GetMyPastPlans` use case
  - [ ] `SubmitParq` use case
  - [ ] `UpdateClientPersonalInfo` use case

---

## Phase 3: Video Content (Planned)

- **Video Upload & Processing:**
  - [ ] `GeneratePresignedUrl` use case
  - [ ] Implement a Lambda function for video processing.
  - [ ] `SaveVideoMetadata` use case.
- **Video Streaming:**
  - [ ] `GetVideoStream` use case.
  - [ ] `GetAllVideosByCategory` use case.
  - [ ] `SearchVideos` use case.

---

## Phase 4: Payments & Subscriptions (Planned)

- **Payment Gateway Integration:**
  - [ ] Integrate a payment gateway (e.g., Stripe).
  - [ ] `CreateCheckoutSession` use case.
  - [ ] Implement a webhook for payment events.
- **Subscription Management:**
  - [ ] `CancelSubscription` use case.
  - [ ] `GetMySubscription` use case.
  - [ ] Implement subscription status checks.

---

## Phase 5: Frontend Development (Planned)

- [ ] Landing Page & Payments
- [ ] User Authentication (Login, Register, PARQ)
- [ ] Client Dashboard
- [ ] Admin Dashboard

---

## Phase 6: Production Readiness & CI/CD (Planned)

- [ ] **Containerization:** Create `Dockerfile` for all services.
- [ ] **CI/CD Pipeline:** Set up GitHub Actions to build, test, and deploy.
- [ ] **Production Operations:**
  - [ ] Plan for production secrets management.
  - [ ] Implement graceful shutdown logic.
  - [ ] Set up monitoring dashboards and alerting.

---

## Phase 7: Asynchronous Backend Processes (Planned)

- **Plan Management:**
  - [ ] Create an `ExpireUserPlan` use case.
  - [ ] Set up a scheduled job to run the use case daily.

---

## Phase 8: Future-Proofing & Advanced Testing (Planned)

- [ ] **API Versioning:** Implement an API versioning strategy (e.g., `/api/v1/...`).
- [ ] **End-to-End (E2E) Testing:** Plan and implement E2E tests.

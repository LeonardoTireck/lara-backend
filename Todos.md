# Lara's Personal Training Platform - Development Roadmap

- [ ] **4. Create `Logout` Usecase & Endpoint:**
  - [ ] Create an endpoint (e.g., `POST /v1/logout`).
  - [ ] Invalidate the refresh token in the database.
  - [ ] Instruct the browser to clear the refresh token cookie.

- [ ] **6. Security: Implement Rate Limiting:**
  - [ ] Add rate limiting to sensitive endpoints like login, refresh token, and user creation to prevent brute-force attacks.

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

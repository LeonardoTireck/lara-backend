# Architecture Decision Record (ADR)

This document records the key technology and architectural decisions for this project. The goal is to provide context and reasoning for why certain choices were made, creating a guide for future development.

---

## 1. Core Technologies

### ADR-001: Runtime & Language
-   **Technology**: Node.js & TypeScript.
-   **Reasoning**: Node.js was chosen for its high-performance, non-blocking I/O model, ideal for scalable APIs. TypeScript was chosen to add static typing, which improves code quality, catches errors early, and makes the codebase more robust and maintainable.

### ADR-002: Database
-   **Technology**: AWS DynamoDB (with `dynamodb-local` for development).
-   **Reasoning**: DynamoDB is a fully managed, serverless NoSQL database that offers high performance and seamless scalability. Its flexible schema is well-suited for evolving requirements. The local version enables efficient, cost-free development and testing.

### ADR-003: Testing Framework
-   **Technology**: Jest.
-   **Reasoning**: Jest is an all-in-one testing framework providing a test runner, assertion library, and mocking capabilities out of the box. Its speed and powerful features are ideal for both unit and integration tests in a Node.js environment.

---

## 2. Architectural Patterns

### ADR-004: Core Architecture (Clean Architecture)
-   **Pattern**: The project is structured using the **Clean Architecture**.
-   **Reasoning**: This pattern decouples the core business logic (domain and use cases) from external concerns like the web framework or database. This is achieved by defining abstract interfaces ("Ports") that are implemented by concrete infrastructure classes ("Adapters").
-   **Consequences**:
    -   **Positive**: The application is highly testable and maintainable.
    -   **Negative**: This pattern introduces a higher level of initial complexity.

### ADR-005: Web Framework Strategy (Amended)
-   **Decision**: Adopt a **pragmatic, hybrid approach** to the web layer. The controller layer will be coupled to the chosen web framework (Fastify), while the core business logic (use cases and domain) remains completely framework-agnostic.
-   **Reasoning**: The initial "pure abstraction" approach, while architecturally clean, is too restrictive. It prevents the use of performance-critical features (e.g., schema-based serialization) and the rich ecosystem of the underlying web framework. This hybrid model offers a better balance.
-   **Benefits**:
    -   **Full Framework Power**: Allows the use of all Fastify features.
    -   **Protected Core Logic**: The business rules remain pure, portable, and easy to test in isolation.
    -   **Improved Developer Experience**: Controller code is more idiomatic to the framework.

### ADR-006: Dependency Management Strategy
-   **Status**: **Planned**
-   **Decision**: Use a **Dependency Injection (DI) Container (e.g., InversifyJS)**.
-   **Reasoning**: A DI container automates the process of creating objects and wiring their dependencies together (Inversion of Control). Instead of classes creating their own dependencies, the container injects them.
-   **Consequences**:
    -   **Positive**: Dramatically improves testability by making it easy to inject mock dependencies. It promotes loosely coupled components.
    -   **Negative**: Adds a layer of abstraction and requires familiarity with DI/IoC principles.

---

## 3. Application Security & API Design

### ADR-007: Input Validation Strategy
-   **Status**: **Planned**
-   **Decision**: Use a **schema-based validation library (e.g., Zod)**.
-   **Reasoning**: All data from external clients must be rigorously validated. Using a library like Zod is more robust, declarative, and maintainable than manual validation logic.

### ADR-008: API Versioning
-   **Status**: **Planned**
-   **Decision**: The API will be versioned from the start (e.g., `/api/v1/...`).
-   **Reasoning**: Versioning is crucial for long-term maintainability, allowing for future breaking changes without disrupting existing clients.

### ADR-009: Secrets Management
-   **Decision**: Use `.env` files for local development and a dedicated service (like AWS Secrets Manager) for production.
-   **Reasoning**: Committing secrets to version control is a major security risk. This approach ensures local development is easy while production is secure and auditable.

---

## 4. Production Readiness

### ADR-010: Containerization
-   **Technology**: Docker and Docker Compose.
-   **Reasoning**: To ensure a consistent and reproducible environment for both development and production, simplifying setup and deployment.

### ADR-011: Observability
-   **Decision**: Implement a **Health Check Endpoint** (`/health`) and **Structured Request Logging**.
-   **Reasoning**: The health check provides a standard way for monitoring services to verify application status. Structured logging provides essential visibility into application behavior for debugging and analysis.
	
### ADR-012: Error Handling
-   **Decision**: Implement a **Global Error Handler** in the web framework adapter.
-   **Reasoning**: This centralizes error-handling logic, preventing crashes from unhandled exceptions and ensuring that clients always receive a consistent, well-formatted error response.
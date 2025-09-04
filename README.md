# Lara's Personal Training Platform - Backend

This repository contains the backend service for Lara's Personal Training Platform, a comprehensive application designed to connect personal trainers with their clients. The platform facilitates personalized training plans, video content delivery, and subscription management.

This project is being developed with a strong emphasis on modern software engineering principles, including Clean Architecture, Domain-Driven Design (DDD), and Test-Driven Development (TDD), to create a robust, scalable, and maintainable system.

---

## Core Concepts & Architecture

The architecture of this project is its most important feature. It is built following the principles of **Clean Architecture** (also known as Hexagonal or Ports and Adapters Architecture), which ensures a clear separation of concerns between the core business logic and external infrastructure.

- **Domain Layer:** Contains the core business entities and rules, with no dependencies on any other layer.
- **Application Layer:** Orchestrates the domain logic through use cases, defining the application's features.
- **Infrastructure Layer:** Contains all external concerns, such as the web framework (Express), database access (DynamoDB), and other services. Adapters in this layer implement interfaces defined by the application layer.

This approach makes the core application independent of external frameworks and tools, highly testable, and easier to maintain and evolve over time. For a detailed explanation of the architectural decisions, please see the [ArchitectureDecisions.txt](ArchitectureDecisions.txt) file.

---

## Features

The platform is designed with a rich feature set, which is detailed in our development roadmap. See [Todos.txt](Todos.txt) for the full list.

### Key Features

- **User Management:** Secure user registration, login, and profile management.
- **Client & Admin Dashboards:** Separate interfaces for clients to view their plans and for admins to manage clients.
- **Personalized Training Plans:** Admins can create and assign detailed training sessions to clients.
- **Video Content Delivery:** Secure upload and streaming of training videos.
- **Subscription Management:** Integration with a payment gateway to manage user subscriptions.

---

## Technologies Used

- **Runtime:** [Node.js](https://nodejs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [AWS DynamoDB](https://aws.amazon.com/dynamodb/) (with DynamoDB Local for development)
- **Testing:** [Jest](https://jestjs.io/)
- **Containerization:** [Docker](https://www.docker.com/)

---

## Getting Started

To get the application running locally, please ensure you have [Node.js](https://nodejs.org/) (v18 or higher) and [Docker](https://www.docker.com/get-started) installed.

### 1. Clone the Repository

```bash
git clone https://github.com/LeonardoTireck/lara-backend.git
cd lara-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application Stack

This project uses Docker Compose to run the entire application stack, including the Node.js server and a local DynamoDB instance.

```bash
docker compose -f ./docker/docker-compose.yaml up
```

This command will start the server, which will be accessible at `http://localhost:3000`.

### 4. Set up the Database

In a separate terminal, run the command to create the necessary DynamoDB table for the first time:

```bash
npm run db:createtable
```

---

## Running Tests

This project uses Jest for both unit and integration testing. To run the entire test suite, use the following command:

```bash
npm test
```

---

## API Endpoints

The available and planned API routes are documented in the [TodoRoutes.txt](TodoRoutes.txt) file. This file provides a clear overview of the API surface.

---

## Project Roadmap

Our detailed development plan, including future features and architectural improvements, is documented in the [Todos.txt](Todos.txt) file. This file outlines the step-by-step path for the project's evolution.

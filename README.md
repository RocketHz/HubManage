# HubManage

A comprehensive management system for products, tasks, and users built with a modern TypeScript stack and clean architecture principles.

## Project Overview

HubManage is a full-stack application built as a monorepo that provides management capabilities for:

- **Products**: Inventory tracking with name, description, price, and stock
- **Tasks**: Task management with status tracking and due dates
- **Users**: User management with authentication and authorization

The application is built using a strict Onion/Hexagonal Architecture pattern to ensure:

- Clear separation of concerns
- Domain-driven design principles
- Testable and maintainable code
- Independence from frameworks and infrastructure

## Directory Structure

```
hubmanage/
├── package.json             # Root package.json for monorepo management
├── tsconfig.json            # Root TypeScript configuration
├── packages/
│   ├── backend/             # Backend API application
│   │   ├── src/
│   │   │   ├── core/        # Domain layer - entities, value objects, domain logic
│   │   │   ├── application/ # Application layer - use cases, DTOs, ports
│   │   │   ├── infrastructure/ # Infrastructure layer - adapters, repositories
│   │   │   ├── presentation/ # Presentation layer - controllers, routes
│   │   │   ├── shared/      # Shared utilities and DI configuration
│   │   │   ├── app.ts       # Express application setup
│   │   │   └── server.ts    # Application entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/            # React frontend application
│       ├── src/
│       │   ├── core/        # Domain models and interfaces
│       │   ├── application/ # Application services and hooks
│       │   ├── presentation/ # React components and pages
│       │   ├── shared/      # Shared utilities
│       │   ├── App.tsx      # Main React component
│       │   └── index.tsx    # React entry point
│       ├── package.json
│       └── tsconfig.json
```

### Backend Architecture

The backend follows the Onion/Hexagonal Architecture with the following layers:

1. **Core Layer**: Contains business entities and domain logic that are independent of any external frameworks.
2. **Application Layer**: Contains use cases, DTOs, and ports (interfaces) that define the boundary between core domain and external services.
3. **Infrastructure Layer**: Contains implementations of repositories, external services, and database configuration.
4. **Presentation Layer**: Contains controllers, routes, and middleware for handling HTTP requests.

### Frontend Architecture

The frontend follows a similar clean architecture approach:

1. **Core Layer**: Contains domain models and interfaces
2. **Application Layer**: Contains API services and hooks for data fetching and state management
3. **Presentation Layer**: Contains React components, pages, and UI logic

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v7 or higher)
- PostgreSQL (v12 or higher)

### Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/hubmanage.git
   cd hubmanage
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd packages/backend
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your PostgreSQL credentials and other environment variables.

4. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at http://localhost:3000/api

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd packages/frontend
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The web application will be available at http://localhost:3000

## Development Workflow

### Working with the Monorepo

- Use workspaces to run commands in specific packages:
  ```bash
  npm run dev:backend   # Start backend development server
  npm run dev:frontend  # Start frontend development server
  npm run build         # Build all packages
  npm run test          # Run tests for all packages
  ```

### Backend Development

1. Define domain entities in the `core` layer
2. Create interfaces (ports) in the `application` layer
3. Implement repositories and services in the `infrastructure` layer
4. Create controllers in the `presentation` layer

### Frontend Development

1. Define domain models in the `core` layer
2. Create API services in the `application` layer
3. Create React components in the `presentation` layer

## Technology Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Dependency Injection**: InversifyJS
- **Validation**: class-validator
- **Authentication**: JWT (JSON Web Tokens)

### Frontend

- **Framework**: React
- **Language**: TypeScript
- **Routing**: React Router
- **API Client**: Axios
- **Forms**: Formik with Yup validation
- **Data Fetching**: React Query
- **UI Components**: Material-UI

## License

This project is licensed under the MIT License - see the LICENSE file for details.


# Controlizze

A comprehensive financial management API for organizations, transactions, and financial insights.

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Built With](#built-with)

## Getting Started

This is a monorepo project using Turbo and pnpm workspaces.

### Prerequisites

- Node.js >= 22
- pnpm >= 10.33.0

## Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env

# Generate database migrations
pnpm run -F @controlizze/api db:generate

# Run migrations
pnpm run -F @controlizze/api db:migrate

# Seed the database (optional)
pnpm run -F @controlizze/api db:seed
```

## Configuration

Create an `.env` file in the `apps/api` directory with the following variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/controlizze
JWT_SECRET=your_jwt_secret_key
RESEND_API_KEY=your_resend_api_key
```

## Development

### Start the Development Server

```bash
pnpm dev
```

The API will be available at `http://localhost:3000`

### Running Tests

```bash
# All tests
pnpm run -F @controlizze/api test

# Unit tests only
pnpm run -F @controlizze/api test:unit

# Integration tests only
pnpm run -F @controlizze/api test:integration
```

### Database Management

```bash
# Generate migrations after schema changes
pnpm run -F @controlizze/api db:generate

# Apply pending migrations
pnpm run -F @controlizze/api db:migrate

# Open Drizzle Studio
pnpm run -F @controlizze/api db:studio
```

## API Documentation

Once the development server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:3000/docs
- **Scalar API Reference**: http://localhost:3000/reference

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer {token}
```

## Built With

- **Framework**: [Fastify](https://www.fastify.io/) v5.8
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication**: JWT with [@fastify/jwt](https://github.com/fastify/fastify-jwt)
- **API Documentation**: Swagger & Scalar API Reference
- **Testing**: Vitest

## License

ISC

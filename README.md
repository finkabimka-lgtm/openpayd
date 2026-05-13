# OpenPayd Portal

A simple full-stack banking portal base project built with Next.js 14, TypeScript, TailwindCSS, PostgreSQL, Prisma ORM, bcrypt password hashes, and a minimal cookie session.

## What is included

- Login page at `/` with email and password authentication.
- Customer dashboard at `/dashboard` with a dynamic greeting and EUR balance card.
- Admin page at `/admin` for creating customers, editing balances, and deleting customers.
- PostgreSQL schema managed by Prisma.
- Seed users for an admin and a Mario Rossi customer.
- Minimal auth utilities with a simple HTTP-only cookie session.

## Seeded accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@openpayd.local` | `Admin123!` |
| Customer | `mario@openpayd.local` | `Mario123!` |

The seeded customer is Mario Rossi with a balance of `12450.87 EUR`.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

3. Update `DATABASE_URL` in `.env` so it points to your PostgreSQL database.

4. Run the database migration:

   ```bash
   npx prisma migrate dev
   ```

5. Seed the database:

   ```bash
   npx prisma db seed
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000).

## Notes for future development

This project intentionally keeps authentication simple for a development base. It does not use JWT, OAuth, refresh tokens, external auth providers, or advanced middleware. You can replace the cookie session and page-level guards later when the portal needs production-grade security.

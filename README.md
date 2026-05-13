# OpenPayd Portal

A production-ready full-stack banking portal base built with Next.js 14, TypeScript, TailwindCSS, PostgreSQL, Prisma, JWT authentication, HTTP-only cookies, bcrypt password hashing, protected routes, and role-based access control.

## Features

- Modern fintech login screen with dark navy, blue, and purple gradients.
- Real end-to-end authentication using JWT sessions in HTTP-only cookies.
- Secure password hashing with bcrypt.
- Prisma schema, SQL migration, and seed data for PostgreSQL.
- Customer dashboard at `/dashboard` with dynamic greeting and EUR balance.
- Admin panel at `/admin` to create customers, list customers, edit balances, and delete customers.
- API routes for authentication and admin customer operations.
- Route middleware that protects customer and admin pages.
- Input validation with Zod, password-hash redaction, SameSite cookies, origin checks for mutations, and basic in-memory rate limiting.

## Seed accounts

| Role | Email | Password |
| --- | --- | --- |
| ADMIN | `admin@openpayd.local` | `Admin123!` |
| CUSTOMER | `mario@openpayd.local` | `Mario123!` |

Mario Rossi is seeded with a balance of `€12,450.87`.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a PostgreSQL database and copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your PostgreSQL connection string and a strong `JWT_SECRET` of at least 32 characters.

4. Generate Prisma Client and run the migration:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. Seed the database:

   ```bash
   npm run prisma:seed
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000/login](http://localhost:3000/login).

## API routes

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/admin/create-user`
- `GET /api/admin/users`
- `PATCH /api/admin/user/:id`
- `DELETE /api/admin/user/:id`

## Expandability

The codebase is structured to support future banking modules such as transactions, cards, transfers, KYC, IBAN management, and operational back-office workflows.

# Nimbus CRM — Backend API

REST API backend for the Nimbus CRM frontend. Built with **Node.js + Express + TypeScript + PostgreSQL + Prisma**.

---

## Quick Start

### 1. Prerequisites
- Node.js 20+
- Docker Desktop (for PostgreSQL)

### 2. Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
copy .env.example .env

# Start PostgreSQL
docker-compose up -d

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed with demo data
npm run db:seed

# Start the dev server
npm run dev
```

The API will be available at **http://localhost:4000**

---

## Test Credentials (after seeding)

| Field    | Value                              |
|----------|------------------------------------|
| Email    | `jordan@nimbus.example.com`        |
| Password | `Password123!`                     |
| Role     | `admin`                            |

---

## API Reference

All endpoints are prefixed with `/api/v1`. All routes except auth require a valid `Authorization: Bearer <token>` header.

### 🔐 Auth — `/api/v1/auth`

| Method | Path               | Auth | Description                  |
|--------|--------------------|------|------------------------------|
| POST   | `/login`           | ❌   | Email/password login          |
| POST   | `/logout`          | ✅   | Invalidate refresh token      |
| POST   | `/refresh`         | ❌   | Get new access token          |
| POST   | `/forgot-password` | ❌   | Send password reset email     |
| POST   | `/reset-password`  | ❌   | Reset password with token     |
| GET    | `/me`              | ✅   | Get current user profile      |

### 👥 Customers — `/api/v1/customers`

| Method | Path                    | Description                 |
|--------|-------------------------|-----------------------------|
| GET    | `/`                     | List customers (paginated)  |
| POST   | `/`                     | Create customer             |
| GET    | `/:id`                  | Get customer + notes/files  |
| PUT    | `/:id`                  | Update customer             |
| DELETE | `/:id`                  | Delete customer             |
| GET    | `/:id/notes`            | List notes                  |
| POST   | `/:id/notes`            | Add note                    |
| GET    | `/:id/files`            | List files                  |
| POST   | `/:id/files`            | Upload file (multipart)     |
| DELETE | `/:id/files/:fileId`    | Delete file                 |
| GET    | `/:id/timeline`         | Get timeline events         |

### 🎯 Leads — `/api/v1/leads`

| Method | Path               | Description                   |
|--------|--------------------|-------------------------------|
| GET    | `/`                | List leads (paginated)        |
| POST   | `/`                | Create lead                   |
| GET    | `/:id`             | Get lead + activity           |
| PUT    | `/:id`             | Update lead                   |
| DELETE | `/:id`             | Delete lead                   |
| PATCH  | `/:id/stage`       | Move to stage                 |
| PATCH  | `/:id/owner`       | Re-assign owner               |
| GET    | `/:id/activity`    | Get activity log              |
| POST   | `/:id/activity`    | Log note/call/email/meeting   |

### 💰 Sales — `/api/v1/sales`

**Deals**

| Method | Path                | Description        |
|--------|---------------------|--------------------|
| GET    | `/deals`            | List deals         |
| POST   | `/deals`            | Create deal        |
| GET    | `/deals/:id`        | Get deal           |
| PUT    | `/deals/:id`        | Update deal        |
| DELETE | `/deals/:id`        | Delete deal        |
| PATCH  | `/deals/:id/stage`  | Move deal stage    |

**Quotations**

| Method | Path                     | Description         |
|--------|--------------------------|---------------------|
| GET    | `/quotations`            | List quotations     |
| POST   | `/quotations`            | Create quotation    |
| GET    | `/quotations/:id`        | Get quotation       |
| PUT    | `/quotations/:id`        | Update quotation    |
| DELETE | `/quotations/:id`        | Delete quotation    |
| PATCH  | `/quotations/:id/status` | Set status          |

**Invoices**

| Method | Path                    | Description     |
|--------|-------------------------|-----------------|
| GET    | `/invoices`             | List invoices   |
| POST   | `/invoices`             | Create invoice  |
| GET    | `/invoices/:id`         | Get invoice     |
| PUT    | `/invoices/:id`         | Update invoice  |
| DELETE | `/invoices/:id`         | Delete invoice  |
| PATCH  | `/invoices/:id/status`  | Set status      |

**Payments**

| Method | Path                            | Description              |
|--------|---------------------------------|--------------------------|
| GET    | `/payments`                     | List all payments        |
| POST   | `/invoices/:invoiceId/payments` | Record payment           |

### 🧑‍💼 Employees — `/api/v1/employees`

| Method | Path                          | Description               |
|--------|-------------------------------|---------------------------|
| GET    | `/`                           | List employees            |
| POST   | `/`                           | Add employee              |
| GET    | `/:id`                        | Get employee + attendance |
| PUT    | `/:id`                        | Update employee           |
| DELETE | `/:id`                        | Soft-delete (terminated)  |
| GET    | `/:id/attendance`             | Get attendance records    |
| PATCH  | `/:id/attendance/today`       | Toggle today's attendance |
| GET    | `/:id/performance`            | Get performance metrics   |

### ✅ Tasks — `/api/v1/tasks`

| Method | Path                | Description         |
|--------|---------------------|---------------------|
| GET    | `/`                 | List tasks          |
| POST   | `/`                 | Create task         |
| GET    | `/:id`              | Get task            |
| PUT    | `/:id`              | Update task         |
| DELETE | `/:id`              | Delete task         |
| PATCH  | `/:id/status`       | Move status column  |
| PATCH  | `/:id/toggle-done`  | Toggle done/todo    |

### 🔔 Notifications — `/api/v1/notifications`

| Method | Path           | Description              |
|--------|----------------|--------------------------|
| GET    | `/`            | List user notifications  |
| PATCH  | `/read-all`    | Mark all as read         |
| DELETE | `/`            | Clear all notifications  |
| PATCH  | `/:id/read`    | Mark one as read         |
| DELETE | `/:id`         | Delete one               |

### 📊 Dashboard — `/api/v1/dashboard`

| Method | Path                    | Description              |
|--------|-------------------------|--------------------------|
| GET    | `/summary`              | KPI stats                |
| GET    | `/revenue-trend`        | Monthly revenue chart    |
| GET    | `/lead-source-breakdown`| Leads by source          |
| GET    | `/recent-activity`      | Activity feed            |

### 📈 Reports — `/api/v1/reports`

All accept `?from=YYYY-MM-DD&to=YYYY-MM-DD`

| Method | Path          | Description             |
|--------|---------------|-------------------------|
| GET    | `/revenue`    | Revenue over time       |
| GET    | `/sales`      | Pipeline & conversions  |
| GET    | `/leads`      | Lead funnel & sources   |
| GET    | `/employees`  | Performance rankings    |

### ⚙️ Settings — `/api/v1/settings`

| Method | Path                           | Auth Role | Description               |
|--------|--------------------------------|-----------|---------------------------|
| GET    | `/company`                     | any       | Get company profile       |
| PUT    | `/company`                     | admin     | Update company profile    |
| GET    | `/roles`                       | any       | Get permission matrix     |
| PUT    | `/roles/:role/permissions`     | admin     | Update role permissions   |
| GET    | `/users`                       | any       | List users + access       |
| PATCH  | `/users/:employeeId/role`      | admin     | Set user role             |
| PATCH  | `/users/:employeeId/access`    | admin     | Toggle user access        |
| GET    | `/preferences`                 | any       | Get my preferences        |
| PUT    | `/preferences`                 | any       | Save my preferences       |

---

## Pagination

List endpoints support:

```
GET /api/v1/customers?page=1&limit=20&sort=createdAt&order=desc
```

Response format:

```json
{
  "data": [...],
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 20,
    "totalPages": 6
  }
}
```

## Error Format

```json
{
  "error": "NOT_FOUND",
  "message": "Customer not found",
  "statusCode": 404
}
```

---

## NPM Scripts

| Script                 | Description                       |
|------------------------|-----------------------------------|
| `npm run dev`          | Start dev server with hot-reload  |
| `npm run build`        | Compile TypeScript                |
| `npm start`            | Run compiled production bundle    |
| `npm run db:migrate`   | Run Prisma migrations (dev)       |
| `npm run db:seed`      | Seed database with demo data      |
| `npm run db:studio`    | Open Prisma Studio GUI            |
| `npm run db:generate`  | Regenerate Prisma client          |

---

## Connecting the Frontend

1. Start the backend (`npm run dev` in `backend/`)
2. In the frontend root, create `.env.local`:
   ```
   VITE_API_BASE_URL=http://localhost:4000/api/v1
   ```
3. Uncomment the JWT interceptor in `src/services/api.client.ts`
4. Replace mock imports in each Zustand store with `*.service.ts` calls

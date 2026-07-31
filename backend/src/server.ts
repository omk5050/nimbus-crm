import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { env } from '@/config/env';
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware';

// ─── Routers ──────────────────────────────────────────────────
import authRouter from '@/modules/auth/auth.router';
import customersRouter from '@/modules/customers/customers.router';
import leadsRouter from '@/modules/leads/leads.router';
import salesRouter from '@/modules/sales/sales.router';
import employeesRouter from '@/modules/employees/employees.router';
import tasksRouter from '@/modules/tasks/tasks.router';
import notificationsRouter from '@/modules/notifications/notifications.router';
import dashboardRouter from '@/modules/dashboard/dashboard.router';
import reportsRouter from '@/modules/reports/reports.router';
import settingsRouter from '@/modules/settings/settings.router';

const app = express();

// ─── Security & Core Middleware ───────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow frontend static assets, Google fonts, and inline styles in SPA
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (same-origin, mobile apps, curl)
      if (!origin) return callback(null, true);
      const allowed = env.CORS_ORIGINS.split(',').map((o) => o.trim());
      if (allowed.includes('*') || allowed.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Allow Render domain dynamically
    },
    credentials: true,
  }),
);

app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Health check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV, timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────
const API = '/api/v1';

app.use(`${API}/auth`, authRouter);
app.use(`${API}/customers`, customersRouter);
app.use(`${API}/leads`, leadsRouter);
app.use(`${API}/sales`, salesRouter);
app.use(`${API}/employees`, employeesRouter);
app.use(`${API}/tasks`, tasksRouter);
app.use(`${API}/notifications`, notificationsRouter);
app.use(`${API}/dashboard`, dashboardRouter);
app.use(`${API}/reports`, reportsRouter);
app.use(`${API}/settings`, settingsRouter);

// ─── Static Frontend Serving (Single-Link Render Deployment) ──
// Detect frontend static build directory across different run locations
const possibleClientPaths = [
  path.resolve(__dirname, '../../dist'),           // When compiled to backend/dist/server.js
  path.resolve(process.cwd(), '../dist'),           // Relative from backend/ execution
  path.resolve(process.cwd(), 'dist'),              // Execution from root directory
  path.resolve(process.cwd(), 'backend/dist/public'),
];

const clientPath = possibleClientPaths.find((p) => fs.existsSync(path.join(p, 'index.html')));

if (clientPath) {
  console.log(`📦 Serving static frontend from: ${clientPath}`);
  app.use(express.static(clientPath));

  // Catch-all route returns index.html for client-side React Router
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(clientPath, 'index.html'));
  });
} else {
  console.log('ℹ️ Static frontend build not found. Running in standalone API mode.');
  app.use(notFoundHandler);
}

// ─── Error Handling ───────────────────────────────────────────
app.use(errorHandler);

import { ensureDefaultAccountsExist } from '@/services/seeder.service';

// ─── Start Server ─────────────────────────────────────────────
app.listen(env.PORT, async () => {
  console.log(`\n🚀 Nimbus CRM Server running at http://localhost:${env.PORT}`);
  console.log(`   Environment : ${env.NODE_ENV}`);
  console.log(`   Health      : http://localhost:${env.PORT}/health`);
  console.log(`   API Base    : http://localhost:${env.PORT}${API}`);
  if (clientPath) {
    console.log(`   Frontend    : http://localhost:${env.PORT} (Single-Link Deployment)\n`);
  }
  await ensureDefaultAccountsExist();
});

export default app;

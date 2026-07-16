import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import routes from './routes';
import { env } from './config/env';

// ─────────────────────────────────────────────────────────────────────────────
// Replaces api-gateway's app.ts + every module's own app.ts. Global
// middleware that used to live in the gateway (CORS, correlation-ID
// injection) now lives here since there's no separate gateway process.
// JWT verification is NOT global here — it stays per-route via
// authenticate/authenticateCandidate, same as before, just without an extra
// hop through a gateway to get there.
// ─────────────────────────────────────────────────────────────────────────────

export const app = express();

app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Correlation ID — carried over from api-gateway's tracing responsibility.
// app.use((req, res, next) => {
//   const correlationId = (req.headers['x-correlation-id'] as string) || randomUUID();
//   res.setHeader('x-correlation-id', correlationId);
//   next();
// });

app.use('/api', routes);

// Central error handler — must be registered last.
app.use(
  (
    err: Error & { statusCode?: number },
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    const statusCode = err.statusCode ?? 500;
    if (statusCode >= 500) {
      console.error(err);
    }
    res.status(statusCode).json({ error: err.message || 'Internal server error' });
  }
);

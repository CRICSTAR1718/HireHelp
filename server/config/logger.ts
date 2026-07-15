import winston from 'winston';
import { env } from './env';

// ─────────────────────────────────────────────────────────────────────────────
// NEW FILE — common/middleware/error-handler.ts (carried over from
// admin-service) imports this but it was never actually copied over during
// the merge. Minimal winston setup, matching admin-service's dependency on
// `winston` in package.json.
// ─────────────────────────────────────────────────────────────────────────────

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    env.NODE_ENV === 'production' ? winston.format.json() : winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

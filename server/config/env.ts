import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// ─────────────────────────────────────────────────────────────────────────────
// Merged env config — union of what candidate/recruitment/admin/interview each
// declared separately. Uses Admin's Zod-validated pattern (the strictest of
// the four) rather than Recruitment's manual requireEnv() or Candidate's bare
// object-with-defaults, since fail-fast on a missing required var beats
// discovering it's missing at first request.
//
// REMOVED vs the original 4 configs:
//   - KAFKA_BROKERS / KAFKA_GROUP_ID — no longer needed, replaced by the
//     in-process event bus (see server/events/bus.ts)
//   - CANDIDATE_SERVICE_URL / ADMIN_SERVICE_URL / INTERVIEW_SERVICE_URL —
//     those modules are now in-process, no HTTP calls between them needed
//   - API_GATEWAY_URL — the gateway is dissolved into this monolith
//
// KEPT:
//   - AI_EVALUATION_SERVICE_URL — the one service that stays genuinely
//     separate (Python/FastAPI), still called over HTTP
//   - S3_* — resume storage, from candidate-service
// ─────────────────────────────────────────────────────────────────────────────

const envSchema = z.object({
  PORT: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 5000)),

  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("1h"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // Candidate auth stays a SEPARATE secret/issuer from staff auth on purpose
  // — do not collapse this into JWT_SECRET even though both live in one
  // process now. See modules/candidates/auth/auth.service.ts.
  CANDIDATE_JWT_SECRET: z.string().min(1, "CANDIDATE_JWT_SECRET is required"),
  CANDIDATE_JWT_EXPIRES_IN: z.string().default("7d"),

  LOG_LEVEL: z.string().default("info"),

  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),

  AI_EVALUATION_SERVICE_URL: z.string().min(1, "AI_EVALUATION_SERVICE_URL is required"),

  S3_ENDPOINT: z.string().optional().default(""),
  S3_REGION: z.string().optional().default("us-east-1"),
  S3_ACCESS_KEY: z.string().optional().default(""),
  S3_SECRET_KEY: z.string().optional().default(""),
  S3_BUCKET: z.string().optional().default(""),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  if (process.env.NODE_ENV !== "test") {
    console.error("❌ Invalid environment variables");
    console.error(parsedEnv.error.format());
    process.exit(1);
  }
}

export const env = parsedEnv.success
  ? parsedEnv.data
  : ({
    PORT: 5000,
    NODE_ENV: "test",
    DATABASE_URL: "",
    JWT_SECRET: "",
    JWT_EXPIRES_IN: "1h",
    JWT_REFRESH_EXPIRES_IN: "7d",
    CANDIDATE_JWT_SECRET: "",
    CANDIDATE_JWT_EXPIRES_IN: "7d",
    LOG_LEVEL: "info",
    CLIENT_ORIGIN: "http://localhost:5173",
    AI_EVALUATION_SERVICE_URL: "",
    S3_ENDPOINT: "",
    S3_REGION: "us-east-1",
    S3_ACCESS_KEY: "",
    S3_SECRET_KEY: "",
    S3_BUCKET: "",
  } satisfies z.infer<typeof envSchema>);

export type Env = typeof env;

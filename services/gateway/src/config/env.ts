import { config } from "dotenv";
import { z } from "zod";

// INFO: Load environment variables from .env (local dev only; Kubernetes injects them directly)
config({ quiet: true });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  RABBITMQ_URL: z.url(),
  REDIS_URL: z.url(),
  QUEUE_NAME: z.string().min(1).default("jobs"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  console.error(z.flattenError(parsed.error).fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

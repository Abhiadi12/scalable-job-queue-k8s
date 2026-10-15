import type { Redis } from "ioredis";
import type { QueueConnection } from "../queue/connection.js";
import type { Liveness, Readiness } from "../types/health.js";

export class HealthService {
  constructor(
    private readonly redis: Redis,
    private readonly queueConnection: QueueConnection,
  ) {}

  liveness(): Liveness {
    return { status: "ok", uptimeSeconds: Math.round(process.uptime()) };
  }

  readiness(): Readiness {
    const checks = {
      redis: this.redis.status === "ready",
      rabbitmq: this.queueConnection.isOpen(),
    };
    return { ready: checks.redis && checks.rabbitmq, checks };
  }
}

import type { Redis } from "ioredis";
import { JOB_KEY_PREFIX, JOB_STATUS, JOB_TTL_SECONDS } from "../constants/index.js";

export class JobStoreService {
  constructor(private readonly redis: Redis) { }

  private key(id: string): string {
    return `${JOB_KEY_PREFIX}${id}`;
  }

  private async update(id: string, fields: Record<string, string | number>): Promise<void> {
    const key = this.key(id);
    await this.redis.multi().hset(key, fields).expire(key, JOB_TTL_SECONDS).exec();
  }

  markProcessing(id: string): Promise<void> {
    return this.update(id, { status: JOB_STATUS.PROCESSING, startedAt: Date.now() });
  }

  markCompleted(id: string, result: unknown, durationMs: number): Promise<void> {
    return this.update(id, {
      status: JOB_STATUS.COMPLETED,
      result: JSON.stringify(result),
      durationMs,
      completedAt: Date.now(),
    });
  }

  markFailed(id: string, reason: string): Promise<void> {
    return this.update(id, { status: JOB_STATUS.FAILED, error: reason, completedAt: Date.now() });
  }
}

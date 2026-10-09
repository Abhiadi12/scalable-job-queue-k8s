import { UnknownJobTypeError } from "../errors/unknown-job-type.error.js";
import type { JobHandler } from "../types/job-handler.js";
import type { JobMessage } from "../types/job.js";
import { logger } from "../utils/logger.js";
import type { JobStoreService } from "./job-store.service.js";

export class JobProcessorService {
  constructor(
    private readonly jobStore: JobStoreService,
    private readonly handlers: Partial<Record<string, JobHandler>>,
  ) { }

  async process(job: JobMessage): Promise<void> {
    await this.jobStore.markProcessing(job.id);
    const startedAt = process.hrtime.bigint();

    let result: unknown;
    try {
      const handler = this.handlers[job.type];
      if (!handler) throw new UnknownJobTypeError(`No handler for job type "${job.type}"`);
      result = handler(job.payload);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      await this.jobStore.markFailed(job.id, reason);
      logger.error({ err: error, jobId: job.id, type: job.type }, "Job failed");
      return;
    }

    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    await this.jobStore.markCompleted(job.id, result, durationMs);
    logger.info({ jobId: job.id, type: job.type, durationMs }, "Job completed");
  }
}

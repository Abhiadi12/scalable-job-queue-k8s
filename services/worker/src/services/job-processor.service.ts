import { UnknownJobTypeError } from "../errors/unknown-job-type.error.js";
import type { JobHandler } from "../types/job-handler.js";
import type { JobMessage } from "../types/job.js";
import { logger } from "../utils/logger.js";
import type { JobStoreService } from "./job-store.service.js";
import type { MetricsService } from "./metrics.service.js";

export class JobProcessorService {
  constructor(
    private readonly jobStore: JobStoreService,
    private readonly metrics: MetricsService,
    private readonly handlers: Partial<Record<string, JobHandler>>,
  ) {}

  async process(job: JobMessage): Promise<void> {
    await this.jobStore.markProcessing(job.id);
    const startedAt = process.hrtime.bigint();

    let result: unknown;
    let failure: unknown;
    try {
      const handler = this.handlers[job.type];
      if (!handler) throw new UnknownJobTypeError(`No handler for job type "${job.type}"`);
      result = handler(job.payload);
    } catch (error) {
      failure = error ?? new Error("Job handler threw an empty value");
    }

    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;

    if (failure) {
      const reason = failure instanceof Error ? failure.message : String(failure);
      await this.jobStore.markFailed(job.id, reason);
      this.metrics.recordProcessed(job.type, durationMs / 1000);
      this.metrics.recordError(job.type);
      logger.error({ err: failure, jobId: job.id, type: job.type }, "Job failed");
      return;
    }

    await this.jobStore.markCompleted(job.id, result, durationMs);
    this.metrics.recordProcessed(job.type, durationMs / 1000);
    logger.info({ jobId: job.id, type: job.type, durationMs }, "Job completed");
  }
}

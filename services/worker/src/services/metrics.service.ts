import { collectDefaultMetrics, Counter, Histogram, Registry } from "prom-client";
import { JOB_DURATION_BUCKETS_SECONDS } from "../constants/index.js";

export class MetricsService {
  private readonly registry = new Registry();
  private readonly jobsProcessed: Counter<"type">;
  private readonly jobErrors: Counter<"type">;
  private readonly jobProcessingTime: Histogram<"type">;

  constructor() {
    collectDefaultMetrics({ register: this.registry });

    this.jobsProcessed = new Counter({
      name: "jobs_processed_total",
      help: "Jobs the worker finished, whether they completed or failed",
      labelNames: ["type"],
      registers: [this.registry],
    });

    this.jobErrors = new Counter({
      name: "job_errors_total",
      help: "Jobs that failed, plus messages rejected as invalid",
      labelNames: ["type"],
      registers: [this.registry],
    });

    this.jobProcessingTime = new Histogram({
      name: "job_processing_time_seconds",
      help: "Time spent running a job handler",
      labelNames: ["type"],
      buckets: JOB_DURATION_BUCKETS_SECONDS,
      registers: [this.registry],
    });
  }

  recordProcessed(type: string, durationSeconds: number): void {
    this.jobsProcessed.inc({ type });
    this.jobProcessingTime.observe({ type }, durationSeconds);
  }

  recordError(type: string): void {
    this.jobErrors.inc({ type });
  }

  get contentType(): string {
    return this.registry.contentType;
  }

  render(): Promise<string> {
    return this.registry.metrics();
  }
}

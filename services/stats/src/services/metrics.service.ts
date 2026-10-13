import { collectDefaultMetrics, Gauge, Registry } from "prom-client";
import type { StatsService } from "./stats.service.js";

export class MetricsService {
  private readonly registry = new Registry();
  private readonly jobsSubmitted: Gauge;
  private readonly jobsCompleted: Gauge;
  private readonly jobsFailed: Gauge;
  private readonly queueLength: Gauge;
  private readonly queueConsumers: Gauge;

  constructor(private readonly statsService: StatsService) {
    collectDefaultMetrics({ register: this.registry });

    this.jobsSubmitted = this.gauge("total_jobs_submitted", "Jobs accepted by the gateway");
    this.jobsCompleted = this.gauge("total_jobs_completed", "Jobs completed successfully by workers");
    this.jobsFailed = this.gauge("total_jobs_failed", "Jobs that workers finished as failed");
    this.queueLength = this.gauge("queue_length", "Jobs waiting in the queue for a free worker");
    this.queueConsumers = this.gauge("queue_consumers", "Workers currently consuming from the queue");
  }

  get contentType(): string {
    return this.registry.contentType;
  }

  async render(): Promise<string> {
    const stats = await this.statsService.getStats();
    this.jobsSubmitted.set(stats.jobs.submitted);
    this.jobsCompleted.set(stats.jobs.completed);
    this.jobsFailed.set(stats.jobs.failed);
    this.queueLength.set(stats.queue.length);
    this.queueConsumers.set(stats.queue.consumers);
    return this.registry.metrics();
  }

  private gauge(name: string, help: string): Gauge {
    return new Gauge({ name, help, registers: [this.registry] });
  }
}

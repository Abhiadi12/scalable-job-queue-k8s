import type { Stats } from "../types/stats.js";
import type { JobCountersService } from "./job-counters.service.js";
import type { QueueStatsService } from "./queue-stats.service.js";

export class StatsService {
  constructor(
    private readonly jobCounters: JobCountersService,
    private readonly queueStats: QueueStatsService,
  ) {}

  async getStats(): Promise<Stats> {
    const [counters, queue] = await Promise.all([
      this.jobCounters.getCounters(),
      this.queueStats.getQueueStats(),
    ]);

    const { submitted, completed, failed, processingTimeMs } = counters;
    return {
      jobs: {
        submitted,
        completed,
        failed,
        pending: Math.max(0, submitted - completed - failed),
      },
      averageProcessingTimeMs: completed > 0 ? processingTimeMs / completed : 0,
      queue,
    };
  }
}

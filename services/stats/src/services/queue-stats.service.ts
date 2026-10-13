import { env } from "../config/env.js";
import type { QueueConnection } from "../queue/connection.js";
import type { QueueStats } from "../types/stats.js";

export class QueueStatsService {
  constructor(private readonly queueConnection: QueueConnection) {}

  async getQueueStats(): Promise<QueueStats> {
    const { messageCount, consumerCount } = await this.queueConnection
      .getChannel()
      .checkQueue(env.QUEUE_NAME);
    return { length: messageCount, consumers: consumerCount };
  }
}

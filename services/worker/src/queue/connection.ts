import { connect, type Channel, type ChannelModel } from "amqplib";
import { env } from "../config/env.js";
import { PREFETCH_COUNT } from "../constants/index.js";
import { InternalError } from "../errors/internal.error.js";
import { logger } from "../utils/logger.js";

export class QueueConnection {
  private model: ChannelModel | null = null;
  private channel: Channel | null = null;
  private closing = false;

  async connect(): Promise<void> {
    this.model = await connect(env.RABBITMQ_URL);
    this.model.on("error", (error: Error) => logger.error({ err: error }, "RabbitMQ error"));
    this.model.on("close", () => {
      if (this.closing) return;
      logger.fatal("RabbitMQ connection closed, exiting");
      process.exit(1);
    });

    this.channel = await this.model.createChannel();
    await this.channel.assertQueue(env.QUEUE_NAME, { durable: true });
    await this.channel.prefetch(PREFETCH_COUNT);
  }

  getChannel(): Channel {
    if (!this.channel) throw new InternalError("Queue channel used before connect()");
    return this.channel;
  }

  async close(): Promise<void> {
    this.closing = true;
    await this.channel?.close();
    await this.model?.close();
  }
}

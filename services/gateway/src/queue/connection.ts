import { connect, type ChannelModel, type ConfirmChannel } from "amqplib";
import { env } from "../config/env.js";
import { InternalError } from "../errors/internal.error.js";
import { logger } from "../utils/logger.js";

export class QueueConnection {
  private model: ChannelModel | null = null;
  private channel: ConfirmChannel | null = null;
  private closing = false;

  async connect(): Promise<void> {
    this.model = await connect(env.RABBITMQ_URL);
    this.model.on("error", (error: Error) => logger.error({ err: error }, "RabbitMQ error"));
    // No reconnect logic on purpose: if the broker connection dies we exit and
    // let the supervisor (later: Kubernetes) restart us with a fresh one.
    this.model.on("close", () => {
      if (this.closing) return;
      logger.fatal("RabbitMQ connection closed, exiting");
      process.exit(1);
    });

    // Confirm channel: the broker acks each publish, so "202 Accepted" really
    // means the broker has the message.
    this.channel = await this.model.createConfirmChannel();
    await this.channel.assertQueue(env.QUEUE_NAME, { durable: true });
  }

  getChannel(): ConfirmChannel {
    if (!this.channel) throw new InternalError("Queue channel used before connect()");
    return this.channel;
  }

  async close(): Promise<void> {
    this.closing = true;
    await this.channel?.close();
    await this.model?.close();
  }
}

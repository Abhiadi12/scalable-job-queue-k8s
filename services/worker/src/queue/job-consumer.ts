import { setTimeout as sleep } from "node:timers/promises";
import type { ConsumeMessage } from "amqplib";
import { z } from "zod";
import { env } from "../config/env.js";
import { JOB_TYPES, REQUEUE_DELAY_MS } from "../constants/index.js";
import { BaseError } from "../errors/base.error.js";
import { InvalidMessageError } from "../errors/invalid-message.error.js";
import type { JobProcessorService } from "../services/job-processor.service.js";
import type { JobMessage } from "../types/job.js";
import { logger } from "../utils/logger.js";
import type { QueueConnection } from "./connection.js";

const jobMessageSchema = z.object({
  id: z.string().min(1),
  type: z.enum(JOB_TYPES),
  payload: z.record(z.string(), z.unknown()).default({}),
});

export class JobConsumer {
  private consumerTag: string | null = null;
  private inFlight: Promise<void> = Promise.resolve();

  constructor(
    private readonly queueConnection: QueueConnection,
    private readonly jobProcessor: JobProcessorService,
  ) { }

  async start(): Promise<void> {
    const channel = this.queueConnection.getChannel();
    const { consumerTag } = await channel.consume(env.QUEUE_NAME, (message) => {
      if (!message) return; // consumer was cancelled by the broker
      this.inFlight = this.handle(message);
    });
    this.consumerTag = consumerTag;
  }

  async stop(): Promise<void> {
    if (this.consumerTag) await this.queueConnection.getChannel().cancel(this.consumerTag);
    await this.inFlight;
  }

  private parse(message: ConsumeMessage): JobMessage {
    try {
      return jobMessageSchema.parse(JSON.parse(message.content.toString()));
    } catch (error) {
      throw new InvalidMessageError("Message is not a valid job", error);
    }
  }

  private async handle(message: ConsumeMessage): Promise<void> {
    const channel = this.queueConnection.getChannel();
    try {
      await this.jobProcessor.process(this.parse(message));
      channel.ack(message);
    } catch (error) {
      const requeue = !(error instanceof BaseError && error.isPermanent);
      logger.error({ err: error, requeue }, "Could not process message");
      if (requeue) await sleep(REQUEUE_DELAY_MS);
      channel.nack(message, false, requeue);
    }
  }
}

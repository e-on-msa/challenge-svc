const amqp = require("amqplib");

const {
  saveUserSuspended,
  saveUserUnsuspended,
  saveUserJoinRestricted,
  saveUserJoinUnrestricted,
} = require("../services/userChallengeStatusService");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const EXCHANGE = process.env.USER_EVENT_EXCHANGE || "user.event";
const QUEUE = process.env.USER_EVENT_QUEUE || "challenge-svc.user-event.queue";

const DLX = `${EXCHANGE}.dlx`;
const DLQ = `${QUEUE}.dlq`;

const routingKeys = [
  "user.suspended",
  "user.unsuspended",
  "user.join-restricted",
  "user.join-unrestricted",
];

async function handleUserEvent(routingKey, payload) {
  if (!payload.user_id) {
    throw new Error("user_id is required");
  }

  switch (routingKey) {
    case "user.suspended":
      await saveUserSuspended(payload);
      break;

    case "user.unsuspended":
      await saveUserUnsuspended(payload);
      break;

    case "user.join-restricted":
      await saveUserJoinRestricted(payload);
      break;

    case "user.join-unrestricted":
      await saveUserJoinUnrestricted(payload);
      break;

    default:
      console.warn(`[RabbitMQ] Unknown routing key: ${routingKey}`);
  }
}

async function startUserEventConsumer() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE, "topic", {
    durable: true,
  });

  await channel.assertExchange(DLX, "topic", {
    durable: true,
  });

  await channel.assertQueue(DLQ, {
    durable: true,
  });

  await channel.bindQueue(DLQ, DLX, "#");

  await channel.assertQueue(QUEUE, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": DLX,
    },
  });

  for (const routingKey of routingKeys) {
    await channel.bindQueue(QUEUE, EXCHANGE, routingKey);
  }

  channel.prefetch(10);

  channel.consume(QUEUE, async (message) => {
    if (!message) return;

    const routingKey = message.fields.routingKey;

    try {
      const payload = JSON.parse(message.content.toString());

      await handleUserEvent(routingKey, payload);

      channel.ack(message);
      console.log(`[RabbitMQ] processed: ${routingKey}`, payload);
    } catch (err) {
      console.error(`[RabbitMQ] failed: ${routingKey}`, err);

      channel.nack(message, false, false);
    }
  });

  console.log(`[RabbitMQ] listening queue: ${QUEUE}`);
}

module.exports = {
  startUserEventConsumer,
};
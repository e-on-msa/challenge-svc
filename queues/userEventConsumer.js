/**
 * RabbitMQ user 이벤트 수신 및 라우팅 담당
 *
 * 역할
 * - user.event exchange 구독
 * - routing key 기반 이벤트 분기
 * - 사용자 상태 변경 정보를 Service로 전달
 *
 * 실제 상태 저장/조회/검증은
 * userChallengeStatusService에서 처리
 */

const amqp = require("amqplib");

const {
  saveUserSuspended,
  saveUserUnsuspended,
  saveUserJoinRestricted,
  saveUserJoinUnrestricted,
} = require("../services/userChallengeStatusService");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

// user-svc가 발행하는 사용자 이벤트 exchange
const EXCHANGE = process.env.USER_EVENT_EXCHANGE || "user.event";

// challenge-svc 사용자 상태 반영용 큐
const QUEUE = process.env.USER_EVENT_QUEUE || "challenge-svc.user-event.queue";

const DLX = `${EXCHANGE}.dlx`;
const DLQ = `${QUEUE}.dlq`;

// challenge-svc가 구독하는 사용자 이벤트 목록
const routingKeys = [
  "user.suspended",
  "user.unsuspended",
  "user.join-restricted",
  "user.join-unrestricted",
];

/**
 * user 이벤트 처리
 * → Redis 사용자 상태 저장
 */
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

/**
 * user.event consumer 시작
 */
async function startUserEventConsumer() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  // 사용자 이벤트 exchange
  await channel.assertExchange(EXCHANGE, "topic", {
    durable: true,
  });

  // 실패 메시지 저장용 DLX
  await channel.assertExchange(DLX, "topic", {
    durable: true,
  });

  // 실패 메시지 저장 큐
  await channel.assertQueue(DLQ, {
    durable: true,
  });

  // 모든 실패 메시지를 DLQ로 라우팅
  await channel.bindQueue(DLQ, DLX, "#");

  // 처리 실패 시 DLQ 이동
  await channel.assertQueue(QUEUE, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": DLX,
    },
  });

  // user 이벤트 구독
  for (const routingKey of routingKeys) {
    await channel.bindQueue(QUEUE, EXCHANGE, routingKey);
  }

  // 동시 처리 제한
  channel.prefetch(10);

  // user 이벤트 소비
  channel.consume(QUEUE, async (message) => {
    if (!message) return;

    const routingKey = message.fields.routingKey;

    try {
      const payload = JSON.parse(message.content.toString());

      await handleUserEvent(routingKey, payload);

      // 성공 시 ACK
      channel.ack(message);
      console.log(`[RabbitMQ] processed: ${routingKey}`, payload);
    } catch (err) {
      console.error(`[RabbitMQ] failed: ${routingKey}`, err);

      // 실패 시 재큐잉 없이 DLQ 이동
      channel.nack(message, false, false);
    }
  });

  console.log(`[RabbitMQ] listening queue: ${QUEUE}`);
}

module.exports = {
  startUserEventConsumer,
};
const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

const channels = {};

/**
 * Exchange별 RabbitMQ 채널 조회
 * 최초 호출 시 채널과 Exchange를 생성하고,
 * 이후에는 캐시된 채널을 재사용한다.
 */
async function getChannel(exchange) {
  if (channels[exchange]) return channels[exchange];

  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, "topic", { durable: true });

  channels[exchange] = channel;
  return channel;
}

/**
 * 공통 이벤트 발행
 */
async function publishEvent(exchange, routingKey, payload) {
  const ch = await getChannel(exchange);

  ch.publish(
    exchange,
    routingKey,
    Buffer.from(JSON.stringify({
      event: routingKey,
      payload,
      occurred_at: new Date().toISOString(),
    })),
    { persistent: true, contentType: "application/json" }
  );

  console.log(`[RabbitMQ] published: ${exchange}:${routingKey}`, payload);
}

module.exports = { publishEvent };

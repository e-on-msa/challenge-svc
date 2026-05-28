const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const EXCHANGE = process.env.CHALLENGE_EVENT_EXCHANGE || "challenge.event";

let connection;
let channel;

/**
 * RabbitMQ 채널 생성
 * 최초 호출 시 연결 생성 후 재사용
 */
async function getChannel() {
  if (channel) return channel;

  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE, "topic", {
    durable: true,
  });

  return channel;
}

/**
 * 공통 챌린지 이벤트 발행
 */
async function publishChallengeEvent(routingKey, payload) {
  const ch = await getChannel();

  const eventPayload = {
    event: routingKey,
    payload,
    occurred_at: new Date().toISOString(),
  };

  ch.publish(
    EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(eventPayload)),
    {
      persistent: true,
      contentType: "application/json",
    }
  );

  console.log(`[RabbitMQ] published: ${routingKey}`, payload);
}

/**
 * 챌린지 엔티티를 이벤트 전송용 payload로 변환
 * (관심사/진로희망 포함)
 */
async function toChallengePayload(challenge) {
  const full =
    typeof challenge.reload === "function"
      ? await challenge.reload({
          include: [
            { association: "interests", through: { attributes: [] } },
            { association: "visions", through: { attributes: [] }},
          ],
        })
      : challenge;

  const json =
    typeof full.toJSON === "function"
      ? full.toJSON()
      : full;

  return {
    challenge_id: json.challenge_id,
    user_id: json.user_id,
    title: json.title,
    description: json.description,
    minimum_age: json.minimum_age,
    maximum_age: json.maximum_age,
    maximum_people: json.maximum_people,
    application_deadline: json.application_deadline,
    start_date: json.start_date,
    end_date: json.end_date,
    challenge_state: json.challenge_state,
    status: json.status,
    interest_ids: json.interests?.map((i) => i.interest_id) || [],
    interest_names: json.interests?.map((i) => i.interest_detail) || [],
    vision_ids: json.visions?.map((v) => v.vision_id) || [],
    vision_names: json.visions?.map((v) => v.vision_detail) || [],
  };
}

/**
 * 챌린지 생성 이벤트 발행
 */
async function publishChallengeCreated(challenge) {
  const payload = await toChallengePayload(challenge);

  await publishChallengeEvent(
    "challenge.created",
    payload
  );
}

/**
 * 챌린지 수정 이벤트 발행
 */
async function publishChallengeUpdated(challenge) {
  const payload = await toChallengePayload(challenge);

  await publishChallengeEvent(
    "challenge.updated",
    payload
  );
}

/**
 * 챌린지 삭제 이벤트 발행
 */
async function publishChallengeDeleted(challenge) {
  await publishChallengeEvent("challenge.deleted", {
    challenge_id: challenge.challenge_id,
    user_id: challenge.user_id,
  });
}

/**
 * 챌린지 참여 신청 이벤트 발행
 */
async function publishChallengeParticipationCreated(participation) {
  await publishChallengeEvent("challenge.participation.created", {
    challenge_id: participation.challenge_id,
    user_id: participation.user_id,
    participating_id: participation.participating_id,
    participating_state: participation.participating_state,
  });
}

module.exports = {
  publishChallengeCreated,
  publishChallengeUpdated,
  publishChallengeDeleted,
  publishChallengeParticipationCreated,
};
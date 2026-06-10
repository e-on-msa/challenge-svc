const { publishEvent } = require("./rabbitPublisher");

const EXCHANGE = process.env.CHALLENGE_EVENT_EXCHANGE || "eon.events";

/**
 * 챌린지 이벤트 발행 공통 함수
 */
async function publishChallengeEvent(routingKey, payload) {
  await publishEvent(EXCHANGE, routingKey, payload);
}

/**
 * 챌린지 엔티티를 이벤트 Payload 형태로 변환
 *
 * 관심사/진로희망 태그를 함께 포함하여
 * 이벤트 구독 서비스가 추가 조회 없이 사용 가능하도록 구성
 */
async function toChallengePayload(challenge) {
  const full =
    typeof challenge.reload === "function"
      ? await challenge.reload({
          include: [
            { association: "interests", through: { attributes: [] } },
            { association: "visions", through: { attributes: [] } },
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

    // 관심사
    interest_ids: json.interests?.map((i) => i.interest_id) || [],
    interest_names: json.interests?.map((i) => i.interest_detail) || [],

    // 진로희망
    vision_ids: json.visions?.map((v) => v.vision_id) || [],
    vision_names: json.visions?.map((v) => v.vision_detail) || [],
  };
}

async function publishChallengeCreated(challenge) {
  const payload = await toChallengePayload(challenge);
  await publishChallengeEvent("challenge.created", payload);
}

async function publishChallengeApproved(challenge) {
  const payload = await toChallengePayload(challenge);
  await publishChallengeEvent("challenge.approved", payload);
}

async function publishChallengeUpdated(challenge) {
  const payload = await toChallengePayload(challenge);
  await publishChallengeEvent("challenge.updated", payload);
}

async function publishChallengeStateUpdated(challenge, previousState) {
  const payload = await toChallengePayload(challenge);
  await publishChallengeEvent("challenge.state.updated", {
    ...payload,
    previous_state: previousState,
    current_state: challenge.challenge_state,
  });
}

async function publishChallengeDeleted(challenge) {
  await publishChallengeEvent("challenge.deleted", {
    challenge_id: challenge.challenge_id,
    user_id: challenge.user_id,
  });
}

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
  publishChallengeApproved,
  publishChallengeUpdated,
  publishChallengeStateUpdated,
  publishChallengeDeleted,
  publishChallengeParticipationCreated,
};

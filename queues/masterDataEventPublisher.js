/**
 * 관심사/진로희망 마스터 데이터 이벤트 발행
 */

const { publishEvent } = require("./rabbitPublisher");

const EXCHANGE = process.env.MASTER_DATA_EVENT_EXCHANGE || "master-data.events";

async function publishInterestCreated(interest, categoryName) {
  await publishEvent(EXCHANGE, "interest.created", {
    interest_id: Number(interest.interest_id),
    interest_detail: interest.interest_detail,
    category_name: categoryName,
  });
}

async function publishInterestUpdated(interest, categoryName) {
  await publishEvent(EXCHANGE, "interest.updated", {
    interest_id: Number(interest.interest_id),
    interest_detail: interest.interest_detail,
    category_name: categoryName,
  });
}

async function publishInterestDeleted(interestId) {
  await publishEvent(EXCHANGE, "interest.deleted", {
    interest_id: Number(interestId),
  });
}

async function publishVisionCreated(vision, categoryName) {
  await publishEvent(EXCHANGE, "vision.created", {
    vision_id: Number(vision.vision_id),
    vision_detail: vision.vision_detail,
    category_name: categoryName,
  });
}

async function publishVisionUpdated(vision, categoryName) {
  await publishEvent(EXCHANGE, "vision.updated", {
    vision_id: Number(vision.vision_id),
    vision_detail: vision.vision_detail,
    category_name: categoryName,
  });
}

async function publishVisionDeleted(visionId) {
  await publishEvent(EXCHANGE, "vision.deleted", {
    vision_id: Number(visionId),
  });
}

module.exports = {
  publishInterestCreated,
  publishInterestUpdated,
  publishInterestDeleted,
  publishVisionCreated,
  publishVisionUpdated,
  publishVisionDeleted,
};

const redis = require("../config/redis");

const getKey = (userId) => `user:${userId}:challenge_status`;

async function saveUserSuspended({ user_id, banned_until }) {
  const key = getKey(user_id);

  await redis.hset(key, {
    is_challenge_create_restricted: "true",
    banned_until: banned_until ?? "",
  });
}

async function saveUserUnsuspended({ user_id }) {
  const key = getKey(user_id);

  await redis.hset(key, {
    is_challenge_create_restricted: "false",
    banned_until: "",
  });
}

async function saveUserJoinRestricted({ user_id, banned_until }) {
  const key = getKey(user_id);

  await redis.hset(key, {
    is_challenge_join_restricted: "true",
    join_banned_until: banned_until ?? "",
  });
}

async function saveUserJoinUnrestricted({ user_id }) {
  const key = getKey(user_id);

  await redis.hset(key, {
    is_challenge_join_restricted: "false",
    join_banned_until: "",
  });
}

async function getUserChallengeStatus(userId) {
  const status = await redis.hgetall(getKey(userId));

  if (!status || Object.keys(status).length === 0) {
    return {
      isChallengeCreateRestricted: false,
      isChallengeJoinRestricted: false,
      bannedUntil: null,
      joinBannedUntil: null,
    };
  }

  return {
    isChallengeCreateRestricted:
      status.is_challenge_create_restricted === "true",
    isChallengeJoinRestricted:
      status.is_challenge_join_restricted === "true",
    bannedUntil: status.banned_until || null,
    joinBannedUntil: status.join_banned_until || null,
  };
}

async function assertCanJoinChallenge(userId) {
  const status = await getUserChallengeStatus(userId);

  if (status.isChallengeJoinRestricted) {
    const error = new Error("참여가 제한된 사용자는 챌린지에 참여할 수 없습니다.");
    error.statusCode = 403;
    throw error;
  }
}

async function assertCanCreateChallenge(userId) {
  const status = await getUserChallengeStatus(userId);

  if (status.isChallengeCreateRestricted) {
    const error = new Error("정지된 사용자는 챌린지를 개설할 수 없습니다.");
    error.statusCode = 403;
    throw error;
  }
}

module.exports = {
  saveUserSuspended,
  saveUserUnsuspended,
  saveUserJoinRestricted,
  saveUserJoinUnrestricted,
  getUserChallengeStatus,
  assertCanJoinChallenge,
  assertCanCreateChallenge,
};
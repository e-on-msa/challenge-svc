/**
 * 사용자 상태 저장/조회 및 챌린지 참여·개설 검증 담당
 *
 * 역할
 * - user 이벤트 기반 사용자 상태 Redis 저장
 * - 사용자 상태 조회
 * - 챌린지 참여/개설 가능 여부 검증
 *
 * 이벤트 수신은 userEventConsumer에서 담당
 */
const redis = require("../config/redis");

/**
 * 사용자 챌린지 상태 Redis Key 생성
 * 예: user:1:challenge_status
 */
const getKey = (userId) => `user:${userId}:challenge_status`;

/**
 * user.suspended 이벤트 처리
 * → 챌린지 개설 제한 상태 저장
 */
async function saveUserSuspended({ user_id, banned_until }) {
  const key = getKey(user_id);

  await redis.hSet(key, {
    is_challenge_create_restricted: "true",
    banned_until: banned_until ?? "",
  });
}

/**
 * user.unsuspended 이벤트 처리
 * → 챌린지 개설 제한 해제
 */
async function saveUserUnsuspended({ user_id }) {
  const key = getKey(user_id);

  await redis.hSet(key, {
    is_challenge_create_restricted: "false",
    banned_until: "",
  });
}

/**
 * user.join-restricted 이벤트 처리
 * → 챌린지 참여 제한 상태 저장
 */
async function saveUserJoinRestricted({ user_id, banned_until }) {
  const key = getKey(user_id);

  await redis.hSet(key, {
    is_challenge_join_restricted: "true",
    join_banned_until: banned_until ?? "",
  });
}

/**
 * user.join-unrestricted 이벤트 처리
 * → 챌린지 참여 제한 해제
 */
async function saveUserJoinUnrestricted({ user_id }) {
  const key = getKey(user_id);

  await redis.hSet(key, {
    is_challenge_join_restricted: "false",
    join_banned_until: "",
  });
}

/**
 * Redis에 저장된 사용자 상태 조회
 */
async function getUserChallengeStatus(userId) {
  const status = await redis.hGetAll(getKey(userId));

  // 상태 정보 없으면 기본값 반환
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

/**
 * 챌린지 개설 가능 여부 검증
 * (user.suspended 상태 확인)
 */
async function assertCanCreateChallenge(userId) {
  const status = await getUserChallengeStatus(userId);

  if (status.isChallengeCreateRestricted) {
    const error = new Error("정지된 사용자는 챌린지를 개설할 수 없습니다.");
    error.statusCode = 403;
    throw error;
  }
}

/**
 * 챌린지 참여 가능 여부 검증
 * (user.join-restricted 상태 확인)
 */
async function assertCanJoinChallenge(userId) {
  const status = await getUserChallengeStatus(userId);

  if (status.isChallengeJoinRestricted) {
    const error = new Error("참여가 제한된 사용자는 챌린지에 참여할 수 없습니다.");
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
  assertCanCreateChallenge,
  assertCanJoinChallenge,
};
const {
  assertCanJoinChallenge,
} = require("../services/userChallengeStatusService");
const {
  publishChallengeParticipationCreated,
} = require("../queues/challengeEventPublisher");

// 수정해도 됨!!
/* 
user.event 구독으로 저장된 사용자 상태 기반 참여 가능 여부 검증 및
challenge.participation.created 이벤트 발행 포함한
챌린지 참여 예시:
exports.join = async (req, res, next) => {
  try {
    const challengeId = req.params.id;
    const userId = req.body.user_id;

    // user.event 구독으로 Redis에 저장된 
    // 사용자 상태 기반 참여 가능 여부 검증
    await assertCanJoinChallenge(userId);

    // 중복 신청 방지
    let exists = await ParticipatingChallenge.findOne({
      where: {
        challenge_id: challengeId,
        user_id: userId,
      },
    });

    console.log(
      "참여 존재?",
      exists && exists.participating_state
    );

    if (exists) {
      if (exists.participating_state === "취소") {
        exists.participating_state = "신청";

        await exists.save();

        exists =
          await ParticipatingChallenge.findOne({
            where: {
              challenge_id: challengeId,
              user_id: userId,
            },
          });

        // challenge.participation.created 이벤트 발행
        try {
          await publishChallengeParticipationCreated(
            exists
          );
        } catch (eventErr) {
          console.error(
            "[RabbitMQ] challenge.participation.created publish failed:",
            eventErr
          );
        }

        return res.status(200).json(exists);
      }

      return res.status(409).json({
        error: "이미 신청한 챌린지",
      });
    }

    const challenge =
      await Challenge.findByPk(challengeId);

    if (!challenge) {
      return res.status(404).json({
        error: "챌린지 없음",
      });
    }

    if (challenge.challenge_state !== "ACTIVE") {
      return res.status(400).json({
        error: "모집중이 아닙니다.",
      });
    }

    const row =
      await ParticipatingChallenge.create({
        challenge_id: challengeId,
        user_id: userId,
        participating_state: "신청",
      });

    // challenge.participation.created 이벤트 발행
    try {
      await publishChallengeParticipationCreated(
        row
      );
    } catch (eventErr) {
      console.error(
        "[RabbitMQ] challenge.participation.created publish failed:",
        eventErr
      );
    }

    return res.status(201).json(row);
  } catch (err) {
    next(err);
  }
}; */
const { Op } = require("sequelize");
const { Challenge, ParticipatingChallenge } = require("../models");
const { assertCanJoinChallenge } = require("../services/userChallengeStatusService");
const { publishChallengeParticipationCreated } = require("../queues/challengeEventPublisher");


/**
 * [POST] /api/participations
 * 챌린지 참여 신청
 */
exports.join = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { challenge_id } = req.body;

    if (!challenge_id) {
      return res.status(400).json({ error: "challenge_id는 필수입니다." });
    }

    // user.events 구독으로 Redis에 저장된 
    // 사용자 상태 기반 참여 가능 여부 검증
    await assertCanJoinChallenge(userId);

    const challenge = await Challenge.findByPk(challenge_id);

    if (!challenge) {
      return res.status(404).json({ error: "챌린지를 찾을 수 없습니다." });
    }

    if (challenge.status !== "APPROVED") {
      return res.status(400).json({ error: "승인되지 않은 챌린지입니다." });
    }

    if (challenge.challenge_state !== "ACTIVE") {
      return res.status(400).json({ error: "모집 중인 챌린지가 아닙니다." });
    }

    if (new Date(challenge.application_deadline) < new Date()) {
      return res.status(400).json({ error: "참여 신청 기간이 마감되었습니다." });
    }

    const existing = await ParticipatingChallenge.findOne({
      where: {
        challenge_id,
        user_id: userId,
        participating_state: { [Op.ne]: "취소" },
      },
    });

    if (existing) {
      return res.status(409).json({ error: "이미 참여 신청한 챌린지입니다." });
    }

    const activeCount = await ParticipatingChallenge.count({
      where: {
        challenge_id,
        participating_state: { [Op.in]: ["신청", "진행 중"] },
      },
    });

    if (activeCount >= challenge.maximum_people) {
      return res.status(400).json({ error: "참여 인원이 초과되었습니다." });
    }

    const cancelled = await ParticipatingChallenge.findOne({
      where: { challenge_id, user_id: userId, participating_state: "취소" },
    });

    let participation;
    if (cancelled) {
      cancelled.participating_state = "신청";
      await cancelled.save();
      participation = cancelled;
    } else {
      participation = await ParticipatingChallenge.create({
        challenge_id,
        user_id: userId,
        participating_state: "신청",
      });
    }

    // challenge.participation.created 이벤트 발행
    try {
        await publishChallengeParticipationCreated(participation);
    } catch (eventErr) {
        console.error("[RabbitMQ] challenge.participation.created publish failed:", eventErr);
    }

    res.status(201).json(participation);
  } catch (err) {
    next(err);
  }
};

/**
 * [PATCH] /api/participations/:id/cancel
 * 챌린지 참여 취소
 */
exports.cancel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const participation = await ParticipatingChallenge.findByPk(id);

    if (!participation) {
      return res.status(404).json({ error: "참여 기록을 찾을 수 없습니다." });
    }

    if (participation.user_id !== userId) {
      return res.status(403).json({ error: "취소 권한이 없습니다." });
    }

    if (participation.participating_state === "취소") {
      return res.status(400).json({ error: "이미 취소된 참여입니다." });
    }

    if (participation.participating_state === "완료") {
      return res.status(400).json({ error: "완료된 참여는 취소할 수 없습니다." });
    }

    participation.participating_state = "취소";
    await participation.save();

    res.status(200).json(participation);
  } catch (err) {
    next(err);
  }
};

/**
 * [GET] /api/participations/:id
 * 참여 기록 단건 조회
 */
exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const participation = await ParticipatingChallenge.findByPk(id);

    if (!participation) {
      return res.status(404).json({ error: "참여 기록을 찾을 수 없습니다." });
    }

    if (participation.user_id !== userId) {
      return res.status(403).json({ error: "조회 권한이 없습니다." });
    }

    res.status(200).json(participation);
  } catch (err) {
    next(err);
  }
};

/**
 * [GET] /api/participations
 * 유저별 챌린지 참여 상태 조회
 */
exports.listByUser = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { challenge_id, state } = req.query;

    const where = { user_id: userId };

    if (challenge_id) {
      where.challenge_id = Number(challenge_id);
    }

    if (state) {
      where.participating_state = state;
    }

    const participations = await ParticipatingChallenge.findAll({
      where,
      order: [["participating_id", "DESC"]],
    });

    res.status(200).json(participations);
  } catch (err) {
    next(err);
  }
};
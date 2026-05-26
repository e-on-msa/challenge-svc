const { getUsersByIds } = require("../services/userServiceClient");
const {
  Challenge,
  ChallengeDay,
  Attachment,
  Interests,
  Visions,
} = require("../models");

/**
 * [GET] /api/admin/challenges
 * 승인 대기 중인 챌린지 목록 조회 (마감 임박순)
 */
exports.listPending = async (req, res, next) => {
  try {
    const challenges = await Challenge.findAll({
      where: { status: "PENDING" },
      order: [["application_deadline", "ASC"]],
    });

    res.status(200).json({
      challenges,
    });
  } catch (err) {
    next(err);
  }
};

// TODO: user-svc 연동 후 확인 필요
/**
 * [GET] /api/admin/challenges/:id
 * 관리자용 챌린지 상세 조회 (모든 상태)
 */
exports.detail = async (req, res, next) => {
  try {
    const { id } = req.params;

    // status 필터 없이 모든 상태의 챌린지를 조회
    const challenge = await Challenge.findOne({
      where: { challenge_id: id },
      include: [
        { model: ChallengeDay, as: "days", attributes: ["day_of_week"] },
        { model: Attachment, as: "attachments", attributes: ["attachment_id", "url", "attachment_type"] },
        { model: Interests, as: "interests", through: { attributes: [] }, attributes: ["interest_id", "interest_detail"] },
        { model: Visions, as: "visions", through: { attributes: [] }, attributes: ["vision_id", "vision_detail"] },
      ],
    });

    if (!challenge) {
      return res.status(404).json({ error: "챌린지를 찾을 수 없습니다." });
    }
    
    let creator = null;

    try {
      const users =
        await getUsersByIds([
          challenge.user_id,
        ]);
      creator = users[ challenge.user_id ] ?? null;
    } catch (err) {
      console.warn("[user-svc]", err.message);
    }

    res.status(200).json({
      challenge_id: challenge.challenge_id,
      title: challenge.title,
      description: challenge.description,
      creator: creator
        ? {
            user_id: creator.user_id,
            name: creator.name,
            email: creator.email,
          }
        : {
            user_id: challenge.user_id,
            name: null,
            email: null,
          },
      creator_contact: challenge.creator_contact,
      age_range: `${challenge.minimum_age} ~ ${challenge.maximum_age}`,
      maximum_people: challenge.maximum_people,
      application_deadline: challenge.application_deadline,
      duration: {
        start: challenge.start_date,
        end: challenge.end_date,
      },
      is_recurring: challenge.is_recurring,
      repeat_type: challenge.repeat_type,
      intermediate_participation: challenge.intermediate_participation,
      status: challenge.status,
      challenge_state: challenge.challenge_state,
      days: challenge.days.map((d) => d.day_of_week),
      attachments: challenge.attachments,
      interests: challenge.interests,
      visions: challenge.visions,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [PATCH] /api/admin/challenges/:id/approve
 * 챌린지 승인 처리
 */
exports.approve = async (req, res, next) => {
  try {
    const { id } = req.params;

    const challenge = await Challenge.findByPk(id, {
      attributes: [
        "challenge_id",
        "title",
        "status",
      ],
    });

    if (!challenge) {
      return res.status(404).json({ error: "챌린지를 찾을 수 없습니다." });
    }

    if (challenge.status !== "PENDING") {
      return res.status(409).json({ error: "승인 대기 상태의 챌린지만 승인할 수 있습니다." });
    }

    challenge.status = "APPROVED";

    await challenge.save();

    res.status(200).json({
      message: "챌린지가 승인되었습니다.",
      challenge_id: challenge.challenge_id,
      status: challenge.status,
    });

  } catch (err) {
    next(err);
  }
};

/**
 * [PATCH] /api/admin/challenges/:id/reject
 * 챌린지 거절
 */
exports.reject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
      return res.status(404).json({ error: "챌린지를 찾을 수 없습니다." });
    }

    if (challenge.status !== "PENDING") {
      return res.status(409).json({ error: "승인 대기 상태의 챌린지만 거절할 수 있습니다." });
    }

    challenge.status = "REJECTED";

    await challenge.save();

    res.status(200).json({
      message: "챌린지가 거절되었습니다.",
      challenge_id: challenge.challenge_id,
      status: challenge.status,
    });

  } catch (err) {
    next(err);
  }
};
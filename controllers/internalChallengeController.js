const { Op, fn, col } = require("sequelize");

const {
  Challenge,
  Interests,
  Visions,
  ParticipatingChallenge,
  Review,
} = require("../models");

/**
 * [GET] /internal/participations/user/:userId
 * 추천 서비스용 사용자 챌린지 활동 조회
 */
exports.getUserChallengeActivity = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ error: "유효하지 않은 사용자 ID입니다." });
    }

    const participatedRows = await ParticipatingChallenge.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: Challenge,
          as: "Challenge",
          attributes: ["challenge_id", "title", "description"],
        },
      ],
      order: [["participating_id", "DESC"]],
    });

    const createdRows = await Challenge.findAll({
      where: {
        user_id: userId,
      },
      attributes: ["challenge_id", "title", "description", "challenge_state"],
      order: [["challenge_id", "DESC"]],
    });

    const participated = participatedRows.map((row) => ({
      challenge_id: row.challenge?.challenge_id,
      title: row.challenge?.title,
      description: row.challenge?.description,
      participating_state: row.participating_state,
    }));

    const created = createdRows.map((challenge) => ({
      challenge_id: challenge.challenge_id,
      title: challenge.title,
      description: challenge.description,
      challenge_state: challenge.challenge_state,
    }));

    return res.status(200).json({
      participated,
      created,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [GET] /internal/challenges/active-with-categories
 * 추천 서비스용 활성 챌린지 내부 조회
 */
exports.getActiveWithCategories = async (req, res, next) => {
  try {
    const challenges = await Challenge.findAll({
      where: {
        status: "APPROVED",
        challenge_state: "ACTIVE",
        [Op.or]: [
          { application_deadline: null },
          { application_deadline: { [Op.gte]: new Date() } },
        ],
      },
      include: [
        { model: Interests, as: "interests", through: { attributes: [] }, attributes: ["interest_id"] },
        { model: Visions, as: "visions", through: { attributes: [] }, attributes: ["vision_id"] },
      ],
      order: [["challenge_id", "DESC"]],
    });

    if (challenges.length === 0) {
        return res.status(200).json({ count: 0, challenges: [] });
    }

    const challengeIds = challenges.map((challenge) => challenge.challenge_id);

    // 참여자 수 group 집계
    const participantRows = await ParticipatingChallenge.findAll({
        attributes: [
            "challenge_id",
            [ fn("COUNT", col("challenge_id")), "participant_count" ],
        ],
        where: {
            challenge_id: { [Op.in]: challengeIds },
            participating_state: { [Op.in]: ["신청", "진행 중"] },
        },
        group: ["challenge_id"],
        raw: true,
    });

    // 평균 평점 group 집계
    const ratingRows = await Review.findAll({
        attributes: [
            "challenge_id",
            [ fn("AVG", col("rating_stars")), "avg_rating" ],
        ],
        where: {
            challenge_id: { [Op.in]: challengeIds },
        },
        group: ["challenge_id"],
        raw: true,
    });

    // Map으로 매핑
    const participantMap = new Map(
        participantRows.map((row) => [
            Number(row.challenge_id),
            Number(row.participant_count),
        ])
    );

    const ratingMap = new Map(
        ratingRows.map((row) => [
            Number(row.challenge_id),
            Number(row.avg_rating) || 0,
        ])
    );

    // interest_ids / vision_ids 포함 응답
    const result = challenges.map((challenge) => {
        const participantCount =
            participantMap.get(challenge.challenge_id) || 0;

        const avgRating =
            ratingMap.get(challenge.challenge_id) || 0;

        return {
          challenge_id: challenge.challenge_id,
          title: challenge.title,
          description: challenge.description,

          minimum_age: challenge.minimum_age,
          maximum_age: challenge.maximum_age,

          participant_count: participantCount,
          avg_rating: avgRating,

          interest_ids:
            challenge.interests?.map((interest) => interest.interest_id) || [],

          vision_ids:
            challenge.visions?.map((vision) => vision.vision_id) || [],

          challenge_state: challenge.challenge_state,
          status: challenge.status,
          application_deadline: challenge.application_deadline,
          start_date: challenge.start_date,
          end_date: challenge.end_date,
        };
    });

    return res.status(200).json({
      count: result.length,
      challenges: result,
    });
  } catch (err) {
    next(err);
  }
};
const { Op, fn, col } = require("sequelize");

const {
  Challenge,
  Interests,
  Visions,
  ParticipatingChallenge,
  Review,
} = require("../models");

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

    const result = await Promise.all(
      challenges.map(async (challenge) => {
        const participantCount = await ParticipatingChallenge.count({
          where: {
            challenge_id: challenge.challenge_id,
            participating_state: {
              [Op.in]: ["신청", "진행 중"],
            },
          },
        });

        const avgRatingRow = await Review.findOne({
          attributes: [[fn("AVG", col("rating_stars")), "avg_rating"]],
          where: {
            challenge_id: challenge.challenge_id,
          },
          raw: true,
        });

        return {
          challenge_id: challenge.challenge_id,
          title: challenge.title,
          description: challenge.description,

          minimum_age: challenge.minimum_age,
          maximum_age: challenge.maximum_age,

          participant_count: participantCount,
          avg_rating: Number(avgRatingRow?.avg_rating) || 0,

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
      })
    );

    return res.status(200).json({
      count: result.length,
      challenges: result,
    });
  } catch (err) {
    next(err);
  }
};
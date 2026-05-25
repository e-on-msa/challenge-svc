const { Review, Challenge } = require("../models");

/**
 * [POST] /api/challenges/:id/reviews
 * 리뷰 작성
 */
exports.create = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const { rating_stars, text } = req.body;

    if (rating_stars === undefined || text === undefined) {
      return res.status(400).json({ error: "rating_stars와 text는 필수입니다." });
    }

    if (rating_stars < 1 || rating_stars > 5) {
      return res.status(400).json({ error: "rating_stars는 1~5 사이여야 합니다." });
    }

    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
      return res.status(404).json({ error: "챌린지를 찾을 수 없습니다." });
    }

    // 한 사용자가 챌린지별 중복 리뷰 작성 불가
    const duplicated = await Review.findOne({
      where: {
        challenge_id: id,
        user_id: userId,
      },
    });

    if (duplicated) {
      return res.status(409).json({ error: "이미 리뷰를 작성했습니다." });
    }

    const review = await Review.create({
      challenge_id: id,
      user_id: userId,
      rating_stars,
      text,
    });

    res.status(201).json({
      message: "리뷰가 작성되었습니다.",
      review,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [GET] /api/challenges/:id/reviews
 * 리뷰 목록 조회
 */
exports.list = async (req, res, next) => {
  try {
    const { id } = req.params;

    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
      return res.status(404).json({ error: "챌린지를 찾을 수 없습니다." });
    }

    const reviews = await Review.findAll({
      where: {
        challenge_id: id,
      },
      attributes: [
        "review_id",
        "user_id",
        "rating_stars",
        "text",
        "is_edited",
        "review_date",
      ],
      order: [["review_date", "DESC"]],
    });

    // TODO: 확인 필요
    // user-svc에서 user_id와 name 가져오기
    const userIds = [...new Set(reviews.map((review) => review.user_id))];

    const userMap = await getUsersByIds(userIds);

    const result = reviews.map((review) => {
      const json = review.toJSON();
      const writer = userMap[json.user_id];

      return {
        ...json,
        writer: writer
          ? {
              user_id: writer.user_id,
              name: writer.name,
            }
          : {
              user_id: json.user_id,
              name: null,
            },
      };
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * [PATCH] /api/reviews/:id
 * 리뷰 수정
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const loginUserId = req.user.user_id;
    const { rating_stars, text } = req.body;

    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ error: "리뷰를 찾을 수 없습니다." });
    }

    if (review.user_id !== loginUserId) {
      return res.status(403).json({ error: "리뷰 수정 권한이 없습니다." });
    }

    if (rating_stars !== undefined) {
      if (rating_stars < 1 || rating_stars > 5) {
        return res.status(400).json({ error: "rating_stars는 1~5 사이여야 합니다." });
      }

      review.rating_stars = rating_stars;
    }

    if (text !== undefined) {
      review.text = text;
    }

    review.is_edited = true;
    review.review_date = new Date();

    await review.save();

    res.status(200).json({
      message: "리뷰가 수정되었습니다.",
      review,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [DELETE] /api/reviews/:id
 * 리뷰 삭제
 */
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const loginUserId = req.user.user_id;

    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ error: "리뷰를 찾을 수 없습니다." });
    }

    if (review.user_id !== loginUserId) {
      return res.status(403).json({ error: "리뷰 삭제 권한이 없습니다." });
    }

    await review.destroy();

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
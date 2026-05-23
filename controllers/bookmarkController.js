const { Bookmark, Challenge } = require("../models");

/**
 * [POST] /api/challenges/:id/bookmarks
 * 북마크 추가
 */
exports.add = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
      return res.status(404).json({
        error: "챌린지를 찾을 수 없습니다.",
      });
    }

    const [bookmark, created] =
      await Bookmark.findOrCreate({
        where: {
          challenge_id: id,
          user_id: userId,
        },
      });

    if (!created) {
      return res.status(409).json({
        error: "이미 북마크한 챌린지입니다.",
      });
    }

    res.status(201).json({
      message: "북마크가 추가되었습니다.",
      bookmark_id: bookmark.bookmark_id,
    });

  } catch (err) {
    next(err);
  }
};

/**
 * [DELETE] /api/challenges/:id/bookmarks
 * 북마크 해제
 */
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const deletedCount = await Bookmark.destroy({
      where: {
        challenge_id: id,
        user_id: userId,
      },
    });

    if (!deletedCount) {
      return res.status(404).json({
        error: "북마크가 존재하지 않습니다.",
      });
    }

    res.status(204).send();

  } catch (err) {
    next(err);
  }
};
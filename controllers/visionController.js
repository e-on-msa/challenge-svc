const { Visions } = require("../models");

/**
 * [GET] /api/visions
 * 비전 전체 조회
*/
exports.getAll = async (req, res, next) => {
  try {
    const visions = await Visions.findAll({
      attributes: [
        ["vision_id", "id"],
        ["vision_detail", "name"],
      ],
      order: [["vision_id", "ASC"]],
    });

    res.status(200).json(visions);
  } catch (err) {
    next(err);
  }
};
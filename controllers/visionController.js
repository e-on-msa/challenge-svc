const { VisionCategory, Visions } = require("../models");

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

/**
 * [GET] /api/visions/categories
 * 비전 카테고리 목록 조회
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await VisionCategory.findAll({
      attributes: ["category_code", "category_name"],
      order: [["category_code", "ASC"]],
    });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [GET] /api/visions/list/:categoryCode
 * 특정 카테고리 세부 진로희망 조회
 */
exports.getList = async (req, res, next) => {
  try {
    const { categoryCode } = req.params;
    const category = await VisionCategory.findByPk(categoryCode);
    if (!category) {
      return res.status(404).json({
        message: "존재하지 않는 진로희망 카테고리입니다.",
      });
    }

    const visions = await Visions.findAll({
      where: {
        category_code: categoryCode,
      },
      attributes: [
        ["vision_id", "id"],
        ["vision_detail", "name"],
      ],
      order: [["vision_id", "ASC"]],
    });

    res.status(200).json({
      success: true,
      visions,
    });
  } catch (err) {
    next(err);
  }
};
const { InterestCategory, Interests } = require("../models");

/**
 * [GET] /api/interests
 * 관심사 전체 조회
 */
exports.getAll = async (req, res, next) => {
  try {
    const interests = await Interests.findAll({
      attributes: [
        ["interest_id", "id"],
        ["interest_detail", "name"],
      ],
      order: [["interest_id", "ASC"]],
    });

    res.status(200).json(interests);
  } catch (err) {
    next(err);
  }
};

/**
 * [GET] /api/interests/categories
 * 관심사 카테고리 목록 조회
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await InterestCategory.findAll({
      attributes: ["category_code", "category_name"],
      order: [["category_code", "ASC"]],
    });

    res.status(200).json({
      success: true,
      categories
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [GET] /api/interests/list/:categoryCode
 * 특정 카테고리 세부 관심사 조회
 */
exports.getList = async (req, res, next) => {
  try {
    const { categoryCode } = req.params;
    const category = await InterestCategory.findByPk(categoryCode);
    if (!category) {
      return res
        .status(404)
        .json({message:"존재하지 않는 관심사 카테고리입니다."});
    }

    const interests = await Interests.findAll({
      where: {
        category_code: req.params.categoryCode,
      },
      attributes: [
        ["interest_id", "id"],
        ["interest_detail", "name"],
      ],
      order: [["interest_id", "ASC"]],
    });

    res.status(200).json({
      success: true,
      interests,
    });
  } catch (err) {
    next(err);
  }
};
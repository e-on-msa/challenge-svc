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

    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

/**
 * [GET] /api/interests/categories/:categoryCode
 * 카테고리별 관심사 조회
 */
exports.getList = async (req, res, next) => {
  try {
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

    res.status(200).json(interests);
  } catch (err) {
    next(err);
  }
};
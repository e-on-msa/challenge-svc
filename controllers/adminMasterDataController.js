const { Interests, InterestCategory, Visions, VisionCategory } = require("../models");
const {
  publishInterestCreated,
  publishInterestUpdated,
  publishInterestDeleted,
  publishVisionCreated,
  publishVisionUpdated,
  publishVisionDeleted,
} = require("../queues/masterDataEventPublisher");

/**
 * 관심사 생성
 * - 원본 데이터 저장
 * - user-svc 동기화를 위한 이벤트 발행
 */
exports.createInterest = async (req, res, next) => {
  try {
    const { interest_detail, category_code } = req.body;

    if (!interest_detail || !category_code) {
      return res.status(400).json({ message: "interest_detail, category_code는 필수입니다." });
    }

    const category = await InterestCategory.findByPk(category_code);
    if (!category) {
      return res.status(404).json({ message: "존재하지 않는 카테고리입니다." });
    }

    const interest = await Interests.create({ interest_detail, category_code });

    // 관심사 생성 이벤트 발행
    await publishInterestCreated(interest, category.category_name);

    return res.status(201).json({ interest_id: Number(interest.interest_id) });
  } catch (err) {
    next(err);
  }
};


/**
 * 관심사 수정
 * - 원본 데이터 수정
 * - user-svc 동기화를 위한 이벤트 발행
 */
exports.updateInterest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { interest_detail, category_code } = req.body;

    if (!interest_detail && !category_code) {
      return res.status(400).json({ message: "수정할 항목이 없습니다." });
    }

    const interest = await Interests.findByPk(id);
    if (!interest) {
      return res.status(404).json({ message: "존재하지 않는 관심사입니다." });
    }

    const targetCategoryCode = category_code ?? interest.category_code;
    const category = await InterestCategory.findByPk(targetCategoryCode);
    if (!category) {
      return res.status(404).json({ message: "존재하지 않는 카테고리입니다." });
    }

    await interest.update({
      ...(interest_detail !== undefined && { interest_detail }),
      ...(category_code !== undefined && { category_code }),
    });

    // 관심사 수정 이벤트 발행
    await publishInterestUpdated(interest, category.category_name);

    return res.json({ message: "수정되었습니다." });
  } catch (err) {
    next(err);
  }
};

/**
 * 관심사 삭제
 * - 원본 데이터 삭제
 * - user-svc 동기화를 위한 이벤트 발행
 */
exports.deleteInterest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const interest = await Interests.findByPk(id);
    if (!interest) {
      return res.status(404).json({ message: "존재하지 않는 관심사입니다." });
    }

    await interest.destroy();

    // 관심사 삭제 이벤트 발행
    await publishInterestDeleted(id);

    return res.json({ message: "삭제되었습니다." });
  } catch (err) {
    next(err);
  }
};

/**
 * 진로희망 생성
 * - 원본 데이터 저장
 * - user-svc 동기화를 위한 이벤트 발행
 */
exports.createVision = async (req, res, next) => {
  try {
    const { vision_detail, category_code } = req.body;

    if (!vision_detail || !category_code) {
      return res.status(400).json({ message: "vision_detail, category_code는 필수입니다." });
    }

    const category = await VisionCategory.findByPk(category_code);
    if (!category) {
      return res.status(404).json({ message: "존재하지 않는 카테고리입니다." });
    }

    const vision = await Visions.create({ vision_detail, category_code });

    // 진로희망 생성 이벤트 발행
    await publishVisionCreated(vision, category.category_name);

    return res.status(201).json({ vision_id: Number(vision.vision_id) });
  } catch (err) {
    next(err);
  }
};

/**
 * 진로희망 수정
 * - 원본 데이터 수정
 * - user-svc 동기화를 위한 이벤트 발행
 */
exports.updateVision = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { vision_detail, category_code } = req.body;

    if (!vision_detail && !category_code) {
      return res.status(400).json({ message: "수정할 항목이 없습니다." });
    }

    const vision = await Visions.findByPk(id);
    if (!vision) {
      return res.status(404).json({ message: "존재하지 않는 진로희망입니다." });
    }

    const targetCategoryCode = category_code ?? vision.category_code;
    const category = await VisionCategory.findByPk(targetCategoryCode);
    if (!category) {
      return res.status(404).json({ message: "존재하지 않는 카테고리입니다." });
    }

    await vision.update({
      ...(vision_detail !== undefined && { vision_detail }),
      ...(category_code !== undefined && { category_code }),
    });

    // 진로희망 수정 이벤트 발행
    await publishVisionUpdated(vision, category.category_name);

    return res.json({ message: "수정되었습니다." });
  } catch (err) {
    next(err);
  }
};

/**
 * 진로희망 삭제
 * - 원본 데이터 삭제
 * - user-svc 동기화를 위한 이벤트 발행
 */
exports.deleteVision = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vision = await Visions.findByPk(id);
    if (!vision) {
      return res.status(404).json({ message: "존재하지 않는 진로희망입니다." });
    }

    await vision.destroy();

    // 진로희망 삭제 이벤트 발행
    await publishVisionDeleted(id);

    return res.json({ message: "삭제되었습니다." });
  } catch (err) {
    next(err);
  }
};

/** ---------------- 관심사 카테고리 (InterestCategory) ---------------- **/
/** --- 하위 관심사가 있으면 수정·삭제 차단 → user-svc 이벤트 발행 불필요 --- */

// 관심사 카테고리 생성 (이벤트 발행 불필요)
exports.createInterestCategory = async (req, res, next) => {
  try {
    const { category_code, category_name } = req.body;

    if (!category_code || !category_name) {
      return res.status(400).json({ message: "category_code, category_name은 필수입니다." });
    }

    const exists = await InterestCategory.findByPk(category_code);
    if (exists) {
      return res.status(409).json({ message: "이미 존재하는 카테고리 코드입니다." });
    }

    await InterestCategory.create({ category_code, category_name });

    return res.status(201).json({ category_code });
  } catch (err) {
    next(err);
  }
};

// 관심사 카테고리 수정
exports.updateInterestCategory = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ message: "category_name은 필수입니다." });
    }

    const category = await InterestCategory.findByPk(code);
    if (!category) {
      return res.status(404).json({ message: "존재하지 않는 카테고리입니다." });
    }

    const count = await Interests.count({ where: { category_code: code } });
    if (count > 0) {
      return res.status(409).json({ message: "해당 카테고리에 속한 관심사가 있어 수정할 수 없습니다." });
    }

    await category.update({ category_name });

    return res.json({ message: "수정되었습니다." });
  } catch (err) {
    next(err);
  }
};

// 관심사 카테고리 삭제
exports.deleteInterestCategory = async (req, res, next) => {
  try {
    const { code } = req.params;

    const category = await InterestCategory.findByPk(code);
    if (!category) {
      return res.status(404).json({ message: "존재하지 않는 카테고리입니다." });
    }

    const count = await Interests.count({ where: { category_code: code } });
    if (count > 0) {
      return res.status(409).json({ message: "해당 카테고리에 속한 관심사가 있어 삭제할 수 없습니다." });
    }

    await category.destroy();

    return res.json({ message: "삭제되었습니다." });
  } catch (err) {
    next(err);
  }
};

/** ---------------- 진로희망 카테고리 (VisionCategory) ---------------- **/
/** --- 하위 진로희망이 있으면 수정·삭제 차단 → user-svc 이벤트 발행 불필요 --- */

// 진로희망 카테고리 생성 (이벤트 발행 불필요)
exports.createVisionCategory = async (req, res, next) => {
  try {
    const { category_code, category_name } = req.body;

    if (!category_code || !category_name) {
      return res.status(400).json({ message: "category_code, category_name은 필수입니다." });
    }

    const exists = await VisionCategory.findByPk(category_code);
    if (exists) {
      return res.status(409).json({ message: "이미 존재하는 카테고리 코드입니다." });
    }

    await VisionCategory.create({ category_code, category_name });

    return res.status(201).json({ category_code });
  } catch (err) {
    next(err);
  }
};

// 진로희망 카테고리 수정
exports.updateVisionCategory = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ message: "category_name은 필수입니다." });
    }

    const category = await VisionCategory.findByPk(code);
    if (!category) {
      return res.status(404).json({ message: "존재하지 않는 카테고리입니다." });
    }

    const count = await Visions.count({ where: { category_code: code } });
    if (count > 0) {
      return res.status(409).json({ message: "해당 카테고리에 속한 진로희망이 있어 수정할 수 없습니다." });
    }

    await category.update({ category_name });

    return res.json({ message: "수정되었습니다." });
  } catch (err) {
    next(err);
  }
};

// 진로희망 카테고리 삭제
exports.deleteVisionCategory = async (req, res, next) => {
  try {
    const { code } = req.params;

    const category = await VisionCategory.findByPk(code);
    if (!category) {
      return res.status(404).json({ message: "존재하지 않는 카테고리입니다." });
    }

    const count = await Visions.count({ where: { category_code: code } });
    if (count > 0) {
      return res.status(409).json({ message: "해당 카테고리에 속한 진로희망이 있어 삭제할 수 없습니다." });
    }

    await category.destroy();

    return res.json({ message: "삭제되었습니다." });
  } catch (err) {
    next(err);
  }
};

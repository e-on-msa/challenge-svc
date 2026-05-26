const { Op } = require("sequelize");
const {
  sequelize,
  Challenge,
  ChallengeDay,
  Attachment,
  Bookmark,
  ChallengeInterest,
  ChallengeVision,
  ParticipatingChallenge,
  ParticipatingAttendance,
  Review,
  Interests,
  Visions,
} = require("../models");

/** ---------------- 공용 헬퍼: KST 기준 현재시각 & 자동 마감 ---------------- **/
function nowKST() {
  // 서버 타임존과 무관하게 KST 기준으로 Date 생성
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
}

// 모집 마감일(application_deadline)이 지났는데 still ACTIVE인 챌린지를 CLOSED로 일괄 변경
async function closeExpiredRecruiting() {
  const now = nowKST();
  await Challenge.update(
    { challenge_state: 'CLOSED' },
    {
      where: {
        challenge_state: 'ACTIVE',
        application_deadline: { [Op.lt]: now }
      }
    }
  );
}


/**
 * [POST] /api/challenges
 * 챌린지 생성
 */
exports.create = async (req, res, next) => { 
  
  let body = req.body;

  const filesObj = req.files ?? {};
  const photosArr = filesObj.photos || [];
  const consentsArr = filesObj.consents || [];
  
  try {
    if (req.body.meta) {
      try {
        body = JSON.parse(req.body.meta);
      } catch (e) {
        return res.status(400).json({
          error: "meta JSON 형식이 올바르지 않습니다.",
        });
      }
    }

    const userId = req.user.user_id;
    const userType = req.user.type;

    const {
      title,
      description,
      minimum_age,
      maximum_age,
      maximum_people,
      application_deadline,
      start_date,
      end_date,
      is_recurring = false,
      repeat_type = null,
      intermediate_participation = false,
      creator_contact,
      days = [],
      interestIds = [],
      visionIds = [],
    } = body;

    if (!title || !description || !creator_contact) {
      return res.status(400).json({ error: "필수 필드 누락" });
    }

    // 7일 내 결석 체크 (지자체는 면제)
    const isMunicipality = userType?.toUpperCase() === "MUNICIPALITY";
    if (!isMunicipality) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const hasAbsence = await ParticipatingAttendance.findOne({
        include: [
          {
            model: ParticipatingChallenge,
            as: "participant",
            where: { user_id: userId },
          },
        ],
        where: {
          attendance_state: "결석",
          attendance_date: {
            [Op.gte]: sevenDaysAgo,
          },
        },
      });

      if (hasAbsence) {
        return res.status(403).json({
          error: "최근 7일 이내 결석 기록이 있어 챌린지 개설이 제한됩니다.",
        });
      }
    }

    const challenge = await sequelize.transaction(async (t) => {
      const ch = await Challenge.create(
        {
          title,
          description,
          minimum_age,
          maximum_age,
          maximum_people,
          application_deadline,
          start_date,
          end_date,
          is_recurring,
          repeat_type,
          intermediate_participation,
          creator_contact,
          user_id: userId,
          // 지자체면 즉시 공개, 그 외는 보류
          status: isMunicipality ? "APPROVED" : "PENDING", 
        },
        { transaction: t }
      );

      // 요일 삽입
      if (is_recurring && days.length) {
        await ChallengeDay.bulkCreate(
          days.map((day) => ({
            challenge_id: ch.challenge_id,
            day_of_week: day,
          })),
          { transaction: t }
        );
      }

      // 관심사/비전 매핑
      if (interestIds.length) await ch.addInterests(interestIds, { transaction: t });
      if (visionIds.length) await ch.addVisions(visionIds, { transaction: t });

      // 첨부파일
      const attachRows = [];
      photosArr.forEach((file) => {
        attachRows.push({
          challenge_id: ch.challenge_id,
          attachment_name: file.originalname,
          url: file.location || `/uploads/${file.filename}`,
          attachment_type: "이미지",
        });
      });

      consentsArr.forEach((file) => {
        attachRows.push({
          challenge_id: ch.challenge_id,
          attachment_name: file.originalname,
          url: file.location || `/uploads/${file.filename}`,
          attachment_type: "문서",
        });
      });

      if (attachRows.length) {
        await Attachment.bulkCreate(attachRows, { transaction: t });
      }

      return ch;
    });

    res.status(201).json({
      message: isMunicipality
        ? "챌린지가 개설되어 즉시 공개되었습니다."
        : "챌린지 개설이 신청되었습니다. 관리자 승인 후 공개됩니다.",
      challenge_id: challenge.challenge_id,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [GET] /api/challenges
 * 챌린지 목록 조회
 */
exports.list = async (req, res, next) => {
  try {
    // 목록 요청 시 자동 마감 정리
    await closeExpiredRecruiting();

    const {
      q: keyword = "",
      state,
      date: dateStr,
      minAge,
      maxAge,
      page = 1,
      limit = 20,
      interestId,
      visionId,
    } = req.query;

    const userId = req.user?.user_id;
    const offset = (Number(page) - 1) * Number(limit);

    const where = {
      status: "APPROVED",
    };

    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }

    if (state) where.challenge_state = state;
    
    if (dateStr) {
      const target = new Date(dateStr);

      if (Number.isNaN(target.getTime())) {
        return res.status(400).json({
          error: "유효하지 않은 date 형식입니다.",
        });
      }

      where.start_date = { [Op.lte]: target };
      where.end_date = { [Op.gte]: target };
    }

    if (minAge) {
      where.maximum_age = {
        [Op.gte]: Number(minAge),
      };
    }

    if (maxAge) {
      where.minimum_age = {
        [Op.lte]: Number(maxAge),
      };
    }

    const include = [
      {
        model: ChallengeDay,
        as: "days",
        attributes: ["day_of_week"],
      },
      {
        model: Attachment,
        as: "attachments",
        attributes: ["url"],
      },
      // 관심사
      interestId
        ? {
            model: Interests,
            as: "interests",
            required: true,
            through: {
              where: {
                interest_id: Number(interestId),
              },
              attributes: [],
            },
            attributes: ["interest_id", "interest_detail"],
          }
        : {
            model: Interests,
            as: "interests",
            through: {
              attributes: [],
            },
            attributes: ["interest_id", "interest_detail"],
          },
      // 비전
      visionId
        ? {
            model: Visions,
            as: "visions",
            required: true,
            through: {
              where: {
                vision_id: Number(visionId),
              },
              attributes: [],
            },
            attributes: ["vision_id", "vision_detail"],
          }
        : {
            model: Visions,
            as: "visions",
            through: {
              attributes: [],
            },
            attributes: ["vision_id", "vision_detail"],
          },
    ];

    const { count, rows } =
      await Challenge.findAndCountAll({
        where,
        include,
        distinct: true,
        limit: Number(limit),
        offset,
        order: [
          ["challenge_id", "ASC"],
        ],
      });

    // 참여 정보 매핑
    let participationMap = {};
    
    if (userId && rows.length > 0) {
      const participations =
        await ParticipatingChallenge.findAll({
          where: {
            challenge_id:
              rows.map(
                (challenge) =>
                  challenge.challenge_id
              ),
            user_id: userId,
          },
        });

      participationMap =
        participations.reduce(
          (acc, participation) => {
            acc[
              participation.challenge_id
            ] = participation;

            return acc;
          },
          {}
        );
    }

    rows.forEach((challenge) => {
      challenge.setDataValue(
        "my_participation",
        participationMap[
          challenge.challenge_id
        ] || null
      );
    });

    res.status(200).json({
      totalItems: count,
      challenges: rows,
      totalPages: Math.ceil(
        count / Number(limit)
      ),
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [GET] /api/challenges/:id
 * 챌린지 상세 조회
 */
exports.detail = async (req, res, next) => {
  try {
    // 상세 요청 시에도 자동 마감 정리
    await closeExpiredRecruiting();

    const { id } = req.params;
    const userId = req.user?.user_id;

    const challenge = await Challenge.findOne({
      where: {
        challenge_id: id,
        status: "APPROVED",
      },
      include: [
        {
          model: ChallengeDay,
          as: "days",
          attributes: ["day_of_week"],
        },
        {
          model: Attachment,
          as: "attachments",
          attributes: [
            "attachment_id",
            "attachment_name",
            "url",
            "attachment_type",
          ],
        },
        {
          model: Interests,
          as: "interests",
          through: { attributes: [] },
          attributes: ["interest_id", "interest_detail"],
        },
        {
          model: Visions,
          as: "visions",
          through: { attributes: [] },
          attributes: ["vision_id", "vision_detail"],
        },
      ],
    });

    if (!challenge) {
      return res.status(404).json({
        error: "존재하지 않는 챌린지입니다.",
      });
    }

    const isBookmarked = userId
      ? !!(await Bookmark.findOne({
          where: {
            challenge_id: id,
            user_id: userId,
          },
        }))
      : false;

    let myParticipation = null;

    if (userId) {
      const participation = await ParticipatingChallenge.findOne({
        where: {
          challenge_id: id,
          user_id: userId,
        },
      });

      myParticipation = participation ? participation.toJSON() : null;
    }

    res.status(200).json({
      challenge_id: challenge.challenge_id,
      title: challenge.title,
      description: challenge.description,
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
      challenge_state: challenge.challenge_state,
      status: challenge.status,
      days: challenge.days.map((day) => day.day_of_week),
      attachments: challenge.attachments,
      interests: challenge.interests,
      visions: challenge.visions,
      creator_contact: challenge.creator_contact,
      is_bookmarked: isBookmarked,
      my_participation: myParticipation,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [PATCH] /api/challenges/:id
 * 챌린지 수정
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const userId = req.user.user_id;

    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
      return res.status(404).json({
        error: "챌린지를 찾을 수 없습니다.",
      });
    }

    if (challenge.user_id !== userId) {
      return res.status(403).json({
        error: "챌린지 수정 권한이 없습니다.",
      });
    }

    const updatable = [
      "title",
      "description",
      "minimum_age",
      "maximum_age",
      "maximum_people",
      "application_deadline",
      "start_date",
      "end_date",
      "is_recurring",
      "repeat_type",
      "intermediate_participation",
      "creator_contact",
    ];

    updatable.forEach((field) => {
      if (body[field] !== undefined) {
        challenge[field] = body[field];
      }
    });

    // challenge_state 변경 허용
    if (body.challenge_state !== undefined) {
      const allowed = ["ACTIVE", "CLOSED", "CANCELLED"];

      if (!allowed.includes(body.challenge_state)) {
        return res.status(400).json({
          error: "잘못된 상태 값",
        });
      }
      challenge.challenge_state = body.challenge_state;
    }

    await sequelize.transaction(async (t) => {
      await challenge.save({ transaction: t });

      if (body.days !== undefined) {
        if (!Array.isArray(body.days)) {
          return res.status(400).json({
            error: "days는 배열이어야 합니다.",
          });
        }

        await ChallengeDay.destroy({
          where: { challenge_id: id },
          transaction: t,
        });

        const nextIsRecurring =
          body.is_recurring !== undefined
            ? body.is_recurring
            : challenge.is_recurring;

        if (nextIsRecurring && body.days.length > 0) {
          await ChallengeDay.bulkCreate(
            body.days.map((day) => ({
              challenge_id: id,
              day_of_week: day,
            })),
            { transaction: t }
          );
        }
      }

      if (body.interestIds !== undefined) {
        await challenge.setInterests(body.interestIds, {
          transaction: t,
        });
      }

      if (body.visionIds !== undefined) {
        await challenge.setVisions(body.visionIds, {
          transaction: t,
        });
      }
    });
    
    res.status(200).json({
      message: "챌린지가 수정되었습니다.",
      challenge_id: challenge.challenge_id,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [DELETE] /api/challenges/:id
 * 챌린지 삭제
 */
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
      return res.status(404).json({
        error: "챌린지를 찾을 수 없습니다.",
      });
    }

    if (challenge.user_id !== userId) {
      return res.status(403).json({
        error: "챌린지 삭제 권한이 없습니다.",
      });
    }

    // 관계 데이터 삭제
    await sequelize.transaction(async (t) => {
      await ChallengeDay.destroy({ where: { challenge_id: id }, transaction: t });
      await ChallengeInterest.destroy({ where: { challenge_id: id }, transaction: t });
      await ChallengeVision.destroy({ where: { challenge_id: id }, transaction: t });
      await Review.destroy({ where: { challenge_id: id }, transaction: t });
      await ParticipatingChallenge.destroy({ where: { challenge_id: id }, transaction: t });
      await Bookmark.destroy({ where: { challenge_id: id }, transaction: t });
      await Attachment.destroy({ where: { challenge_id: id }, transaction: t });

      await Challenge.destroy({
        where: { challenge_id: id },
        transaction: t,
      });
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

/**
 * [PATCH] /api/challenges/:id/state
 * 챌린지 상태 변경
 */
exports.changeState = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { state } = req.body;
    const userId = req.user.user_id;
    const allowedStates = ["ACTIVE", "CLOSED", "CANCELLED"];

    if (!allowedStates.includes(state)) {
      return res.status(400).json({
        error: "잘못된 챌린지 상태 값입니다.",
      });
    }

    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
      return res.status(404).json({
        error: "챌린지를 찾을 수 없습니다.",
      });
    }

    if (challenge.user_id !== userId) {
      return res.status(403).json({
        error: "챌린지 상태 변경 권한이 없습니다.",
      });
    }

    challenge.challenge_state = state;
    await challenge.save();

    res.status(200).json({
      challenge_id: challenge.challenge_id,
      challenge_state: challenge.challenge_state,
    });
  } catch (err) {
    next(err);
  }
};


/**
 * [GET] /api/challenges/my/participated
 * 내가 신청한 챌린지 활동 내역 조회 (참여 이력)
 */
exports.myParticipated = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { from, to, keyword, page, limit } = req.query;

    const usePaging = page !== undefined || limit !== undefined;
    const currentPage = Number(page) || 1;
    const pageSize = Number(limit) || 10;

    if (page !== undefined && (!Number.isInteger(currentPage) || currentPage < 1)) {
      return res.status(400).json({ error: "page는 1 이상의 정수여야 합니다." });
    }

    if (limit !== undefined && (!Number.isInteger(pageSize) || pageSize < 1)) {
      return res.status(400).json({ error: "limit는 1 이상의 정수여야 합니다." });
    }

    const offset = (currentPage - 1) * pageSize;
    const participationWhere = { user_id: userId };
    const challengeWhere = {};

    const parseDate = (value, field) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return { error: `${field} 날짜 형식이 올바르지 않습니다.` };
      }
      return { date };
    };

    if (from || to) {
      const fromDate = from ? parseDate(from, "from") : null;
      const toDate = to ? parseDate(to, "to") : null;

      if (fromDate?.error) return res.status(400).json({ error: fromDate.error });
      if (toDate?.error) return res.status(400).json({ error: toDate.error });

      challengeWhere.start_date = {
        ...(fromDate?.date && { [Op.gte]: fromDate.date }),
        ...(toDate?.date && { [Op.lte]: toDate.date }),
      };
    }

    if (keyword) {
      challengeWhere.title = { [Op.like]: `%${keyword}%` };
    }

    const queryOptions = {
      where: participationWhere,
      include: [
        {
          model: Challenge,
          where: Object.keys(challengeWhere).length ? challengeWhere : undefined,
          include: [
            { model: ChallengeDay, as: "days", attributes: ["day_of_week"] },
            { model: Attachment, as: "attachments", attributes: ["url"] },
            { model: Interests, as: "interests", through: { attributes: [] } },
            { model: Visions, as: "visions", through: { attributes: [] } },
          ],
        },
      ],
      order: [["participating_id", "DESC"]],
      distinct: true,
    };

    if (usePaging) {
      queryOptions.limit = pageSize;
      queryOptions.offset = offset;
    }

    const result = await ParticipatingChallenge.findAndCountAll(queryOptions);

    res.status(200).json({
      challenges: result.rows.map((p) => ({
        ...p.Challenge.toJSON(),
        my_participation: {
          participating_id: p.participating_id,
          participating_state: p.participating_state,
        },
      })),
      totalCount: result.count,
      totalPages: usePaging ? Math.ceil(result.count / pageSize) : 1,
      currentPage: usePaging ? currentPage : 1,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [GET] /api/challenges/my/created
 * 내가 개설한 챌린지 활동 내역 조회
 */
exports.myCreated = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { from, to, keyword, page, limit } = req.query;

    const usePaging = page !== undefined || limit !== undefined;
    const currentPage = Number(page) || 1;
    const pageSize = Number(limit) || 10;

    if (page !== undefined && (!Number.isInteger(currentPage) || currentPage < 1)) {
      return res.status(400).json({ error: "page는 1 이상의 정수여야 합니다." });
    }

    if (limit !== undefined && (!Number.isInteger(pageSize) || pageSize < 1)) {
      return res.status(400).json({ error: "limit는 1 이상의 정수여야 합니다." });
    }

    const offset = (currentPage - 1) * pageSize;
    const where = { user_id: userId };

    const parseDate = (value, field) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return { error: `${field} 날짜 형식이 올바르지 않습니다.` };
      }
      return { date };
    };

    if (from || to) {
      const fromDate = from ? parseDate(from, "from") : null;
      const toDate = to ? parseDate(to, "to") : null;

      if (fromDate?.error) return res.status(400).json({ error: fromDate.error });
      if (toDate?.error) return res.status(400).json({ error: toDate.error });

      where.created_at = {
        ...(fromDate?.date && { [Op.gte]: fromDate.date }),
        ...(toDate?.date && { [Op.lte]: toDate.date }),
      };
    }

    if (keyword) {
      where.title = { [Op.like]: `%${keyword}%` };
    }

    const queryOptions = {
      where,
      include: [
        { model: ChallengeDay, as: "days", attributes: ["day_of_week"] },
        { model: Attachment, as: "attachments", attributes: ["url", "attachment_type"] },
        {
          model: ParticipatingChallenge,
          as: "participants",
          attributes: ["participating_id", "participating_state"],
        },
      ],
      order: [["challenge_id", "DESC"]],
      distinct: true,
    };

    if (usePaging) {
      queryOptions.limit = pageSize;
      queryOptions.offset = offset;
    }

    const result = await Challenge.findAndCountAll(queryOptions);

    res.status(200).json({
      challenges: result.rows.map((challenge) => ({
        challenge_id: challenge.challenge_id,
        title: challenge.title,
        status: challenge.status,
        challenge_state: challenge.challenge_state,
        application_deadline: challenge.application_deadline,
        start_date: challenge.start_date,
        end_date: challenge.end_date,
        applicants_count: challenge.participants?.length ?? 0,
        participants: challenge.participants,
        attachments: challenge.attachments,
        days: challenge.days,
      })),
      totalCount: result.count,
      totalPages: usePaging ? Math.ceil(result.count / pageSize) : 1,
      currentPage: usePaging ? currentPage : 1,
    });
  } catch (err) {
    next(err);
  }
};
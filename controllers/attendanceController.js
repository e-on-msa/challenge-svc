const { Op } = require("sequelize");
const {
  ParticipatingChallenge,
  ParticipatingAttendance,
  Challenge,
} = require("../models");

const { getUsersByIds } = require("../services/userServiceClient");

/**
 * [POST] /api/participations/:id/attendances
 * 출석 추가
 */
exports.add = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { attendance_date, attendance_state, memo } = req.body;

    if (!attendance_date) {
      return res.status(400).json({ error: "attendance_date는 필수입니다." });
    }

    const allowedStates = ["출석", "결석"];

    if (!allowedStates.includes(attendance_state)) {
      return res.status(400).json({ error: "attendance_state는 출석 또는 결석이어야 합니다." });
    }

    // 참여 존재 여부 검증
    const participation = await ParticipatingChallenge.findByPk(id);

    if (!participation) {
      return res.status(404).json({ error: "참여 기록을 찾을 수 없습니다." });
    }

    // 같은 날짜에 중복 출석 방지
    const duplicated = await ParticipatingAttendance.findOne({
      where: {
        participating_id: id,
        attendance_date,
      },
    });

    if (duplicated) {
      return res.status(409).json({ error: "이미 해당 날짜 출석 기록이 있습니다." });
    }

    const attendance = await ParticipatingAttendance.create({
      participating_id: id,
      attendance_date,
      attendance_state,
      memo,
    });

    res.status(201).json({
      message: "출석 기록이 추가되었습니다.",
      attendance,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [GET] /api/challenges/:id/attendance
 * 챌린지별 출석 조회
 */
exports.listByChallenge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, from, to } = req.query; // YYYY-MM-DD

    // 1) 챌린지 존재 여부 검증
    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
      return res.status(404).json({ error: "챌린지를 찾을 수 없습니다." });
    }

    // 2) 날짜 검증
    let dateCondition;

    if (date) {
      const target = new Date(date);

      if (Number.isNaN(target.getTime())) {
        return res.status(400).json({ error: "유효하지 않은 date 형식입니다." });
      }

      dateCondition = { attendance_date: date };
    } else if (from || to) {
      const fromDate = from || "1000-01-01";
      const toDate = to || "9999-12-31";

      if (
        Number.isNaN(new Date(fromDate).getTime()) ||
        Number.isNaN(new Date(toDate).getTime())
      ) {
        return res.status(400).json({ error: "유효하지 않은 기간 형식입니다." });
      }

      dateCondition = {
        attendance_date: {
          [Op.between]: [fromDate, toDate],
        },
      };
    }

    // 3) 쿼리 : 참여자 전체 + (해당 날짜/기간의) 출석 LEFT JOIN
    const participations = await ParticipatingChallenge.findAll({
      where: {
        challenge_id: id,
        participating_state: {
          [Op.in]: ["신청", "진행 중"],
        },
      },
      attributes: [
        "participating_id",
        "challenge_id",
        "user_id",
        "participating_state",
      ],
      include: [
        {
          model: ParticipatingAttendance,
          as: "attendances",
          required: false,
          where: dateCondition,
        },
      ],
      order: [
        ["user_id", "ASC"],
        [{ model: ParticipatingAttendance, as: "attendances" },
          "attendance_date",
          "ASC",
        ],
      ],
    });

    // 4) user-svc 호출
    // TODO: 연동 후 확인 필요
    // user-svc에서 user_id와 name 가져오기
    const userIds = [...new Set(participations.map((p) => p.user_id))];

    let userMap = {};
    try {
      userMap = await getUsersByIds(userIds);
    } catch (e) {
      console.warn("[user-svc] 조회 실패", e.message);
    }

    const result = participations.map((p) => {
      const json = p.toJSON();
      return {
        ...json,
        participant: {
          user_id: json.user_id,
          name: userMap[json.user_id]?.name ?? null,
        },
      };
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
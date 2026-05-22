const { Op } = require("sequelize");
const {
  sequelize,
  Challenge,
  ChallengeDay,
  Attachment,
  ParticipatingChallenge,
  ParticipatingAttendance,
} = require("../models");

/**
 * [POST] /api/challenges
 * 챌린지 생성
 */
exports.create = async (req, res, next) => {
  const body = req.body.meta ? JSON.parse(req.body.meta) : req.body;

  const filesObj = req.files ?? {};
  const photosArr = filesObj.photos || [];
  const consentsArr = filesObj.consents || [];

  try {
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
          status: isMunicipality ? "APPROVED" : "PENDING",
        },
        { transaction: t }
      );

      if (is_recurring && days.length) {
        await ChallengeDay.bulkCreate(
          days.map((day) => ({
            challenge_id: ch.challenge_id,
            day_of_week: day,
          })),
          { transaction: t }
        );
      }

      if (interestIds.length) {
        await ch.addInterests(interestIds, { transaction: t });
      }

      if (visionIds.length) {
        await ch.addVisions(visionIds, { transaction: t });
      }

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
const fs = require("fs");
const path = require("path");

const { Attachment, Challenge } = require("../models");

/**
 * [POST] /api/challenges/:id/attachments
 * 첨부파일 업로드
 */
exports.add = async (req, res, next) => {
  try {
    const { id } = req.params;

    const photos = req.files?.photos ?? [];
    const consents = req.files?.consents ?? [];

    const challenge = await Challenge.findByPk(id);

    // 1) 챌린지 존재 확인
    if (!challenge) {
      return res.status(404).json({ error: "챌린지를 찾을 수 없습니다." });
    }

    // 2) 업로드할 파일이 하나도 없으면 400 에러
    if (!photos.length && !consents.length) {
      return res.status(400).json({ error: "업로드할 파일이 없습니다." });
    }

    // 3) DB 삽입용 레코드 배열 준비
    const rows = [];

    // 3-1) photosArr → attachment_type: '이미지'
    for (const file of photos) {
      rows.push({
        challenge_id: id,
        attachment_name: file.originalname,
        url: `/uploads/${file.filename}` || file.location, 
        attachment_type: "이미지",
      });
    }

    // 3-2) consentsArr → attachment_type: '동의서'
    for (const file of consents) {
      rows.push({
        challenge_id: id,
        attachment_name: file.originalname,
        url: `/uploads/${file.filename}` || file.location, 
        attachment_type: "문서",
      });
    }

    // 4) 한꺼번에 Bulk Insert
    const attachments = await Attachment.bulkCreate(rows);
    res.status(201).json({
      message: "첨부파일 업로드 완료",
      attachments,
    });

  } catch (err) {
    next(err);
  }
};

/**
 * [GET] /api/challenges/:id/attachments
 * 첨부파일 목록 조회
 */
exports.list = async (req, res, next) => {
  try {
    const { id } = req.params;

    const attachments =
      await Attachment.findAll({
        where: { challenge_id: id },
        order: [["attachment_id", "ASC"]],
      });

    res.status(200).json(
      attachments
    );

  } catch (err) {
    next(err);
  }
};

/**
 * [DELETE] /api/attachments/:id
 * 첨부파일 삭제
 */
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const attachment =
      await Attachment.findByPk(id);

    if (!attachment) {
      return res.status(404).json({
        error: "첨부파일을 찾을 수 없습니다.",
      });
    }

    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      const filePath = path.join(
        __dirname,
        "..",
        attachment.url
      );

      fs.unlink(
        filePath,
        () => {}
      );
    }

    await attachment.destroy();

    res.status(204).send();

  } catch (err) {
    next(err);
  }
};
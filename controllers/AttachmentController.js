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
      const url = file.location ?? (file.filename ? `/uploads/${file.filename}` : null);
      if (!url) throw new Error("파일 URL 생성에 실패했습니다.");

      rows.push({
        challenge_id: id,
        attachment_name: file.originalname,
        url, 
        attachment_type: "이미지",
      });
    }

    // 3-2) consentsArr → attachment_type: '동의서'
    for (const file of consents) {
      const url = file.location ?? (file.filename ? `/uploads/${file.filename}` : null);
      if (!url) throw new Error("파일 URL 생성에 실패했습니다.");
      rows.push({
        challenge_id: id,
        attachment_name: file.originalname,
        url, 
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

    const attachment = await Attachment.findByPk(id);

    if (!attachment) {
      return res.status(404).json({ error: "첨부파일을 찾을 수 없습니다." });
    }

    if (
      process.env.NODE_ENV !== "production" &&
      attachment.url?.startsWith("/uploads/")
    ) {
      const relativePath = attachment.url.replace(/^\/+/, "");

      // 프로젝트 실행 위치 기준으로 실제 파일 경로 생성
      const filePath = path.resolve(process.cwd(), relativePath);

      try {
        await fs.promises.unlink(filePath);
      } catch (err) {
        if (err.code !== "ENOENT") { // 이미 파일이 없는 경우(ENOENT)는 무시
          throw err;
        }
      }
    }

    // DB 레코드 삭제
    await attachment.destroy();

    res.status(204).send();

  } catch (err) {
    next(err);
  }
};
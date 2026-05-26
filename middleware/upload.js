const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 운영이 아니면 uploads 폴더 생성
if (
  process.env.NODE_ENV !== "production" &&
  !fs.existsSync("uploads")
) {
  fs.mkdirSync("uploads");
}

// 저장 장소 & 파일명 지정
const storage =
  process.env.NODE_ENV === "production"

    // 운영 → 메모리에 저장 (GCS 업로드용)
    ? multer.memoryStorage()

    // 개발 → 로컬 uploads 저장
    : multer.diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, "uploads/"); // uploads 폴더에 저장
        },
        filename: (_req, file, cb) => {
            const ext      = path.extname(file.originalname); // .jpg
            const basename = path.basename(file.originalname, ext);
            const unique   = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, `${basename}-${unique}${ext}`);          // img-12345.jpg
        },
      });

// 필터: 이미지만 통과
const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("이미지 파일만 업로드 가능"));
};

// 크기 제한: 5 MB
module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const isGcsStorage = process.env.STORAGE_TYPE === "gcs";

if (!isGcsStorage && !fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

// 저장 장소 & 파일명 지정
const storage = isGcsStorage
    // gcs → 메모리에 저장
    ? multer.memoryStorage()
    // local → uploads 디렉터리(PVC 마운트 경로)에 저장
    : multer.diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, "uploads/"); // uploads 폴더에 저장
        },
        filename: (_req, file, cb) => {
            const ext      = path.extname(file.originalname); // .jpg
            const unique   = Date.now() + "-" + Math.round(Math.random() * 1e9);

            cb(null, `attachment-${unique}${ext}`); // img-12345.jpg
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
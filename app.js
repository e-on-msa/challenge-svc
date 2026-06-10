const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/", (req, res) => { res.status(200).send("OK"); });
app.get("/health", (req, res) => { res.status(200).send("OK"); });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 라우터
app.use("/api/challenges", require("./routes/challengeRouter"));
app.use("/api/challenges", require("./routes/bookmarkRouter"));
app.use("/api/reviews", require("./routes/reviewRouter"));
app.use("/api/attachments", require("./routes/attachmentRouter"));
app.use("/api/attendances", require("./routes/attendanceRouter"));
app.use("/api/participations", require("./routes/participationRouter"));

app.use("/api/admin/challenges", require("./routes/adminChallengeRouter"));

app.use("/api/visions", require("./routes/visionRouter"));
app.use("/api/interests", require("./routes/interestRouter"));

app.use("/internal", require("./routes/internalChallengeRouter"));
app.use("/internal/admin/master-data", require("./routes/adminMasterDataRouter"));

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err);

  const rawStatusCode = Number(err.statusCode);
  const statusCode =
    Number.isInteger(rawStatusCode) &&
    rawStatusCode >= 100 &&
    rawStatusCode < 600
      ? rawStatusCode
      : 500;

  const clientMessage =
    statusCode >= 500
      ? "Internal Server Error"
      : err.message || "Bad Request";

  res.status(statusCode).json({
    error: clientMessage,
  });
});

module.exports = app;
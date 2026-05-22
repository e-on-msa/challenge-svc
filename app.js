const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// 라우터
app.use("/api/challenges", require("./routes/challengeRouter"));
app.use("/api/visions", require("./routes/visionRouter"));
app.use("/api/interests", require("./routes/interestRouter"));

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
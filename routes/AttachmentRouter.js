const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { isLoggedIn } = require("../middleware/auth");
const ctrl = require("../controllers/attachmentController");

// 첨부파일 삭제
router.delete("/:id", isLoggedIn, ctrl.remove);

module.exports = router;
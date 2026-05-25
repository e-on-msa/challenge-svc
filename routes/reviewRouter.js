const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware/auth");
const reviewCtrl = require("../controllers/reviewController");

// 리뷰 수정
router.patch("/:id", isLoggedIn, reviewCtrl.update);

// 리뷰 삭제
router.delete("/:id", isLoggedIn, reviewCtrl.remove);

module.exports = router;
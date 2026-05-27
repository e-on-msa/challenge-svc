const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware/auth");
const bookmarkCtrl = require("../controllers/bookmarkController");

// 북마크 추가
router.post("/:id/bookmarks", isLoggedIn, bookmarkCtrl.add);

// 북마크 해제
router.delete("/:id/bookmarks", isLoggedIn, bookmarkCtrl.remove);

module.exports = router;
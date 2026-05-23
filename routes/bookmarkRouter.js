const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware/auth");
const bookmarkCtrl = require("../controllers/bookmarkController");

router.post("/:id/bookmarks", isLoggedIn, bookmarkCtrl.add);
router.delete("/:id/bookmarks", isLoggedIn, bookmarkCtrl.remove);

module.exports = router;
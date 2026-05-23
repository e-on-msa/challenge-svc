const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { isLoggedIn } = require("../middleware/auth");
const challengeCtrl = require("../controllers/challengeController");

router.post(
  '/',
  isLoggedIn,
  upload.fields([
    { name: 'photos', maxCount: 5 },
    { name: 'consents', maxCount: 1 }
  ]),
  challengeCtrl.create
);
router.get("/", challengeCtrl.list);
router.patch("/:id/state", isLoggedIn, challengeCtrl.changeState);
router.get("/:id", challengeCtrl.detail);
router.patch("/:id", isLoggedIn, challengeCtrl.update);
router.delete("/:id", isLoggedIn, challengeCtrl.remove);

module.exports = router;
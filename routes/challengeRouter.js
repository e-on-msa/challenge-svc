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

module.exports = router;
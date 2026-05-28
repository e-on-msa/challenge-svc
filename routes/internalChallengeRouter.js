const express = require("express");
const router = express.Router();

const internalChallengeCtrl = require("../controllers/internalChallengeController");

router.get(
  "/challenges/active-with-categories",
  internalChallengeCtrl.getActiveWithCategories
);

module.exports = router;
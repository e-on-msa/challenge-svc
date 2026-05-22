const express = require("express");
const router = express.Router();

const interestController = require("../controllers/interestController");

router.get("/", interestController.getAll);
router.get("/categories", interestController.getCategories);
router.get("/categories/:categoryCode", interestController.getList);

module.exports = router;
const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/adminMasterDataController");

/** ---------------- 관심사 ---------------- **/
router.post("/interests", ctrl.createInterest);

router.patch("/interests/:id", ctrl.updateInterest);

router.delete("/interests/:id", ctrl.deleteInterest);


/** ---------------- 진로희망 ---------------- **/
router.post("/visions", ctrl.createVision);

router.patch("/visions/:id", ctrl.updateVision);

router.delete("/visions/:id", ctrl.deleteVision);

module.exports = router;

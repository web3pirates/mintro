const express = require("express");
const router = express.Router();
const FearGreedController = require("../controllers/fearGreedController");

router.get("/latest", FearGreedController.getLatestFearGreedIndex);

router.get("/historical", FearGreedController.getHistoricalFearGreedIndex);

module.exports = router;

const express = require("express");
const router = express.Router();
const TragicNewsController = require("../controllers/tragicNewsController");

// Get tragic news that could impact markets
router.get("/market-impact", TragicNewsController.getTragicNews);

// Get news by specific keyword
router.get("/keyword/:keyword", TragicNewsController.getNewsByKeyword);

module.exports = router;

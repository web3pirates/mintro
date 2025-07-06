const express = require("express");
const router = express.Router();
const WorldcoinNotificationController = require("../controllers/worldcoinNotificationController");

// Send a single notification
router.post("/send", WorldcoinNotificationController.sendNotification);

module.exports = router;

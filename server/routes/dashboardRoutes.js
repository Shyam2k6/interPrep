const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, controller.getDashboard);

module.exports = router;

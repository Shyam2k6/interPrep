const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const controllers = require("../controllers/goalController");

router.post("/", protect, controllers.createGoal);

module.exports = router;

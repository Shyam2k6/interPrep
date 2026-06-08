const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const controllers = require("../controllers/goalController");

router.post("/", protect, controllers.createGoal);
router.get("/", protect, controllers.getGoals);
router.delete("/:id", protect, controllers.deleteGoal);

module.exports = router;

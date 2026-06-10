const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const controllers = require("../controllers/goalController");

router
  .post("/", protect, controllers.createGoal)
  .get("/", protect, controllers.getGoals)
  .delete("/:id", protect, controllers.deleteGoal)
  .patch("/:id", protect, controllers.updateGoal);

module.exports = router;

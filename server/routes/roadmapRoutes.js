const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const controllers = require("../controllers/roadmapController");
const router = express.Router();

router
  .get("/", protect, controllers.getRoadmaps)
  .post("/", protect, controllers.createRoadmap);

module.exports = router;

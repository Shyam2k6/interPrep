const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createRoadmap } = require("../controllers/roadmapController");
const router = express.Router();

router.post("/", protect, createRoadmap);

module.exports = router;

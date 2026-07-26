const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { chatWithAI, generateRoadmap } = require("../controllers/aiController");

const router = express.Router();

router.post("/roadmap", protect, generateRoadmap);
router.post("/chat", protect, chatWithAI);

module.exports = router;

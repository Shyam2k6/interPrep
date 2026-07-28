const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  chatWithAI,
  getChatHistory,
  generateRoadmap,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/roadmap", protect, generateRoadmap);
router.post("/chat", protect, chatWithAI);
router.get("/history", protect, getChatHistory);

module.exports = router;

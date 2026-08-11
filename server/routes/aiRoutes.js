const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  chatWithAI,
  getChatHistory,
  generateRoadmap,
  getConversations,
  deleteConversation,
  renameConversation,
  explainCareerTransition,
  suggestRoadmap,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/roadmap", protect, generateRoadmap);
router.post("/chat", protect, chatWithAI);
router.get("/history", protect, getChatHistory);
router.get("/conversations", protect, getConversations);
router.patch("/conversations/:id", protect, renameConversation);
router.delete("/conversations/:id", protect, deleteConversation);
router.post("/career-explanation", protect, explainCareerTransition);
router.post("/roadmap-suggestion", protect, suggestRoadmap);

module.exports = router;

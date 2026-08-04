const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  chatWithAI,
  getChatHistory,
  generateRoadmap,
  getConversations,
  deleteConversation,
  renameConversation,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/roadmap", protect, generateRoadmap);
router.post("/chat", protect, chatWithAI);
router.get("/history", protect, getChatHistory);
router.get("/conversations", protect, getConversations);
router.patch("/conversations/:id", protect, renameConversation);
router.delete("/conversations/:id", protect, deleteConversation);

module.exports = router;

const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { generateQuiz, submitQuiz, getQuizHistory } = require("../controllers/assessmentController");

const router = express.Router();

router.post("/generate", protect, generateQuiz);
router.post("/submit", protect, submitQuiz);
router.get("/history", protect, getQuizHistory);

module.exports = router;

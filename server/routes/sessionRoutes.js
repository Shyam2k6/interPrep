const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createStudySession,
  getStudySessions,
  updateStudySession,
  deleteStudySession,
  getStudySessionStats,
  getWeeklyActivity,
} = require("../controllers/studySessionController");

const router = express.Router();

router
  .get("/", protect, getStudySessions)
  .get("/stats", protect, getStudySessionStats)
  .get("/weekly-activity", protect, getWeeklyActivity)
  .post("/", protect, createStudySession)
  .patch("/:id", protect, updateStudySession)
  .delete("/:id", protect, deleteStudySession);

module.exports = router;

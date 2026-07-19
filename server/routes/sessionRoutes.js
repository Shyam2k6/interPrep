const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createStudySession,
  getStudySessions,
  updateStudySession,
  deleteStudySession,
  getStudySessionStats,
} = require("../controllers/studySessionController");

const router = express.Router();

router
  .get("/", protect, getStudySessions)
  .get("/stats", protect, getStudySessionStats)
  .post("/", protect, createStudySession)
  .patch("/:id", protect, updateStudySession)
  .delete("/:id", protect, deleteStudySession);

module.exports = router;

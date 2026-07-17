const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createStudySession,
  getStudySessions,
  updateStudySession,
} = require("../controllers/studySessionController");

const router = express.Router();

router
  .get("/", protect, getStudySessions)
  .post("/", protect, createStudySession)
  .patch("/:id", protect, updateStudySession);

module.exports = router;

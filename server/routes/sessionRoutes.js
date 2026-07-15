const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createStudySession,
  getStudySessions,
} = require("../controllers/studySessionController");

const router = express.Router();

router
  .get("/", protect, getStudySessions)
  .post("/", protect, createStudySession);

module.exports = router;

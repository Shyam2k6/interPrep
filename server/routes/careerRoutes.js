const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getCareerProfile,
  updateCareerProfile,
  getCareerTransitions,
  setTargetCareer,
  resetCareerProfile,
  enhanceRoadmap,
} = require("../controllers/careerController");

const router = express.Router();

router.get("/profile", protect, getCareerProfile);
router.patch("/profile", protect, updateCareerProfile);
router.delete("/profile", protect, resetCareerProfile);
router.get("/transitions", protect, getCareerTransitions);
router.post("/targets", protect, setTargetCareer);
router.post("/roadmap-enhance", protect, enhanceRoadmap);

module.exports = router;

const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getOccupations, getOccupationById } = require("../controllers/occupationController");

const router = express.Router();

router.get("/", protect, getOccupations);
router.get("/:id", protect, getOccupationById);

module.exports = router;

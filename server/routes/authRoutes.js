const express = require("express");
const controllers = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", controllers.registerUser);
router.post("/login", controllers.loginUser);
router.get("/me", protect, controllers.getMe);

module.exports = router;

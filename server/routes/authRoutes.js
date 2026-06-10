const express = require("express");
const controllers = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router
  .post("/register", controllers.registerUser)
  .post("/login", controllers.loginUser)
  .get("/me", protect, controllers.getMe);

module.exports = router;

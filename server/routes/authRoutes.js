const express = require("express");
const controllers = require("../controllers/authController");
const router = express.Router();

router.post("/register", controllers.registerUser);
router.post("/login", controllers.loginUser);

module.exports = router;

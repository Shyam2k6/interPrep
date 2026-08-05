const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const controllers = require("../controllers/notificationController");

router.use(protect);

router
  .route("/")
  .get(controllers.syncAndGetNotifications)
  .delete(controllers.clearAllNotifications);

router.patch("/read-all", controllers.markAllAsRead);

router
  .route("/:id")
  .patch(controllers.markAsRead)
  .delete(controllers.deleteNotification);

module.exports = router;

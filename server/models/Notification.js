const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "warning", "success"],
      default: "info",
    },
    read: {
      type: Boolean,
      default: false,
    },
    triggerKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate notifications of the same trigger key for the same user
notificationSchema.index({ user: 1, triggerKey: 1 }, { unique: true });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;

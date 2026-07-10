const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Goal title is required"],
    },
    category: {
      type: String,
      enum: ["Programming", "Interview Prep", "College", "Personal", "Fitness"],
      default: "Personal",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;

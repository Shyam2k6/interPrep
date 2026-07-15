const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
  {
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    duration: {
      type: Number,
      required: [true, "Study duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    studiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const StudySession = mongoose.model("StudySession", studySessionSchema);

module.exports = StudySession;

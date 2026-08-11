const mongoose = require("mongoose");

const assessmentQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctOptionIndex: {
    type: Number,
    required: true,
  },
  selectedOptionIndex: {
    type: Number,
    default: -1,
  },
  explanation: {
    type: String,
    default: "",
  },
});

const assessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skillName: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    questions: [assessmentQuestionSchema],
    completed: {
      type: Boolean,
      default: false,
    },
    takenAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Assessment", assessmentSchema);

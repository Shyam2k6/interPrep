const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Technical",
        "Analytical",
        "Communication",
        "Domain",
        "Management",
        "Digital",
        "AI",
        "Creative",
        "Programming",
        "Testing",
        "Problem Solving",
        "Security",
        "Data",
        "Design",
      ],
      default: "Technical",
    },
    description: {
      type: String,
      default: "",
    },
    demandTrend: {
      type: String,
      enum: ["increasing", "stable", "decreasing"],
      default: "stable",
    },
    aiRelevance: {
      type: String,
      default: "",
    },
    source: {
      type: String,
      default: "O*NET Content Model",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Skill", skillSchema);

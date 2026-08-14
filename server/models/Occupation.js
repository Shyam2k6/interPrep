const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  importance: {
    type: Number,
    min: 0,
    max: 100,
    default: 50,
  },
  requiredSkills: [
    {
      type: String,
    },
  ],
  aiAutomationPotential: {
    type: Number, // 0 to 100
    min: 0,
    max: 100,
    default: 50,
  },
  aiAugmentationPotential: {
    type: Number, // 0 to 100
    min: 0,
    max: 100,
    default: 50,
  },
  humanValue: {
    type: Number, // 0 to 100 (human complementarity)
    min: 0,
    max: 100,
    default: 50,
  },
  evidenceConfidence: {
    type: Number, // 0 to 100
    min: 0,
    max: 100,
    default: 50,
  },
  explanation: {
    type: String,
    default: "",
  },
});

const occupationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      default: "Generic",
    },
    tasks: [taskSchema],
    skills: [
      {
        type: String, // skill names
      },
    ],
    coreSkills: [
      {
        type: String,
      },
    ],
    aiAugmentedSkills: [
      {
        type: String,
      },
    ],
    emergingSkills: [
      {
        type: String,
      },
    ],
    humanCentricSkills: [
      {
        type: String,
      },
    ],
    timeline: [
      {
        phaseName: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
    technologies: [
      {
        type: String,
      },
    ],
    transferableSkills: [
      {
        type: String,
      },
    ],
    relatedOccupations: [
      {
        type: String, // related occupation names
      },
    ],
    dataSource: {
      name: {
        type: String,
        default: "O*NET Curated Dataset",
      },
      version: {
        type: String,
        default: "30.3",
      },
      url: {
        type: String,
        default: "https://www.onetcenter.org/",
      },
      retrievedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Occupation", occupationSchema);

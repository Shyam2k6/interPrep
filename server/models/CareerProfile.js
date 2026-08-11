const mongoose = require("mongoose");

const userSkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  proficiency: {
    type: Number, // 0 to 100
    min: 0,
    max: 100,
    default: 10,
  },
  source: {
    type: String,
    enum: ["self-assessed", "quiz", "imported"],
    default: "self-assessed",
  },
  category: {
    type: String,
    default: "Technical",
  },
  lastAssessed: {
    type: Date,
    default: Date.now,
  },
});

const careerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    currentOccupation: {
      type: String,
      required: true,
      trim: true,
    },
    chosenCareer: {
      type: String,
      default: "",
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    educationLevel: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    preferredIndustries: [
      {
        type: String,
      },
    ],
    preferredWorkAreas: [
      {
        type: String,
      },
    ],
    careerInterests: [
      {
        type: String,
      },
    ],
    targetOccupation: {
      type: String,
      default: "",
      trim: true,
    },
    skills: [userSkillSchema],
    readinessScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    aiReadinessScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    aiReadinessBreakdown: {
      coreCareerSkills: { type: Number, default: 0 },
      aiAssistedWorkflow: { type: Number, default: 0 },
      aiApplicationSkills: { type: Number, default: 0 },
      aiEvaluation: { type: Number, default: 0 },
      aiSecurity: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
    },
    subScores: {
      technicalSkills: { type: Number, default: 0 },
      domainKnowledge: { type: Number, default: 0 },
      transferableSkills: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
      assessment: { type: Number, default: 0 },
      learningProgress: { type: Number, default: 0 },
      interviewPrep: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CareerProfile", careerProfileSchema);

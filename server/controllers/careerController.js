const CareerProfile = require("../models/CareerProfile");
const Occupation = require("../models/Occupation");
const Goal = require("../models/Goal");
const Roadmap = require("../models/Roadmap");
const StudySession = require("../models/StudySession");
const Assessment = require("../models/Assessment");
const scoringService = require("../services/careerScoringService");
const aiScoringService = require("../services/careerIntelligenceService");
const asyncHandler = require("../utils/asyncHandler");

// Helper to recalculate and save user readiness based on target occupation and AI-Era Chosen Career
const refreshReadiness = async (userId) => {
  const profile = await CareerProfile.findOne({ user: userId });
  if (!profile) return null;

  // 1. Traditional Target-Based Readiness (for legacy page compatibility)
  if (profile.targetOccupation) {
    const targetOcc = await Occupation.findOne({ name: profile.targetOccupation });
    if (targetOcc) {
      const roadmap = await Roadmap.findOne({
        user: userId,
        title: `Transition to ${profile.targetOccupation}`,
      });
      const roadmapProgress = roadmap ? roadmap.progress : 0;

      let projectCount = 0;
      if (roadmap) {
        projectCount = roadmap.steps.filter(
          (s) => s.completed && /project|portfolio|build|implement/i.test(s.title)
        ).length;
      }

      const targetSkills = targetOcc.skills || [];
      const assessments = await Assessment.find({
        user: userId,
        skillName: { $in: targetSkills },
        completed: true,
      });
      const avgAssessmentScore =
        assessments.length > 0
          ? Math.round(assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length)
          : 0;

      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const sessionCount = await StudySession.countDocuments({
        user: userId,
        studiedAt: { $gte: twoWeeksAgo },
      });
      const consistencyScore = Math.min(100, sessionCount * 15);

      let interviewPrepCount = 0;
      if (roadmap) {
        interviewPrepCount = roadmap.steps.filter(
          (s) => s.completed && /interview|mock|prepare/i.test(s.title)
        ).length;
      }

      const { readinessScore, subScores } = scoringService.calculateCareerReadiness(
        profile.skills,
        targetSkills,
        roadmapProgress,
        projectCount,
        avgAssessmentScore,
        consistencyScore,
        interviewPrepCount
      );

      profile.readinessScore = readinessScore;
      profile.subScores = subScores;
    }
  }

  // 2. AI-Era Within-Career Readiness calculation
  const careerName = profile.chosenCareer || profile.currentOccupation;
  if (careerName) {
    const occupationDetails = await Occupation.findOne({ name: careerName });
    if (occupationDetails) {
      // Find user active roadmap for chosen career
      const roadmap = await Roadmap.findOne({
        user: userId,
        title: { $regex: new RegExp(careerName, "i") },
      });
      const roadmapProgress = roadmap ? roadmap.progress : 0;

      // Completed steps count containing "project", "portfolio", "build", "implement"
      let completedProjectsCount = 0;
      if (roadmap) {
        completedProjectsCount = roadmap.steps.filter(
          (s) => s.completed && /project|portfolio|build|implement/i.test(s.title)
        ).length;
      }

      // Quiz assessment average
      const quizAssessments = await Assessment.find({
        user: userId,
        completed: true,
      });
      const quizAverage =
        quizAssessments.length > 0
          ? Math.round(quizAssessments.reduce((sum, a) => sum + a.score, 0) / quizAssessments.length)
          : 0;

      const { aiReadinessScore, aiReadinessBreakdown } = aiScoringService.calculateAIReadiness(
        profile,
        occupationDetails,
        roadmapProgress,
        completedProjectsCount,
        quizAverage
      );

      profile.aiReadinessScore = aiReadinessScore;
      profile.aiReadinessBreakdown = aiReadinessBreakdown;
    }
  }

  await profile.save();
  return profile;
};

// @desc    Get user career profile
// @route   GET /api/career/profile
// @access  Private
exports.getCareerProfile = asyncHandler(async (req, res) => {
  let profile = await CareerProfile.findOne({ user: req.user._id });
  if (!profile) {
    return res.status(200).json({
      status: "success",
      data: { profile: null },
    });
  }

  // Refresh readiness statistics before returning
  profile = await refreshReadiness(req.user._id);

  res.status(200).json({
    status: "success",
    data: { profile },
  });
});

// @desc    Create or update user career profile
// @route   PATCH /api/career/profile
// @access  Private
exports.updateCareerProfile = asyncHandler(async (req, res) => {
  const {
    currentOccupation,
    chosenCareer,
    yearsOfExperience,
    educationLevel,
    location,
    preferredIndustries,
    preferredWorkAreas,
    careerInterests,
    skills, // array of { name, proficiency, category }
  } = req.body;

  let profile = await CareerProfile.findOne({ user: req.user._id });

  const activeCareer = chosenCareer || currentOccupation;

  if (!profile) {
    if (!activeCareer) {
      return res.status(400).json({
        status: "fail",
        message: "Chosen career occupation is required to create a profile.",
      });
    }

    profile = new CareerProfile({
      user: req.user._id,
      currentOccupation: activeCareer,
      chosenCareer: activeCareer,
      yearsOfExperience: yearsOfExperience || 0,
      educationLevel: educationLevel || "",
      location: location || "",
      preferredIndustries: preferredIndustries || [],
      preferredWorkAreas: preferredWorkAreas || [],
      careerInterests: careerInterests || [],
      skills: skills || [],
    });
  } else {
    if (activeCareer !== undefined) {
      profile.currentOccupation = activeCareer;
      profile.chosenCareer = activeCareer;
    }
    if (yearsOfExperience !== undefined) profile.yearsOfExperience = yearsOfExperience;
    if (educationLevel !== undefined) profile.educationLevel = educationLevel;
    if (location !== undefined) profile.location = location;
    if (preferredIndustries !== undefined) profile.preferredIndustries = preferredIndustries;
    if (preferredWorkAreas !== undefined) profile.preferredWorkAreas = preferredWorkAreas;
    if (careerInterests !== undefined) profile.careerInterests = careerInterests;

    if (skills !== undefined) {
      profile.skills = skills;
    }
  }

  // If skills list is empty, auto-seed with core and emerging skills from occupation
  if (profile.skills.length === 0) {
    const occ = await Occupation.findOne({ name: profile.chosenCareer || profile.currentOccupation });
    if (occ) {
      const seededSkills = [];
      (occ.coreSkills || []).forEach((s) => {
        seededSkills.push({ name: s, proficiency: 40, category: "Core", source: "self-assessed" });
      });
      (occ.aiAugmentedSkills || []).forEach((s) => {
        seededSkills.push({ name: s, proficiency: 30, category: "AI-Augmented", source: "self-assessed" });
      });
      (occ.emergingSkills || []).forEach((s) => {
        seededSkills.push({ name: s, proficiency: 10, category: "Emerging", source: "self-assessed" });
      });
      (occ.humanCentricSkills || []).forEach((s) => {
        seededSkills.push({ name: s, proficiency: 50, category: "Human-Centric", source: "self-assessed" });
      });
      profile.skills = seededSkills;
    }
  }

  await profile.save();
  profile = await refreshReadiness(req.user._id);

  res.status(200).json({
    status: "success",
    data: { profile },
  });
});

// @desc    Get recommended career transitions with Fit and Distance scores
// @route   GET /api/career/transitions
// @access  Private
exports.getCareerTransitions = asyncHandler(async (req, res) => {
  const profile = await CareerProfile.findOne({ user: req.user._id });
  if (!profile) {
    return res.status(400).json({
      status: "fail",
      message: "Setup your career profile first.",
    });
  }

  const occupations = await Occupation.find({ name: { $ne: profile.currentOccupation } });

  const recommendations = occupations.map((occ) => {
    const overlap = scoringService.calculateSkillOverlap(profile.skills, occ.skills);
    const fitScore = scoringService.calculateCareerFit(
      profile.skills,
      occ.skills,
      profile.careerInterests,
      occ.name,
      occ.industry
    );
    const distance = scoringService.calculateTransitionDistance(profile.skills, occ.skills);

    const { gaps } = scoringService.calculateSkillGap(profile.skills, occ.skills);

    return {
      _id: occ._id,
      name: occ.name,
      description: occ.description,
      industry: occ.industry,
      fitScore,
      overlap,
      distanceScore: distance.score,
      distanceLabel: distance.label,
      gapsSummary: gaps.filter((g) => g.gap > 0).map((g) => g.name),
    };
  });

  // Sort by fit score descending
  recommendations.sort((a, b) => b.fitScore - a.fitScore);

  res.status(200).json({
    status: "success",
    results: recommendations.length,
    data: { recommendations },
  });
});

// @desc    Select target career and generate learning roadmap
// @route   POST /api/career/targets
// @access  Private
exports.setTargetCareer = asyncHandler(async (req, res) => {
  const { targetName } = req.body;
  if (!targetName) {
    return res.status(400).json({
      status: "fail",
      message: "Please specify target career name.",
    });
  }

  const targetOcc = await Occupation.findOne({ name: targetName });
  if (!targetOcc) {
    return res.status(404).json({
      status: "fail",
      message: "Target career occupation data not found in database.",
    });
  }

  let profile = await CareerProfile.findOne({ user: req.user._id });
  if (!profile) {
    return res.status(400).json({
      status: "fail",
      message: "Setup your career profile first.",
    });
  }

  profile.targetOccupation = targetName;
  await profile.save();

  // Create or retrieve Goal for this transition
  const goalTitle = `Transition to ${targetName}`;
  let goal = await Goal.findOne({ user: req.user._id, title: goalTitle });
  if (!goal) {
    goal = await Goal.create({
      title: goalTitle,
      category: "Programming",
      status: "in-progress",
      progress: 0,
      user: req.user._id,
    });
  }

  // Generate Personalized Transition Roadmap
  const { gaps } = scoringService.calculateSkillGap(profile.skills, targetOcc.skills);
  const missingSkills = gaps.filter((g) => g.gap > 20).map((g) => g.name);

  // Clear older roadmap if it exists
  await Roadmap.deleteMany({ user: req.user._id, title: `Transition to ${targetName}` });

  const steps = [];
  missingSkills.forEach((skillName, idx) => {
    steps.push({
      title: `Master ${skillName}`,
      description: `Understand core paradigms, commands, and best practices of ${skillName}.`,
      completed: false,
      requiredTime: 60,
      timeSpent: 0,
      resources: [
        {
          title: `${skillName} Official Documentation`,
          url: `https://www.google.com/search?q=${encodeURIComponent(skillName + " official documentation Reference")}`,
          type: "documentation",
        },
      ],
    });
  });

  // Append standard project and interview preparation steps
  steps.push({
    title: `Build Portfolio Project`,
    description: `Construct a real-world project demonstrating integrated mastery of: ${missingSkills.join(
      ", "
    )}.`,
    completed: false,
    requiredTime: 90,
    timeSpent: 0,
    resources: [
      {
        title: "Portfolio Project Best Practices",
        url: "https://www.google.com/search?q=github+portfolio+project+guide",
        type: "article",
      },
    ],
  });

  steps.push({
    title: `Interview Preparation & Simulation`,
    description: `Execute mock interview prep and review behavioral scenarios for the ${targetName} role.`,
    completed: false,
    requiredTime: 45,
    timeSpent: 0,
    resources: [
      {
        title: "Mock Interview Guide",
        url: "https://www.google.com/search?q=mock+interview+coding+questions",
        type: "exercise",
      },
    ],
  });

  const roadmap = await Roadmap.create({
    title: `Transition to ${targetName}`,
    description: `Personalized transition learning pathway from ${profile.currentOccupation} to ${targetName}.`,
    progress: 0,
    steps,
    user: req.user._id,
    goal: goal._id,
  });

  profile = await refreshReadiness(req.user._id);

  res.status(200).json({
    status: "success",
    data: {
      profile,
      roadmap,
    },
  });
});

// @desc    Reset user career profile and related roadmap/goal transitions
// @route   DELETE /api/career/profile
// @access  Private
exports.resetCareerProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const profile = await CareerProfile.findOne({ user: userId });

  if (profile) {
    const targetName = profile.targetOccupation;
    if (targetName) {
      await Roadmap.deleteMany({ user: userId, title: `Transition to ${targetName}` });
      await Goal.deleteMany({ user: userId, title: `Transition to ${targetName}` });
    }
    await CareerProfile.deleteOne({ user: userId });
  }

  res.status(200).json({
    status: "success",
    message: "Career profile reset successfully.",
  });
});

// @desc    Add recommended AI skills steps to existing active roadmap
// @route   POST /api/career/roadmap-enhance
// @access  Private
exports.enhanceRoadmap = asyncHandler(async (req, res) => {
  const { skillNames } = req.body;
  if (!skillNames || !Array.isArray(skillNames) || skillNames.length === 0) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide an array of skillNames to add.",
    });
  }

  const profile = await CareerProfile.findOne({ user: req.user._id });
  if (!profile) {
    return res.status(400).json({
      status: "fail",
      message: "Please configure your job profile first.",
    });
  }

  const careerName = profile.chosenCareer || profile.currentOccupation;

  // Find user's dedicated career roadmap.
  let roadmap = await Roadmap.findOne({
    user: req.user._id,
    title: `Learning Path: ${careerName}`,
  });

  if (!roadmap) {
    const goalTitle = `Become an AI-ready ${careerName}`;
    let goal = await Goal.findOne({ user: req.user._id, title: goalTitle });
    if (!goal) {
      goal = await Goal.create({
        title: goalTitle,
        category: "Programming",
        status: "in-progress",
        progress: 0,
        user: req.user._id,
      });
    }
    roadmap = await Roadmap.create({
      title: `Learning Path: ${careerName}`,
      description: `Structured career intelligence pathway for ${careerName}.`,
      progress: 0,
      steps: [],
      user: req.user._id,
      goal: goal._id,
    });
  }

  // Pre-configured dynamic sub-steps for AI-era skills
  const subStepsMap = {
    "llm apis": [
      "Understand LLM fundamentals and token constraints",
      "Learn API-based model interaction and completion requests",
      "Format structured outputs using schemas",
      "Design context prompt layouts",
      "Implement model tool calling and functions",
      "Implement model response streaming",
      "Handle API rate limits and network errors",
      "Build an AI-powered project feature",
      "Configure automated evaluation checks",
      "Deploy the AI feature service endpoint"
    ],
    "rag (retrieval augmentation)": [
      "Study RAG pattern components and document loaders",
      "Build text chunking strategy tests",
      "Integrate vector embedding APIs",
      "Configure vector database indexes (Pinecone or MongoDB Atlas)",
      "Design similarity search query retrievers",
      "Integrate context injection filters in model prompts",
      "Handle prompt injection and citation verifications",
      "Build a documentation search QA prototype assistant"
    ],
    "ai application architecture": [
      "Study Agent loops and memory paradigms",
      "Implement sequential tool execution chains",
      "Design user session conversation histories in Redis",
      "Integrate Human-in-the-loop validation checkpoints",
      "Write advanced model system prompts and safety gates"
    ],
    "ai evaluation": [
      "Design AI output accuracy metrics",
      "Configure golden datasets with expected outputs",
      "Execute batch model evaluation tests",
      "Track model latency and token billing metrics",
      "Build a model comparison diagnostic feedback dashboard"
    ],
    "ai security": [
      "Audit application logic against prompt injections",
      "Configure server-side moderation filters",
      "Setup key proxies and secret manager rotators",
      "Enforce context payload limit constraints",
      "Audit model connections access control logs"
    ]
  };

  const stepsAdded = [];
  const currentStepTitles = new Set(roadmap.steps.map((s) => s.title.toLowerCase()));

  skillNames.forEach((skillName) => {
    const key = skillName.toLowerCase().trim();
    const modules = subStepsMap[key] || [
      `Learn ${skillName} core concepts`,
      `Practice coding with ${skillName} tools`,
      `Implement a small project practicing ${skillName}`,
      `Review security and efficiency for ${skillName}`
    ];

    modules.forEach((moduleTitle) => {
      const fullTitle = `${skillName}: ${moduleTitle}`;
      if (!currentStepTitles.has(fullTitle.toLowerCase())) {
        roadmap.steps.push({
          title: fullTitle,
          description: `Study module for ${skillName} transition.`,
          completed: false,
          requiredTime: 30,
          timeSpent: 0,
          resources: [
            {
              title: `${skillName} Official Reference`,
              url: `https://www.google.com/search?q=${encodeURIComponent(skillName + " official guide " + moduleTitle)}`,
              type: "documentation",
            },
          ],
        });
        stepsAdded.push(fullTitle);
        currentStepTitles.add(fullTitle.toLowerCase());
      }
    });
  });

  if (stepsAdded.length > 0) {
    const total = roadmap.steps.length;
    const completed = roadmap.steps.filter((s) => s.completed).length;
    roadmap.progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    await roadmap.save();
  }

  // Refresh readiness scores
  const updatedProfile = await refreshReadiness(req.user._id);

  res.status(200).json({
    status: "success",
    message: `Successfully added ${stepsAdded.length} new modules to your roadmap.`,
    data: {
      stepsAdded,
      roadmap,
      profile: updatedProfile,
    },
  });
});

exports.refreshReadiness = refreshReadiness;

const Roadmap = require("../models/Roadmap");
const Goal = require("../models/Goal");
const StudySession = require("../models/StudySession");
const asyncHandler = require("../utils/asyncHandler");
const groq = require("../utils/groq");

const syncGoalProgress = async (goalId, progress) => {
  if (!goalId) return;
  try {
    const goal = await Goal.findById(goalId);
    if (!goal) return;

    goal.progress = progress;
    if (progress === 100) {
      goal.status = "completed";
    } else if (progress > 0) {
      goal.status = "in-progress";
    } else {
      goal.status = "pending";
    }
    await goal.save();
  } catch (err) {
    console.error("Failed to sync goal progress:", err);
  }
};

const estimateStudyTime = (title) => {
  if (!title) return 30;
  const lowerTitle = title.toLowerCase();
  const highKeywords = ["build", "implement", "master", "advanced", "configure", "deploy", "design", "architecture", "deep", "optimize", "structure", "custom", "testing", "security", "auth", "integration"];
  const lowKeywords = ["setup", "install", "intro", "introduction", "overview", "hello", "start", "basic", "basics", "prerequisites"];

  const hasHigh = highKeywords.some(keyword => lowerTitle.includes(keyword));
  const hasLow = lowKeywords.some(keyword => lowerTitle.includes(keyword));

  if (hasHigh) return 60;
  if (hasLow) return 15;
  return 30;
};

const enrichStepsWithAI = async (steps, roadmapTitle) => {
  if (!steps || !Array.isArray(steps) || steps.length === 0) return steps;

  try {
    const prompt = `
Given the learning roadmap title "${roadmapTitle}" and the following steps:
${JSON.stringify(steps.map((s) => ({ title: s.title })), null, 2)}

Provide descriptions, exactly 1 highly trusted official documentation resource URL, and estimated requiredTime in minutes for each step.
Return ONLY valid JSON matching this format:
[
  {
    "title": "Step Title (must match exactly)",
    "description": "Short explanation of what concepts should be studied",
    "requiredTime": 30,
    "resources": [
      {
        "title": "Official Documentation Name (e.g., MDN Web Docs, React Official Docs, Express API Reference)",
        "url": "Must be a stable, verified official documentation link or search query URL that NEVER 404s. Do NOT use deep sub-paths that can break. Prefer official landing pages (e.g. https://react.dev/reference/react) or search queries on the official documentation site (e.g. https://developer.mozilla.org/en-US/search?q=javascript+array+map or https://mongoosejs.com/docs/search.html). Do NOT link to blogs, video tutorials, or unofficial articles.",
        "type": "documentation"
      }
    ]
  }
]

Provide an estimated study duration in 'requiredTime' (integer in minutes). Calculate this based on the difficulty and complexity of the step's topic (e.g., 15 minutes for basic installations, setups, or intros; 30-45 minutes for standard core concepts/APIs; and 60-90 minutes for complex implementations, integrations, architectures, or debugging).
Do not include markdown or explanations.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert learning resources generator.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
    });

    let resContent = completion.choices[0].message.content;
    resContent = resContent
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const enriched = JSON.parse(resContent);

    const enrichedSteps = steps.map((step) => {
      const match = enriched.find(
        (e) => e.title.toLowerCase() === step.title.toLowerCase()
      );
      if (match) {
        return {
          title: step.title,
          completed: step.completed || false,
          description: match.description,
          resources: match.resources,
          timeSpent: step.timeSpent || 0,
          requiredTime: match.requiredTime || estimateStudyTime(step.title),
        };
      }
      return {
        title: step.title,
        completed: step.completed || false,
        description: `Study and master concepts related to ${step.title}.`,
        resources: [
          {
            title: `Learn ${step.title} on Google`,
            url: `https://www.google.com/search?q=how+to+learn+${encodeURIComponent(step.title)}`,
            type: "documentation",
          },
        ],
        timeSpent: step.timeSpent || 0,
        requiredTime: estimateStudyTime(step.title),
      };
    });

    const { verifyAndFilterResources } = require("../utils/urlVerifier");
    return await verifyAndFilterResources(enrichedSteps);
  } catch (err) {
    console.error("AI step enrichment failed:", err);
    return steps.map((step) => ({
      title: step.title,
      completed: step.completed || false,
      description: `Study and master concepts related to ${step.title}.`,
      resources: [
        {
          title: `Learn ${step.title} on Google`,
          url: `https://www.google.com/search?q=how+to+learn+${encodeURIComponent(step.title)}`,
          type: "documentation",
        },
      ],
      timeSpent: step.timeSpent || 0,
      requiredTime: estimateStudyTime(step.title),
    }));
  }
};

exports.createRoadmap = asyncHandler(async (req, res) => {
  const { title, description, steps, goal } = req.body;

  let processedSteps = steps;
  if (steps && Array.isArray(steps)) {
    processedSteps = await enrichStepsWithAI(steps, title);
  }

  const roadmap = await Roadmap.create({
    title,
    description,
    steps: processedSteps,
    user: req.user._id,
    goal: goal || null,
  });

  // Sync initial progress to goal (which is 0)
  if (goal) {
    await syncGoalProgress(goal, 0);
  }

  res.status(201).json({
    status: "success",
    message: "Roadmap created successfully",
    data: {
      roadmap,
    },
  });
});

exports.getRoadmaps = asyncHandler(async (req, res) => {
  const roadmaps = await Roadmap.find({ user: req.user._id }).populate(
    "user",
    "name email",
  ).populate("goal", "title category");

  res.status(200).json({
    status: "success",
    message: "Roadmaps fetched successfully",
    results: roadmaps.length,
    data: { roadmaps },
  });
});

exports.completeStep = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findById(req.params.roadmapId);

  if (!roadmap) {
    const error = new Error("Roadmap not Found");
    error.statusCode = 404;

    throw error;
  }

  if (roadmap.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      status: "fail",
      message: "Not authorized",
    });
  }

  const step = roadmap.steps.id(req.params.stepId);

  if (!step) {
    return res.status(404).json({
      status: "fail",
      message: "Step not found",
    });
  }

  // Toggle step completion instead of hardcoding to true
  step.completed = !step.completed;

  const completedSteps = roadmap.steps.filter((step) => step.completed).length;

  roadmap.progress = roadmap.steps.length > 0 ? Math.round((completedSteps / roadmap.steps.length) * 100) : 0;

  await roadmap.save();

  // Sync progress to the goal if linked
  if (roadmap.goal) {
    await syncGoalProgress(roadmap.goal, roadmap.progress);
  }

  res.status(200).json({
    status: "success",
    message: "Step successfully completed",
    data: {
      roadmap,
    },
  });
});

exports.deleteRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findById(req.params.id);

  if (!roadmap) {
    res.status(404);
    throw new Error("Roadmap not found");
  }

  if (roadmap.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  await roadmap.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Roadmap deleted successfully",
  });
});

exports.studyStep = asyncHandler(async (req, res) => {
  const { roadmapId, stepId } = req.params;
  const { duration, notes } = req.body;

  const parsedDuration = Math.max(1, Math.round(Number(duration)));

  const roadmap = await Roadmap.findById(roadmapId);
  if (!roadmap) {
    return res.status(404).json({
      status: "fail",
      message: "Roadmap not found",
    });
  }

  if (roadmap.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: "fail",
      message: "Not authorized",
    });
  }

  const step = roadmap.steps.id(stepId);
  if (!step) {
    return res.status(404).json({
      status: "fail",
      message: "Step not found",
    });
  }

  // Add time spent to the step
  if (!step.timeSpent) step.timeSpent = 0;
  step.timeSpent += parsedDuration;

  const threshold = step.requiredTime || 15;

  // Auto-complete only if total accumulated time meets the threshold
  if (step.timeSpent >= threshold) {
    step.completed = true;
  }

  // Recalculate progress
  const completedSteps = roadmap.steps.filter((s) => s.completed).length;
  roadmap.progress =
    roadmap.steps.length > 0
      ? Math.round((completedSteps / roadmap.steps.length) * 100)
      : 0;

  await roadmap.save();

  // Sync to Linked Goal
  if (roadmap.goal) {
    await syncGoalProgress(roadmap.goal, roadmap.progress);
  }

  // Create Study Session
  const studySession = await StudySession.create({
    user: req.user._id,
    goal: roadmap.goal || undefined,
    roadmap: roadmap._id,
    stepId: step._id,
    duration: parsedDuration,
    notes: notes || `Completed study milestone: ${step.title}`,
  });

  res.status(200).json({
    status: "success",
    message: "Study time logged and step completed",
    data: {
      roadmap,
      studySession,
    },
  });
});

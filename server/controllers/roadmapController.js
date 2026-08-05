const Roadmap = require("../models/Roadmap");
const Goal = require("../models/Goal");
const asyncHandler = require("../utils/asyncHandler");

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

exports.createRoadmap = asyncHandler(async (req, res) => {
  const { title, description, steps, goal } = req.body;

  const roadmap = await Roadmap.create({
    title,
    description,
    steps,
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

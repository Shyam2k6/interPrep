const Roadmap = require("../models/Roadmap");
const asyncHandler = require("../utils/asyncHandler");

exports.createRoadmap = asyncHandler(async (req, res) => {
  const { title, description, steps } = req.body;

  const roadmap = await Roadmap.create({
    title,
    description,
    steps,
    user: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      roadmap,
    },
  });
});

exports.getRoadmaps = asyncHandler(async (req, res) => {
  const roadmaps = await Roadmap.find({ user: req.user._id }).populate(
    "user",
    "name email",
  );

  res.status(200).json({
    status: "success",
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

  step.completed = true;

  const completedSteps = roadmap.steps.filter((step) => step.completed).length;

  roadmap.progress = Math.round((completedSteps / roadmap.steps.length) * 100);

  await roadmap.save();

  res.status(200).json({
    status: "success",
    data: roadmap,
  });
});

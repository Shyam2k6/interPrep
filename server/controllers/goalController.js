const Goal = require("../models/Goal");
const asyncHandler = require("../utils/asyncHandler");

exports.createGoal = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const goal = await Goal.create({
    title,
    user: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      goal,
    },
  });
});

exports.getGoals = asyncHandler(async (req, res) => {
  const goal = await Goal.find({ user: req.user._id }).populate(
    "user",
    "name email",
  );

  res.status(200).json({
    status: "success",
    results: goal.length,
    data: {
      goal,
    },
  });
});

exports.deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    return res.status(404).json({
      status: "fail",
      message: "Goal not found",
    });
  }
  if (goal.user.toString() !== req.user.id.toString()) {
    return res.status(400).json({
      status: "fail",
      message: "Not Authorized",
    });
  }

  await goal.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Goal deleted successfully",
  });
});

exports.updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    return res.status(404).json({
      status: "fail",
      message: "Goal not found",
    });
  }

  if (goal.user.toString() !== req.user.id.toString()) {
    return res.status(400).json({
      status: "fail",
      message: "Not Authorized",
    });
  }

  goal.title = req.body.title || goal.title;

  if (req.body.status) {
    goal.status = req.body.status;
  }

  if (req.body.status !== undefined) {
    goal.progress = req.body.progress;
  }

  if (goal.progress === 100) {
    goal.status = "completed";
  }

  await goal.save();

  res.status(200).json({
    status: "success",
    data: {
      goal,
    },
  });
});

exports.getGoalStats = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });

  const totalGoals = goals.length;

  const completedGoals = goals.filter(
    (goal) => goal.status === "completed",
  ).length;

  const pendingGoals = goals.filter((goal) => goal.status === "pending").length;

  const inProgressGoals = goals.filter(
    (goal) => goal.status === "in-progress",
  ).length;

  res.status(200).json({
    status: "success",
    data: {
      totalGoals,
      inProgressGoals,
      pendingGoals,
      completedGoals,
    },
  });
});

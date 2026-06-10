const Goal = require("../models/Goal");

exports.createGoal = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const goal = await Goal.find({ user: req.user._id });

    res.status(200).json({
      status: "success",
      results: goal.length,
      data: {
        goal,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
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
    await Goal.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Goal deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateGoal = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getGoalStats = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });

    const totalGoals = goals.length;
    const completedGoals = goals.filter(
      (goal) => goal.status === "completed",
    ).length;
    const pendingGpals = goals.filter(
      (goal) => goal.status === "pending",
    ).length;
    const inProgressGoals = goals.filter(
      (goal) => goal.status === "in-progress",
    ).length;

    res.status(200).json({
      status: "success",
      data: {
        totalGoals,
        inProgressGoals,
        pendingGpals,
        completedGoals,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

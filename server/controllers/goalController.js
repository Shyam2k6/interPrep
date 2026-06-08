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

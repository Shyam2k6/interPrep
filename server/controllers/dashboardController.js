const Goal = require("../models/Goal");
const Roadmap = require("../models/Roadmap");

exports.getDashboard = async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.user._id,
    });

    const roadmaps = await Roadmap.find({
      user: req.user._id,
    });

    const totalGoals = goals.length;

    const completedGoals = goals.filter(
      (goal) => goal.status === "completed",
    ).length;

    const averageProgress =
      roadmaps.length > 0
        ? Math.round(
            roadmaps.reduce((sum, roadmap) => sum + roadmap.progress, 0) /
              roadmaps.length,
          )
        : 0;

    res.status(200).json({
      status: "success",
      data: {
        totalGoals,
        completedGoals,
        roadmaps: roadmaps.length,
        averageProgress,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

const Goal = require("../models/Goal");
const StudySession = require("../models/StudySession");
const asyncHandler = require("../utils/asyncHandler");

exports.createStudySession = asyncHandler(async (req, res) => {
  const { goal, duration, notes } = req.body;

  const existingGoal = await Goal.findById(goal);

  if (!existingGoal) {
    return res.status(404).json({
      status: "fail",
      message: "Goal not found",
    });
  }

  if (existingGoal.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: "fail",
      message: "Not authorized",
    });
  }

  const studySession = await StudySession.create({
    goal,
    user: req.user._id,
    duration,
    notes,
  });

  res.status(201).json({
    status: "success",
    message: "Study session created successfully",
    data: {
      studySession,
    },
  });
});

exports.getStudySessions = asyncHandler(async (req, res) => {
  const studySessions = await StudySession.find({
    user: req.user._id,
  })
    .populate("goal", "title category")
    .sort({
      studiedAt: -1,
    });

  res.status(200).json({
    status: "success",
    results: studySessions.length,
    data: {
      studySessions,
    },
  });
});

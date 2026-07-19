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

exports.updateStudySession = asyncHandler(async (req, res) => {
  const studySession = await StudySession.findById(req.params.id);

  if (!studySession) {
    return res.status(404).json({
      status: "fail",
      message: "Study session not found",
    });
  }

  if (studySession.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: "fail",
      message: "Not authorized",
    });
  }

  if (req.body.duration !== undefined) {
    studySession.duration = req.body.duration;
  }

  if (req.body.notes !== undefined) {
    studySession.notes = req.body.notes;
  }

  await studySession.save();

  res.status(200).json({
    status: "success",
    message: "Study session updated successfully",
    data: {
      studySession,
    },
  });
});

exports.deleteStudySession = asyncHandler(async (req, res) => {
  const studySession = await StudySession.findById(req.params.id);

  if (!studySession) {
    return res.status(404).json({
      status: "fail",
      message: "Study session not found",
    });
  }

  if (studySession.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: "fail",
      message: "Not authorized",
    });
  }

  await studySession.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Study session deleted successfully",
  });
});

exports.getStudySessionStats = asyncHandler(async (req, res) => {
  const sessions = await StudySession.find({
    user: req.user._id,
  });

  const totalSessions = sessions.length;

  const totalStudyMinutes = sessions.reduce(
    (total, session) => total + session.duration,
    0,
  );

  const averageSessionDuration =
    totalSessions === 0 ? 0 : Math.round(totalStudyMinutes / totalSessions);

  res.status(200).json({
    status: "success",
    message: "Study session statistics fetched successfully",
    data: {
      totalSessions,
      totalStudyMinutes,
      averageSessionDuration,
    },
  });
});

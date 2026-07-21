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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysSessions = sessions.filter((session) => {
    const studyDate = new Date(session.studiedAt);

    studyDate.setHours(0, 0, 0, 0);

    return studyDate.getTime() === today.getTime();
  });

  const todayStudyMinutes = todaysSessions.reduce(
    (total, session) => total + session.duration,
    0,
  );

  res.status(200).json({
    status: "success",
    message: "Study session statistics fetched successfully",
    data: {
      totalSessions,
      totalStudyMinutes,
      averageSessionDuration,
      todayStudyMinutes,
    },
  });
});

exports.getWeeklyActivity = asyncHandler(async (req, res) => {
  const today = new Date();

  const day = today.getDay();

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - day);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const sessions = await StudySession.find({
    user: req.user._id,
    studiedAt: {
      $gte: startOfWeek,
      $lte: endOfWeek,
    },
  });

  const weeklyMinutes = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  sessions.forEach((session) => {
    const dayName = days[new Date(session.studiedAt).getDay()];
    weeklyMinutes[dayName] += session.duration;
  });

  const weeklyActivity = Object.entries(weeklyMinutes).map(
    ([day, minutes]) => ({
      day,
      minutes,
    }),
  );

  res.status(200).json({
    status: "success",
    data: {
      weeklyActivity,
    },
  });
});

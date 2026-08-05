const Notification = require("../models/Notification");
const Goal = require("../models/Goal");
const StudySession = require("../models/StudySession");
const Roadmap = require("../models/Roadmap");
const asyncHandler = require("../utils/asyncHandler");

exports.syncAndGetNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Sync Goal Deadline Tomorrow
  const startOfTomorrow = new Date();
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
  startOfTomorrow.setHours(0, 0, 0, 0);

  const endOfTomorrow = new Date();
  endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
  endOfTomorrow.setHours(23, 59, 59, 999);

  const tomorrowGoals = await Goal.find({
    user: userId,
    status: { $ne: "completed" },
    deadline: {
      $gte: startOfTomorrow,
      $lte: endOfTomorrow,
    },
  });

  const tomorrowStr = startOfTomorrow.toISOString().split("T")[0];
  for (const goal of tomorrowGoals) {
    const triggerKey = `deadline_tomorrow:${goal._id}:${tomorrowStr}`;
    const exists = await Notification.findOne({ user: userId, triggerKey });
    if (!exists) {
      await Notification.create({
        user: userId,
        title: "Goal Deadline Tomorrow ⏳",
        message: `Your goal "${goal.title}" is due tomorrow! Keep pushing to complete it.`,
        type: "warning",
        triggerKey,
      });
    }
  }

  // 2. Sync Haven't Studied Today
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const studyTodayCount = await StudySession.countDocuments({
    user: userId,
    studiedAt: {
      $gte: startOfToday,
      $lte: endOfToday,
    },
  });

  const todayStr = startOfToday.toISOString().split("T")[0];
  const studyTriggerKey = `study_prompt:${todayStr}`;

  if (studyTodayCount === 0) {
    const exists = await Notification.findOne({ user: userId, triggerKey: studyTriggerKey });
    if (!exists) {
      await Notification.create({
        user: userId,
        title: "Haven't Studied Today 🔥",
        message: "You haven't logged any study session today. Keep your learning momentum going!",
        type: "info",
        triggerKey: studyTriggerKey,
      });
    }
  } else {
    // If they have studied today, delete/resolve the reminder
    await Notification.deleteMany({ user: userId, triggerKey: studyTriggerKey });
  }

  // 3. Sync Roadmap Completed
  const completedRoadmaps = await Roadmap.find({
    user: userId,
    progress: 100,
  });

  for (const roadmap of completedRoadmaps) {
    const roadmapTriggerKey = `roadmap_completed:${roadmap._id}`;
    const exists = await Notification.findOne({ user: userId, triggerKey: roadmapTriggerKey });
    if (!exists) {
      await Notification.create({
        user: userId,
        title: "Roadmap Completed! 🎉",
        message: `Congratulations! You've finished all milestones in your roadmap "${roadmap.title}".`,
        type: "success",
        triggerKey: roadmapTriggerKey,
      });
    }
  }

  // Fetch all notifications sorted by newest
  const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    data: {
      notifications,
    },
  });
});

exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({
      status: "fail",
      message: "Notification not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      notification,
    },
  });
});

exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });

  res.status(200).json({
    status: "success",
    message: "All notifications marked as read",
  });
});

exports.deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!notification) {
    return res.status(404).json({
      status: "fail",
      message: "Notification not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Notification deleted",
  });
});

exports.clearAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ user: req.user._id });

  res.status(200).json({
    status: "success",
    message: "All notifications cleared",
  });
});

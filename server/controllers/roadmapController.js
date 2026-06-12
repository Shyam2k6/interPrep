const Roadmap = require("../models/Roadmap");

exports.createRoadmap = async (req, res) => {
  try {
    const { title, description, steps } = req.body;
    console.log(req.body);
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
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user._id });

    res.status(200).json({
      status: "success",
      results: roadmaps.length,
      data: { roadmaps },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.completeStep = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.roadmapId);

    if (!roadmap) {
      return res.status(404).json({
        status: "fail",
        message: "Roadmap not found",
      });
    }

    if (roadmap.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
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

    await roadmap.save();

    res.status(200).json({
      status: "success",
      data: roadmap,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

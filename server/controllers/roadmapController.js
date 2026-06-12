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

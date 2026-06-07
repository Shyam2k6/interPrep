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

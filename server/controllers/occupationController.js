const Occupation = require("../models/Occupation");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get all occupations
// @route   GET /api/occupations
// @access  Private
exports.getOccupations = asyncHandler(async (req, res) => {
  const occupations = await Occupation.find({}).select("name description industry dataSource");
  res.status(200).json({
    status: "success",
    results: occupations.length,
    data: { occupations },
  });
});

// @desc    Get occupation by ID
// @route   GET /api/occupations/:id
// @access  Private
exports.getOccupationById = asyncHandler(async (req, res) => {
  const occupation = await Occupation.findById(req.params.id);
  if (!occupation) {
    return res.status(404).json({
      status: "fail",
      message: "Occupation not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: { occupation },
  });
});

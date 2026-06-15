const errorHandler = (err, req, res, next) => {
  console.log("ERROR MIDDLEWARE HIT");
  res.status(err.statusCode || 500).json({
    status: "fail",
    message: err.message || "Server Error",
  });
};

module.exports = errorHandler;

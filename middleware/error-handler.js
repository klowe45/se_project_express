const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message || "Unknown error"}`);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    error: message,
  });
  next(err);
};

module.exports = errorHandler;

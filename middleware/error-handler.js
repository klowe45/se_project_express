const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message || "Unknown Error"}`);

  const statusCode = err.statusCode || 500;

  const message = err.message || "Server Issue";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
  next();
};

module.exports = errorHandler;

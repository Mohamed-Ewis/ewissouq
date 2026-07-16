const errorMiddleware = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    statusCode = 400;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    error: err.message,
  });
};

module.exports = errorMiddleware;

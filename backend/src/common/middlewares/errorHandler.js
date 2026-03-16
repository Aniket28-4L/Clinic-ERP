const { AppError } = require("../errors/AppError");

function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-unused-vars
  const _next = next;

  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const code = isAppError ? err.code : "INTERNAL_ERROR";

  const payload = {
    success: false,
    error: {
      code,
      message: isAppError ? err.message : "Internal server error",
    },
  };

  if (isAppError && err.details) payload.error.details = err.details;

  // Surface useful info in non-prod for faster development/debugging.
  if (process.env.NODE_ENV !== "production" && !isAppError) {
    payload.error.debug = {
      name: err?.name,
      message: err?.message,
      stack: err?.stack,
    };
  }

  return res.status(statusCode).json(payload);
}

module.exports = { errorHandler };


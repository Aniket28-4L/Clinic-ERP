const { AppError } = require("../errors/AppError");

function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.flatten();
      return next(new AppError("Validation failed", 400, "VALIDATION_ERROR", details));
    }
    req.body = parsed.data;
    return next();
  };
}

module.exports = { validateBody };


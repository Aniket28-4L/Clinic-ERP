const { AppError } = require("../errors/AppError");

function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403, "FORBIDDEN"));
    }
    return next();
  };
}

module.exports = { requireRoles };


const jwt = require("jsonwebtoken");
const { AppError } = require("../errors/AppError");
const { User } = require("../../modules/users/user.model");

async function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Missing or invalid Authorization header", 401, "UNAUTHORIZED"));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.sub).lean();
    if (!user || !user.isActive) {
      return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
    }
    req.user = { id: String(user._id), role: user.role, email: user.email, name: user.name, phone: user.phone };
    return next();
  } catch (e) {
    return next(new AppError("Invalid or expired token", 401, "UNAUTHORIZED"));
  }
}

module.exports = { authRequired };


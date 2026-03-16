const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { AppError } = require("../../common/errors/AppError");
const { User, ROLE_ENUM } = require("../users/user.model");

const ROLES = Object.freeze(ROLE_ENUM);

function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user._id), role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
  );
}

const authService = {
  async register(payload) {
    const { name, email, password, role, phone } = payload;

    if (!ROLES.includes(role)) {
      throw new AppError("Invalid role", 400, "VALIDATION_ERROR", { role: "Invalid role" });
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) throw new AppError("Email already in use", 409, "EMAIL_IN_USE");

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: passwordHash,
      role,
      phone,
      isActive: true,
    });

    const accessToken = signAccessToken(user);

    return {
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role, phone: user.phone },
      accessToken,
    };
  },

  async login(payload) {
    const { email, password } = payload;

    const user = await User.findOne({ email }).select("+password");
    // If user not found or legacy user without password field, treat as invalid creds
    if (!user || !user.password) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }
    if (!user.isActive) throw new AppError("Account disabled", 403, "ACCOUNT_DISABLED");

    const okPwd = await bcrypt.compare(password, user.password);
    if (!okPwd) throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");

    const accessToken = signAccessToken(user);
    return {
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role, phone: user.phone },
      accessToken,
    };
  },
};

module.exports = { authService, ROLES };


const { created, ok } = require("../../common/utils/response");
const { authService } = require("./auth.service");

const authController = {
  async register(req, res) {
    const result = await authService.register(req.body);
    return created(res, result);
  },

  async login(req, res) {
    const result = await authService.login(req.body);
    return ok(res, result);
  },

  async me(req, res) {
    return ok(res, { user: req.user });
  },
};

module.exports = { authController };


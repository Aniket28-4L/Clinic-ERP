const { ok, created } = require("../../common/utils/response");
const { medicineService } = require("./medicine.service");

const medicineController = {
  async create(req, res) {
    const doc = await medicineService.create(req.body, req.user.id);
    return created(res, doc);
  },

  async list(req, res) {
    const { q, page, limit, isActive } = req.query;
    const parsedIsActive =
      typeof isActive === "string" ? (isActive === "true" ? true : isActive === "false" ? false : undefined) : undefined;
    const result = await medicineService.list({ q, page, limit, isActive: parsedIsActive });
    return ok(res, result);
  },

  async getById(req, res) {
    const doc = await medicineService.getById(req.params.id);
    return ok(res, doc);
  },

  async update(req, res) {
    const doc = await medicineService.update(req.params.id, req.body, req.user.id);
    return ok(res, doc);
  },

  async remove(req, res) {
    const result = await medicineService.remove(req.params.id);
    return ok(res, result);
  },
};

module.exports = { medicineController };


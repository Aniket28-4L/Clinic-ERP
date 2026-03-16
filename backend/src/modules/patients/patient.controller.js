const { ok, created } = require("../../common/utils/response");
const { patientService } = require("./patient.service");

const patientController = {
  async create(req, res) {
    const doc = await patientService.create(req.body, req.user.id);
    return created(res, doc);
  },

  async list(req, res) {
    const { q, page, limit, isActive } = req.query;
    const parsedIsActive =
      typeof isActive === "string" ? (isActive === "true" ? true : isActive === "false" ? false : undefined) : undefined;
    const result = await patientService.list({ q, page, limit, isActive: parsedIsActive });
    return ok(res, result);
  },

  async getById(req, res) {
    const doc = await patientService.getById(req.params.id);
    return ok(res, doc);
  },

  async update(req, res) {
    const doc = await patientService.update(req.params.id, req.body, req.user.id);
    return ok(res, doc);
  },

  async remove(req, res) {
    const result = await patientService.remove(req.params.id);
    return ok(res, result);
  },
};

module.exports = { patientController };


const { ok, created } = require("../../common/utils/response");
const { doctorService } = require("./doctor.service");

const doctorController = {
  async create(req, res) {
    const doc = await doctorService.create(req.body);
    return created(res, doc);
  },

  async list(req, res) {
    const { q, page, limit } = req.query;
    const result = await doctorService.list({ q, page, limit });
    return ok(res, result);
  },

  async getById(req, res) {
    const doc = await doctorService.getById(req.params.id);
    return ok(res, doc);
  },

  async me(req, res) {
    const doc = await doctorService.getByUserId(req.user.id);
    return ok(res, doc);
  },

  async update(req, res) {
    const doc = await doctorService.update(req.params.id, req.body);
    return ok(res, doc);
  },

  async remove(req, res) {
    const result = await doctorService.remove(req.params.id);
    return ok(res, result);
  },
};

module.exports = { doctorController };


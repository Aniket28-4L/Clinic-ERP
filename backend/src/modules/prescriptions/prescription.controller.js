const { ok, created } = require("../../common/utils/response");
const { prescriptionService } = require("./prescription.service");

const prescriptionController = {
  async create(req, res) {
    const doc = await prescriptionService.create(req.body);
    return created(res, doc);
  },

  async list(req, res) {
    const { patientId, doctorId, page, limit } = req.query;
    const result = await prescriptionService.list({ patientId, doctorId, page, limit });
    return ok(res, result);
  },

  async getById(req, res) {
    const doc = await prescriptionService.getById(req.params.id);
    return ok(res, doc);
  },

  async update(req, res) {
    const doc = await prescriptionService.update(req.params.id, req.body);
    return ok(res, doc);
  },

  async remove(req, res) {
    const result = await prescriptionService.remove(req.params.id);
    return ok(res, result);
  },
};

module.exports = { prescriptionController };


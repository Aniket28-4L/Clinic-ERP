const { ok, created } = require("../../common/utils/response");
const { appointmentService } = require("./appointment.service");

const appointmentController = {
  async create(req, res) {
    const doc = await appointmentService.create(req.body, req.user.id);
    return created(res, doc);
  },

  async list(req, res) {
    const { patientId, doctorId, status, from, to, page, limit } = req.query;
    const result = await appointmentService.list({ patientId, doctorId, status, from, to, page, limit });
    return ok(res, result);
  },

  async listToday(req, res) {
    const { doctorId } = req.query;
    const result = await appointmentService.listToday({ doctorId });
    return ok(res, result);
  },

  async getById(req, res) {
    const doc = await appointmentService.getById(req.params.id);
    return ok(res, doc);
  },

  async update(req, res) {
    const doc = await appointmentService.update(req.params.id, req.body, req.user.id);
    return ok(res, doc);
  },

  async remove(req, res) {
    const result = await appointmentService.remove(req.params.id);
    return ok(res, result);
  },
};

module.exports = { appointmentController };


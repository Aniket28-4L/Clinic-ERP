const dayjs = require("dayjs");
const { AppError } = require("../../common/errors/AppError");
const { Appointment } = require("./appointment.model");

function buildAppointmentFilter({ patientId, doctorId, status, from, to }) {
  const filter = {};
  if (patientId) filter.patientId = patientId;
  if (doctorId) filter.doctorId = doctorId;
  if (status) filter.status = status;

  if (from || to) {
    filter.appointmentDate = {};
    if (from) filter.appointmentDate.$gte = new Date(from);
    if (to) filter.appointmentDate.$lte = new Date(to);
  }
  return filter;
}

const appointmentService = {
  async create(payload) {
    const doc = await Appointment.create(payload);
    return doc;
  },

  async list({ patientId, doctorId, status, from, to, page = 1, limit = 20 }) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (safePage - 1) * safeLimit;

    const filter = buildAppointmentFilter({ patientId, doctorId, status, from, to });
    const sort = { appointmentDate: 1, appointmentTime: 1 };

    const [items, total] = await Promise.all([
      Appointment.find(filter)
        .populate("patientId", "firstName lastName")
        .populate({ path: "doctorId", populate: { path: "userId", select: "name" } })
        .sort(sort)
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Appointment.countDocuments(filter),
    ]);

    return { items, page: safePage, limit: safeLimit, total };
  },

  async listToday({ doctorId }) {
    const startOfDay = dayjs().startOf("day").toDate();
    const endOfDay = dayjs().endOf("day").toDate();
    const filter = buildAppointmentFilter({ doctorId, from: startOfDay, to: endOfDay });
    const items = await Appointment.find(filter)
      .populate("patientId", "firstName lastName")
      .populate({ path: "doctorId", populate: { path: "userId", select: "name" } })
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .lean();
    return { items };
  },

  async getById(id) {
    const doc = await Appointment.findById(id)
      .populate("patientId", "firstName lastName")
      .populate({ path: "doctorId", populate: { path: "userId", select: "name" } })
      .lean();
    if (!doc) throw new AppError("Appointment not found", 404, "APPOINTMENT_NOT_FOUND");
    return doc;
  },

  async update(id, payload) {
    const doc = await Appointment.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
      .populate("patientId", "firstName lastName")
      .populate({ path: "doctorId", populate: { path: "userId", select: "name" } })
      .lean();
    if (!doc) throw new AppError("Appointment not found", 404, "APPOINTMENT_NOT_FOUND");
    return doc;
  },

  async remove(id) {
    const doc = await Appointment.findByIdAndDelete(id).lean();
    if (!doc) throw new AppError("Appointment not found", 404, "APPOINTMENT_NOT_FOUND");
    return { deleted: true };
  },
};

module.exports = { appointmentService };


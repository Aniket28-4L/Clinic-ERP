const { AppError } = require("../../common/errors/AppError");
const { Prescription } = require("./prescription.model");

const prescriptionService = {
  async create(payload) {
    const doc = await Prescription.create(payload);
    return doc;
  },

  async list({ patientId, doctorId, page = 1, limit = 20 }) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (safePage - 1) * safeLimit;

    const filter = {};
    if (patientId) filter.patientId = patientId;
    if (doctorId) filter.doctorId = doctorId;

    const [items, total] = await Promise.all([
      Prescription.find(filter)
        .populate("patientId", "firstName lastName")
        .populate({ path: "doctorId", populate: { path: "userId", select: "name" } })
        .populate("medicines.medicineId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Prescription.countDocuments(filter),
    ]);

    return { items, page: safePage, limit: safeLimit, total };
  },

  async getById(id) {
    const doc = await Prescription.findById(id)
      .populate("patientId", "firstName lastName")
      .populate({ path: "doctorId", populate: { path: "userId", select: "name" } })
      .populate("medicines.medicineId", "name")
      .lean();
    if (!doc) throw new AppError("Prescription not found", 404, "PRESCRIPTION_NOT_FOUND");
    return doc;
  },

  async update(id, payload) {
    const doc = await Prescription.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
      .populate("patientId", "firstName lastName")
      .populate({ path: "doctorId", populate: { path: "userId", select: "name" } })
      .populate("medicines.medicineId", "name")
      .lean();
    if (!doc) throw new AppError("Prescription not found", 404, "PRESCRIPTION_NOT_FOUND");
    return doc;
  },

  async remove(id) {
    const doc = await Prescription.findByIdAndDelete(id).lean();
    if (!doc) throw new AppError("Prescription not found", 404, "PRESCRIPTION_NOT_FOUND");
    return { deleted: true };
  },
};

module.exports = { prescriptionService };


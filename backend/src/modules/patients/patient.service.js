const { AppError } = require("../../common/errors/AppError");
const { Patient } = require("./patient.model");

function buildPatientSearchFilter({ q }) {
  const filter = {};
  if (q && q.trim()) {
    filter.$text = { $search: q.trim() };
  }
  return filter;
}

const patientService = {
  async create(payload) {
    const doc = await Patient.create(payload);
    return doc;
  },

  async list({ q, page = 1, limit = 20 }) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (safePage - 1) * safeLimit;

    const filter = buildPatientSearchFilter({ q });
    const sort = filter.$text ? { score: { $meta: "textScore" } } : { createdAt: -1 };

    const [items, total] = await Promise.all([
      Patient.find(filter, filter.$text ? { score: { $meta: "textScore" } } : undefined)
        .sort(sort)
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Patient.countDocuments(filter),
    ]);

    return {
      items,
      page: safePage,
      limit: safeLimit,
      total,
    };
  },

  async getById(id) {
    const doc = await Patient.findById(id).lean();
    if (!doc) throw new AppError("Patient not found", 404, "PATIENT_NOT_FOUND");
    return doc;
  },

  async update(id, payload) {
    const doc = await Patient.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
    if (!doc) throw new AppError("Patient not found", 404, "PATIENT_NOT_FOUND");
    return doc;
  },

  async remove(id) {
    const doc = await Patient.findByIdAndDelete(id).lean();
    if (!doc) throw new AppError("Patient not found", 404, "PATIENT_NOT_FOUND");
    return { deleted: true };
  },
};

module.exports = { patientService };


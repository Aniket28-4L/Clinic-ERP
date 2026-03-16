const { AppError } = require("../../common/errors/AppError");
const { Medicine } = require("./medicine.model");

function buildMedicineFilter({ q }) {
  const filter = {};
  if (q && q.trim()) filter.$text = { $search: q.trim() };
  return filter;
}

const medicineService = {
  async create(payload) {
    const doc = await Medicine.create(payload);
    return doc;
  },

  async list({ q, page = 1, limit = 20 }) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (safePage - 1) * safeLimit;

    const filter = buildMedicineFilter({ q });
    const sort = filter.$text ? { score: { $meta: "textScore" } } : { name: 1 };

    const [items, total] = await Promise.all([
      Medicine.find(filter, filter.$text ? { score: { $meta: "textScore" } } : undefined)
        .sort(sort)
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Medicine.countDocuments(filter),
    ]);

    return { items, page: safePage, limit: safeLimit, total };
  },

  async getById(id) {
    const doc = await Medicine.findById(id).lean();
    if (!doc) throw new AppError("Medicine not found", 404, "MEDICINE_NOT_FOUND");
    return doc;
  },

  async update(id, payload) {
    const doc = await Medicine.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
    if (!doc) throw new AppError("Medicine not found", 404, "MEDICINE_NOT_FOUND");
    return doc;
  },

  async remove(id) {
    const doc = await Medicine.findByIdAndDelete(id).lean();
    if (!doc) throw new AppError("Medicine not found", 404, "MEDICINE_NOT_FOUND");
    return { deleted: true };
  },
};

module.exports = { medicineService };


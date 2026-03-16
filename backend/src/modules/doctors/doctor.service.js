const mongoose = require("mongoose");

const { AppError } = require("../../common/errors/AppError");
const { User } = require("../users/user.model");
const { Doctor } = require("./doctor.model");

function buildDoctorSearchFilter({ q }) {
  const filter = {};
  if (q && q.trim()) {
    // Rough search on specialization; name/email live on User
    filter.specialization = new RegExp(q.trim(), "i");
  }
  return filter;
}

const doctorService = {
  async create(payload) {
    const userExists = await User.findById(payload.userId).lean();
    if (!userExists) throw new AppError("User not found", 400, "VALIDATION_ERROR", { userId: "User not found" });

    const doc = await Doctor.create(payload);
    return doc;
  },

  async list({ q, page = 1, limit = 20 }) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (safePage - 1) * safeLimit;

    const filter = buildDoctorSearchFilter({ q });

    const [items, total] = await Promise.all([
      Doctor.find(filter)
        .populate("userId", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Doctor.countDocuments(filter),
    ]);

    return { items, page: safePage, limit: safeLimit, total };
  },

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) throw new AppError("Doctor not found", 404, "DOCTOR_NOT_FOUND");
    const doc = await Doctor.findById(id).populate("userId", "name email phone").lean();
    if (!doc) throw new AppError("Doctor not found", 404, "DOCTOR_NOT_FOUND");
    return doc;
  },

  async getByUserId(userId) {
    const doc = await Doctor.findOne({ userId }).populate("userId", "name email phone").lean();
    if (!doc) throw new AppError("Doctor not found", 404, "DOCTOR_NOT_FOUND");
    return doc;
  },

  async update(id, payload) {
    const doc = await Doctor.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
      .populate("userId", "name email phone")
      .lean();
    if (!doc) throw new AppError("Doctor not found", 404, "DOCTOR_NOT_FOUND");
    return doc;
  },

  async remove(id) {
    const doc = await Doctor.findByIdAndDelete(id).lean();
    if (!doc) throw new AppError("Doctor not found", 404, "DOCTOR_NOT_FOUND");
    return { deleted: true };
  },
};

module.exports = { doctorService };


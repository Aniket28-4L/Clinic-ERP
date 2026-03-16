const mongoose = require("mongoose");
const { AppError } = require("../../common/errors/AppError");
const { Medicine } = require("../pharmacy/medicine.model");
const { InventoryTransaction } = require("./inventoryTransaction.model");

const inventoryTransactionService = {
  async create(payload) {
    const session = await mongoose.startSession();
    try {
      let created;
      await session.withTransaction(async () => {
        const med = await Medicine.findById(payload.medicineId).session(session);
        if (!med) throw new AppError("Medicine not found", 404, "MEDICINE_NOT_FOUND");

        const qty = payload.quantity;
        if (payload.type === "stock_out") {
          if ((med.stockQuantity || 0) < qty) {
            throw new AppError("Insufficient stock", 400, "INSUFFICIENT_STOCK");
          }
          med.stockQuantity = (med.stockQuantity || 0) - qty;
        } else {
          med.stockQuantity = (med.stockQuantity || 0) + qty;
        }
        await med.save({ session });

        created = await InventoryTransaction.create([{ ...payload }], { session });
      });

      const tx = Array.isArray(created) ? created[0] : created;
      return await InventoryTransaction.findById(tx._id).populate("medicineId", "name category").lean();
    } finally {
      session.endSession();
    }
  },

  async list({ medicineId, type, page = 1, limit = 20 }) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (safePage - 1) * safeLimit;

    const filter = {};
    if (medicineId) filter.medicineId = medicineId;
    if (type) filter.type = type;

    const [items, total] = await Promise.all([
      InventoryTransaction.find(filter)
        .populate("medicineId", "name category")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      InventoryTransaction.countDocuments(filter),
    ]);

    return { items, page: safePage, limit: safeLimit, total };
  },

  async remove(id) {
    const doc = await InventoryTransaction.findByIdAndDelete(id).lean();
    if (!doc) throw new AppError("Inventory transaction not found", 404, "INVENTORY_TRANSACTION_NOT_FOUND");
    return { deleted: true };
  },
};

module.exports = { inventoryTransactionService };


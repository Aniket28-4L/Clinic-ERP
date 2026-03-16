const { AppError } = require("../../common/errors/AppError");
const { Bill } = require("./bill.model");

function calcTotalAmount({ doctorFee = 0, medicineCharges = 0, labCharges = 0 }) {
  return Number(doctorFee || 0) + Number(medicineCharges || 0) + Number(labCharges || 0);
}

const billingService = {
  async createBill(payload) {
    const totalAmount = calcTotalAmount(payload);
    const doc = await Bill.create({
      ...payload,
      totalAmount,
      paymentStatus: payload.paymentStatus || "pending",
      paymentMethod: payload.paymentMethod || "cash",
    });
    return doc;
  },

  async listBills({ patientId, paymentStatus, page = 1, limit = 20 }) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (safePage - 1) * safeLimit;

    const filter = {};
    if (patientId) filter.patientId = patientId;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const [items, total] = await Promise.all([
      Bill.find(filter).populate("patientId", "firstName lastName").sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
      Bill.countDocuments(filter),
    ]);

    return { items, page: safePage, limit: safeLimit, total };
  },

  async getBill(id) {
    const bill = await Bill.findById(id).populate("patientId", "firstName lastName").lean();
    if (!bill) throw new AppError("Bill not found", 404, "BILL_NOT_FOUND");
    return bill;
  },

  async updateBill(id, payload) {
    const totalAmount = calcTotalAmount(payload);
    const bill = await Bill.findByIdAndUpdate(
      id,
      { ...payload, totalAmount },
      { new: true, runValidators: true }
    )
      .populate("patientId", "firstName lastName")
      .lean();
    if (!bill) throw new AppError("Bill not found", 404, "BILL_NOT_FOUND");
    return bill;
  },

  async deleteBill(id) {
    const bill = await Bill.findByIdAndDelete(id).lean();
    if (!bill) throw new AppError("Bill not found", 404, "BILL_NOT_FOUND");
    return { deleted: true };
  },

  async recordPayment(payload) {
    const bill = await Bill.findByIdAndUpdate(
      payload.billId,
      { paymentStatus: "paid", paymentMethod: payload.paymentMethod },
      { new: true, runValidators: true }
    )
      .populate("patientId", "firstName lastName")
      .lean();
    if (!bill) throw new AppError("Bill not found", 404, "BILL_NOT_FOUND");
    return { bill };
  },
};

module.exports = { billingService };


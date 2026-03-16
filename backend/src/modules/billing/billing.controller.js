const { ok, created } = require("../../common/utils/response");
const { billingService } = require("./billing.service");

const billingController = {
  async createBill(req, res) {
    const bill = await billingService.createBill(req.body);
    return created(res, bill);
  },

  async listBills(req, res) {
    const { patientId, paymentStatus, page, limit } = req.query;
    const result = await billingService.listBills({ patientId, paymentStatus, page, limit });
    return ok(res, result);
  },

  async getBill(req, res) {
    const bill = await billingService.getBill(req.params.id);
    return ok(res, bill);
  },

  async updateBill(req, res) {
    const bill = await billingService.updateBill(req.params.id, req.body);
    return ok(res, bill);
  },

  async deleteBill(req, res) {
    const result = await billingService.deleteBill(req.params.id);
    return ok(res, result);
  },

  async recordPayment(req, res) {
    const result = await billingService.recordPayment(req.body);
    return created(res, result);
  },
};

module.exports = { billingController };


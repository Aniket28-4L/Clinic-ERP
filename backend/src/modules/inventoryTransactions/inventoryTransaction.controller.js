const { ok, created } = require("../../common/utils/response");
const { inventoryTransactionService } = require("./inventoryTransaction.service");

const inventoryTransactionController = {
  async create(req, res) {
    const tx = await inventoryTransactionService.create(req.body);
    return created(res, tx);
  },

  async list(req, res) {
    const { medicineId, type, page, limit } = req.query;
    const result = await inventoryTransactionService.list({ medicineId, type, page, limit });
    return ok(res, result);
  },

  async remove(req, res) {
    const result = await inventoryTransactionService.remove(req.params.id);
    return ok(res, result);
  },
};

module.exports = { inventoryTransactionController };


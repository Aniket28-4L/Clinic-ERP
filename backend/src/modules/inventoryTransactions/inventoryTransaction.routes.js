const express = require("express");

const { asyncHandler } = require("../../common/utils/asyncHandler");
const { authRequired } = require("../../common/middlewares/auth");
const { requireRoles } = require("../../common/middlewares/rbac");
const { validateBody } = require("../../common/validators/validate");

const { inventoryTransactionController } = require("./inventoryTransaction.controller");
const { createInventoryTransactionSchema } = require("./inventoryTransaction.validators");

const inventoryTransactionRouter = express.Router();

inventoryTransactionRouter.use(authRequired);

inventoryTransactionRouter.get(
  "/",
  requireRoles("admin", "pharmacist"),
  asyncHandler(inventoryTransactionController.list)
);
inventoryTransactionRouter.post(
  "/",
  requireRoles("admin", "pharmacist"),
  validateBody(createInventoryTransactionSchema),
  asyncHandler(inventoryTransactionController.create)
);
inventoryTransactionRouter.delete(
  "/:id",
  requireRoles("admin", "pharmacist"),
  asyncHandler(inventoryTransactionController.remove)
);

module.exports = { inventoryTransactionRouter };


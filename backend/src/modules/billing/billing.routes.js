const express = require("express");

const { asyncHandler } = require("../../common/utils/asyncHandler");
const { authRequired } = require("../../common/middlewares/auth");
const { requireRoles } = require("../../common/middlewares/rbac");
const { validateBody } = require("../../common/validators/validate");

const { billingController } = require("./billing.controller");
const { createBillSchema, updateBillSchema, recordPaymentSchema } = require("./billing.validators");

const billingRouter = express.Router();

billingRouter.use(authRequired);

billingRouter.get("/", requireRoles("admin", "receptionist"), asyncHandler(billingController.listBills));
billingRouter.post(
  "/",
  requireRoles("admin", "receptionist"),
  validateBody(createBillSchema),
  asyncHandler(billingController.createBill)
);

billingRouter.get("/:id", requireRoles("admin", "receptionist"), asyncHandler(billingController.getBill));
billingRouter.put(
  "/:id",
  requireRoles("admin", "receptionist"),
  validateBody(updateBillSchema),
  asyncHandler(billingController.updateBill)
);
billingRouter.delete("/:id", requireRoles("admin"), asyncHandler(billingController.deleteBill));

billingRouter.post(
  "/payments",
  requireRoles("admin", "receptionist"),
  validateBody(recordPaymentSchema),
  asyncHandler(billingController.recordPayment)
);

module.exports = { billingRouter };


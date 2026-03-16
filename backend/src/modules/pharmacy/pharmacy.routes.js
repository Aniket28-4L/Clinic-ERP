const express = require("express");

const { asyncHandler } = require("../../common/utils/asyncHandler");
const { authRequired } = require("../../common/middlewares/auth");
const { requireRoles } = require("../../common/middlewares/rbac");
const { validateBody } = require("../../common/validators/validate");

const { medicineController } = require("./medicine.controller");
const { createMedicineSchema, updateMedicineSchema } = require("./medicine.validators");

const pharmacyRouter = express.Router();

pharmacyRouter.use(authRequired);

// Medicines CRUD
pharmacyRouter.get(
  "/medicines",
  requireRoles("admin", "pharmacist"),
  asyncHandler(medicineController.list)
);
pharmacyRouter.post(
  "/medicines",
  requireRoles("admin", "pharmacist"),
  validateBody(createMedicineSchema),
  asyncHandler(medicineController.create)
);
pharmacyRouter.get(
  "/medicines/:id",
  requireRoles("admin", "pharmacist"),
  asyncHandler(medicineController.getById)
);
pharmacyRouter.put(
  "/medicines/:id",
  requireRoles("admin", "pharmacist"),
  validateBody(updateMedicineSchema),
  asyncHandler(medicineController.update)
);
pharmacyRouter.delete("/medicines/:id", requireRoles("admin"), asyncHandler(medicineController.remove));

module.exports = { pharmacyRouter };


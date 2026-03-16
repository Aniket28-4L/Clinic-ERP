const express = require("express");

const { asyncHandler } = require("../../common/utils/asyncHandler");
const { authRequired } = require("../../common/middlewares/auth");
const { requireRoles } = require("../../common/middlewares/rbac");
const { validateBody } = require("../../common/validators/validate");

const { prescriptionController } = require("./prescription.controller");
const { createPrescriptionSchema, updatePrescriptionSchema } = require("./prescription.validators");

const prescriptionRouter = express.Router();

prescriptionRouter.use(authRequired);

prescriptionRouter.get(
  "/",
  requireRoles("admin", "doctor", "pharmacist"),
  asyncHandler(prescriptionController.list)
);
prescriptionRouter.post(
  "/",
  requireRoles("admin", "doctor"),
  validateBody(createPrescriptionSchema),
  asyncHandler(prescriptionController.create)
);
prescriptionRouter.get(
  "/:id",
  requireRoles("admin", "doctor", "pharmacist"),
  asyncHandler(prescriptionController.getById)
);
prescriptionRouter.put(
  "/:id",
  requireRoles("admin", "doctor"),
  validateBody(updatePrescriptionSchema),
  asyncHandler(prescriptionController.update)
);
prescriptionRouter.delete("/:id", requireRoles("admin"), asyncHandler(prescriptionController.remove));

module.exports = { prescriptionRouter };


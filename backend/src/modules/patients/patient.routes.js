const express = require("express");

const { asyncHandler } = require("../../common/utils/asyncHandler");
const { authRequired } = require("../../common/middlewares/auth");
const { requireRoles } = require("../../common/middlewares/rbac");
const { validateBody } = require("../../common/validators/validate");

const { patientController } = require("./patient.controller");
const { createPatientSchema, updatePatientSchema } = require("./patient.validators");

const patientRouter = express.Router();

patientRouter.use(authRequired);

patientRouter.get("/", requireRoles("admin", "receptionist", "doctor"), asyncHandler(patientController.list));
patientRouter.post(
  "/",
  requireRoles("admin", "receptionist"),
  validateBody(createPatientSchema),
  asyncHandler(patientController.create)
);
patientRouter.get("/:id", requireRoles("admin", "receptionist", "doctor"), asyncHandler(patientController.getById));
patientRouter.put(
  "/:id",
  requireRoles("admin", "receptionist"),
  validateBody(updatePatientSchema),
  asyncHandler(patientController.update)
);
patientRouter.delete("/:id", requireRoles("admin"), asyncHandler(patientController.remove));

module.exports = { patientRouter };


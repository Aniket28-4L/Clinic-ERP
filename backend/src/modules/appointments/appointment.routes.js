const express = require("express");

const { asyncHandler } = require("../../common/utils/asyncHandler");
const { authRequired } = require("../../common/middlewares/auth");
const { requireRoles } = require("../../common/middlewares/rbac");
const { validateBody } = require("../../common/validators/validate");

const { appointmentController } = require("./appointment.controller");
const { createAppointmentSchema, updateAppointmentSchema } = require("./appointment.validators");

const appointmentRouter = express.Router();

appointmentRouter.use(authRequired);

appointmentRouter.get(
  "/",
  requireRoles("admin", "receptionist", "doctor"),
  asyncHandler(appointmentController.list)
);
appointmentRouter.get(
  "/today",
  requireRoles("admin", "receptionist", "doctor"),
  asyncHandler(appointmentController.listToday)
);
appointmentRouter.post(
  "/",
  requireRoles("admin", "receptionist"),
  validateBody(createAppointmentSchema),
  asyncHandler(appointmentController.create)
);
appointmentRouter.get(
  "/:id",
  requireRoles("admin", "receptionist", "doctor"),
  asyncHandler(appointmentController.getById)
);
appointmentRouter.put(
  "/:id",
  requireRoles("admin", "receptionist"),
  validateBody(updateAppointmentSchema),
  asyncHandler(appointmentController.update)
);
appointmentRouter.delete(
  "/:id",
  requireRoles("admin", "receptionist"),
  asyncHandler(appointmentController.remove)
);

module.exports = { appointmentRouter };


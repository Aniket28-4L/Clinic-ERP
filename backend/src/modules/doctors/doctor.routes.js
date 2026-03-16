const express = require("express");

const { asyncHandler } = require("../../common/utils/asyncHandler");
const { authRequired } = require("../../common/middlewares/auth");
const { requireRoles } = require("../../common/middlewares/rbac");
const { validateBody } = require("../../common/validators/validate");

const { doctorController } = require("./doctor.controller");
const { createDoctorSchema, updateDoctorSchema } = require("./doctor.validators");

const doctorRouter = express.Router();

doctorRouter.use(authRequired);

doctorRouter.get("/me", requireRoles("doctor"), asyncHandler(doctorController.me));

doctorRouter.get("/", requireRoles("admin", "receptionist"), asyncHandler(doctorController.list));
doctorRouter.post("/", requireRoles("admin"), validateBody(createDoctorSchema), asyncHandler(doctorController.create));
doctorRouter.get("/:id", requireRoles("admin", "receptionist"), asyncHandler(doctorController.getById));
doctorRouter.put("/:id", requireRoles("admin"), validateBody(updateDoctorSchema), asyncHandler(doctorController.update));
doctorRouter.delete("/:id", requireRoles("admin"), asyncHandler(doctorController.remove));

module.exports = { doctorRouter };


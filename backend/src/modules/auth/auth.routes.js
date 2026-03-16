const express = require("express");
const { asyncHandler } = require("../../common/utils/asyncHandler");
const { authController } = require("./auth.controller");
const { validateBody } = require("../../common/validators/validate");
const { registerSchema, loginSchema } = require("./auth.validators");
const { authRequired } = require("../../common/middlewares/auth");

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), asyncHandler(authController.register));
authRouter.post("/login", validateBody(loginSchema), asyncHandler(authController.login));
authRouter.get("/me", authRequired, asyncHandler(authController.me));

module.exports = { authRouter };


const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");

const { notFound } = require("./common/middlewares/notFound");
const { errorHandler } = require("./common/middlewares/errorHandler");
const { createApiRateLimiter } = require("./common/middlewares/rateLimit");
const { xssSanitize } = require("./common/middlewares/xssSanitize");

const { authRouter } = require("./modules/auth/auth.routes");
const { patientRouter } = require("./modules/patients/patient.routes");
const { doctorRouter } = require("./modules/doctors/doctor.routes");
const { appointmentRouter } = require("./modules/appointments/appointment.routes");
const { pharmacyRouter } = require("./modules/pharmacy/pharmacy.routes");
const { prescriptionRouter } = require("./modules/prescriptions/prescription.routes");
const { billingRouter } = require("./modules/billing/billing.routes");
const { inventoryTransactionRouter } = require("./modules/inventoryTransactions/inventoryTransaction.routes");

function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(createApiRateLimiter());

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use(mongoSanitize());
  app.use(xssSanitize);

  if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "clinic-erp-api" });
  });

  app.use("/auth", authRouter);
  app.use("/patients", patientRouter);
  app.use("/doctors", doctorRouter);
   app.use("/appointments", appointmentRouter);
  app.use("/pharmacy", pharmacyRouter);
  app.use("/prescriptions", prescriptionRouter);
  app.use("/billing", billingRouter);
  app.use("/inventory-transactions", inventoryTransactionRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };


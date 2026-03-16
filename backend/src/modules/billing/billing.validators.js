const { z } = require("zod");

const createBillSchema = z
  .object({
    patientId: z.string().min(1),
    appointmentId: z.string().min(1).optional(),
    doctorFee: z.number().min(0).default(0),
    medicineCharges: z.number().min(0).default(0),
    labCharges: z.number().min(0).default(0),
    paymentStatus: z.enum(["pending", "paid"]).optional(),
    paymentMethod: z.enum(["cash", "card", "upi"]).optional(),
  })
  .strict();

const updateBillSchema = createBillSchema.partial().strict();

const recordPaymentSchema = z
  .object({
    billId: z.string().min(1),
    paymentMethod: z.enum(["cash", "card", "upi"]),
  })
  .strict();

module.exports = { createBillSchema, updateBillSchema, recordPaymentSchema };


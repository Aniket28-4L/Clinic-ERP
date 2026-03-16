const { z } = require("zod");

const registerSchema = z
  .object({
    name: z.string().min(2).max(120),
    email: z.string().email().max(254),
    password: z.string().min(8).max(72),
    role: z.enum(["admin", "doctor", "receptionist", "pharmacist"]),
    phone: z.string().max(30).optional(),
  })
  .strict();

const loginSchema = z
  .object({
    email: z.string().email().max(254),
    password: z.string().min(1).max(72),
  })
  .strict();

module.exports = { registerSchema, loginSchema };


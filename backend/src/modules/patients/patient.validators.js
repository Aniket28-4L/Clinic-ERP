const { z } = require("zod");

const createPatientSchema = z
  .object({
    firstName: z.string().min(1).max(80),
    lastName: z.string().min(1).max(80),
    gender: z.string().max(20).optional(),
    age: z.number().int().min(0).max(150).optional(),
    phone: z.string().max(30).optional(),
    email: z.string().email().max(254).optional(),
    bloodGroup: z.string().max(10).optional(),
    address: z.string().max(500).optional(),
    allergies: z.array(z.string().max(120)).optional(),
    medicalHistory: z.string().max(4000).optional(),
    emergencyContactName: z.string().max(120).optional(),
    emergencyContactPhone: z.string().max(30).optional(),
  })
  .strict();

const updatePatientSchema = createPatientSchema.partial().strict();

module.exports = { createPatientSchema, updatePatientSchema };


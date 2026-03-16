const { z } = require("zod");

const createDoctorSchema = z
  .object({
    userId: z.string().min(1),
    specialization: z.string().min(2).max(120),
    experienceYears: z.number().int().min(0).max(80).optional(),
    consultationFee: z.number().min(0).optional(),
    roomNumber: z.string().max(20).optional(),
    availableDays: z.array(z.string().max(20)).optional(),
    availableTimeStart: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    availableTimeEnd: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  })
  .strict();

const updateDoctorSchema = createDoctorSchema.partial().strict();

module.exports = { createDoctorSchema, updateDoctorSchema };


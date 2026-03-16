const { z } = require("zod");

const createAppointmentSchema = z
  .object({
    patientId: z.string().min(1),
    doctorId: z.string().min(1),
    appointmentDate: z.coerce.date(),
    appointmentTime: z.string().regex(/^\d{2}:\d{2}$/),
    reason: z.string().max(240).optional(),
    status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
    notes: z.string().max(5000).optional(),
  })
  .strict();

const updateAppointmentSchema = createAppointmentSchema.partial().strict();

module.exports = { createAppointmentSchema, updateAppointmentSchema };


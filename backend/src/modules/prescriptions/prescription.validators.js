const { z } = require("zod");

const prescriptionMedicineSchema = z
  .object({
    medicineId: z.string().min(1),
    dosage: z.string().min(1).max(80),
    frequency: z.string().min(1).max(80),
    durationDays: z.number().int().min(1).max(365).optional(),
    instructions: z.string().max(500).optional(),
  })
  .strict();

const createPrescriptionSchema = z
  .object({
    patientId: z.string().min(1),
    doctorId: z.string().min(1),
    appointmentId: z.string().min(1).optional(),
    diagnosis: z.string().max(2000).optional(),
    medicines: z.array(prescriptionMedicineSchema).min(1),
    notes: z.string().max(2000).optional(),
  })
  .strict();

const updatePrescriptionSchema = createPrescriptionSchema.partial().strict();

module.exports = { createPrescriptionSchema, updatePrescriptionSchema };


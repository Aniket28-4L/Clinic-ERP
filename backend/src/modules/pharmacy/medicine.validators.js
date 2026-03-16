const { z } = require("zod");

const createMedicineSchema = z
  .object({
    name: z.string().min(1).max(160),
    manufacturer: z.string().max(160).optional(),
    category: z.string().max(80).optional(),
    price: z.number().min(0),
    stockQuantity: z.number().int().min(0),
    expiryDate: z.coerce.date().optional(),
    reorderLevel: z.number().int().min(0).optional(),
  })
  .strict();

const updateMedicineSchema = createMedicineSchema.partial().strict();

module.exports = { createMedicineSchema, updateMedicineSchema };


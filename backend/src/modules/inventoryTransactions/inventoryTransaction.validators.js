const { z } = require("zod");

const createInventoryTransactionSchema = z
  .object({
    medicineId: z.string().min(1),
    type: z.enum(["stock_in", "stock_out"]),
    quantity: z.number().int().min(1),
    reason: z.string().max(200).optional(),
    referenceId: z.string().min(1).optional(),
  })
  .strict();

const updateInventoryTransactionSchema = createInventoryTransactionSchema.partial().strict();

module.exports = { createInventoryTransactionSchema, updateInventoryTransactionSchema };


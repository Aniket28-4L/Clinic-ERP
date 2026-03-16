const mongoose = require("mongoose");

const { Schema } = mongoose;

const inventoryTransactionSchema = new Schema(
  {
    medicineId: { type: Schema.Types.ObjectId, ref: "Medicine", required: true, index: true },
    type: { type: String, enum: ["stock_in", "stock_out"], required: true, index: true },
    quantity: { type: Number, required: true, min: 1 },
    reason: { type: String, trim: true, maxlength: 200 },
    referenceId: { type: Schema.Types.ObjectId },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

inventoryTransactionSchema.index({ medicineId: 1, createdAt: -1 });

const InventoryTransaction = mongoose.model("InventoryTransaction", inventoryTransactionSchema);

module.exports = { InventoryTransaction };


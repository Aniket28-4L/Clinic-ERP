const mongoose = require("mongoose");

const { Schema } = mongoose;

const MOVEMENT_TYPES = ["RECEIVE", "DISPENSE", "ADJUSTMENT", "RETURN"];

const inventoryMovementSchema = new Schema(
  {
    medicineId: { type: Schema.Types.ObjectId, ref: "Medicine", required: true, index: true },
    type: { type: String, enum: MOVEMENT_TYPES, required: true, index: true },
    quantity: { type: Number, required: true, min: 1 },
    occurredAt: { type: Date, default: Date.now, index: true },

    // Optional linkage to business documents
    referenceType: { type: String, trim: true, maxlength: 40, index: true }, // "Prescription" | "Bill" | "Manual"
    referenceId: { type: Schema.Types.ObjectId, index: true },

    note: { type: String, trim: true, maxlength: 500 },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true }
);

inventoryMovementSchema.index({ medicineId: 1, occurredAt: -1 });
inventoryMovementSchema.index({ referenceType: 1, referenceId: 1 });

const InventoryMovement = mongoose.model("InventoryMovement", inventoryMovementSchema);

module.exports = { InventoryMovement, MOVEMENT_TYPES };


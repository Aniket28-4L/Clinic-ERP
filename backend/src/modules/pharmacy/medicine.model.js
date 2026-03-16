const mongoose = require("mongoose");

const { Schema } = mongoose;

const medicineSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    manufacturer: { type: String, trim: true, maxlength: 160 },
    category: { type: String, trim: true, maxlength: 80 },
    price: { type: Number, min: 0, default: 0 },
    stockQuantity: { type: Number, min: 0, default: 0 },
    expiryDate: { type: Date },
    reorderLevel: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

medicineSchema.index({ name: "text", manufacturer: "text", category: "text" });
medicineSchema.index({ stockQuantity: 1, reorderLevel: 1 });

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = { Medicine };


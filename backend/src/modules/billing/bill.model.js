const mongoose = require("mongoose");

const { Schema } = mongoose;

const billSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", index: true },

    doctorFee: { type: Number, min: 0, default: 0 },
    medicineCharges: { type: Number, min: 0, default: 0 },
    labCharges: { type: Number, min: 0, default: 0 },
    totalAmount: { type: Number, min: 0, default: 0 },

    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending", index: true },
    paymentMethod: { type: String, enum: ["cash", "card", "upi"], default: "cash" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

billSchema.index({ patientId: 1, createdAt: -1 });
billSchema.index({ paymentStatus: 1, createdAt: -1 });

const Bill = mongoose.model("Bill", billSchema);

module.exports = { Bill };


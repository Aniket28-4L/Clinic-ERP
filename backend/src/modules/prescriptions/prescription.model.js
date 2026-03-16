const mongoose = require("mongoose");

const { Schema } = mongoose;

const prescriptionMedicineSchema = new Schema(
  {
    medicineId: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
    dosage: { type: String, required: true, trim: true, maxlength: 80 }, // "1 tablet"
    frequency: { type: String, required: true, trim: true, maxlength: 80 }, // "twice a day"
    durationDays: { type: Number, min: 1, max: 365, default: 1 },
    instructions: { type: String, trim: true, maxlength: 500 },
  },
  { _id: false }
);

const prescriptionSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", index: true },

    diagnosis: { type: String, trim: true, maxlength: 2000 },
    medicines: { type: [prescriptionMedicineSchema], default: [] },

    notes: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

prescriptionSchema.index({ patientId: 1, createdAt: -1 });
prescriptionSchema.index({ doctorId: 1, createdAt: -1 });

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = { Prescription };


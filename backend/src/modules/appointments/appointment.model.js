const mongoose = require("mongoose");

const { Schema } = mongoose;

const APPOINTMENT_STATUS = ["scheduled", "completed", "cancelled"];

const appointmentSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },

    appointmentDate: { type: Date, required: true, index: true },
    appointmentTime: { type: String, required: true, trim: true, maxlength: 5 }, // "HH:mm"

    reason: { type: String, trim: true, maxlength: 240 },
    status: { type: String, enum: APPOINTMENT_STATUS, default: "scheduled", index: true },
    notes: { type: String, trim: true, maxlength: 5000 },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ patientId: 1, appointmentDate: -1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = { Appointment, APPOINTMENT_STATUS };


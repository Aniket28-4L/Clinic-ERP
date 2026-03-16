const mongoose = require("mongoose");

const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    gender: { type: String, trim: true, maxlength: 20 },
    age: { type: Number, min: 0, max: 150 },
    phone: { type: String, trim: true, maxlength: 30, index: true },
    email: { type: String, lowercase: true, trim: true, maxlength: 254, index: true },
    bloodGroup: { type: String, trim: true, maxlength: 10 },
    address: { type: String, trim: true, maxlength: 500 },
    allergies: [{ type: String, trim: true, maxlength: 120 }],
    medicalHistory: { type: String, trim: true, maxlength: 4000 },
    emergencyContactName: { type: String, trim: true, maxlength: 120 },
    emergencyContactPhone: { type: String, trim: true, maxlength: 30 },
  },
  { timestamps: true }
);

patientSchema.index({ firstName: "text", lastName: "text", phone: "text", email: "text" });

const Patient = mongoose.model("Patient", patientSchema);

module.exports = { Patient };


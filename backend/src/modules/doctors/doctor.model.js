const mongoose = require("mongoose");

const { Schema } = mongoose;

const doctorSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },

    specialization: { type: String, required: true, trim: true, maxlength: 120, index: true },
    experienceYears: { type: Number, min: 0, max: 80, default: 0 },
    consultationFee: { type: Number, min: 0, default: 0 },
    roomNumber: { type: String, trim: true, maxlength: 20 },
    availableDays: [{ type: String, trim: true }], // e.g. ["Mon","Tue",...]
    availableTimeStart: { type: String, trim: true, maxlength: 5 }, // "09:00"
    availableTimeEnd: { type: String, trim: true, maxlength: 5 }, // "17:00"
  },
  { timestamps: true }
);

doctorSchema.index({ specialization: 1 });

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = { Doctor };


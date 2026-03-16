const mongoose = require("mongoose");

const { Schema } = mongoose;

const ROLE_ENUM = ["admin", "doctor", "receptionist", "pharmacist"];

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      unique: true,
      index: true,
    },
    password: { type: String, required: true, select: false }, // bcrypt hash
    role: { type: String, required: true, enum: ROLE_ENUM, index: true },
    phone: { type: String, trim: true, maxlength: 30 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

module.exports = { User, ROLE_ENUM };


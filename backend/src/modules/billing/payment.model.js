const mongoose = require("mongoose");

const { Schema } = mongoose;

const PAYMENT_METHODS = ["Cash", "Card", "BankTransfer", "MobileMoney", "Insurance", "Other"];

const paymentSchema = new Schema(
  {
    billId: { type: Schema.Types.ObjectId, ref: "Bill", required: true, index: true },
    amount: { type: Number, required: true, min: 0.01 },
    method: { type: String, enum: PAYMENT_METHODS, required: true, index: true },
    paidAt: { type: Date, default: Date.now, index: true },

    reference: { type: String, trim: true, maxlength: 120 }, // card auth code / transaction ref
    note: { type: String, trim: true, maxlength: 500 },

    receivedBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true }
);

paymentSchema.index({ billId: 1, paidAt: -1 });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = { Payment, PAYMENT_METHODS };


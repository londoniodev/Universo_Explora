import mongoose from "mongoose";

const PsychologistAccessPurchaseSchema = new mongoose.Schema({
  psychologistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  packageId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["manual", "paypal", "stripe"],
    default: "manual",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
});

export const PsychologistAccessPurchase = mongoose.model("PsychologistAccessPurchase", PsychologistAccessPurchaseSchema);
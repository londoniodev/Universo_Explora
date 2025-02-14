import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    psychologistId: { type: mongoose.Schema.Types.ObjectId, ref: "Psychologist" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
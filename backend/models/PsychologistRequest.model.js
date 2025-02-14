import mongoose from "mongoose";

const PsychologistRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  psychologistId: { type: mongoose.Schema.Types.ObjectId, ref: "Psychologist", required: false },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export const PsychologistRequest = mongoose.model("PsychologistRequest", PsychologistRequestSchema);
import mongoose from "mongoose";

const PsychologistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Psychologist = mongoose.model("Psychologist", PsychologistSchema);
import mongoose from "mongoose";

const PsychologistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    birthdate: { type: Date, required: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    documentId: { type: String, required: true, trim: true, unique: true },
    role: { type: String, required: true, default: "psychologist", enum: ["psychologist", "fallback_psychologist"] },
    experienceYears: { type: Number, min: 0, default: 0 },
    profilePicture: { type: String, required: true },
    degreeCertificate: { type: String, required: true },
    professionalCard: { type: String, default: "" },
    isApproved: { type: Boolean, default: false },
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }],
  },
  { timestamps: true }
);

export const Psychologist = mongoose.model("Psychologist", PsychologistSchema);
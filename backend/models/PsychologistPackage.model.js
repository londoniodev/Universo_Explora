import mongoose from "mongoose";

const psychologistPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Nombre del paquete
    description: { type: String, required: true }, // Descripción del paquete
    price: { type: Number, required: true }, // Precio del paquete
    durationDays: { type: Number, required: true }, // Duración del acceso en días
  },
  { timestamps: true }
);

export const PsychologistPackage = mongoose.model("PsychologistPackage", psychologistPackageSchema);
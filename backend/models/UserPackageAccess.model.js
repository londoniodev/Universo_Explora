import mongoose from "mongoose";

const userPackageAccessSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    psychologistId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    used: { type: Boolean, default: false }, // 🚀 Nuevo campo para saber si ya se usó
    usedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    usedByName: { type: String, default: "Usuario no registrado" },
    expiresAt: { type: Date, required: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    isPermanent: { type: Boolean, default: false },
    paymentMethod: { type: String, required: false }, // Ejemplo: "Stripe", "PayPal o "MercadoPago"
    transactionId: { type: String, required: false }, // ID de la transacción en la pasarela
    paymentStatus: { type: String, default: "pending" }, // "pending", "completed", "failed"
  },
  { timestamps: true }
);

export const UserPackageAccess = mongoose.model("UserPackageAccess", userPackageAccessSchema);
import mongoose from "mongoose";

const userPackageAccessSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    token: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
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
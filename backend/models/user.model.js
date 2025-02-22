import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user", enum: ["user", "admin", "psychologist", "fallback_psychologist"] },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    gender: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    resultsSent: { type: Boolean, default: false },

    cart: [
      {
        testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true, default: 0 },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    purchasedTests: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],

    testProgress: {
      contextualization: { type: String, default: "locked", enum: ["locked", "inProgress", "completed"] },
      autoevaluation: { type: String, default: "locked", enum: ["locked", "inProgress", "completed"] },
      sixteenPF: { type: String, default: "locked", enum: ["locked", "inProgress", "completed"] },
    },
    
    documentId: { type: String, trim: true, unique: true, sparse: true },
    experienceYears: { type: Number, min: 0, default: 0 },
    profilePicture: { type: String, default: "" },
    degreeCertificate: { type: String, default: "" },
    professionalCard: { type: String, default: "" },
    
    psychologistAssigned: { type: mongoose.Schema.Types.ObjectId, ref: "Psychologist", default: null },
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }],

    resetPasswordToken: { type: String },
    resetPasswordExpiresAt: { type: Date },
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
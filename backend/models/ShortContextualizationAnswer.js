import mongoose from "mongoose";

const shortContextualizationAnswerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    answers: { type: Map, of: String, default: {} },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ShortContextualizationAnswer = mongoose.model(
  "ShortContextualizationAnswer",
  shortContextualizationAnswerSchema
);

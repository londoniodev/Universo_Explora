import mongoose from "mongoose";

const AutoevaluationAnswerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    test: { type: String, default: "autoevaluation", required: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    answers: { type: Object, required: true },
    isCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const AutoevaluationAnswer = mongoose.model( 'AutoevaluationAnswer', AutoevaluationAnswerSchema);
import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    selectedOption: { type: String, required: true },
    score: { type: Number, required: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    factor: { type: String, required: true },
    polo: { type: Number, required: true },
    answeredAt: { type: Date, default: Date.now },
    calculatedResult: { type: Number },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound indexes for common query patterns
answerSchema.index({ user: 1, package: 1 });
answerSchema.index({ user: 1, question: 1, package: 1 }, { unique: true });

export const Answer = mongoose.model("Answer", answerSchema);
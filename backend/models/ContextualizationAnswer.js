  import mongoose from "mongoose";

  const ContextualizationAnswerSchema = new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      test: { type: String, default: "contextualization", required: true },
      package: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
      answers: { type: Map, of: String, required: true },
      isCompleted: { type: Boolean, default: false },
    },
    { 
      timestamps: true 
    }
  );
  
  export const ContextualizationAnswer = mongoose.model( "ContextualizationAnswer", ContextualizationAnswerSchema);  
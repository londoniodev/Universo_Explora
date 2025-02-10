import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  psychologistId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
}, { timestamps: true });


export const Request = mongoose.model("Request", RequestSchema);
// models/Alert.js
// Gera alertas automáticos vinculados à empresa e meta financeira.

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const AlertSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  metaId: { type: Schema.Types.ObjectId, ref: "Meta" }, // metaId pode ser opcional
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["warning", "limit_reached", "goal_exceeded"], required: true },
  message: { type: String, required: true },
  generationDate: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
}, { timestamps: true });

AlertSchema.index({ companyId: 1, read: 1 });

export default model("Alert", AlertSchema);

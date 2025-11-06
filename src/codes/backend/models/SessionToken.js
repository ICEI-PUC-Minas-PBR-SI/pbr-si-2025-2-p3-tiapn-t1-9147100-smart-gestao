// models/SessionToken.js
// Armazenamento de tokens de sessão (opcional, para logout e revogação)

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SessionTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Padronizado para userId
  tokenHash: { type: String, required: true }, // Padronizado para tokenHash
  device: { type: String }, // Padronizado para device
  originIp: { type: String }, // Padronizado para originIp
  createdAt: { type: Date, default: Date.now }, // Padronizado para createdAt
  expiration: { type: Date }, // Padronizado para expiration
  active: { type: Boolean, default: true } // Padronizado para active
});

SessionTokenSchema.index({ userId: 1 });
SessionTokenSchema.index({ tokenHash: 1 });

export default model("SessionToken", SessionTokenSchema);

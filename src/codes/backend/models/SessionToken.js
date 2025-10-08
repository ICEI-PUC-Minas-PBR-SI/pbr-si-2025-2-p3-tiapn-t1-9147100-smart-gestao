// models/SessionToken.js
// Armazenamento de tokens de sessão (opcional, para logout e revogação)

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SessionTokenSchema = new Schema({
  usuarioId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token_hash: { type: String, required: true }, // hash do token (não armazene token puro)
  dispositivo: { type: String }, // ex.: 'Chrome - Windows'
  ip_origem: { type: String },
  criado_em: { type: Date, default: Date.now },
  expiracao: { type: Date },
  ativo: { type: Boolean, default: true }
});

SessionTokenSchema.index({ usuarioId: 1 });
SessionTokenSchema.index({ token_hash: 1 });

export default model("SessionToken", SessionTokenSchema);

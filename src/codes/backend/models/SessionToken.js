// =================================================================================
// ARQUIVO: models/SessionToken.js
// DESCRIÇÃO: Define o Schema para a coleção 'SessionTokens' no MongoDB.
//            Este modelo é projetado para armazenar e gerenciar tokens de sessão
//            (como Refresh Tokens), permitindo funcionalidades como logout
//            centralizado, revogação de tokens e rastreamento de sessões ativas.
//            É uma peça chave para implementar um controle de sessão mais robusto
//            e stateful, se necessário.
// =================================================================================

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SessionTokenSchema = new Schema({
  // Vínculo com o usuário ao qual este token de sessão pertence.
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  // Hash do token de sessão (ex: Refresh Token). Armazenar o hash em vez do token
  // em texto plano aumenta a segurança, caso o banco de dados seja comprometido.
  tokenHash: { type: String, required: true },
  // Informações sobre o dispositivo ou cliente que gerou o token (opcional, para auditoria).
  device: { type: String },
  // Endereço IP de origem da requisição que gerou o token (opcional, para segurança).
  originIp: { type: String },
  // Data de expiração do token. Essencial para a lógica de renovação e invalidação.
  expiration: { type: Date, required: true },
  // Flag para indicar se o token ainda está ativo e pode ser usado. Permite "soft delete" ou revogação.
  active: { type: Boolean, default: true }
});

// Índices para otimizar buscas por usuário e por hash do token.
SessionTokenSchema.index({ userId: 1 });
SessionTokenSchema.index({ tokenHash: 1 });

export default model("SessionToken", SessionTokenSchema);

// models/Log.js
// Armazena todas as ações realizadas pelo usuário (auditoria).

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const LogSchema = new Schema({
  empresaId: { type: Schema.Types.ObjectId, ref: "Empresa" },
  usuarioId: { type: Schema.Types.ObjectId, ref: "User" },
  acao: { type: String, required: true },
  descricao: { type: String },
  ip_origem: { type: String },
  user_agent: { type: String },
  detalhes: { type: Schema.Types.Mixed },
  data_evento: { type: Date, default: Date.now }
});

export default model("Log", LogSchema);

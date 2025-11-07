// =================================================================================
// ARQUIVO: models/Logs.js
// DESCRIÇÃO: Define o Schema para a coleção 'Logs' no MongoDB.
//            Este modelo é fundamental para a auditoria do sistema, pois armazena
//            um registro de todas as ações importantes realizadas pelos usuários.
// =================================================================================

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const LogSchema = new Schema(
  {
    // Vínculo com a empresa onde a ação ocorreu.
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    // Vínculo com o usuário que realizou a ação.
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    // Nome da ação realizada (ex: 'CREATE_USER', 'DELETE_TRANSACTION').
    action: { type: String, required: true },
    // Descrição resumida da ação.
    description: { type: String },
    // Rota da API que foi chamada.
    route: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    // Campo flexível para armazenar dados adicionais em formato JSON,
    // como o corpo da requisição (`req.body`).
    details: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Índice para otimizar a consulta de logs por empresa, ordenados por data.
LogSchema.index({ companyId: 1, createdAt: -1 });

export default model("Log", LogSchema);

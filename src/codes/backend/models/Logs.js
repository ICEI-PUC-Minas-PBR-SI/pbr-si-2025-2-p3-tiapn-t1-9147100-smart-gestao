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
    // Chave estrangeira que vincula o log à empresa onde a ação ocorreu.
    companyId: { type: Schema.Types.ObjectId, ref: "Company", index: true },
    // Chave estrangeira que vincula o log ao usuário que realizou a ação.
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    // Nome da ação realizada (ex: 'CREATE_USER', 'DELETE_TRANSACTION'), para fácil filtragem.
    action: { type: String, required: true },
    // Descrição textual resumida da ação.
    description: { type: String },
    // Rota da API que foi acionada.
    route: { type: String },
    // Endereço IP de origem da requisição.
    ip: { type: String },
    // User-Agent do navegador ou cliente que fez a requisição.
    userAgent: { type: String },
    // Campo flexível para armazenar dados adicionais em formato JSON, como o corpo da requisição (`req.body`).
    details: { type: Schema.Types.Mixed },
  },
  { timestamps: true } // Adiciona `createdAt` e `updatedAt` automaticamente.
);

// Índice composto para otimizar a consulta de logs por empresa, ordenados por data.
LogSchema.index({ companyId: 1, createdAt: -1 });

export default model("Log", LogSchema);

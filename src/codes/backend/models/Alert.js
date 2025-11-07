// =================================================================================
// ARQUIVO: models/Alert.js
// DESCRIÇÃO: Define o Schema para a coleção 'Alerts' no MongoDB.
//            Este modelo armazena notificações geradas automaticamente pelo
//            sistema para informar os usuários sobre eventos importantes, como
//            metas atingidas ou limites de despesas próximos.
// =================================================================================

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const AlertSchema = new Schema({
  // Vínculo com a empresa para garantir que o alerta seja exibido apenas para os usuários corretos.
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  // Vínculo opcional com a meta que originou o alerta.
  metaId: { type: Schema.Types.ObjectId, ref: "Meta" },
  // Vínculo opcional com um usuário específico, se o alerta for direcionado.
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  // Tipo do alerta, para categorização (ex: aviso, limite atingido).
  type: { type: String, enum: ["warning", "limit_reached", "goal_exceeded"], required: true },
  // A mensagem de texto que será exibida para o usuário.
  message: { type: String, required: true },
  // Data em que o alerta foi gerado.
  generationDate: { type: Date, default: Date.now },
  // Flag para indicar se o usuário já visualizou o alerta.
  read: { type: Boolean, default: false }
}, { timestamps: true });

// Índice para otimizar a busca de alertas não lidos de uma empresa.
AlertSchema.index({ companyId: 1, read: 1 });

export default model("Alert", AlertSchema);

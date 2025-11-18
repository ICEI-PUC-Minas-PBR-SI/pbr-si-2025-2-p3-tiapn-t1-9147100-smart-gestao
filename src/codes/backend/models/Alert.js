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
  // Chave estrangeira que vincula o alerta à empresa correta, essencial para a arquitetura multi-tenant.
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  // Chave estrangeira opcional que vincula o alerta à meta que o originou.
  metaId: { type: Schema.Types.ObjectId, ref: "Goal" },
  // Chave estrangeira opcional para direcionar o alerta a um usuário específico.
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  // Tipo do alerta, usado para categorização e para definir a estilização no frontend.
  type: { type: String, enum: ["warning", "limit_reached", "goal_achieved"], required: true },
  // A mensagem de texto que será exibida para o usuário.
  message: { type: String, required: true },
  // Flag para indicar se o usuário já visualizou o alerta.
  read: { type: Boolean, default: false }
}, {
  // Adiciona os campos `createdAt` e `updatedAt` automaticamente.
  timestamps: true
});

// Índice composto para otimizar a busca de alertas não lidos de uma empresa.
AlertSchema.index({ companyId: 1, read: 1, createdAt: -1 });

export default mongoose.models.Alert || model("Alert", AlertSchema);

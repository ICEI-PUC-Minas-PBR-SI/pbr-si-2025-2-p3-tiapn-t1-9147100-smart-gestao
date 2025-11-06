// models/Client.js
// Registro de clientes e fornecedores vinculados a uma empresa e usuário.

import mongoose from "mongoose";
const { Schema, model } = mongoose;

// - Schema para representar um cliente ou fornecedor
const ClientSchema = new Schema({ // Padronizado para inglês e camelCase
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["client", "supplier"], required: true },
  name: { type: String, required: true, trim: true },
  document: { type: String, trim: true }, // Para CPF ou CNPJ
  phone: { type: String },
  email: { type: String },
  category: { type: String },
  address: { type: String },
  ativo: { type: Boolean, default: true } // Se o registro está ativo
}, { timestamps: true });

// - Índices para otimizar a busca por empresa e tipo
ClientSchema.index({ companyId: 1, type: 1 });

// Exporta o modelo para que possa ser usado em outros arquivos
export default model("Client", ClientSchema);

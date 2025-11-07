// =================================================================================
// ARQUIVO: models/Client.js
// DESCRIÇÃO: Define o Schema para a coleção 'Clients' no MongoDB.
//            Este modelo é usado para registrar tanto **clientes** (de quem a
//            empresa recebe) quanto **fornecedores** (para quem a empresa paga),
//            diferenciados pelo campo `type`.
// =================================================================================

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ClientSchema = new Schema({
  // Vínculo com a empresa, garantindo que cada cliente/fornecedor pertença a um único tenant.
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  // Vínculo com o usuário que cadastrou o registro.
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  // Campo que diferencia se o registro é um cliente ('client') ou um fornecedor ('supplier').
  type: { type: String, enum: ["client", "supplier"], required: true },
  // Nome ou Razão Social.
  name: { type: String, required: true, trim: true },
  // Documento de identificação (CPF ou CNPJ).
  document: { type: String, trim: true },
  phone: { type: String },
  email: { type: String },
  // Categoria para agrupar clientes/fornecedores (ex: "Varejo", "Serviços de TI").
  category: { type: String },
  address: { type: String },
  // Flag para "soft delete". Se `false`, o registro é considerado inativo.
  ativo: { type: Boolean, default: true }
}, { timestamps: true });

// Índice para otimizar a busca de clientes ou fornecedores dentro de uma empresa.
ClientSchema.index({ companyId: 1, type: 1 });

export default model("Client", ClientSchema);

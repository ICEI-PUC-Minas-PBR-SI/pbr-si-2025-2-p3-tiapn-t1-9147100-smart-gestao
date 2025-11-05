// models/Client.js
// Registro de clientes e fornecedores vinculados a uma empresa e usuário.

import mongoose from "mongoose";
const { Schema, model } = mongoose;

// - Schema para representar um cliente ou fornecedor
const ClientSchema = new Schema({
  empresaId: { type: Schema.Types.ObjectId, ref: "Company", required: true }, // Id da empresa (vínculo)
  usuarioId: { type: Schema.Types.ObjectId, ref: "User", required: true },   // Id do usuário que cadastrou
  tipo: { type: String, enum: ["cliente", "fornecedor"], required: true }, // Tipo de registro
  nome_razao: { type: String, required: true }, // Nome ou razão social
  cpf_cnpj: { type: String, trim: true }, // CPF ou CNPJ
  telefone: { type: String },
  email: { type: String },
  categoria: { type: String }, // Categoria do cliente/fornecedor
  endereco: { type: String },
  ativo: { type: Boolean, default: true } // Se o registro está ativo
}, { timestamps: true });

// - Índices para otimizar a busca por empresa e tipo
ClientSchema.index({ empresaId: 1, tipo: 1 });

// Exporta o modelo para que possa ser usado em outros arquivos
export default model("Client", ClientSchema);

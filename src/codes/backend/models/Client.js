// models/Client.js
// Registro de clientes e fornecedores vinculados a uma empresa e usuário.

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ClientSchema = new Schema({
  empresaId: { type: Schema.Types.ObjectId, ref: "Empresa", required: true }, // vínculo de empresa
  usuarioId: { type: Schema.Types.ObjectId, ref: "User", required: true },   // quem cadastrou
  tipo: { type: String, enum: ["cliente", "fornecedor"], required: true },
  nome_razao: { type: String, required: true },
  cpf_cnpj: { type: String, trim: true },
  telefone: { type: String },
  email: { type: String },
  categoria: { type: String },
  endereco: { type: String },
  ativo: { type: Boolean, default: true }
}, { timestamps: true });

// Índices: melhor busca por empresa
ClientSchema.index({ empresaId: 1, tipo: 1 });

export default model("Client", ClientSchema);

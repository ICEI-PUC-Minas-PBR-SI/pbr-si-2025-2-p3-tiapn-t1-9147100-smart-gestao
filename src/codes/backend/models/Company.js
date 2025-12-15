// =================================================================================
// ARQUIVO: models/Company.js
// DESCRIÇÃO: Define o Schema para a coleção 'Companies' no MongoDB.
//            Este é o modelo central da arquitetura multi-tenant do sistema.
//            Cada documento 'Company' representa um cliente (uma empresa)
//            e serve como a raiz para o isolamento de todos os outros dados,
//            como usuários, transações, clientes, etc.
// =================================================================================

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CompanySchema = new Schema({
  // Nome fantasia da empresa.
  name: { type: String, required: true, trim: true },
  // CNPJ da empresa, usado como identificador único em todo o sistema para evitar duplicatas.
  cnpj: { type: String, required: true, unique: true, trim: true },
  // E-mail principal de contato da empresa.
  email: { type: String, trim: true, lowercase: true },
  // Telefone principal de contato.
  phone: { type: String, trim: true },
  // Endereço físico da empresa.
  address: { type: String, trim: true },
  // Plano de assinatura contratado pela empresa (ex: Básico, Profissional), controla o acesso a funcionalidades.
  plan: { type: String, enum: ["BASIC", "PRO", "PREMIUM"], default: "BASIC" },
  // Flag para "soft delete". Se `false`, a empresa é considerada inativa e seus usuários não podem mais logar.
  isActive: { type: Boolean, default: true },
  // Data em que a empresa foi registrada no sistema, preenchida automaticamente.
}, {
  // Adiciona os campos `createdAt` e `updatedAt` automaticamente.
  timestamps: true
});

// Índices para otimizar consultas.
// Um índice no nome para buscas e ordenações rápidas.
CompanySchema.index({ name: 1 });

export default mongoose.models.Company || model("Company", CompanySchema);

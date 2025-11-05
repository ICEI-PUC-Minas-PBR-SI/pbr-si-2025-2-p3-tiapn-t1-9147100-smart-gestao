// models/Empresa.js
// Representa a empresa contratante do sistema.
// Cada empresa terá seus próprios usuários e dados isolados.

import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Estrutura básica da Empresa
const EmpresaSchema = new Schema({
  nome: { type: String, required: true, trim: true },       // Nome da empresa
  cnpj: { type: String, required: true, unique: true, trim: true }, // CNPJ único
  email_contato: { type: String, trim: true },               // E-mail de contato da empresa
  telefone: { type: String, trim: true },                    // Telefone de contato
  endereco: { type: String, trim: true },                    // Endereço da empresa
  plano: { type: String, enum: ["BASICO", "PRO", "PREMIUM"], default: "BASICO" }, // Tipo de plano
  ativo: { type: Boolean, default: true },                   // Se a empresa está ativa no sistema
  data_cadastro: { type: Date, default: Date.now }           // Data de registro da empresa
}, { timestamps: true });

// Índices úteis
EmpresaSchema.index({ nome: 1 });
EmpresaSchema.index({ cnpj: 1 }, { unique: true });

export default model("Company", EmpresaSchema);

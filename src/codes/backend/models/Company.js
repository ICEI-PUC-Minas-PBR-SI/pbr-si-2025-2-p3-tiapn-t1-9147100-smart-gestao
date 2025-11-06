// models/Empresa.js
// Representa a empresa contratante do sistema.
// Cada empresa terá seus próprios usuários e dados isolados.

import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Estrutura básica da Empresa
const CompanySchema = new Schema({ // Padronizado para inglês e camelCase
  name: { type: String, required: true, trim: true },
  cnpj: { type: String, required: true, unique: true, trim: true }, // CNPJ único
  email: { type: String, trim: true }, // Padronizado para 'email'
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  plan: { type: String, enum: ["BASIC", "PRO", "PREMIUM"], default: "BASIC" },
  isActive: { type: Boolean, default: true },
  registrationDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Índices úteis
CompanySchema.index({ name: 1 });
CompanySchema.index({ cnpj: 1 }, { unique: true });

export default model("Company", CompanySchema);

// models/Log.js
// Armazena todas as ações realizadas pelo usuário (auditoria).

import mongoose from "mongoose";
const { Schema, model } = mongoose;

// - Schema para auditoria de ações no sistema
const LogSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    description: { type: String },
    route: { type: String }, // Padronizado para camelCase
    ip: { type: String },
    userAgent: { type: String },
    details: { type: Schema.Types.Mixed },
  },
  { timestamps: true } // Adiciona createdAt e updatedAt automaticamente
);

LogSchema.index({ companyId: 1, createdAt: -1 });

export default model("Log", LogSchema);

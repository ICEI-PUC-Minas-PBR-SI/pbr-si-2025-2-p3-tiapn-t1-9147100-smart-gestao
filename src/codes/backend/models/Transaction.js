// models/Transaction.js
// Cada transação pertence a uma empresa e um usuário específico

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TransactionSchema = new Schema({
  empresaId: { type: Schema.Types.ObjectId, ref: "Empresa", required: true },
  usuarioId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  clientId: { type: Schema.Types.ObjectId, ref: "Client" },
  tipo: { type: String, enum: ["receita", "despesa"], required: true },
  descricao: { type: String, trim: true },
  categoria: { type: String },
  valor: { type: Number, required: true, min: 0 },
  data_transacao: { type: Date, required: true },
  forma_pagamento: { type: String, default: "outro" },
  status: { type: String, enum: ["pago", "pendente", "recebido", "a_receber"], default: "pendente" },
  anexo_url: { type: String }
}, { timestamps: true });

// 🔍 Índice para relatórios filtrados por empresa e data
TransactionSchema.index({ empresaId: 1, data_transacao: -1 });

export default model("Transaction", TransactionSchema);

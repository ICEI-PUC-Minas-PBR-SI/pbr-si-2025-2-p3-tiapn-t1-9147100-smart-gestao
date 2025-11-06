// models/Transaction.js
// Cada transação pertence a uma empresa e um usuário específico

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TransactionSchema = new Schema({
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  clientId: { type: Schema.Types.ObjectId, ref: "Client" },
  type: { 
    type: String, 
    enum: ["revenue", "expense"], // "revenue" é mais padrão que "income"
    required: true 
  },
  description: { type: String, trim: true, required: true },
  category: { type: String },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true, default: Date.now },
  paymentMethod: { 
    type: String, 
    enum: ['credit_card', 'debit_card', 'pix', 'cash', 'bank_transfer', 'other'], // Adiciona validação
    default: "other" 
  },
  status: { 
    type: String, 
    enum: ["completed", "pending", "canceled"], // Simplifica e padroniza os status
    default: "pending" 
  },
  attachmentUrl: { type: String }
}, { timestamps: true });

// - Índice para relatórios filtrados por empresa e data
TransactionSchema.index({ companyId: 1, date: -1 });

export default model("Transaction", TransactionSchema);

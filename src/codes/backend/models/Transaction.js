// =================================================================================
// ARQUIVO: models/Transaction.js
// DESCRIÇÃO: Define o Schema para a coleção 'Transactions' no MongoDB.
//            Este é um dos modelos mais importantes, representando cada
//            movimentação financeira (receita ou despesa) de uma empresa.
// =================================================================================

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TransactionSchema = new Schema({
  // Vínculo com a empresa, essencial para o isolamento de dados.
  companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  // Vínculo com o usuário que registrou a transação, para fins de auditoria.
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  // Vínculo opcional com um cliente ou fornecedor.
  clientId: { type: Schema.Types.ObjectId, ref: "Client" },
  // Tipo da transação: 'revenue' (receita) ou 'expense' (despesa).
  type: { 
    type: String, 
    enum: ["revenue", "expense"],
    required: true 
  },
  // Descrição livre sobre a transação.
  description: { type: String, trim: true, required: true },
  // Categoria para agrupar transações (ex: "Alimentação", "Transporte", "Serviços").
  category: { type: String },
  // Valor monetário da transação.
  amount: { type: Number, required: true, min: 0 },
  // Data em que a transação ocorreu.
  date: { type: Date, required: true, default: Date.now },
  // Método de pagamento utilizado. O `enum` garante a consistência dos dados.
  paymentMethod: { 
    type: String, 
    enum: ['credit_card', 'debit_card', 'pix', 'cash', 'bank_transfer', 'other'],
    default: "other" 
  },
  // Status da transação (ex: se um pagamento está pendente ou já foi concluído).
  status: { 
    type: String, 
    enum: ["completed", "pending", "canceled"],
    default: "pending" 
  },
  // URL para um anexo (ex: comprovante, nota fiscal).
  attachmentUrl: { type: String }
}, { timestamps: true });

// Índice composto para otimizar consultas de listagem e relatórios,
// que frequentemente filtram por empresa e ordenam por data.
TransactionSchema.index({ companyId: 1, date: -1 });

export default model("Transaction", TransactionSchema);

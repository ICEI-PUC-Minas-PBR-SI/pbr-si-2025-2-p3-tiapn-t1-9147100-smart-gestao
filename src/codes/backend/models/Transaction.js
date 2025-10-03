// Modelo de dados para transações financeiras (receitas e despesas)

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true }, // de qual cliente é
  type: { type: String, enum: ["receita", "despesa"], required: true }, // se é receita ou despesa
  value: { type: Number, required: true }, // valor da transação
  category: { type: String, required: true }, // categoria (alimentação, serviços, etc.)
  date: { type: Date, default: Date.now }, // data da transação
  description: { type: String } // observações
});

export default mongoose.model("Transaction", transactionSchema);

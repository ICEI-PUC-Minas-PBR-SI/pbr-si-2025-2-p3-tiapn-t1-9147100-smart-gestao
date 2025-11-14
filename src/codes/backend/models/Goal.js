// =================================================================================
// ARQUIVO: models/Goal.js
// DESCRIÇÃO: Define o Schema para a coleção 'Goals' no MongoDB.
//            Este modelo representa as metas financeiras que uma empresa
//            estabelece, como limites de gastos ou objetivos de receita.
// =================================================================================

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const GoalSchema = new Schema(
  {
    // Chave estrangeira que vincula a meta à sua respectiva empresa.
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    // Chave estrangeira que vincula a meta ao usuário que a criou.
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // Título ou nome da meta (ex: "Reduzir custos com marketing").
    title: { type: String, required: true, trim: true },
    // Tipo da meta: 'revenue' (objetivo de receita), 'expense' (limite de despesa) ou 'saving' (meta de economia).
    type: { type: String, enum: ["revenue", "expense", "saving"], default: "saving" },
    // O valor alvo a ser alcançado (para 'revenue' e 'saving') ou não ultrapassado (para 'expense').
    targetAmount: { type: Number, required: true, min: 0 },
    // O valor atual acumulado para esta meta, atualizado por processos do sistema.
    currentAmount: { type: Number, default: 0, min: 0 },
    // Prazo final para o cumprimento da meta.
    deadline: { type: Date },
  },
  {
    // Adiciona os campos `createdAt` e `updatedAt` automaticamente.
    timestamps: true
  }
);

// Índice composto para otimizar a busca de metas por empresa e prazo.
GoalSchema.index({ companyId: 1, deadline: 1 });

export default model("Goal", GoalSchema);

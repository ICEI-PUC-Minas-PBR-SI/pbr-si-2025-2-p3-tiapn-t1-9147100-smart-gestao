// =================================================================================
// ARQUIVO: models/Meta.js
// DESCRIÇÃO: Define o Schema para a coleção 'Metas' no MongoDB.
//            Este modelo representa as metas financeiras que uma empresa
//            estabelece, como limites de gastos ou objetivos de receita.
// =================================================================================

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MetaSchema = new Schema(
  {
    // Vínculo com a empresa à qual a meta pertence.
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    // Vínculo com o usuário que criou a meta.
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // Título ou nome da meta (ex: "Reduzir custos com marketing").
    title: { type: String, required: true, trim: true },
    // Tipo da meta: 'revenue' (receita), 'expense' (despesa) ou 'saving' (economia).
    type: { type: String, enum: ["revenue", "expense", "saving"], default: "saving" },
    // O valor alvo a ser alcançado ou não ultrapassado.
    targetAmount: { type: Number, required: true, min: 0 },
    // O valor atual acumulado para esta meta.
    currentAmount: { type: Number, default: 0, min: 0 },
    // Prazo final para o cumprimento da meta.
    deadline: { type: Date },
  },
  { timestamps: true }
);

// Índice para otimizar a busca de metas por empresa e prazo.
MetaSchema.index({ companyId: 1, deadline: 1 });

export default model("Meta", MetaSchema);

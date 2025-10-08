// models/Meta.js
// Metas financeiras por empresa (mensais, por categoria, etc.)

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MetaSchema = new Schema({
  empresaId: { type: Schema.Types.ObjectId, ref: "Empresa", required: true },
  usuarioId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tipo_meta: { type: String, enum: ["receita", "despesa"], required: true },
  valor_meta: { type: Number, required: true },
  periodo_inicio: { type: Date, required: true },
  periodo_fim: { type: Date, required: true },
  categoria_foco: { type: String }
}, { timestamps: true });

MetaSchema.index({ empresaId: 1, periodo_inicio: 1 });

export default model("Meta", MetaSchema);

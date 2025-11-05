// models/Alert.js
// Gera alertas automáticos vinculados à empresa e meta financeira.

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const AlertSchema = new Schema({
  empresaId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  metaId: { type: Schema.Types.ObjectId, ref: "Meta", required: true },
  usuarioId: { type: Schema.Types.ObjectId, ref: "User" },
  tipo_alerta: { type: String, enum: ["aviso", "limite_atingido", "acima_da_meta"], required: true },
  mensagem: { type: String },
  data_geracao: { type: Date, default: Date.now },
  lido: { type: Boolean, default: false }
}, { timestamps: true });

AlertSchema.index({ empresaId: 1, lido: 1 });

export default model("Alert", AlertSchema);

// Modelo de dados para os clientes (ex: empresas/MEIs cadastrados)

import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true }, // nome do cliente ou empresa
  type: { type: String, default: "MEI" }, // tipo padrão: MEI
  createdAt: { type: Date, default: Date.now } // data de criação
});

export default mongoose.model("Client", clientSchema);

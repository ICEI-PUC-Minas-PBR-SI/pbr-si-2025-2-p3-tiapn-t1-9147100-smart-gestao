// Modelo de dados para os usuários do sistema

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },       // nome do usuário
  email: { type: String, unique: true, required: true }, // email único
  password: { type: String, required: true },   // senha (armazenada com hash)
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" } // a qual cliente pertence
});

export default mongoose.model("User", userSchema);

// config/db.js
// Conexão com o MongoDB (Mongoose)
// Carrega variáveis de ambiente com dotenv

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
  try {
    // process.env.MONGO_URI vem do arquivo .env
    await mongoose.connect(process.env.MONGO_URI, {
      // opções recomendadas
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Conectado ao MongoDB");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err);
    process.exit(1);
  }
}

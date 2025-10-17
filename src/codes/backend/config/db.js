// ===========================================
// 📁 Arquivo: config/db.js
// 🎯 Função: Estabelece conexão com o banco MongoDB Atlas
// ===========================================

import mongoose from "mongoose";
import dotenv from "dotenv";

// Carrega variáveis de ambiente (como MONGO_URI)
dotenv.config();

/**
 * 🔌 Função responsável por conectar o servidor Node.js ao MongoDB.
 * Ela usa a variável de ambiente MONGO_URI definida no arquivo `.env`.
 * Caso a conexão falhe, o servidor é encerrado de forma segura.
 */
export const connectDB = async () => {
  try {
    // Tenta conectar ao banco de dados
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Conexão com MongoDB estabelecida com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar com o MongoDB:", error.message);
    process.exit(1); // Encerra o processo para evitar falhas em cascata
  }
};

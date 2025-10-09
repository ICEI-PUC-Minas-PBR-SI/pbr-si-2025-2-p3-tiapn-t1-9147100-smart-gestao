// ===========================================
// Arquivo: config/db.js
// Função: Conexão principal com o banco MongoDB
// ===========================================

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis do arquivo .env

/**
 * Função responsável por conectar o servidor Node.js ao banco MongoDB.
 * Ela utiliza a string de conexão definida em MONGO_URI no arquivo .env.
 */
export const connectDB = async () => {
  try {
    // Conexão com o banco de dados MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Conexão com MongoDB estabelecida com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar com o MongoDB:", error.message);
    process.exit(1); // Encerra o processo caso o banco não esteja acessível
  }
};

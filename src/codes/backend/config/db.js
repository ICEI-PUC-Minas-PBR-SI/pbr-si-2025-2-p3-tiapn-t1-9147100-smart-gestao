// Arquivo responsável por conectar ao banco MongoDB Atlas

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // pega string de conexão do .env
    console.log("✅ Conectado ao MongoDB Atlas");
  } catch (error) {
    console.error("❌ Erro ao conectar:", error.message);
    process.exit(1); // encerra aplicação se não conectar
  }
};

// Importa dependências principais
import express from "express";
import dotenv from "dotenv";

// Importa função de conexão com o banco
import { connectDB } from "backend/config/db.js";

// Importa as rotas do sistema
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

// Configura variáveis de ambiente
dotenv.config();
const app = express();
app.use(express.json()); // permite receber JSON nas requisições

// Conecta ao MongoDB Atlas
connectDB();

// Define as rotas principais do sistema
app.use("/api/auth", authRoutes);           // autenticação
app.use("/api/clients", clientRoutes);      // clientes
app.use("/api/transactions", transactionRoutes); // receitas/despesas
app.use("/api/reports", reportRoutes);      // relatórios

// Sobe o servidor na porta definida no .env ou padrão 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

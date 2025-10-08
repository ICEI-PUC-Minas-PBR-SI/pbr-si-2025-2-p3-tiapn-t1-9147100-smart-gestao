// =============================================
// 📌 ARQUIVO PRINCIPAL DO BACKEND - SMART GESTÃO
// =============================================
//
// Este arquivo inicializa o servidor Express, configura
// o banco de dados MongoDB, aplica middlewares globais
// (como CORS e JSON), e registra todas as rotas do sistema.
//
// Estrutura baseada em Node.js + Express + Mongoose
// =============================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// 🧩 Importa rotas principais do sistema
import authRoutes from "./routes/authRoutes.js";            // Rotas de autenticação
import userRoutes from "./routes/userRoutes.js";            // Rotas de usuários
import clientRoutes from "./routes/clientRoutes.js";        // Rotas de clientes/fornecedores
import transactionRoutes from "./routes/transactionRoutes.js"; // Rotas de transações financeiras
import reportRoutes from "./routes/reportRoutes.js";        // ✅ Rotas de relatórios por empresa

// ⚙️ Configuração de variáveis de ambiente (.env)
dotenv.config();

// Cria a aplicação Express
const app = express();

// ======================
// 🧱 MIDDLEWARES GLOBAIS
// ======================

// Permite que o frontend (React, por exemplo) acesse a API
app.use(cors());

// Permite envio e recebimento de dados em JSON
app.use(express.json());

// =======================
// 🌐 CONEXÃO COM O BANCO
// =======================
//
// O banco utilizado é o MongoDB (Atlas ou local).
// Você pode definir a variável MONGODB_URI no arquivo .env
// Exemplo: MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/smartgestao
//
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conexão com MongoDB estabelecida com sucesso"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// =======================
// 🚏 ROTAS DO SISTEMA
// =======================
//
// Cada grupo de funcionalidades do sistema tem seu próprio
// arquivo de rotas, garantindo organização e manutenibilidade.
//

app.use("/api/auth", authRoutes);           // Autenticação e login
app.use("/api/users", userRoutes);          // Usuários e permissões
app.use("/api/clients", clientRoutes);      // Clientes e fornecedores
app.use("/api/transactions", transactionRoutes); // Transações financeiras
app.use("/api/reports", reportRoutes);      // ✅ Relatórios por empresa (novidade)

// =======================
// ⚡ ROTA BASE DE TESTE
// =======================
//
// Apenas para verificar se o servidor está no ar.
// Pode ser acessada via: http://localhost:5000/api
//
app.get("/api", (req, res) => {
  res.json({
    status: "Online",
    message: "🚀 API Smart Gestão em execução com sucesso!",
    version: "1.0.0",
  });
});

// =======================
// ⚙️ EXECUÇÃO DO SERVIDOR
// =======================
//
// Define a porta de execução. Se não houver variável de ambiente PORT,
// utiliza a porta 5000 por padrão.
//
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}/api`);
});
// =======================
// 📌 FIM DO ARQUIVO PRINCIPAL
// =======================
// server.js
// Inicialização do servidor Express para o backend Smart Gestão
// Comentários em português — campos, rotas e models estão padronizados em inglês.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

// conexão com o MongoDB
import { connectDB } from "./config/db.js";
// inicializador de permissões (cria roles padrão se necessário)
import { initPermissions } from "./Scripts/initPermissions.js";

// rotas do sistema (organizadas por domínio)
import alertRoutes from "./routes/alertRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";
import permissionRoutes from "./routes/permissionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// carrega variáveis de ambiente do .env
dotenv.config();

const app = express();

// Middlewares globais
app.use(cors()); // permite requisições cross-origin (ajuste políticas conforme necessário)
app.use(express.json({ limit: "10mb" })); // parse JSON
app.use(express.urlencoded({ extended: true })); // parse form-encoded
app.use(morgan("dev")); // logs de requisições no console (desenvolvimento)

// rota de health check simples
app.get("/api/health", (req, res) => {
  return res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// registro das rotas da API (prefixo /api)
app.use("/api/alerts", alertRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);

// inicialização do servidor: conecta ao BD e inicializa permissões
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // 1) Conecta ao MongoDB (lê MONGO_URI do .env)
    await connectDB();

    // 2) Insere permissões padrões se estiverem ausentes (ROOT, ADMIN_COMPANY, USER_COMPANY, READ_ONLY)
    await initPermissions();

    // 3) Inicia o servidor
    app.listen(PORT, () => {
      console.log(`🚀 Smart Gestão backend rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("Erro ao iniciar servidor:", err);
    process.exit(1);
  }
})();

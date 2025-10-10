// ============================================================
// 🚀 Arquivo: server.js
// 🧩 Função: Inicializa o servidor Express do backend Smart Gestão
// ============================================================

// ----------------------
// 📦 Importações gerais
// ----------------------
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

// ----------------------
// 🔗 Importação da conexão com o banco
// ----------------------
import { connectDB } from "./config/db.js";

// ----------------------
// 🛡️ Importação do script de inicialização de permissões
// (cria roles padrão automaticamente se não existirem)
// ----------------------
import { initPermissions } from "./Scripts/initPermissions.js";

// ----------------------
// 🧭 Importação das rotas da API (organizadas por domínio)
// ----------------------
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

// ----------------------
// ⚙️ Configuração de ambiente
// ----------------------
// Carrega variáveis do arquivo .env (como PORT, MONGO_URI e JWT_SECRET)
dotenv.config();

// Cria a aplicação Express
const app = express();

// ============================================================
// 🧩 MIDDLEWARES GLOBAIS
// ============================================================

// 🔓 CORS — permite requisições externas (como do front-end React)
app.use(cors());

// 🧾 Body Parser — permite que o servidor interprete JSONs grandes (até 10MB)
app.use(express.json({ limit: "10mb" }));

// 🔤 Interpreta dados enviados via formulários (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// 🧠 Morgan — exibe logs das requisições HTTP no console (para debug)
app.use(morgan("dev"));

// ============================================================
// ❤️ ROTA DE TESTE (Health Check)
// ============================================================
// Serve para confirmar se o servidor está ativo e funcional
app.get("/api/health", (req, res) => {
  return res.json({
    status: "ok",
    message: "Servidor Smart Gestão ativo!",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// 📚 REGISTRO DAS ROTAS PRINCIPAIS DA API
// ============================================================
// Cada domínio do sistema possui um módulo de rotas separado.

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

// ============================================================
// 🔄 INICIALIZAÇÃO DO SERVIDOR
// ============================================================

// Define a porta padrão (vem do .env ou 5000 por padrão)
const PORT = process.env.PORT || 5000;

/**
 * Função autoexecutável responsável por:
 * 1️⃣ Conectar ao MongoDB Atlas
 * 2️⃣ Criar permissões padrão se necessário
 * 3️⃣ Iniciar o servidor Express
 */
(async () => {
  try {
    console.log("⏳ Iniciando servidor...");

    // 1️⃣ Conecta ao banco de dados
    await connectDB();

    // 2️⃣ Inicializa permissões padrão (ROOT, ADMIN_COMPANY, USER_COMPANY, READ_ONLY)
    await initPermissions();

    // 3️⃣ Sobe o servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Smart Gestão rodando na porta ${PORT}`);
      console.log(`📡 Acesse: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    // Caso qualquer etapa falhe, o sistema encerra de forma segura
    console.error("❌ Erro ao iniciar o servidor:");
    console.error(err.message);
    process.exit(1);
  }
})();
// ============================================================
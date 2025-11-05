// ============================================================
// - Arquivo: server.js
// - Função: Inicializa o servidor Express do backend Smart Gestão
// ============================================================

// ----------------------
// - Importações gerais
// ----------------------
import express from "express"; // Framework principal para criação de APIs
import cors from "cors"; // Libera acesso do front-end (Cross-Origin)
import dotenv from "dotenv"; // Carrega variáveis de ambiente (.env)
import morgan from "morgan"; // Exibe logs de requisições no console (modo dev)

// ----------------------
// - Conexão com o banco de dados
// ----------------------
import { connectDB } from "./config/db.js"; // Arquivo de conexão com o MongoDB

// ----------------------
// - Inicialização das permissões padrão do sistema
// (Cria roles iniciais automaticamente, se não existirem)
// ----------------------
// ⚠️ Importante: a pasta deve ser 'scripts' (minúscula)
import { initPermissions } from "./scripts/initPermissions.js";

// ----------------------
// - Importação das rotas da API (separadas por domínio funcional)
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
// - Configuração de ambiente
// ----------------------
dotenv.config(); // Carrega variáveis do arquivo .env (PORT, MONGO_URI, JWT_SECRET)

// Cria a aplicação Express
const app = express();

// ============================================================
// - MIDDLEWARES GLOBAIS
// ============================================================

// - CORS — permite que o front-end (React, por exemplo) acesse a API
app.use(cors());

// - Express JSON — converte automaticamente o corpo das requisições em JSON
app.use(express.json({ limit: "10mb" }));

// - Interpreta dados de formulários enviados via POST (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// - Morgan — exibe logs detalhados das requisições (método, rota, tempo de resposta)
app.use(morgan("dev"));

// ============================================================
// - ROTA DE TESTE (Health Check)
// ============================================================
// Essa rota é útil para verificar se o backend está ativo e respondendo corretamente
app.get("/api/health", (req, res) => {
  return res.json({
    status: "ok",
    message: "Servidor Smart Gestão ativo!",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// - REGISTRO DAS ROTAS PRINCIPAIS
// ============================================================
// Cada módulo de negócio possui um grupo de rotas específico

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
// - INICIALIZAÇÃO DO SERVIDOR
// ============================================================

// Define a porta de execução (por padrão 5000)
const PORT = process.env.PORT || 5000;

/**
 * - Função autoexecutável que:
 * 1. Conecta ao banco MongoDB (usando MONGO_URI)
 * 2️⃣ Inicializa permissões padrão (ROOT, ADMIN_COMPANY, USER_COMPANY, READ_ONLY)
 * 3️⃣ Inicia o servidor Express
 */
(async () => {
  try {
    console.log("⏳ Iniciando servidor Smart Gestão...");

    // 1. Conecta ao banco MongoDB Atlas
    await connectDB();

    // 2. Cria permissões padrão caso não existam
    await initPermissions();

    // 3. Inicializa o servidor Express
    app.listen(PORT, () => {
      console.log(`✅ Conexão com o banco estabelecida!`);
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📡 Verifique em: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    // - Captura erros de inicialização e encerra o processo de forma segura
    console.error("Erro ao iniciar o servidor:");
    console.error(err.message);
    process.exit(1);
  }
})();

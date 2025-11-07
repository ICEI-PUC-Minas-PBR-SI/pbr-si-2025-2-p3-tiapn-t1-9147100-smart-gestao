// =================================================================================
// ARQUIVO: server.js
// DESCRIÇÃO: Ponto de entrada principal (entrypoint) da aplicação backend.
//            Este arquivo é responsável por configurar e inicializar o servidor
//            Express, conectar-se ao banco de dados, registrar os middlewares
//            e as rotas da API.
// =================================================================================

// --- 1. IMPORTAÇÕES DE MÓDULOS ---

// Framework web principal para criar o servidor e as rotas da API.
import express from "express";

// Middleware que habilita o CORS (Cross-Origin Resource Sharing), permitindo
// que o frontend (rodando em uma origem diferente, ex: localhost:3000)
// possa fazer requisições para este backend (ex: localhost:5000).
import cors from "cors";

// Carrega as variáveis de ambiente definidas no arquivo .env para o objeto
// `process.env`, permitindo o acesso a configurações sensíveis (como senhas e chaves secretas)
// de forma segura, sem expô-las no código-fonte.
import dotenv from "dotenv";

// Middleware de logging de requisições HTTP. É muito útil durante o desenvolvimento
// para visualizar no console cada requisição que chega ao servidor (método, rota, status, etc.).
import morgan from "morgan";

// --- Módulos Internos da Aplicação ---

// Importa a função responsável por estabelecer a conexão com o banco de dados MongoDB.
import { connectDB } from "./config/db.js";

// Importa o script de inicialização que garante que as permissões (roles)
// essenciais do sistema (como ROOT, ADMIN_COMPANY) existam no banco de dados.
import { initPermissions } from "./Scripts/initPermissions.js";

// --- Importação de Todas as Rotas da API ---
// Cada arquivo de rota agrupa os endpoints de um módulo específico da aplicação (ex: autenticação, transações).
// Isso mantém o código organizado e modular.
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

// --- 2. CONFIGURAÇÃO INICIAL ---
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

// Cria a aplicação Express
const app = express();

// ============================================================
// --- 3. REGISTRO DE MIDDLEWARES GLOBAIS ---
// Middlewares são funções executadas em sequência para cada requisição que chega.
// A ordem de registro é importante.
// ============================================================

// Middleware para habilitar o CORS (Cross-Origin Resource Sharing),
// permitindo que o frontend acesse a API a partir de uma origem diferente.
app.use(cors());

// Middleware nativo do Express que interpreta o corpo (body) das requisições
// que chegam no formato JSON, tornando-o acessível em `req.body`.
app.use(express.json({ limit: "10mb" }));

// Middleware nativo do Express que interpreta dados de formulários tradicionais
// (enviados como `application/x-www-form-urlencoded`).
app.use(express.urlencoded({ extended: true }));

// Middleware para logar as requisições HTTP no console em modo de desenvolvimento.
app.use(morgan("dev"));

// ============================================================
// --- 4. ROTA DE VERIFICAÇÃO DE SAÚDE (Health Check) ---
// Endpoint público usado para verificar se o servidor está online e respondendo.
// ============================================================
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
// Associa cada conjunto de rotas a um prefixo de URL.
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
// --- 6. INICIALIZAÇÃO DO SERVIDOR ---
// ============================================================

const PORT = process.env.PORT || 5000;

/**
 * Função auto-executável (IIFE - Immediately Invoked Function Expression)
 * para orquestrar a inicialização assíncrona do servidor.
 */
(async () => {
  try {
    console.log("⏳ Iniciando servidor Smart Gestão...");

    // Etapa 1: Conectar ao banco de dados.
    await connectDB();

    // Etapa 2: Garantir que as permissões essenciais existam no banco.
    await initPermissions();

    // Etapa 3: Iniciar o servidor Express para ouvir por requisições.
    app.listen(PORT, () => {
      console.log(`✅ Conexão com o banco estabelecida!`);
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📡 Verifique em: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    // Captura erros críticos durante a inicialização e encerra o processo.
    console.error("Erro ao iniciar o servidor:");
    console.error(err.message);
    process.exit(1);
  }
})();

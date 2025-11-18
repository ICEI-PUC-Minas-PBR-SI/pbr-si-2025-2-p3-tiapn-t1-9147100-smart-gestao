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

// Importa o Mongoose para ser usado na função de graceful shutdown.
import mongoose from "mongoose";

// --- Módulos Internos da Aplicação ---

// Importa a função responsável por estabelecer a conexão com o banco de dados MongoDB.
import { connectDB } from "./config/db.js";

// Importa o script de inicialização que garante que as permissões (roles)
// essenciais do sistema (como ROOT, ADMIN_COMPANY) existam no banco de dados.
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { initPermissions } from "./Scripts/initPermissions.js";

// --- Importação de Todas as Rotas da API ---
// Cada arquivo de rota agrupa os endpoints de um módulo específico da aplicação (ex: autenticação, transações).
// Isso mantém o código organizado e modular.
import alertRoutes from "./routes/alertRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import permissionRoutes from "./routes/permissionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// --- 2. CONFIGURAÇÃO INICIAL --- //
// Carrega as variáveis de ambiente do arquivo .env.
// É crucial que isso aconteça antes de qualquer outro módulo que possa precisar delas.
dotenv.config();

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
app.use("/api/logs", logRoutes); // Mantido por consistência com o modelo
app.use("/api/goals", goalRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);

// Middleware de tratamento de erros global. Deve ser o último middleware a ser registrado.
app.use(errorHandler);

// ============================================================
// --- 6. INICIALIZAÇÃO DO SERVIDOR (funções exportadas para testes) ---
// ============================================================

const PORT = process.env.PORT || 5000;

// Variável para armazenar a instância do servidor para o graceful shutdown.
let server;

/**
 * Inicia o servidor programaticamente (útil para testes in-process).
 * @param {object} options
 * @param {string} options.dbUri - URI do MongoDB a ser usado (opcional).
 * @param {number|string} options.port - Porta para o servidor (opcional).
 * @returns {Promise<import('http').Server>} A instância do servidor HTTP.
 */
export async function startServer({ dbUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI, port = PORT } = {}) {
  try {
    console.log('⏳ Iniciando servidor Smart Gestão (startServer)...');
    
    await connectDB(dbUri);
    console.log('✅ [1/1] Conexão com o banco de dados estabelecida!');

    return new Promise((resolve, reject) => {
      server = app.listen(port, () => {
        console.log(`✅ Servidor rodando na porta ${port}`);
        resolve(server);
      });
      server.on('error', (err) => reject(err));
    });
  } catch (err) {
    console.error('Erro ao iniciar o servidor (startServer):', err.message);
    throw err;
  }
}

/**
 * Encerra o servidor iniciado por `startServer` de forma limpa.
 */
export async function stopServer() {
  if (!server) return;
  return new Promise((resolve, reject) => {
    server.close(async (err) => {
      if (err) return reject(err);
      try {
        await mongoose.disconnect();
      } catch (e) {
        // Falha ao desconectar do mongoose não é crítico para os testes
        console.warn('Aviso: falha ao desconectar do mongoose durante stopServer.', e.message);
      }
      server = undefined;
      console.log('✅ Servidor e conexão com MongoDB encerrados (stopServer).');
      resolve();
    });
  });
}

// Auto-start apenas quando não estivermos no ambiente de teste.
if (process.env.NODE_ENV !== 'test') {
  // Inicia automaticamente quando o arquivo é executado diretamente (modo normal).
  (async () => {
    try {
      await startServer();
      // Em modo de produção/desenvolvimento, inicializamos as permissões após o servidor subir.
      await initPermissions();
    } catch (err) {
      console.error('Erro ao iniciar o servidor automaticamente:', err.message);
      process.exit(1);
    }
  })();
}

// ============================================================
// --- 7. GRACEFUL SHUTDOWN ---
// ============================================================
// Ouve por sinais de encerramento do processo (como Ctrl+C) para garantir
// que o servidor e a conexão com o banco de dados sejam finalizados de forma limpa.
async function gracefulShutdown(signal) {
  console.log(`\n🚨 Recebido sinal ${signal}. Inciando graceful shutdown...`);
  await stopServer();
  console.log('✅ Processo finalizado com sucesso.');
  process.exit(0);
}
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

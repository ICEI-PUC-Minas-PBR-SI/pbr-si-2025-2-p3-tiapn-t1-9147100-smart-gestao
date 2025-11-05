// ===========================================
// Arquivo: middlewares/errorMiddleware.js
// Função: Tratador global de erros Express
// Uso: deve ser registrado por último (app.use(errorMiddleware))
// ===========================================

/**
 * - errorHandler(err, req, res, next)
 * - Centraliza respostas de erro
 * - Registra no console (ou sistema de logs) os detalhes do erro
 * - Retorna um JSON padronizado ao cliente
 */
import { errorResponse } from "../utils/responseHelper.js";

export function errorHandler(err, req, res, next) {
  // Se o erro não tiver um status code definido, assume 500 (Internal Server Error) como padrão.
  const statusCode = err.statusCode || 500;

  // Loga o erro no console para depuração. Em produção, isso seria substituído por um sistema de logging mais robusto (Winston, Sentry, etc.).
  console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.error(err);

  // Monta o payload de erros. Se o objeto de erro já tiver uma estrutura de erros, ela é reutilizada.
  const payloadErrors = err.errors || (
    err.message ? [{ message: err.message }] : [{ message: "Erro interno no servidor" }]
  );

  // Envia uma resposta padronizada para o cliente, sem vazar detalhes internos (stack trace) em ambiente de produção.
  return errorResponse(res, { status: statusCode, message: "Falha ao processar requisição.", errors: payloadErrors });
}

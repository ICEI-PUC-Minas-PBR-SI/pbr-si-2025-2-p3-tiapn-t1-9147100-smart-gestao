// ===========================================
// Arquivo: middlewares/errorMiddleware.js
// Função: Tratador global de erros Express
// Uso: deve ser registrado por último (app.use(errorMiddleware))
// ===========================================

/**
 * errorHandler(err, req, res, next)
 * - Centraliza respostas de erro
 * - Registra no console (ou sistema de logs) os detalhes do erro
 * - Retorna um JSON padronizado ao cliente
 */
import { errorResponse } from "../utils/responseHelper.js";

export function errorHandler(err, req, res, next) {
  // Caso não tenha um status definido, considera 500
  const statusCode = err.statusCode || 500;

  // Log do erro no console para análise (em produção usar logger real)
  console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.error(err);

  // Monta payload de erros. Se já for array/obj, reaproveita
  const payloadErrors = err.errors || (
    err.message ? [{ message: err.message }] : [{ message: "Erro interno no servidor" }]
  );

  // Resposta para o cliente (sem vazar stack trace em produção)
  return errorResponse(res, { status: statusCode, message: "Falha ao processar requisição.", errors: payloadErrors });
}

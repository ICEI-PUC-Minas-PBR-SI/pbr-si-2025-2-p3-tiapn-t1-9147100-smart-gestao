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
export function errorHandler(err, req, res, next) {
  // Caso não tenha um status definido, considera 500
  const statusCode = err.statusCode || 500;

  // Log do erro no console para análise (em produção usar logger real)
  console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.error(err);

  // Resposta para o cliente (sem vazar stack trace em produção)
  return res.status(statusCode).json({
    message: err.message || "Erro interno no servidor",
    // Em ambiente de desenvolvimento você poderia incluir stack: err.stack
  });
}

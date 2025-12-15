// =================================================================================
// ARQUIVO: middlewares/errorMiddleware.js
// DESCRIÇÃO: Middleware global para tratamento de erros (Error Handler).
//            Este é o último middleware na cadeia do Express e sua função é
//            capturar quaisquer erros que ocorram durante o processamento de
//            uma requisição, garantindo que a aplicação não quebre e que uma
//            resposta de erro padronizada e segura seja enviada ao cliente.
// =================================================================================

/**
 * Tratador de erros global para a aplicação Express.
 * A assinatura com 4 argumentos (err, req, res, next) é o que o Express
 * reconhece como um middleware de tratamento de erros.
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  // Registra o erro no console para fins de depuração. Em um ambiente de produção,
  // isso seria substituído por um sistema de logging mais robusto (como Winston,
  // Pino ou serviços como Sentry) para monitoramento e alertas.
  console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.error(err);

  // Envia uma resposta de erro padronizada. Em produção, é uma boa prática não vazar
  // detalhes internos do erro (como o stack trace), enviando uma mensagem genérica.
  res.status(statusCode).json({
    message: err.message || "Ocorreu um erro inesperado no servidor.",
  });
}

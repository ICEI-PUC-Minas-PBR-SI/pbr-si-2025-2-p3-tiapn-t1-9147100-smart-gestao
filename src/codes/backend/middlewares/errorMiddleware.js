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
 * @param {Error} err - O objeto de erro capturado.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 * @param {function} next - A função de callback (não utilizada aqui, mas necessária na assinatura).
 */
export function errorHandler(err, req, res, next) {
  // Define o código de status da resposta. Se o erro já tiver um `statusCode`
  // (definido em um controlador, por exemplo), ele é usado. Caso contrário,
  // assume-se um erro inesperado e o padrão é 500 (Internal Server Error).
  const statusCode = err.statusCode || 500;

  // Registra o erro no console para fins de depuração. Em um ambiente de produção,
  // isso seria substituído por um sistema de logging mais robusto (como Winston,
  // Pino ou serviços como Sentry) para monitoramento e alertas.
  console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.error(err);

  // Envia uma resposta de erro padronizada em formato JSON para o cliente.
  // É uma boa prática não vazar detalhes internos do erro (como o stack trace)
  // para o cliente em um ambiente de produção, por isso enviamos uma mensagem genérica.
  res.status(statusCode).json({
    message: err.message || "Ocorreu um erro inesperado no servidor.",
    // Opcional: pode-se adicionar um campo 'code' para erros específicos da aplicação.
    // error_code: err.code || 'INTERNAL_SERVER_ERROR'
  });
}

// =================================================================================
// ARQUIVO: middlewares/auditMiddleware.js
// DESCRIÇÃO: Middleware de auditoria que registra ações importantes no sistema.
//            Ele opera de forma assíncrona, "ouvindo" o evento `finish` da
//            resposta HTTP. Isso garante que o log seja gravado somente após
//            a requisição ter sido completamente processada e enviada ao cliente,
//            sem adicionar latência à resposta.
// =================================================================================

import { createLog } from "../utils/logger.js";

/**
 * Cria um middleware de auditoria que registra uma ação específica após a finalização da requisição.
 * @param {string} actionName - Um nome curto e descritivo para a ação sendo auditada (ex: 'CREATE_TRANSACTION'). Se omitido, um nome será gerado dinamicamente.
 * @returns {function} Um middleware Express.
 */
export function auditMiddleware(actionName = "") {
  return (req, res, next) => {
    // O evento 'finish' é emitido pelo Node.js quando a resposta foi completamente enviada ao cliente.
    // Usar este evento desacopla a lógica de logging do fluxo principal da requisição,
    // garantindo que a resposta ao usuário não seja atrasada pela gravação do log.
    res.on("finish", async () => {
      try {
        // Sanitiza o corpo da requisição para remover dados sensíveis antes de logar.
        const sanitizedBody = { ...req.body };
        delete sanitizedBody.password;
        delete sanitizedBody.passwordHash;
        delete sanitizedBody.token;
        delete sanitizedBody.refreshToken;

        // Monta o payload do log com informações detalhadas da requisição e do usuário.
        const logData = {
          userId: req.user?.userId || null,
          companyId: req.user?.companyId || null,
          action: actionName || `${req.method}_${req.originalUrl}`,
          description: `Ação finalizada com status: ${res.statusCode}`,
          route: req.originalUrl,
          ip: req.ip || req.headers["x-forwarded-for"] || null,
          userAgent: req.headers["user-agent"] || null,
          details: {
            method: req.method,
            statusCode: res.statusCode,
            body: Object.keys(sanitizedBody).length > 0 ? JSON.stringify(sanitizedBody) : undefined,
            params: req.params,
            query: req.query,
          },
        };

        await createLog(logData);
      } catch (err) {
        // Uma falha na gravação do log não deve quebrar a aplicação.
        // Apenas registramos o erro no console para análise posterior.
        console.error("Falha crítica ao gravar log de auditoria:", err);
      }
    });

    // Chama `next()` imediatamente para não bloquear o processamento da requisição,
    // permitindo que o fluxo continue para o próximo middleware ou controller.
    next();
  };
}

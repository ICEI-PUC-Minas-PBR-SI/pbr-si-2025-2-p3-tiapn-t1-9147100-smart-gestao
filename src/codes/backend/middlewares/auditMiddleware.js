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
 * Cria um middleware de auditoria que registra uma ação específica.
 * @param {string} actionName - Um nome curto e descritivo para a ação sendo auditada (ex: 'CREATE_TRANSACTION').
 *
 * @returns {function} Um middleware Express.
 */
export function auditMiddleware(actionName = "") {
  return (req, res, next) => {
    // O evento 'finish' é emitido pelo Node.js quando a resposta foi completamente
    // enviada ao cliente. Usar este evento desacopla a lógica de logging do
    // fluxo principal da requisição, evitando atrasos na resposta.
    res.on("finish", async () => {
      try {
        // Monta o payload do log com informações detalhadas da requisição e do usuário.
        const logData = {
          userId: req.user?.userId || null,
          companyId: req.user?.companyId || null,
          // Usa o nome da ação fornecido ou gera um nome dinâmico.
          action: actionName || `${req.method}_${req.originalUrl}`,
          description: `Ação finalizada com status: ${res.statusCode}`,
          route: req.originalUrl,
          ip: req.ip || req.headers["x-forwarded-for"] || null,
          userAgent: req.headers["user-agent"] || null,
          // O campo 'details' armazena um contexto rico para depuração,
          // incluindo o corpo da requisição, parâmetros e queries.
          details: {
            method: req.method,
            statusCode: res.statusCode,
            // O corpo da requisição pode conter dados sensíveis.
            // Em produção, considere filtrar campos como 'password'.
            body: req.body ? JSON.stringify(req.body) : undefined,
            params: req.params,
            query: req.query,
          },
        };

        // Chama a função centralizada para salvar o log no banco de dados.
        await createLog(logData);
      } catch (err) {
        // Se a gravação do log falhar, apenas registramos o erro no console.
        // Isso é crucial para que uma falha no sistema de auditoria não quebre a aplicação.
        console.error("Falha crítica ao gravar log de auditoria:", err);
      }
    });

    // Chama `next()` imediatamente para não bloquear o processamento da requisição.
    // A lógica de log será executada depois, quando o evento 'finish' ocorrer.
    next();
  };
}

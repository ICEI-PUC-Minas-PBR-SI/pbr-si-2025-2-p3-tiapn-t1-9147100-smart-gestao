// ===========================================
// Arquivo: middlewares/auditMiddleware.js
// Função: Registrar logs de auditoria após resposta (res.on('finish'))
// Uso: aplicar em rotas que realizam escrita (POST/PUT/DELETE)
// Exemplo: router.post('/', authMiddleware, auditMiddleware('CREATE_TRANSACTION'), controller.createTransaction)
// ===========================================

import { createLog } from "../utils/logger.js";

/**
 * auditMiddleware(actionName)
 * - actionName: string curta representando a ação (ex: 'CREATE_TRANSACTION').
 *
 * O middleware retorna uma função que:
 *  - adiciona um listener em res 'finish'
 *  - quando a resposta for finalizada, grava um log com informações do request/response
 */
export function auditMiddleware(actionName = "") {
  return (req, res, next) => {
    // listener será executado quando a resposta terminar
    res.on("finish", async () => {
      try {
        const logData = {
          userId: req.user?.userId || null,
          companyId: req.user?.companyId || null,
          action: actionName || `${req.method}_${req.originalUrl}`,
          description: `Status ${res.statusCode}`,
          route: req.originalUrl,
          ip: req.ip || req.headers["x-forwarded-for"] || null,
          userAgent: req.headers["user-agent"] || null,
          details: {
            method: req.method,
            statusCode: res.statusCode,
            body: req.body ? JSON.stringify(req.body) : undefined,
            params: req.params,
            query: req.query,
          },
        };

        // grava o log usando o helper centralizado
        await createLog(logData);
      } catch (err) {
        // Não interrompe o fluxo principal se falhar ao gravar o log
        console.error("Falha ao gravar log de auditoria:", err);
      }
    });

    // segue para próxima função/middleware/handler
    next();
  };
}

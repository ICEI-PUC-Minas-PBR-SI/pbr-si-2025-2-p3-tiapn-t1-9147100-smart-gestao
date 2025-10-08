// middlewares/auditMiddleware.js
// Middleware de auditoria para registrar operações de forma automática.

import Log from "../models/Log.js";

/**
 * auditMiddleware(actionName)
 * 
 * Exemplo de uso:
 * router.post("/",
 *   authMiddleware,                 // garante que o usuário está autenticado
 *   auditMiddleware("CRIAR_TRANSACAO"), // registra ação
 *   transactionController.createTransaction);
 */
export function auditMiddleware(actionName) {
  return async (req, res, next) => {
    // Aguarda a resposta ser enviada para registrar log completo
    res.on("finish", async () => {
      try {
        await Log.create({
          empresaId: req.user?.empresaId || null,
          usuarioId: req.user?._id || null,
          acao: actionName || `${req.method} ${req.originalUrl}`,
          descricao: `Requisição ${req.method} em ${req.originalUrl}`,
          ip_origem: req.ip,
          user_agent: req.headers["user-agent"],
          detalhes: {
            statusCode: res.statusCode,
            body: req.body,
            params: req.params
          }
        });
      } catch (err) {
        console.error("Erro ao gravar log:", err);
      }
    });
    next();
  };
}

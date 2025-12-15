// =================================================================================
// ARQUIVO: utils/logger.js
// DESCRIÇÃO: Helper centralizado para a gravação de logs de auditoria.
//            Esta função desacopla a lógica de criação de logs dos controladores,
//            permitindo um ponto único de manutenção e maior consistência.
// =================================================================================

import Logs from "../models/Logs.js";

/**
 * Grava um log de auditoria no banco de dados.
 * A função é sobrecarregada e pode ser chamada de duas maneiras:
 *
 * 1. **Com objeto de requisição (Express):**
 *    `createLog(req, "NOME_DA_ACAO", "Descrição opcional")`
 *    Extrai automaticamente `userId`, `companyId`, `ip`, etc., do objeto `req`.
 *
 * 2. **Com objeto de dados direto:**
 *    `createLog({ userId, companyId, action, description, ... })`
 *    Permite a criação de logs de forma mais manual e flexível.
 */
export const createLog = async (arg1, arg2, arg3) => {
  try {
    let payload = {};

    // Forma 1: Detecta se o primeiro argumento é um objeto de requisição do Express.
    if (arg1 && arg1.headers && typeof arg2 === "string") {
      const req = arg1;
      payload = {
        userId: req.user?.userId || null,
        companyId: req.user?.companyId || null,
        action: arg2,
        description: arg3 || null,
        route: req.originalUrl || null,
        ip: req.ip || req.headers["x-forwarded-for"] || null,
        userAgent: req.headers["user-agent"] || null,
      };
    }
    // Forma 2: Detecta se o primeiro argumento é um objeto de dados direto.
    else if (arg1 && typeof arg1 === "object") {
      payload = { ...arg1 };
    }

    // Cria e salva o documento de log no banco de dados.
    await Logs.create(payload);

    // Loga uma versão resumida no console para depuração em tempo real durante o desenvolvimento/teste.
    console.log(`[LOG] Ação: ${payload.action} | Usuário: ${payload.userId || "N/A"}`);
  } catch (error) {
    // Uma falha na gravação do log não deve quebrar a aplicação.
    // Apenas registramos o erro no console para análise posterior.
    // Se o cliente do Mongo já tiver sido fechado durante o shutdown, isso é um
    // comportamento esperado e não deve poluir os logs com stacktraces.
    const msg = String(error && (error.message || error));
    if (msg.includes('client was closed') || (error && error.name === 'MongoClientClosedError')) {
      console.warn('Aviso: gravação de log não ocorreu porque o cliente MongoDB foi fechado.');
    } else {
      console.error("Falha crítica ao gravar log de auditoria:", error);
    }
  }
};

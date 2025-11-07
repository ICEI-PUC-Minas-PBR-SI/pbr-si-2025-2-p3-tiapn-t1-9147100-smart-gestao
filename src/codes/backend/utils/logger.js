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

    // Detecta a Forma 1: o primeiro argumento é um objeto de requisição do Express.
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
    // Detecta a Forma 2: o primeiro argumento é um objeto de dados.
    else if (arg1 && typeof arg1 === "object") {
      payload = { ...arg1 };
    }

    // Cria e salva o documento de log no banco de dados.
    await Logs.create(payload);

    // Loga uma versão resumida no console para depuração em tempo real.
    console.log(`[LOG] Ação: ${payload.action} | Usuário: ${payload.userId || "N/A"}`);
  } catch (error) {
    // Uma falha na gravação do log não deve quebrar a aplicação.
    // Apenas registramos o erro no console para análise posterior.
    console.error("Falha crítica ao gravar log de auditoria:", error);
  }
};

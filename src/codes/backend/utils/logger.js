// utils/logger.js
// Helper para gravação de logs/ auditoria.
// Aceita duas formas de uso:
// 1) createLog(req, "ACTION_NAME", "description text")
// 2) createLog({ userId, companyId, action, description, route, ip, userAgent, statusCode, details })
//
// Os comentários explicam em português cada parte.

import Logs from "../models/Logs.js";

/**
 * createLog - grava log de auditoria no MongoDB (coleção Logs).
 * Suporta chamadas por objeto (forma 2) ou por request Express (forma 1).
 */
export const createLog = async (arg1, arg2, arg3) => {
  try {
    let payload = {};

    // Forma 1: createLog(req, action, description)
    if (arg1 && arg1.headers && typeof arg2 === "string") {
      const req = arg1;
      payload = {
        userId: req.user ? req.user.userId : null,
        companyId: req.user ? req.user.companyId : null,
        action: arg2,
        description: arg3 || null,
        route: req.originalUrl || null,
        ip: req.ip || req.headers["x-forwarded-for"] || null,
        userAgent: req.headers["user-agent"] || null,
        statusCode: req.res ? req.res.statusCode : null,
        details: req.body ? req.body : undefined,
      };
    }
    // Forma 2: createLog({ userId, companyId, action, ... })
    else if (arg1 && typeof arg1 === "object") {
      payload = { ...arg1 };
    } else {
      payload = {
        action: String(arg2 || "LOG").toUpperCase(),
        description: arg3 || null,
      };
    }

    // Normalização mínima: garante que action exista
    if (!payload.action) payload.action = "UNSPECIFIED_ACTION";

    // Cria o documento de log e salva no MongoDB
    const logDoc = new Logs({
      ...payload,
      createdAt: new Date(),
    });

    await logDoc.save();

    // Exibe no console para debug (resumido)
    console.log(`🧾 [${logDoc.action}] user:${logDoc.userId || "-"} company:${logDoc.companyId || "-"} route:${logDoc.route || "-"}`);
  } catch (error) {
    // Em caso de falha ao salvar o log, apenas reportamos no console — não interrompe fluxo da API
    console.error("Falha ao gravar log:", error);
  }
};

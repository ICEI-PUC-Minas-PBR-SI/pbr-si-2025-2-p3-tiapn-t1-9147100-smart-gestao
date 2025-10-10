// ===========================================
// controllers/logController.js
// Função: Endpoints para leitura dos logs/auditoria armazenados
// Observação: Logs são escritos por auditMiddleware e também por controllers.
// ===========================================

import Logs from "../models/Logs.js";

/**
 * GET /api/logs
 * Lista os logs de auditoria. Permissão: ROOT ou ADMIN_COMPANY.
 * Suporte a query params (opcional): ?userId=...&companyId=...&action=...
 */
export const getAllLogs = async (req, res) => {
  try {
    // Monta filtro a partir de query params para pesquisa flexível
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.companyId) filter.companyId = req.query.companyId;
    if (req.query.action) filter.action = req.query.action;

    // Paginação simples (opcional)
    const page = parseInt(req.query.page || "1", 10);
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
    const skip = (page - 1) * limit;

    const logs = await Logs.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Logs.countDocuments(filter);

    return res.status(200).json({ total, page, limit, logs });
  } catch (error) {
    console.error("Erro em getAllLogs:", error);
    return res.status(500).json({ message: "Erro ao buscar logs", error: error.message });
  }
};

/**
 * GET /api/logs/user/:userId
 * Lista logs de um usuário específico (pode ser acessado por admins da company ou root)
 */
export const getLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await Logs.find({ userId }).sort({ createdAt: -1 }).limit(200);
    return res.status(200).json(logs);
  } catch (error) {
    console.error("Erro em getLogsByUser:", error);
    return res.status(500).json({ message: "Erro ao buscar logs do usuário", error: error.message });
  }
};

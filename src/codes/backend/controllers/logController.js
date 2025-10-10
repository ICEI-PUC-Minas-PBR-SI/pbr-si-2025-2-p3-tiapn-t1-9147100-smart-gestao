// controllers/logController.js
// Endpoints para consulta dos logs/auditoria

import Logs from "../models/Logs.js";

/**
 * GET /api/logs
 * Lista logs; requisito: role ROOT ou ADMIN_COMPANY
 * Aceita query params: userId, companyId, action, page, limit
 */
export const getAllLogs = async (req, res) => {
  try {
    // controle de acesso (apenas ROOT ou ADMIN_COMPANY)
    if (!["ROOT", "ADMIN_COMPANY"].includes(req.user.role)) return res.status(403).json({ message: "Acesso negado" });

    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.companyId) filter.companyId = req.query.companyId;
    if (req.query.action) filter.action = req.query.action;

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 500);
    const skip = (page - 1) * limit;

    const items = await Logs.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Logs.countDocuments(filter);

    return res.status(200).json({ total, page, limit, items });
  } catch (error) {
    console.error("getAllLogs:", error);
    return res.status(500).json({ message: "Erro ao listar logs", error: error.message });
  }
};

/**
 * GET /api/logs/user/:userId
 * Lista logs de um usuário específico
 */
export const getLogsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    // validação básica de acesso: se não for ROOT, só pode ver logs da própria company
    if (req.user.role !== "ROOT" && req.user.userId !== userId) {
      // administradores da mesma company podem consultar logs de usuários da sua company,
      // mas essa regra pode ser estendida conforme necessidade
      return res.status(403).json({ message: "Acesso negado" });
    }

    const items = await Logs.find({ userId }).sort({ createdAt: -1 }).limit(500);
    return res.status(200).json(items);
  } catch (error) {
    console.error("getLogsByUser:", error);
    return res.status(500).json({ message: "Erro ao listar logs por usuário", error: error.message });
  }
};

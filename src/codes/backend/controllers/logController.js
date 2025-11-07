// =================================================================================
// ARQUIVO: controllers/logController.js
// DESCRIÇÃO: Controladores para consulta de logs de auditoria do sistema.
//            Estes endpoints permitem que administradores monitorem as ações
//            realizadas pelos usuários.
// =================================================================================

import Logs from "../models/Logs.js";

/**
 * Lista os logs de auditoria com filtros e paginação.
 * O acesso é restrito a usuários com permissão 'ROOT' ou 'ADMIN_COMPANY'.
 * @param {object} req - O objeto de requisição do Express, pode conter `query params` para filtro.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getAllLogs = async (req, res) => {
  try {
    // Controle de acesso: apenas usuários com papel ROOT ou ADMIN_COMPANY podem acessar.
    if (!["ROOT", "ADMIN_COMPANY"].includes(req.user.role)) return res.status(403).json({ message: "Acesso negado" }); // req.user.role já é string

    // Constrói o objeto de filtro com base nos query parameters da requisição.
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId; // userId já é ObjectId
    if (req.query.companyId) filter.companyId = req.query.companyId;
    if (req.query.action) filter.action = req.query.action;

    // Define a lógica de paginação, com valores padrão e limites de segurança.
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
 * Lista todos os logs de um usuário específico.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getLogsByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // userId já é ObjectId
    // Validação de acesso: um usuário só pode ver os logs de outro se for ROOT.
    // A regra poderia ser estendida para permitir que um ADMIN_COMPANY veja logs de sua empresa.
    if (req.user.role !== "ROOT" && req.user.userId !== userId) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    const items = await Logs.find({ userId }).sort({ createdAt: -1 }).limit(500);
    return res.status(200).json(items);
  } catch (error) {
    console.error("getLogsByUser:", error);
    return res.status(500).json({ message: "Erro ao listar logs por usuário", error: error.message });
  }
};

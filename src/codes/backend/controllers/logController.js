import Logs from "../models/Logs.js";
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getAllLogs = async (req, res) => {
  try {
    // Controle de acesso: apenas usuários com papel ROOT ou ADMIN_COMPANY podem acessar.
    if (!["ROOT", "ADMIN_COMPANY"].includes(req.user.role)) return errorResponse(res, { status: 403, message: "Acesso negado." });

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

    return successResponse(res, { data: { total, page, limit, items } });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao listar logs.", errors: error });
  }
};

export const getLogsByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // userId já é ObjectId
    // Validação de acesso: um usuário só pode ver os logs de outro se for ROOT.
    // A regra poderia ser estendida para permitir que um ADMIN_COMPANY veja logs de sua empresa.
    if (req.user.role !== "ROOT" && req.user.userId.toString() !== userId) {
      return errorResponse(res, { status: 403, message: "Acesso negado." });
    }

    const items = await Logs.find({ userId }).sort({ createdAt: -1 }).limit(500);
    return successResponse(res, { data: items });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao listar logs por usuário.", errors: error });
  }
};

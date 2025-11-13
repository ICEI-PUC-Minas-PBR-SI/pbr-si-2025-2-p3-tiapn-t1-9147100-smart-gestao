// =================================================================================
// ARQUIVO: controllers/goalController.js
// DESCRIÇÃO: Controladores para as operações CRUD relacionadas a Metas Financeiras
//            ('Goal'). Garante que todas as operações sejam executadas dentro
//            do escopo da empresa do usuário autenticado.
// =================================================================================

import Goal from "../models/Goal.js";
import mongoose from 'mongoose';
import { createLog } from "../utils/logger.js";
import { successResponse, errorResponse } from '../utils/responseHelper.js';

/**
 * Lista todas as metas financeiras da empresa do usuário autenticado.
 * @param {object} req - O objeto de requisição do Express, contendo `req.user` do `authMiddleware`.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getGoals = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const goals = await Goal.find({ companyId }).sort({ createdAt: -1 });
    return successResponse(res, { data: goals });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro no servidor ao listar metas.", errors: error });
  }
};

/**
 * Busca uma meta financeira específica por ID.
 * @param {object} req - O objeto de requisição do Express, com `req.params.id`.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getGoalById = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const goal = await Goal.findOne({ _id: req.params.id, companyId });

        // Se a meta não for encontrada ou não pertencer à empresa, retorna 404.
        if (!goal) {
            return errorResponse(res, { status: 404, message: "Meta não encontrada." });
        }

        return successResponse(res, { data: goal });
    } catch (error) {
        return errorResponse(res, { status: 500, message: "Erro no servidor ao buscar meta.", errors: error });
    }
};
/**
 * Cria uma nova meta financeira.
 * A meta é automaticamente associada à empresa e ao usuário que a criou.
 * @param {object} req - O objeto de requisição do Express, com os dados da meta em `req.body`.
 * @param {object} res - O objeto de resposta do Express.
 */
export const createGoal = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    // Combina os dados do corpo da requisição com os IDs de empresa e usuário.
    const payload = { ...req.body, companyId, userId };

    const goal = await Goal.create(payload);

    // Registra a ação de criação no log de auditoria.
    await createLog({
      userId,
      companyId,
      action: "CREATE_GOAL",
      description: `Meta "${goal.title}" criada com sucesso.`,
      route: req.originalUrl,
    });

    return successResponse(res, { status: 201, data: goal });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro no servidor ao criar meta.", errors: error });
  }
};

/**
 * Atualiza uma meta financeira existente.
 * @param {object} req - O objeto de requisição do Express, com ID e dados de atualização.
 * @param {object} res - O objeto de resposta do Express.
 */
export const updateGoal = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    // Encontra e atualiza a meta, garantindo que ela pertença à empresa do usuário.
    const goal = await Goal.findOneAndUpdate({ _id: req.params.id, companyId }, { $set: req.body }, { new: true });
    if (!goal) return errorResponse(res, { status: 404, message: "Meta não encontrada." });

    // Registra a ação de atualização no log de auditoria.
    await createLog({
      userId: req.user.userId,
      companyId,
      action: "UPDATE_GOAL",
      description: `Meta "${goal.title}" atualizada.`,
      route: req.originalUrl,
    });

    return successResponse(res, { data: goal });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro no servidor ao atualizar meta.", errors: error });
  }
};

/**
 * Exclui uma meta financeira (exclusão física).
 * @param {object} req - O objeto de requisição do Express, com o ID da meta a ser excluída.
 * @param {object} res - O objeto de resposta do Express.
 */
export const deleteGoal = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    // Encontra e exclui a meta, garantindo que ela pertença à empresa do usuário.
    const deletedGoal = await Goal.findOneAndDelete({ _id: req.params.id, companyId });
    if (!deletedGoal) {
      return errorResponse(res, { status: 404, message: "Meta não encontrada." });
    }

    // Registra a ação de exclusão no log de auditoria.
    await createLog({
      userId: req.user.userId,
      companyId,
      action: "DELETE_GOAL",
      description: `Meta "${deletedGoal.title}" removida.`,
      route: req.originalUrl,
    });

    return successResponse(res, { message: "Meta removida com sucesso." });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro no servidor ao remover meta.", errors: error });
  }
};

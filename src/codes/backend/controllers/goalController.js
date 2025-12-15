// =================================================================================
// ARQUIVO: controllers/goalController.js
// DESCRIÇÃO: Controladores para as operações CRUD relacionadas a Metas Financeiras
//            ('Goal'). Garante que todas as operações sejam executadas dentro
//            do escopo da empresa do usuário autenticado.
// =================================================================================

import Goal from "../models/Goal.js";
import mongoose from 'mongoose'; // Importar mongoose para usar ObjectId
import { createLog } from "../utils/logger.js";
import { successResponse, errorResponse } from '../utils/responseHelper.js';

/**
 * Lista todas as metas financeiras da empresa do usuário autenticado.
 * @desc    Listar todas as metas financeiras da empresa.
 * @route   GET /api/goals
 * @access  Private
 */
export const getGoals = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    // Busca todas as metas associadas ao companyId do usuário logado, ordenando pela data de criação.
    const items = await Goal.find({ companyId }).sort({ createdAt: -1 });
    return successResponse(res, { data: items });
  } catch (error) {
    // Em caso de erro, retorna uma resposta padronizada de erro 500.
    return errorResponse(res, { status: 500, message: "Erro ao listar metas", errors: error });
  }
};

/**
 * Busca uma meta financeira específica por ID.
 * @desc    Obter uma meta financeira específica por ID.
 * @route   GET /api/goals/:id
 * @access  Private
 */
export const getGoalById = async (req, res) => {
    try {
        // Valida se o ID fornecido é um ObjectId válido do MongoDB.
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return errorResponse(res, { status: 404, message: "Meta não encontrada" });

        const companyId = req.user.companyId;
        // Busca a meta pelo ID e pelo companyId para garantir o isolamento de dados.
        const goal = await Goal.findOne({ _id: req.params.id, companyId });

        // Se a meta não for encontrada ou não pertencer à empresa, retorna 404.
        if (!goal) {
            return errorResponse(res, { status: 404, message: "Meta não encontrada" });
        }

        return successResponse(res, { data: goal });
    } catch (error) {
        // Em caso de erro, retorna uma resposta padronizada de erro 500.
        return errorResponse(res, { status: 500, message: "Erro ao buscar meta", errors: error });
    }
};
/**
 * Cria uma nova meta financeira.
 * A meta é automaticamente associada à empresa e ao usuário que a criou.
 * @desc    Criar uma nova meta financeira.
 * @route   POST /api/goals
 * @access  Private
 */
export const createGoal = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user.userId; // CORREÇÃO: Usar 'userId' em vez de 'id'
    // Combina os dados do corpo da requisição com os IDs de empresa e usuário, garantindo a associação correta.
    const payload = { ...req.body, companyId, userId };

    const goal = await Goal.create(payload);

    // Registra a ação de criação no log de auditoria.
    // O auditMiddleware na rota também fará um log, mas este é mais específico.
    await createLog({
      userId,
      companyId,
      action: "CREATE_GOAL",
      description: `Meta "${goal.title}" criada com sucesso.`,
      route: req.originalUrl,
    });

    return successResponse(res, { status: 201, data: goal });
  } catch (error) {
    // Em caso de erro, retorna uma resposta padronizada de erro 500.
    return errorResponse(res, { status: 500, message: "Erro ao criar meta", errors: error });
  }
};

/**
 * Atualiza uma meta financeira existente.
 * @desc    Atualizar uma meta financeira existente.
 * @route   PUT /api/goals/:id
 * @access  Private
 */
export const updateGoal = async (req, res) => {
  try {
    // Valida se o ID fornecido é um ObjectId válido do MongoDB.
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return errorResponse(res, { status: 404, message: "Meta não encontrada" });

    const companyId = req.user.companyId;
    // Encontra e atualiza a meta, garantindo que ela pertença à empresa do usuário.
    const goal = await Goal.findOneAndUpdate({ _id: req.params.id, companyId }, { $set: req.body }, { new: true });
    if (!goal) return errorResponse(res, { status: 404, message: "Meta não encontrada" });

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
    // Em caso de erro, retorna uma resposta padronizada de erro 500.
    return errorResponse(res, { status: 500, message: "Erro ao atualizar meta", errors: error });
  }
};

/**
 * Exclui uma meta financeira (exclusão física).
 * @desc    Excluir uma meta financeira.
 * @route   DELETE /api/goals/:id
 * @access  Private
 * @note    Implementa uma exclusão física (hard delete). Em produção, a melhor prática seria a exclusão lógica (soft delete).
 */
export const deleteGoal = async (req, res) => {
  try {
    // Valida se o ID fornecido é um ObjectId válido do MongoDB.
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return errorResponse(res, { status: 404, message: "Meta não encontrada" });

    const companyId = req.user.companyId;
    // Encontra e exclui a meta, garantindo que ela pertença à empresa do usuário.
    const deletedGoal = await Goal.findOneAndDelete({ _id: req.params.id, companyId });
    if (!deletedGoal) return errorResponse(res, { status: 404, message: "Meta não encontrada" });

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
    // Em caso de erro, retorna uma resposta padronizada de erro 500.
    return errorResponse(res, { status: 500, message: "Erro ao remover meta", errors: error });
  }
};

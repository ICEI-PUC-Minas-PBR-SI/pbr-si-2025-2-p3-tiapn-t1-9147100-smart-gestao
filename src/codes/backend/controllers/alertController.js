import Alert from "../models/Alert.js";
import { createLog } from "../utils/logger.js";
import { successResponse, errorResponse } from '../utils/responseHelper.js';

/**
 * @desc    Listar todos os alertas da empresa do usuário autenticado.
 * @route   GET /api/alerts
 * @access  Private
 */
export const getAllAlerts = async (req, res) => {
  try {
    // O ID da empresa é extraído do token JWT, garantindo que a consulta seja sempre no escopo correto.
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const items = await Alert.find({ companyId: companyId }).sort({ createdAt: -1 });
    return successResponse(res, { data: items });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao listar alertas.", errors: error });
  }
};

/**
 * @desc    Obter um alerta específico por ID.
 * @route   GET /api/alerts/:id
 * @access  Private
 */
export const getAlertById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware

    // A consulta inclui o companyId para garantir que um usuário não possa acessar um alerta de outra empresa.
    const alert = await Alert.findOne({ _id: id, companyId: companyId });
    if (!alert) return errorResponse(res, { status: 404, message: "Alerta não encontrado." });

    return successResponse(res, { data: alert });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao obter alerta.", errors: error });
  }
};

/**
 * @desc    Criar um novo alerta.
 * @route   POST /api/alerts
 * @access  Private (geralmente para administradores ou processos automáticos)
 */
export const createAlert = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const { message, type } = req.body; // Removidos title e severity para corresponder ao modelo Alert

    // Cria uma nova instância do modelo Alert com os dados da requisição e o companyId do usuário.
    const newAlert = new Alert({
      companyId: companyId,
      message,
      type, // type já é validado pelo schema
    });

    const saved = await newAlert.save();
    // A criação do log de auditoria agora é delegada ao auditMiddleware na rota.
    await createLog(req.user, req, "CREATE_ALERT", 201);

    return successResponse(res, { status: 201, data: saved });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao criar alerta.", errors: error });
  }
};

/**
 * @desc    Atualizar um alerta existente.
 * @route   PUT /api/alerts/:id
 * @access  Private
 */
export const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const update = req.body;

    // Encontra e atualiza o alerta, garantindo que o _id e o companyId correspondam.
    const updated = await Alert.findOneAndUpdate(
      { _id: id, companyId },
      { $set: update },
      { new: true }
    );

    if (!updated) return errorResponse(res, { status: 404, message: "Alerta não encontrado." });

    // A criação do log de auditoria agora é delegada ao auditMiddleware na rota.
    await createLog(req.user, req, "UPDATE_ALERT", 200);
    return successResponse(res, { data: updated });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao atualizar alerta.", errors: error });
  }
};

/**
 * @desc    Marcar um alerta como lido.
 * @route   PATCH /api/alerts/:id/read
 * @access  Private
 */
export const markAlertAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware

    // Ação específica para alterar apenas o status 'read' para true.
    const updated = await Alert.findOneAndUpdate(
      { _id: id, companyId: companyId },
      { $set: { read: true } },
      { new: true }
    );

    if (!updated) return errorResponse(res, { status: 404, message: "Alerta não encontrado" });

    // A criação do log de auditoria agora é delegada ao auditMiddleware na rota.
    await createLog(req.user, req, "READ_ALERT", 200);
    return successResponse(res, { data: updated });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao marcar alerta como lido.", errors: error });
  }
};

/**
 * @desc    Excluir um alerta.
 * @route   DELETE /api/alerts/:id
 * @access  Private
 */
export const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware

    // Encontra e exclui o alerta, garantindo que o _id e o companyId correspondam.
    const alert = await Alert.findOneAndDelete({ _id: id, companyId: companyId });

    if (!alert) {
      return errorResponse(res, { status: 404, message: "Alerta não encontrado" });
    }

    // A criação do log de auditoria agora é delegada ao auditMiddleware na rota.
    await createLog(req.user, req, "DELETE_ALERT", 200);
    return successResponse(res, { message: "Alerta removido com sucesso." });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao deletar alerta.", errors: error });
  }
};

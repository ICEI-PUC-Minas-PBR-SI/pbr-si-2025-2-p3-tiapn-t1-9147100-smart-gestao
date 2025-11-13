// =================================================================================
// ARQUIVO: controllers/alertController.js
// DESCRIÇÃO: Controladores para o gerenciamento de alertas (Alerts).
//            As funções aqui implementam as operações CRUD (Create, Read, Update,
//            Delete) para alertas, garantindo que todas as ações sejam restritas
//            ao escopo da empresa do usuário autenticado (multi-tenant).
// =================================================================================

import Alert from "../models/Alert.js";
import { createLog } from "../utils/logger.js";

/**
 * Lista todos os alertas pertencentes à empresa do usuário autenticado.
 * @param {object} req - O objeto de requisição do Express, contendo `req.user` do middleware de autenticação.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getAllAlerts = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const alerts = await Alert.find({ companyId: companyId }).sort({ createdAt: -1 });
    return res.status(200).json(alerts);
  } catch (error) {
    console.error("Erro ao listar alertas:", error);
    return res.status(500).json({ message: "Erro interno ao listar alertas." });
  }
};

/**
 * Busca um alerta específico por ID, garantindo que ele pertença à empresa do usuário.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getAlertById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware

    const alert = await Alert.findOne({ _id: id, companyId: companyId });
    if (!alert) return res.status(404).json({ message: "Alerta não encontrado." });

    return res.status(200).json(alert);
  } catch (error) {
    console.error("Erro ao obter alerta:", error);
    return res.status(500).json({ message: "Erro interno ao obter alerta." });
  }
};

/**
 * Cria um novo alerta, associando-o automaticamente à empresa do usuário.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const createAlert = async (req, res) => {
  try {
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const { message, type } = req.body; // Removidos title e severity para corresponder ao modelo Alert

    const newAlert = new Alert({
      companyId: companyId,
      message,
      type, // type já é validado pelo schema
    });

    const saved = await newAlert.save();
    // Registra a ação de criação em um log de auditoria.
    await createLog(req.user, req, "CREATE_ALERT", 201);

    return res.status(201).json(saved);
  } catch (error) {
    console.error("Erro ao criar alerta:", error);
    return res.status(500).json({ message: "Erro interno ao criar alerta." });
  }
};

/**
 * Atualiza um alerta existente, verificado pelo ID e pela empresa do usuário.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const update = req.body;

    const updated = await Alert.findOneAndUpdate(
      { _id: id, companyId },
      { $set: update },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Alerta não encontrado." });

    // Registra a ação de atualização no log de auditoria.
    await createLog(req.user, req, "UPDATE_ALERT", 200);
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Erro ao atualizar alerta:", error);
    return res.status(500).json({ message: "Erro interno ao atualizar alerta." });
  }
};

/**
 * Marca um alerta específico como lido.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const markAlertAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const updated = await Alert.findOneAndUpdate(
      { _id: id, companyId: companyId },
      { $set: { read: true } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Alerta não encontrado." });

    // Registra a ação de leitura no log de auditoria.
    await createLog(req.user, req, "READ_ALERT", 200);
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Erro ao marcar alerta como lido:", error);
    return res.status(500).json({ message: "Erro interno ao marcar alerta como lido." });
  }
};

/**
 * Exclui um alerta, garantindo que pertença à empresa do usuário.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware
    const alert = await Alert.findOneAndDelete({ _id: id, companyId: companyId });

    if (!alert) {
      return res.status(404).json({ message: "Alerta não encontrado." });
    }

    // Registra a ação de exclusão no log de auditoria.
    await createLog(req.user, req, "DELETE_ALERT", 200);
    return res.status(200).json({ message: "Alerta removido com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar alerta:", error);
    return res.status(500).json({ message: "Erro interno ao deletar alerta." });
  }
};

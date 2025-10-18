// controllers/alertController.js
// Gerencia alertas financeiros (CRUD mínimo)

import Alert from "../models/Alert.js";
import { createLog } from "../utils/logger.js";

/**
 * GET /api/alerts
 * Lista alertas da company do usuário autenticado.
 */
export const getAllAlerts = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const alerts = await Alert.find({ companyId }).sort({ createdAt: -1 });
    return res.status(200).json(alerts);
  } catch (error) {
    console.error("Erro ao listar alertas:", error);
    return res.status(500).json({ message: "Erro interno ao listar alertas." });
  }
};

/**
 * GET /api/alerts/:id
 * Retorna um alerta por ID (se pertencer à mesma company do usuário).
 */
export const getAlertById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const alert = await Alert.findOne({ _id: id, companyId });
    if (!alert) return res.status(404).json({ message: "Alerta não encontrado." });

    return res.status(200).json(alert);
  } catch (error) {
    console.error("Erro ao obter alerta:", error);
    return res.status(500).json({ message: "Erro interno ao obter alerta." });
  }
};

/**
 * POST /api/alerts
 * Cria um novo alerta (vinculado à company do usuário).
 */
export const createAlert = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { title, message, type, severity } = req.body;

    const newAlert = new Alert({
      companyId,
      title,
      message,
      type,
      severity,
    });

    const saved = await newAlert.save();
    // cria log de auditoria
    await createLog(req.user, req, "CREATE_ALERT", 201);

    return res.status(201).json(saved);
  } catch (error) {
    console.error("Erro ao criar alerta:", error);
    return res.status(500).json({ message: "Erro interno ao criar alerta." });
  }
};

/**
 * PUT /api/alerts/:id
 * Atualiza um alerta (apenas se pertencer à mesma company).
 */
export const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const update = req.body;

    const updated = await Alert.findOneAndUpdate(
      { _id: id, companyId },
      { $set: update },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Alerta não encontrado." });

    await createLog(req.user, req, "UPDATE_ALERT", 200);
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Erro ao atualizar alerta:", error);
    return res.status(500).json({ message: "Erro interno ao atualizar alerta." });
  }
};

/**
 * PUT /api/alerts/:id/read
 * Marca um alerta como lido.
 */
export const markAlertAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const updated = await Alert.findOneAndUpdate(
      { _id: id, companyId },
      { $set: { read: true } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Alerta não encontrado." });

    await createLog(req.user, req, "READ_ALERT", 200);
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Erro ao marcar alerta como lido:", error);
    return res.status(500).json({ message: "Erro interno ao marcar alerta como lido." });
  }
};

/**
 * DELETE /api/alerts/:id
 * Remove um alerta (caso esteja autorizado e pertença à mesma company).
 */
export const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const alert = await Alert.findOneAndDelete({ _id: id, companyId });

    if (!alert) {
      return res.status(404).json({ message: "Alerta não encontrado." });
    }

    await createLog(req.user, req, "DELETE_ALERT", 200);
    return res.status(200).json({ message: "Alerta removido com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar alerta:", error);
    return res.status(500).json({ message: "Erro interno ao deletar alerta." });
  }
};

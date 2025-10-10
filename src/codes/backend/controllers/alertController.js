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
    console.error("getAllAlerts:", error);
    return res.status(500).json({ message: "Erro ao listar alertas", error: error.message });
  }
};

/**
 * POST /api/alerts
 * Cria um alerta manual (em geral alertas automáticos são gerados por regras)
 */
export const createAlert = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    const payload = { ...req.body, companyId };

    const alert = await Alert.create(payload);

    await createLog({
      userId,
      companyId,
      action: "CREATE_ALERT",
      description: `Alerta criado: ${alert.message}`,
      route: req.originalUrl,
    });

    return res.status(201).json(alert);
  } catch (error) {
    console.error("createAlert:", error);
    return res.status(500).json({ message: "Erro ao criar alerta", error: error.message });
  }
};

/**
 * PUT /api/alerts/:id/read
 * Marca um alerta como lido
 */
export const markAlertAsRead = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, companyId },
      { status: "read" },
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: "Alerta não encontrado" });

    await createLog({
      userId,
      companyId,
      action: "MARK_ALERT_READ",
      description: `Alerta marcado como lido: ${alert._id}`,
      route: req.originalUrl,
    });

    return res.status(200).json(alert);
  } catch (error) {
    console.error("markAlertAsRead:", error);
    return res.status(500).json({ message: "Erro ao marcar alerta como lido", error: error.message });
  }
};

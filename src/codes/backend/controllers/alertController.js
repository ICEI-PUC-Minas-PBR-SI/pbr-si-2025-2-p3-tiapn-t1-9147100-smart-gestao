// ===========================================
// Arquivo: controllers/alertController.js
// Função: Gerenciamento dos alertas financeiros do sistema
// ===========================================

import Alert from "../models/Alert.js";
import { createLog } from "../config/logger.js";

/**
 * Listar todos os alertas de uma empresa
 */
export const getAllAlerts = async (req, res) => {
  try {
    const { companyId } = req.user;

    const alerts = await Alert.find({ companyId });
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar alertas", error });
  }
};

/**
 * Criar um novo alerta (gerado automaticamente ou manualmente)
 */
export const createAlert = async (req, res) => {
  try {
    const { companyId, userId } = req.user;
    const alert = new Alert({ ...req.body, companyId });
    await alert.save();

    await createLog({
      userId,
      companyId,
      action: "CREATE_ALERT",
      description: `Alerta criado: ${alert.message}`,
      route: req.originalUrl,
    });

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar alerta", error });
  }
};

/**
 * Marcar um alerta como lido
 */
export const markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { status: "lido" }, { new: true });

    await createLog({
      userId: req.user.userId,
      companyId: req.user.companyId,
      action: "READ_ALERT",
      description: `Alerta marcado como lido (${alert._id})`,
      route: req.originalUrl,
    });

    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar alerta", error });
  }
};

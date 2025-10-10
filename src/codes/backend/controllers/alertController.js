// ===========================================
// Arquivo: controllers/AlertController.js
// Descrição: Gerencia alertas financeiros do sistema
// ===========================================

import Alert from "../models/Alert.js";
import { createLog } from "../utils/logger.js";

/**
 * Lista todos os alertas da empresa vinculada ao usuário.
 */
export const getAlerts = async (req, res) => {
  try {
    const empresaId = req.user.companyId;
    const alerts = await Alert.find({ companyId: empresaId });
    await createLog(req, "LIST_ALERTS", "Listagem de alertas financeiros realizada.");
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar alertas", error: error.message });
  }
};

/**
 * Cria um novo alerta financeiro (gerado manualmente ou por meta).
 */
export const createAlert = async (req, res) => {
  try {
    const { message, type, metaId } = req.body;
    const empresaId = req.user.companyId;

    const newAlert = await Alert.create({
      companyId: empresaId,
      metaId,
      message,
      type,
      createdAt: new Date(),
      status: "ativo",
    });

    await createLog(req, "CREATE_ALERT", `Alerta criado: ${message}`);
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar alerta", error: error.message });
  }
};

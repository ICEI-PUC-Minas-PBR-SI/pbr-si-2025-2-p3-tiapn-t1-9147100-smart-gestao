// ===========================================
// Arquivo: controllers/reportController.js
// Função: Geração de relatórios financeiros e de auditoria
// ===========================================

import Transaction from "../models/Transaction.js";
import Meta from "../models/Meta.js";
import Alert from "../models/Alert.js";
import { createLog } from "../utils/logger.js";

/**
 * Gerar relatório financeiro consolidado (receitas, despesas, lucro)
 */
export const generateFinancialReport = async (req, res) => {
  try {
    const { companyId } = req.user;

    const transactions = await Transaction.find({ companyId });
    const totalReceitas = transactions
      .filter((t) => t.type === "receita")
      .reduce((acc, curr) => acc + curr.value, 0);
    const totalDespesas = transactions
      .filter((t) => t.type === "despesa")
      .reduce((acc, curr) => acc + curr.value, 0);

    const lucroLiquido = totalReceitas - totalDespesas;

    const report = {
      totalReceitas,
      totalDespesas,
      lucroLiquido,
      dataGeracao: new Date(),
    };

    await createLog({
      userId: req.user.userId,
      companyId,
      action: "GENERATE_REPORT",
      description: `Relatório financeiro gerado`,
      route: req.originalUrl,
    });

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Erro ao gerar relatório financeiro", error });
  }
};

/**
 * Relatório de alertas e metas atingidas
 */
export const generateAlertReport = async (req, res) => {
  try {
    const { companyId } = req.user;

    const metas = await Meta.find({ companyId });
    const alertas = await Alert.find({ companyId });

    const report = { metas, alertas };

    await createLog({
      userId: req.user.userId,
      companyId,
      action: "GENERATE_ALERT_REPORT",
      description: `Relatório de alertas/metas gerado`,
      route: req.originalUrl,
    });

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Erro ao gerar relatório de alertas/metas", error });
  }
};

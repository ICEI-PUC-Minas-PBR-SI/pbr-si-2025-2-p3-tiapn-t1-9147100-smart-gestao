// controllers/reportController.js
// Geração de relatórios e dashboards básicos

import Transaction from "../models/Transaction.js";
import Meta from "../models/Meta.js";
import Alert from "../models/Alert.js";
import { createLog } from "../utils/logger.js";

/**
 * GET /api/reports/summary
 * Retorna soma de income, expense e balance num período
 * Query optional: ?start=YYYY-MM-DD&end=YYYY-MM-DD
 */
export const getFinancialSummary = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const start = req.query.start ? new Date(req.query.start) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = req.query.end ? new Date(req.query.end) : new Date();

    const transactions = await Transaction.find({
      companyId,
      date: { $gte: start, $lte: end }
    });

    const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + Number(t.value || 0), 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.value || 0), 0);
    const balance = income - expense;

    await createLog({
      userId: req.user.userId,
      companyId,
      action: "GENERATE_FINANCIAL_SUMMARY",
      description: `Relatório gerado (${start.toISOString()} - ${end.toISOString()})`,
      route: req.originalUrl,
    });

    return res.status(200).json({ start, end, totals: { income, expense, balance }, transactionsCount: transactions.length });
  } catch (error) {
    console.error("getFinancialSummary:", error);
    return res.status(500).json({ message: "Erro ao gerar resumo financeiro", error: error.message });
  }
};

/**
 * GET /api/reports/categories
 * Agrupa transações por category
 */
export const getCategoryReport = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const result = await Transaction.aggregate([
      { $match: { companyId } },
      { $group: { _id: "$category", totalValue: { $sum: "$value" }, count: { $sum: 1 } } },
      { $sort: { totalValue: -1 } }
    ]);

    return res.status(200).json(result);
  } catch (error) {
    console.error("getCategoryReport:", error);
    return res.status(500).json({ message: "Erro ao gerar relatório por categoria", error: error.message });
  }
};

/**
 * GET /api/reports/meta-progress
 * Calcula progresso das metas
 */
export const getMetaProgress = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const metas = await Meta.find({ companyId });

    const progress = await Promise.all(metas.map(async (meta) => {
      const agg = await Transaction.aggregate([
        { $match: { companyId, type: meta.type, category: meta.focusCategory, date: { $gte: meta.startDate, $lte: meta.endDate } } },
        { $group: { _id: null, total: { $sum: "$value" } } }
      ]);
      const achieved = agg.length ? agg[0].total : 0;
      const pct = meta.value ? ((achieved / meta.value) * 100).toFixed(2) : "0.00";
      return { metaId: meta._id, type: meta.type, valueGoal: meta.value, achieved, progress: `${pct}%` };
    }));

    return res.status(200).json(progress);
  } catch (error) {
    console.error("getMetaProgress:", error);
    return res.status(500).json({ message: "Erro ao gerar progresso de metas", error: error.message });
  }
};

/**
 * GET /api/reports/alerts
 * Lista alertas ativos
 */
export const getActiveAlerts = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const alerts = await Alert.find({ companyId, status: "active" }).sort({ createdAt: -1 });
    return res.status(200).json(alerts);
  } catch (error) {
    console.error("getActiveAlerts:", error);
    return res.status(500).json({ message: "Erro ao listar alertas", error: error.message });
  }
};

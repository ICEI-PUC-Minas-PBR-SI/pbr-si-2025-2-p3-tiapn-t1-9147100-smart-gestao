// ===========================================
// controllers/reportController.js
// Função: geração de relatórios financeiros
// Baseado nas coleções Transaction, Meta e Alert.
// ===========================================

import Transaction from "../models/Transaction.js";
import Meta from "../models/Meta.js";
import Alert from "../models/Alert.js";

/**
 * GET /api/reports/summary
 * Retorna resumo financeiro geral (receitas, despesas, lucro líquido)
 * Filtrado por companyId e período (mês atual por padrão)
 */
export const getFinancialSummary = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { start, end } = req.query;

    const startDate = start ? new Date(start) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endDate = end ? new Date(end) : new Date();

    // Busca transações da empresa dentro do período
    const transactions = await Transaction.find({
      companyId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Soma receitas e despesas
    const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.value, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.value, 0);
    const balance = income - expense;

    return res.status(200).json({
      companyId,
      period: { start: startDate, end: endDate },
      totals: { income, expense, balance },
      transactionsCount: transactions.length,
    });
  } catch (error) {
    console.error("Erro em getFinancialSummary:", error);
    return res.status(500).json({ message: "Erro ao gerar resumo financeiro", error: error.message });
  }
};

/**
 * GET /api/reports/categories
 * Retorna total de despesas/receitas agrupadas por categoria
 */
export const getCategoryReport = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const result = await Transaction.aggregate([
      { $match: { companyId } },
      {
        $group: {
          _id: "$category",
          totalValue: { $sum: "$value" },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalValue: -1 } },
    ]);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Erro em getCategoryReport:", error);
    return res.status(500).json({ message: "Erro ao gerar relatório por categoria", error: error.message });
  }
};

/**
 * GET /api/reports/meta-progress
 * Mostra o progresso das metas financeiras atuais
 */
export const getMetaProgress = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const metas = await Meta.find({ companyId });

    const result = [];
    for (const meta of metas) {
      const totalTransactions = await Transaction.aggregate([
        {
          $match: {
            companyId,
            type: meta.type,
            category: meta.focusCategory,
            date: { $gte: meta.startDate, $lte: meta.endDate },
          },
        },
        { $group: { _id: null, total: { $sum: "$value" } } },
      ]);

      const achieved = totalTransactions.length ? totalTransactions[0].total : 0;
      const progress = ((achieved / meta.value) * 100).toFixed(2);

      result.push({
        metaId: meta._id,
        type: meta.type,
        valueGoal: meta.value,
        achieved,
        progress: `${progress}%`,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Erro em getMetaProgress:", error);
    return res.status(500).json({ message: "Erro ao gerar progresso de metas", error: error.message });
  }
};

/**
 * GET /api/reports/alerts
 * Lista alertas financeiros ativos
 */
export const getActiveAlerts = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const alerts = await Alert.find({ companyId, status: "active" }).sort({ createdAt: -1 });
    return res.status(200).json(alerts);
  } catch (error) {
    console.error("Erro em getActiveAlerts:", error);
    return res.status(500).json({ message: "Erro ao buscar alertas ativos", error: error.message });
  }
};
    /*  return res.status(400).json({ message: "Valor inválido para transação" }); */

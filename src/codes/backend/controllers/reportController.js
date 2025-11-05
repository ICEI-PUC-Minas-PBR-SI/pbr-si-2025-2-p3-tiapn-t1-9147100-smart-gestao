// ============================================================
// - Arquivo: controllers/reportController.js
// - Função: Controla os relatórios financeiros e de alertas do sistema
// ============================================================

import Transaction from "../models/Transaction.js";
import Meta from "../models/Meta.js";
import Alert from "../models/Alert.js";

/**
 * - getFinancialSummary
 * Gera um resumo financeiro da empresa:
 * - Total de receitas
 * - Total de despesas
 * - Lucro líquido
 */
export const getFinancialSummary = async (req, res) => {
  try {
    const { companyId } = req.user; // obtém a empresa do usuário logado

    // Busca todas as transações da empresa
    const transactions = await Transaction.find({ companyId });

    // Calcula os totais de receita e despesa iterando sobre as transações.
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = totalIncome - totalExpense;

    res.status(200).json({
      companyId,
      totalIncome,
      totalExpense,
      netProfit,
    });
  } catch (error) {
    console.error("❌ Erro ao gerar resumo financeiro:", error);
    res.status(500).json({ message: "Erro ao gerar resumo financeiro." });
  }
};

/**
 * - getMonthlyReport
 * Retorna o balanço financeiro mensal agrupado por mês.
 */
export const getMonthlyReport = async (req, res) => {
  try {
    const { companyId } = req.user;

    // Utiliza o Aggregation Framework do MongoDB para agrupar transações por mês e calcular os totais.
    const report = await Transaction.aggregate([
      { $match: { companyId } },
      {
        $group: {
          _id: { $month: "$date" },
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.status(200).json({ companyId, report });
  } catch (error) {
    console.error("❌ Erro ao gerar relatório mensal:", error);
    res.status(500).json({ message: "Erro ao gerar relatório mensal." });
  }
};

/**
 * - getAlertsReport
 * Lista alertas financeiros e operacionais da empresa,
 * permitindo análise dos principais riscos ou falhas detectadas.
 */
export const getAlertsReport = async (req, res) => {
  try {
    const { companyId } = req.user;

    // Busca todos os alertas vinculados à empresa do usuário logado e os ordena por data de criação.
    const alerts = await Alert.find({ companyId }).sort({ createdAt: -1 });

    if (!alerts.length) {
      return res.status(200).json({
        message: "Nenhum alerta registrado para esta empresa.",
        alerts: [],
      });
    }

    res.status(200).json({
      message: "Relatório de alertas gerado com sucesso.",
      totalAlerts: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error("❌ Erro ao gerar relatório de alertas:", error);
    res.status(500).json({ message: "Erro ao gerar relatório de alertas." });
  }
};

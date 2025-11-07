// =================================================================================
// ARQUIVO: controllers/reportController.js
// DESCRIÇÃO: Controladores responsáveis por agregar dados e gerar relatórios
//            financeiros e operacionais para a empresa do usuário autenticado.
// =================================================================================

import Transaction from "../models/Transaction.js";
import Meta from "../models/Meta.js";
import Alert from "../models/Alert.js";

/**
 * Gera um resumo financeiro geral para a empresa.
 * Calcula o total de receitas, o total de despesas e o lucro líquido
 * com base em todas as transações da empresa.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getFinancialSummary = async (req, res) => {
  try {
    const { companyId } = req.user; // companyId já é ObjectId do authMiddleware

    // Busca todas as transações da empresa no banco de dados.
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
    console.error("Erro ao gerar resumo financeiro:", error);
    res.status(500).json({ message: "Erro ao gerar resumo financeiro." });
  }
};

/**
 * Gera um relatório financeiro agrupado por mês.
 * Utiliza o Aggregation Framework do MongoDB para processar os dados de forma
 * eficiente diretamente no banco de dados.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getMonthlyReport = async (req, res) => {
  try {
    const { companyId } = req.user; // companyId já é ObjectId do authMiddleware

    // Utiliza o Aggregation Framework do MongoDB para agrupar transações por mês e calcular os totais.
    const report = await Transaction.aggregate([
      // Filtra apenas as transações da empresa do usuário.
      { $match: { companyId } },
      {
        $group: {
          // Agrupa os documentos pelo mês extraído do campo 'date'.
          _id: { $month: "$date" },
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
      // Ordena os resultados pelo mês em ordem crescente.
      { $sort: { "_id": 1 } },
    ]);

    res.status(200).json({ companyId, report });
  } catch (error) {
    console.error("Erro ao gerar relatório mensal:", error);
    res.status(500).json({ message: "Erro ao gerar relatório mensal." });
  }
};

/**
 * Gera um relatório de todos os alertas da empresa.
 * Permite uma análise dos principais riscos ou eventos operacionais que
 * foram registrados para a empresa.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getAlertsReport = async (req, res) => {
  try {
    const { companyId } = req.user; // companyId já é ObjectId do authMiddleware

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
    console.error("Erro ao gerar relatório de alertas:", error);
    res.status(500).json({ message: "Erro ao gerar relatório de alertas." });
  }
};

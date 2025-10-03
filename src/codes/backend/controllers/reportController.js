// Controlador de relatórios financeiros

import Transaction from "../models/Transaction.js";

export const generateReport = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { startDate, endDate } = req.query;

    // Filtro por cliente e período
    const query = { clientId };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Busca todas transações
    const transactions = await Transaction.find(query);

    // Calcula totais
    const totalReceitas = transactions.filter(t => t.type === "receita").reduce((s, t) => s + t.value, 0);
    const totalDespesas = transactions.filter(t => t.type === "despesa").reduce((s, t) => s + t.value, 0);

    // Retorna relatório simples
    res.json({
      periodo: { startDate, endDate },
      totalReceitas,
      totalDespesas,
      saldoFinal: totalReceitas - totalDespesas,
      qtdTransacoes: transactions.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

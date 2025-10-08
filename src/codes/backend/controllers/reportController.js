// controllers/reportController.js
// Gera relatórios financeiros restritos à empresa logada

import Transaction from "../models/Transaction.js";

export const getCompanyReport = async (req, res) => {
  try {
    const empresaId = req.user.empresaId;

    // Filtro automático — somente dados da empresa
    const transactions = await Transaction.find({ empresaId });

    const resumo = {
      totalReceitas: transactions
        .filter(t => t.tipo === "receita")
        .reduce((acc, t) => acc + t.valor, 0),
      totalDespesas: transactions
        .filter(t => t.tipo === "despesa")
        .reduce((acc, t) => acc + t.valor, 0),
    };

    res.status(200).json({ empresaId, resumo, quantidade: transactions.length });
  } catch (err) {
    console.error("Erro ao gerar relatório:", err);
    res.status(500).json({ message: "Erro ao gerar relatório financeiro" });
  }
};

// Controlador de transações: receitas e despesas

import Transaction from "../models/Transaction.js";

// Criar uma transação (receita ou despesa)
export const createTransaction = async (req, res) => {
  try {
    const tx = new Transaction(req.body);
    await tx.save();
    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todas as transações de um cliente
export const getTransactions = async (req, res) => {
  try {
    const { clientId } = req.params;
    const txs = await Transaction.find({ clientId });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

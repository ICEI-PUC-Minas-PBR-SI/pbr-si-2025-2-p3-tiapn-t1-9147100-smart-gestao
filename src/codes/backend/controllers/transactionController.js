// ===========================================
// Arquivo: controllers/transactionController.js
// Função: Controle de transações financeiras (receitas e despesas)
// ===========================================

import Transaction from "../models/Transaction.js";
import { createLog } from "../utils/logger.js";

/**
 * Listar todas as transações da empresa
 */
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ companyId: req.user.companyId });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar transações", error });
  }
};

/**
 * Criar uma nova transação (receita ou despesa)
 */
export const createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      companyId: req.user.companyId,
    });
    await transaction.save();

    await createLog({
      userId: req.user.userId,
      companyId: req.user.companyId,
      action: "CREATE_TRANSACTION",
      description: `Transação criada (${transaction.type}): ${transaction.value}`,
      route: req.originalUrl,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar transação", error });
  }
};

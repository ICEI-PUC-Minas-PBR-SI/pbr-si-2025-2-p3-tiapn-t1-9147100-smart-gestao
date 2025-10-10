// ===========================================
// controllers/transactionController.js
// Função: CRUD de Transactions (income/expense)
// Observação: toda operação respeita companyId (multi-tenant).
// ===========================================

import Transaction from "../models/Transaction.js";
import { createLog } from "../utils/logger.js";

/**
 * GET /api/transactions
 * Lista transações da company do usuário. Suporta filtros por date range e categoria.
 * Query params: ?start=YYYY-MM-DD&end=YYYY-MM-DD&category=...
 */
export const getAllTransactions = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const filter = { companyId };

    // Filtros opcionais de data
    if (req.query.start || req.query.end) {
      filter.date = {};
      if (req.query.start) filter.date.$gte = new Date(req.query.start);
      if (req.query.end) filter.date.$lte = new Date(req.query.end);
    }

    if (req.query.category) filter.category = req.query.category;
    if (req.query.type) filter.type = req.query.type; // income|expense

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Erro em getAllTransactions:", error);
    return res.status(500).json({ message: "Erro ao listar transações", error: error.message });
  }
};

/**
 * GET /api/transactions/:id
 * Busca uma transação específica, somente se pertencer à mesma company.
 */
export const getTransactionById = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const tx = await Transaction.findOne({ _id: req.params.id, companyId });
    if (!tx) return res.status(404).json({ message: "Transação não encontrada" });
    return res.status(200).json(tx);
  } catch (error) {
    console.error("Erro em getTransactionById:", error);
    return res.status(500).json({ message: "Erro ao buscar transação", error: error.message });
  }
};

/**
 * POST /api/transactions
 * Cria nova transação. Body esperado:
 * { type: "income"|"expense", description, category, value, date, paymentMethod, clientId(optional) }
 */
export const createTransaction = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const creatorId = req.user.userId;

    const payload = {
      ...req.body,
      companyId,
    };

    // validações básicas
    if (!payload.type || !["income", "expense"].includes(payload.type)) {
      return res.status(400).json({ message: "Tipo inválido de transação" });
    }
    if (typeof payload.value !== "number" || payload.value < 0) {
      return res.status(400).json({ message: "Valor inválido" });
    }

    const tx = await Transaction.create(payload);

    await createLog({
      userId: creatorId,
      companyId,
      action: "CREATE_TRANSACTION",
      description: `Transação criada (${tx.type}) valor=${tx.value}`,
      route: req.originalUrl,
    });

    return res.status(201).json(tx);
  } catch (error) {
    console.error("Erro em createTransaction:", error);
    return res.status(500).json({ message: "Erro ao criar transação", error: error.message });
  }
};

/**
 * PUT /api/transactions/:id
 * Atualiza uma transação existente (within company).
 */
export const updateTransaction = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const updaterId = req.user.userId;
    const txId = req.params.id;

    const updated = await Transaction.findOneAndUpdate(
      { _id: txId, companyId },
      { $set: req.body },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Transação não encontrada" });

    await createLog({
      userId: updaterId,
      companyId,
      action: "UPDATE_TRANSACTION",
      description: `Transação atualizada (${updated._id})`,
      route: req.originalUrl,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Erro em updateTransaction:", error);
    return res.status(500).json({ message: "Erro ao atualizar transação", error: error.message });
  }
};

/**
 * DELETE /api/transactions/:id
 * Remove (ou marca como cancelada) uma transação.
 */
export const deleteTransaction = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const deleterId = req.user.userId;
    const txId = req.params.id;

    const removed = await Transaction.findOneAndDelete({ _id: txId, companyId });
    if (!removed) return res.status(404).json({ message: "Transação não encontrada" });

    await createLog({
      userId: deleterId,
      companyId,
      action: "DELETE_TRANSACTION",
      description: `Transação removida (${removed._id})`,
      route: req.originalUrl,
    });

    return res.status(200).json({ message: "Transação removida com sucesso" });
  } catch (error) {
    console.error("Erro em deleteTransaction:", error);
    return res.status(500).json({ message: "Erro ao remover transação", error: error.message });
  }
};

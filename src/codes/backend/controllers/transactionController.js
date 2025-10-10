// controllers/transactionController.js
// CRUD de transactions (income/expense)

import Transaction from "../models/Transaction.js";
import { createLog } from "../utils/logger.js";

/**
 * GET /api/transactions
 * Lista transações da company, com filtros opcionais: start,end,category,type
 */
export const getAllTransactions = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const filter = { companyId };

    if (req.query.start || req.query.end) {
      filter.date = {};
      if (req.query.start) filter.date.$gte = new Date(req.query.start);
      if (req.query.end) filter.date.$lte = new Date(req.query.end);
    }
    if (req.query.category) filter.category = req.query.category;
    if (req.query.type) filter.type = req.query.type;

    const items = await Transaction.find(filter).sort({ date: -1 });
    return res.status(200).json(items);
  } catch (error) {
    console.error("getAllTransactions:", error);
    return res.status(500).json({ message: "Erro ao listar transações", error: error.message });
  }
};

/**
 * POST /api/transactions
 * Cria transaction; corpo: { type, description, category, value, date, paymentMethod, clientId }
 */
export const createTransaction = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    const payload = { ...req.body, companyId };

    if (!payload.type || !["income", "expense"].includes(payload.type)) return res.status(400).json({ message: "Tipo inválido" });
    if (typeof payload.value !== "number") return res.status(400).json({ message: "Valor obrigatorio e numérico" });

    const tx = await Transaction.create(payload);

    await createLog({
      userId,
      companyId,
      action: "CREATE_TRANSACTION",
      description: `Transaction criada: ${tx._id} (${tx.type}) valor=${tx.value}`,
      route: req.originalUrl,
    });

    return res.status(201).json(tx);
  } catch (error) {
    console.error("createTransaction:", error);
    return res.status(500).json({ message: "Erro ao criar transaction", error: error.message });
  }
};

/**
 * PUT /api/transactions/:id
 * Atualiza transaction (dentro da mesma company)
 */
export const updateTransaction = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const updated = await Transaction.findOneAndUpdate({ _id: req.params.id, companyId }, { $set: req.body }, { new: true });
    if (!updated) return res.status(404).json({ message: "Transaction não encontrada" });

    await createLog({
      userId: req.user.userId,
      companyId,
      action: "UPDATE_TRANSACTION",
      description: `Transaction atualizada: ${updated._id}`,
      route: req.originalUrl,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("updateTransaction:", error);
    return res.status(500).json({ message: "Erro ao atualizar transaction", error: error.message });
  }
};

/**
 * DELETE /api/transactions/:id
 * Remove transaction (dentro da mesma company)
 */
export const deleteTransaction = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const removed = await Transaction.findOneAndDelete({ _id: req.params.id, companyId });
    if (!removed) return res.status(404).json({ message: "Transaction não encontrada" });

    await createLog({
      userId: req.user.userId,
      companyId,
      action: "DELETE_TRANSACTION",
      description: `Transaction removida: ${removed._id}`,
      route: req.originalUrl,
    });

    return res.status(200).json({ message: "Transaction removida com sucesso" });
  } catch (error) {
    console.error("deleteTransaction:", error);
    return res.status(500).json({ message: "Erro ao remover transaction", error: error.message });
  }
};

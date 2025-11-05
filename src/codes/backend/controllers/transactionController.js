// controllers/transactionController.js
// CRUD de transactions (income/expense)

import Transaction from "../models/Transaction.js";
import { createLog } from "../utils/logger.js";

/**
 * - GET /api/transactions
 * Lista transações da company, com filtros opcionais: start,end,category,type
 */
export const getAllTransactions = async (req, res) => {
  try {
    const companyId = req.user.companyId; // Vem do authMiddleware
    const filter = { companyId: companyId };

    if (req.query.start || req.query.end) {
      filter.date = {};
      if (req.query.start) filter.date.$gte = new Date(req.query.start); // Usa o campo 'date'
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
 * - POST /api/transactions
 * Cria transaction; corpo: { type, description, category, value, date, paymentMethod, clientId }
 */
export const createTransaction = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    // Garante que o companyId do token seja usado, ignorando qualquer um que venha no corpo
    const payload = { ...req.body, companyId: companyId, userId: req.user.userId }; 

    // A validação agora é primariamente feita pelo Mongoose Schema.
    // O controller pode focar na lógica de negócio.
    const tx = await Transaction.create(payload);

    // Exemplo de log de auditoria
    await createLog({
      userId: req.user.userId,
      companyId,
      action: "CREATE_TRANSACTION",
      description: `Transação criada: ${tx._id} (${tx.type}) valor=${tx.amount}`,
      route: req.originalUrl,
    });

    return res.status(201).json(tx);
  } catch (error) {
    console.error("createTransaction:", error);
    return res.status(500).json({ message: "Erro ao criar transaction", error: error.message });
  }
};

/**
 * - PUT /api/transactions/:id
 * Atualiza transaction (dentro da mesma company)
 */
export const updateTransaction = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, companyId: companyId }, // Garante que só pode editar da própria empresa
      { $set: req.body },
      { new: true, runValidators: true } // 'runValidators' força a validação do schema na atualização
    );
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
 * - DELETE /api/transactions/:id
 * Remove transaction (dentro da mesma company)
 */
export const deleteTransaction = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const removed = await Transaction.findOneAndDelete({ _id: req.params.id, companyId: companyId });
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

// =================================================================================
// ARQUIVO: controllers/transactionController.js
// DESCRIÇÃO: Controladores para as operações CRUD da entidade 'Transaction'.
//            Este é um dos principais controladores do sistema, responsável por
//            gerenciar todas as receitas e despesas.
// =================================================================================

import mongoose from 'mongoose'; // Importar mongoose para usar ObjectId
import Transaction from "../models/Transaction.js";
import { createLog } from "../utils/logger.js";

/**
 * Lista as transações da empresa do usuário, com suporte a filtros.
 * Filtros disponíveis via query string: `start`, `end`, `category`, `type`.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getAllTransactions = async (req, res) => {
  try {
    const companyId = req.user.companyId; // Vem do authMiddleware
    // O filtro base sempre garante o escopo da empresa.
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
 * Busca uma transação específica pelo seu ID.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getTransactionById = async (req, res) => {
    try {
        const transactionId = new mongoose.Types.ObjectId(req.params.id);
        const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware

        const transaction = await Transaction.findOne({ _id: transactionId, companyId: companyId });
        
       if (!transaction) {
            return res.status(404).json({ message: "Transaction não encontrada" });
        }

        return res.status(200).json(transaction);
    } catch (error) {
        console.error("getTransactionById:", error);
        return res.status(500).json({ message: "Erro ao buscar transaction", error: error.message });
    }
};
/**
 * Cria uma nova transação (receita ou despesa).
 * Garante que `companyId` e `userId` sejam extraídos do token de autenticação,
 * ignorando quaisquer valores que possam vir no corpo da requisição por segurança.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const createTransaction = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const payload = { ...req.body, companyId: companyId, userId: req.user.userId }; 

    // A validação dos campos é feita pelo Schema do Mongoose.
    const tx = await Transaction.create(payload);

    // Registra um log de auditoria detalhado para a criação da transação.
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
 * Atualiza uma transação existente.
 * A opção `runValidators: true` força o Mongoose a re-validar os dados
 * com base no Schema durante a atualização.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const updateTransaction = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, companyId: companyId }, // Garante que só pode editar da própria empresa
      { $set: req.body },
      { new: true, runValidators: true }
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
 * Exclui uma transação existente.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
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

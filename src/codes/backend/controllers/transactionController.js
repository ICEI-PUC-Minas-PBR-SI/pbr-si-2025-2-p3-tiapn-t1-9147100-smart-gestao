import mongoose from 'mongoose'; // Importar mongoose para usar ObjectId
import Transaction from "../models/Transaction.js";
import fs from 'fs';
import path from 'path';
import { createLog } from "../utils/logger.js";
import { successResponse, errorResponse } from '../utils/responseHelper.js';

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
    return successResponse(res, { data: items });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao listar transações", errors: error });
  }
};

export const getTransactionById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return errorResponse(res, { status: 404, message: "Transação não encontrada" });

        const companyId = req.user.companyId; // companyId já é ObjectId do authMiddleware

        const transaction = await Transaction.findOne({ _id: req.params.id, companyId: companyId });
        
       if (!transaction) {
            return errorResponse(res, { status: 404, message: "Transação não encontrada" });
        }

        return successResponse(res, { data: transaction });
    } catch (error) {
        return errorResponse(res, { status: 500, message: "Erro ao buscar transação", errors: error });
    }
};
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

    return successResponse(res, { status: 201, data: tx });
  } catch (error) {
    // Identifica se o erro é de validação do Mongoose e retorna 400.
    if (error.name === 'ValidationError') {
      return errorResponse(res, { status: 400, message: "Dados inválidos para criar transação.", errors: error.errors });
    }
    return errorResponse(res, { status: 500, message: "Erro ao criar transação", errors: error });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return errorResponse(res, { status: 404, message: "Transação não encontrada" });

    const companyId = req.user.companyId;
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, companyId: companyId }, // Garante que só pode editar da própria empresa
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return errorResponse(res, { status: 404, message: "Transação não encontrada" });

    await createLog({
      userId: req.user.userId,
      companyId,
      action: "UPDATE_TRANSACTION",
      description: `Transaction atualizada: ${updated._id}`,
      route: req.originalUrl,
    });

    return successResponse(res, { data: updated });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao atualizar transação", errors: error });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return errorResponse(res, { status: 404, message: "Transação não encontrada" });

    const companyId = req.user.companyId;
    const removed = await Transaction.findOneAndDelete({ _id: req.params.id, companyId: companyId });
    if (!removed) return errorResponse(res, { status: 404, message: "Transação não encontrada" });

    await createLog({
      userId: req.user.userId,
      companyId,
      action: "DELETE_TRANSACTION",
      description: `Transaction removida: ${removed._id}`,
      route: req.originalUrl,
    });

    return successResponse(res, { message: "Transação removida com sucesso" });
  } catch (error) {
    return errorResponse(res, { status: 500, message: "Erro ao remover transação", errors: error });
  }
};

/**
 * @desc    Upload an attachment for a specific transaction
 * @route   POST /api/transactions/:id/upload
 * @access  Private
 */
export const uploadAttachment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return errorResponse(res, { status: 404, message: "Transação não encontrada" });

    // O middleware 'upload' já processou o arquivo e o adicionou a req.file
    if (!req.file) {
      return errorResponse(res, { status: 400, message: 'Nenhum arquivo foi enviado.' });
    }

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return errorResponse(res, { status: 404, message: 'Transação não encontrada.' });
    }

    // Se já houver um anexo, remove o arquivo antigo antes de adicionar o novo.
    if (transaction.attachment) {
      const oldPath = path.resolve(process.cwd(), transaction.attachment);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Salva o caminho do novo arquivo no banco de dados.
    // O caminho é relativo à raiz do projeto.
    transaction.attachment = req.file.path.replace(/\\/g, "/"); // Normaliza para barras forward
    await transaction.save();

    return successResponse(res, { message: 'Anexo enviado com sucesso.', data: transaction });

  } catch (error) {
    return errorResponse(res, { status: 500, message: 'Erro no servidor ao enviar anexo.', errors: error });
  }
};

/**
 * @desc    Delete the attachment from a specific transaction
 * @route   DELETE /api/transactions/:id/upload
 * @access  Private
 */
export const deleteAttachment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return errorResponse(res, { status: 404, message: "Transação não encontrada" });

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return errorResponse(res, { status: 404, message: 'Transação não encontrada.' });
    }

    if (!transaction.attachment) {
      return errorResponse(res, { status: 404, message: 'A transação não possui um anexo para ser removido.' });
    }

    const filePath = path.resolve(process.cwd(), transaction.attachment);

    // Remove o arquivo físico do disco.
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove a referência do anexo no banco de dados.
    transaction.attachment = null;
    await transaction.save();

    return successResponse(res, { message: 'Anexo removido com sucesso.', data: transaction });

  } catch (error) {
    return errorResponse(res, { status: 500, message: 'Erro no servidor ao remover anexo.', errors: error });
  }
};

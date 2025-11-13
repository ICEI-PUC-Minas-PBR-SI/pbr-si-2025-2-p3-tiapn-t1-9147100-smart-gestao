// =================================================================================
// ARQUIVO: controllers/reportController.js
// DESCRIÇÃO: Controladores responsáveis por orquestrar a geração de relatórios,
//            principalmente em formato PDF. Eles buscam os dados necessários
//            e invocam os serviços correspondentes para criar os arquivos.
// =================================================================================

import Transaction from '../models/Transaction.js';
import Alert from '../models/Alert.js';
import Company from '../models/Company.js';
import Client from '../models/Client.js';
import mongoose from 'mongoose';
import { errorResponse } from '../utils/responseHelper.js';

// @desc    Exportar um relatório de transações em PDF
// @route   GET /api/reports/export/pdf
// @access  Private
export const exportTransactionsPDF = async (req, res) => {
  try {
    const companyId = new mongoose.Types.ObjectId(req.user.companyId);

    // 1. Busca os dados necessários em paralelo
    const transactions = await Transaction.find({ companyId }).sort({ date: -1 }).limit(100).lean();
    const company = await Company.findById(companyId).lean();

    // 2. Chama o serviço de PDF para gerar o relatório
    // Importa dinamicamente o serviço de PDF no momento da requisição para permitir
    // que testes que mockam `pdfService` substituam a implementação.
    const { generateFinancialReportPDF } = await import('../services/pdfService.js');
    generateFinancialReportPDF({ transactions, company }, res);
  } catch (error) {
    return errorResponse(res, 500, "Erro interno ao gerar relatório de transações.", error);
  }
};

// @desc    Exportar um relatório de clientes em PDF
// @route   GET /api/reports/export/clients-pdf
// @access  Private
export const exportClientsPDF = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const company = await Company.findById(companyId);
        const clients = await Client.find({ companyId });

        // Garante que, mesmo sem clientes, o relatório seja gerado corretamente (com a informação de "nenhum cliente").
        const { generateClientsReportPDF } = await import('../services/pdfService.js');
        if (!clients) {
          return generateClientsReportPDF({ clients: [], company }, res);
        }

        generateClientsReportPDF({ clients, company }, res);
    } catch (error) {
        return errorResponse(res, 500, 'Erro interno ao gerar relatório de clientes.', error);
    }
};

// @desc    Obter um resumo financeiro (total de receitas, despesas e balanço)
// @route   GET /api/reports/summary
// @access  Private
export const getFinancialSummary = async (req, res) => {
  try {
    const companyId = new mongoose.Types.ObjectId(req.user.companyId);
    const summary = await Transaction.aggregate([
      { $match: { companyId: companyId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const revenue = summary.find(item => item._id === 'revenue')?.total || 0;
    const expense = summary.find(item => item._id === 'expense')?.total || 0;

    res.json({
      revenue,
      expense,
      balance: revenue - expense,
    });
  } catch (error) {
    return errorResponse(res, 500, 'Erro ao gerar resumo financeiro.', error);
  }
};

// @desc    Obter um relatório financeiro agrupado por mês
// @route   GET /api/reports/monthly
// @access  Private
export const getMonthlyReport = async (req, res) => {
  try {
    const companyId = new mongoose.Types.ObjectId(req.user.companyId);
    const report = await Transaction.aggregate([
      { $match: { companyId: companyId } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          totalRevenue: { $sum: { $cond: [{ $eq: ['$type', 'revenue'] }, '$amount', 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
    ]);
    res.json(report);
  } catch (error) {
    return errorResponse(res, 500, 'Erro ao gerar relatório mensal.', error);
  }
};

// @desc    Obter um relatório de todos os alertas gerados para a empresa
// @route   GET /api/reports/alerts
// @access  Private
export const getAlertsReport = async (req, res) => {
  const alerts = await Alert.find({ companyId: req.user.companyId }).sort({ createdAt: -1 });
  res.json(alerts);
};

// @desc    Exportar uma fatura para uma transação específica
// @route   GET /api/reports/export/invoice/:transactionId
// @access  Private
export const exportInvoicePDF = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.companyId);

        const transaction = await Transaction.findOne({ _id: transactionId, companyId });
        if (!transaction) {
            return errorResponse(res, 404, "Transação não encontrada.");
        }

    const company = await Company.findById(companyId).lean();
    const client = transaction.clientId ? await Client.findById(transaction.clientId).lean() : null;

    const { generateInvoicePDF } = await import('../services/pdfService.js');
    generateInvoicePDF({ transaction, company, client }, res);
    } catch (error) {
        return errorResponse(res, 500, "Erro interno ao gerar fatura.", error);
    }
};
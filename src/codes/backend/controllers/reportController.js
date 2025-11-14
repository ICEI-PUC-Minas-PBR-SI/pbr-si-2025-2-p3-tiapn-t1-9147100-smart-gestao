import Transaction from '../models/Transaction.js';
import Company from '../models/Company.js';
import mongoose from 'mongoose';
import { errorResponse } from '../utils/responseHelper.js';

/**
 * @desc    Exportar um relatório de clientes em PDF.
 */
export const exportClientsPDF = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const Client = mongoose.model('Client'); // Evita importação circular se Client usar algum serviço
        const company = await Company.findById(companyId);
        const clients = await Client.find({ companyId });

        // Garante que, mesmo sem clientes, o relatório seja gerado corretamente (com a informação de "nenhum cliente").
        const { generateClientsReportPDF } = await import('../services/pdfService.js');
        if (!clients) {
          return generateClientsReportPDF({ clients: [], company }, res);
        }

        generateClientsReportPDF({ clients, company }, res);
    } catch (error) {
        return errorResponse(res, { status: 500, message: 'Erro interno ao gerar relatório de clientes.', errors: error });
    }
};

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
    return errorResponse(res, { status: 500, message: 'Erro ao gerar resumo financeiro.', errors: error });
  }
};

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
    return errorResponse(res, { status: 500, message: 'Erro ao gerar relatório mensal.', errors: error });
  }
};

export const getAlertsReport = async (req, res) => {
  const Alert = mongoose.model('Alert');
  const alerts = await Alert.find({ companyId: req.user.companyId }).sort({ createdAt: -1 });
  res.json(alerts);
};

export const exportInvoicePDF = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.companyId);

        const transaction = await Transaction.findOne({ _id: transactionId, companyId });
        if (!transaction) {
            return errorResponse(res, { status: 404, message: "Transação não encontrada." });
        }

    const company = await Company.findById(companyId).lean();
    const Client = mongoose.model('Client');
    const client = transaction.clientId ? await Client.findById(transaction.clientId).lean() : null;

    const { generateInvoicePDF } = await import('../services/pdfService.js');
    generateInvoicePDF({ transaction, company, client }, res);
    } catch (error) {
        return errorResponse(res, { status: 500, message: "Erro interno ao gerar fatura.", errors: error });
    }
};
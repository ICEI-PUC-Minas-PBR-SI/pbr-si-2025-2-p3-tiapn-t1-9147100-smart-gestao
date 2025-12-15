/**
 * =================================================================================
 * ARQUIVO: controllers/reportController.js
 * DESCRIÇÃO: Controladores responsáveis por orquestrar a geração de relatórios.
 *            A responsabilidade principal é buscar os dados necessários no banco
 *            e delegar a criação do PDF para o `pdfService`.
 * =================================================================================
 */
/**
 * =================================================================================
 * ARQUIVO: controllers/reportController.js
 * DESCRIÇÃO: Controladores responsáveis por orquestrar a geração de relatórios.
 *            A responsabilidade principal é buscar os dados necessários no banco
 *            e delegar a criação do PDF para o `pdfService`.
 * =================================================================================
 */
import Transaction from '../models/Transaction.js';
import Company from '../models/Company.js';
import mongoose from 'mongoose';
import { errorResponse } from '../utils/responseHelper.js';
import {
  generateClientsReportPDF,
  generateInvoicePDF,
  generateFinancialReportPDF,
} from '../services/pdfService.js';

/**
 * @desc    Exporta um relatório de clientes em formato PDF.
 * @route   GET /api/reports/export/clients-pdf
 * @access  Private
 * @note    Busca os dados e delega a geração e envio do PDF para o `pdfService`.
 */
export const exportClientsPDF = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const Client = mongoose.model('Client'); // Evita importação circular se Client usar algum serviço
        const company = await Company.findById(companyId);
        const clients = await Client.find({ companyId });

        return generateClientsReportPDF({ clients, company }, res);
    } catch (error) {
        return errorResponse(res, { status: 500, message: 'Erro interno ao gerar relatório de clientes.', errors: error });
    }
};

/**
 * @desc    Exporta uma fatura específica em formato PDF.
 * @route   GET /api/reports/export/invoice/:id
 * @access  Private
 * @note    Busca os dados e delega a geração e envio do PDF para o `pdfService`.
 */
export const exportInvoicePDF = async (req, res) => {
    try {
        const { id: transactionId } = req.params;
        const companyId = new mongoose.Types.ObjectId(req.user.companyId);

        const transaction = await Transaction.findOne({ _id: transactionId, companyId });
        if (!transaction) {
            return errorResponse(res, { status: 404, message: "Transação não encontrada." });
        }

    const company = await Company.findById(companyId).lean();
    const Client = mongoose.model('Client');
    const client = transaction.clientId ? await Client.findById(transaction.clientId).lean() : null;

    return generateInvoicePDF({ transaction, company, client }, res);
    } catch (error) {
        return errorResponse(res, { status: 500, message: "Erro interno ao gerar fatura.", errors: error });
    }
};

/**
 * @desc    Exporta um relatório de transações financeiras em formato PDF.
 * @route   GET /api/reports/export/transactions-pdf
 * @access  Private
 * @note    Busca os dados e delega a geração e envio do PDF para o `pdfService`.
 */
export const exportTransactionsPDF = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const company = await Company.findById(companyId).lean();
    const transactions = await Transaction.find({ companyId }).sort({ date: -1 }).lean();

    return generateFinancialReportPDF({ transactions, company }, res);
  } catch (error) {
    return errorResponse(res, { status: 500, message: 'Erro interno ao gerar relatório de transações.', errors: error });
  }
};
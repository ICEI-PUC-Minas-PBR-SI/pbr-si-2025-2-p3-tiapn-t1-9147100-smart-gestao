/**
 * =================================================================================
 * ARQUIVO: services/reportGenerator.js
 * DESCRIÇÃO: Serviço centralizado para gerar, salvar e gerenciar relatórios em PDF.
 *            Este módulo encapsula toda a lógica de criação de PDF, incluindo a
 *            formatação do conteúdo e o salvamento em uma estrutura de pastas organizada.
 * =================================================================================
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Funções Auxiliares de Geração de PDF ---

/**
 * Adiciona um cabeçalho padrão ao documento PDF.
 * @param {PDFDocument} doc - A instância do documento PDFKit.
 * @param {object} company - O objeto da empresa.
 * @param {string} title - O título do relatório.
 */
function addHeader(doc, company, title) {
    doc.fontSize(18).font('Helvetica-Bold').text(title, { align: 'center' });
    doc.moveDown(0.5);

    if (company) {
        doc.fontSize(12).font('Helvetica').text(`Empresa: ${company.name || 'N/A'}`, { align: 'center' });
        doc.fontSize(10).text(`CNPJ: ${company.cnpj || 'N/A'}`, { align: 'center' });
    }
    doc.fontSize(8).text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
    doc.moveDown(2);
}

/**
 * Adiciona um rodapé padrão ao documento PDF.
 * @param {PDFDocument} doc - A instância do documento PDFKit.
 */
function addFooter(doc, pageNumber) {
    doc.fontSize(8).text(`Página ${pageNumber}`, 50, doc.page.height - 50, {
        align: 'right'
    });
    doc.fontSize(8).text('Relatório gerado por Smart Gestão', 50, doc.page.height - 50, {
        align: 'left'
    });
}

/**
 * Cria a estrutura de diretórios para salvar o relatório e retorna o caminho completo do arquivo.
 * @param {string} companyName - Nome da empresa para criar a pasta.
 * @param {string} reportType - Tipo de relatório (e.g., 'transactions', 'clients').
 * @returns {string} O caminho absoluto onde o arquivo PDF será salvo.
 */
function getReportPath(companyName, reportType) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const companySlug = (companyName || 'sem-nome').toString().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateFolder = `${year}-${month}-${day}`;

    const reportDir = path.resolve(__dirname, '..', 'uploads', 'reports', companySlug, dateFolder, reportType);
    fs.mkdirSync(reportDir, { recursive: true });

    const timestamp = date.getTime();
    const filename = `relatorio-${timestamp}.pdf`;

    return path.join(reportDir, filename);
}

/**
 * Gera um PDF de relatório de transações, salva em disco e retorna o caminho do arquivo.
 * @param {object} data - Dados para o relatório.
 * @returns {Promise<string>} O caminho do arquivo PDF gerado.
 */
export async function generateTransactionsReport(data) {
    const { transactions, company } = data;
    const doc = new PDFDocument({ margin: 50 });
    const filePath = getReportPath(company.name, 'transactions');
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    let pageNumber = 1;
    addFooter(doc, pageNumber);
    doc.on('pageAdded', () => {
        pageNumber++;
        addFooter(doc, pageNumber);
    });

    addHeader(doc, company, 'Relatório de Transações');

    // Tabela
    doc.font('Helvetica-Bold');
    const tableTop = doc.y;
    doc.text('Data', 50, tableTop);
    doc.text('Descrição', 120, tableTop);
    doc.text('Categoria', 280, tableTop);
    doc.text('Tipo', 400, tableTop);
    doc.text('Valor', 480, tableTop, { align: 'right' });
    doc.moveDown();

    doc.font('Helvetica');
    transactions.forEach(tx => {
        const y = doc.y;
        doc.text(new Date(tx.date).toLocaleDateString('pt-BR'), 50, y);
        doc.text(tx.description, 120, y, { width: 150 });
        doc.text(tx.category, 280, y, { width: 110 });
        doc.text(tx.type === 'revenue' ? 'Receita' : 'Despesa', 400, y);
        doc.text(tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 480, y, { align: 'right' });
        doc.moveDown();
    });

    doc.end();

    return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
}

/**
 * Gera um PDF de relatório de clientes, salva em disco e retorna o caminho do arquivo.
 * @param {object} data - Dados para o relatório.
 * @returns {Promise<string>} O caminho do arquivo PDF gerado.
 */
export async function generateClientsReport(data) {
    const { clients, company } = data;
    const doc = new PDFDocument({ margin: 50 });
    const filePath = getReportPath(company.name, 'clients');
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    let pageNumber = 1;
    addFooter(doc, pageNumber);
    doc.on('pageAdded', () => {
        pageNumber++;
        addFooter(doc, pageNumber);
    });

    addHeader(doc, company, 'Relatório de Clientes');

    // Tabela
    doc.font('Helvetica-Bold');
    const tableTop = doc.y;
    doc.text('Nome', 50, tableTop);
    doc.text('Email', 250, tableTop);
    doc.text('Tipo', 480, tableTop, { align: 'right' });
    doc.moveDown();

    doc.font('Helvetica');
    clients.forEach(client => {
        const y = doc.y;
        doc.text(client.name, 50, y, { width: 190 });
        doc.text(client.email || 'N/A', 250, y, { width: 220 });
        doc.text(client.type === 'client' ? 'Cliente' : 'Fornecedor', 480, y, { align: 'right' });
        doc.moveDown();
    });

    doc.end();

    return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
}

/**
 * Gera uma fatura em PDF, salva em disco e retorna o caminho do arquivo.
 * @param {object} data - Dados para a fatura.
 * @returns {Promise<string>} O caminho do arquivo PDF gerado.
 */
export async function generateInvoice(data) {
    const { transaction, company, client } = data;
    const doc = new PDFDocument({ margin: 50 });
    const filePath = getReportPath(company.name, 'invoices');
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    let pageNumber = 1;
    addFooter(doc, pageNumber);
    doc.on('pageAdded', () => {
        pageNumber++;
        addFooter(doc, pageNumber);
    });

    addHeader(doc, company, `Fatura #${transaction._id.toString().substring(0, 8)}`);

    doc.fontSize(12).font('Helvetica-Bold').text('Cliente:');
    doc.font('Helvetica').text(client ? client.name : 'Não informado');
    if (client && client.document) {
        doc.text(`Documento: ${client.document}`);
    }
    doc.moveDown(2);

    doc.fontSize(12).font('Helvetica-Bold').text('Detalhes da Transação:');
    doc.font('Helvetica').text(`Descrição: ${transaction.description}`);
    doc.text(`Data: ${new Date(transaction.date).toLocaleDateString('pt-BR')}`);
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Valor Total:', { continued: true, align: 'right' });
    doc.text(` ${transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);

    doc.end();

    return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);
    });
}
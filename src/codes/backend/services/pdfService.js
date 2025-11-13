/**
 * @file Serviço de geração de PDFs.
 * @description Centraliza a lógica de criação de diferentes tipos de relatórios em PDF.
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Adiciona um cabeçalho padrão a um documento PDF.
 * @param {PDFDocument} doc - A instância do documento PDFKit.
 * @param {object} company - O objeto da empresa.
 * @param {string} title - O título do relatório.
 */
function addHeader(doc, company, title) {
  doc.fontSize(20).text(title, { align: 'center' });
  doc.moveDown();

  if (company) {
    doc.fontSize(14).text(`Empresa: ${company.name}`);
    doc.fontSize(10).text(`CNPJ: ${company.cnpj}`);
  }
  doc.fontSize(10).text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`);
  doc.moveDown();
  doc.lineCap('butt').moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();
}

/**
 * Desenha o cabeçalho de uma tabela de forma genérica.
 * @param {PDFDocument} doc - A instância do documento PDFKit.
 * @param {number} y - A posição Y inicial para desenhar.
 * @param {Array<object>} headers - Um array de objetos de cabeçalho. Ex: [{ text: 'Nome', x: 50, options: {} }]
 */
function drawTableHeader(doc, y, headers) {
  doc.fontSize(10).font('Helvetica-Bold');
  headers.forEach(header => {
    doc.text(header.text, header.x, y, header.options);
  });
  doc.font('Helvetica');
  const tableBottomLineY = y + 15;
  doc.moveTo(50, tableBottomLineY).lineTo(550, tableBottomLineY).stroke();
  return tableBottomLineY + 5; // Retorna a posição para a primeira linha de dados
}

/**
 * Desenha uma linha da tabela de forma genérica.
 * @param {PDFDocument} doc - A instância do documento PDFKit.
 * @param {number} y - A posição Y para desenhar a linha.
 * @param {Array<object>} cells - Um array de objetos de célula. Ex: [{ text: 'Valor', x: 50, options: {} }]
 */
function drawTableRow(doc, y, cells) {
  doc.fontSize(10);
  cells.forEach(cell => {
    doc.text(cell.text, cell.x, y, cell.options);
  });
}

/**
 * Adiciona um rodapé padrão com paginação.
 * @param {PDFDocument} doc - A instância do documento PDFKit.
 */
function addFooter(doc) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).text(`Página ${i + 1} de ${range.count}`, 50, doc.page.height - 50, { align: 'right' });
    doc.fontSize(8).text('Gerado por SmartGestao', 50, doc.page.height - 50, { align: 'left' });
  }
}

/**
 * Gera um PDF de relatório financeiro.
 * @param {object} data - Os dados para o relatório.
 * @param {Array} data.transactions - A lista de transações.
 * @param {object} data.company - Os dados da empresa.
 * @param {object} res - O objeto de resposta do Express.
 */
export function generateFinancialReportPDF(data, res) {
  // If tests installed a mock, prefer process.__pdfServiceMock (visible to server process).
  const gmock = (process && process.__pdfServiceMock) || globalThis.__pdfServiceMock;
  if (gmock && typeof gmock.generateFinancialReportPDF === 'function') {
    return gmock.generateFinancialReportPDF(data, res);
  }

  const { transactions, company } = data;
  const doc = new PDFDocument({ margin: 50, bufferPages: true });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio-financeiro.pdf');
  doc.pipe(res);

  // During tests, also save the generated PDF to disk for manual inspection.
  try {
    if (process.env.NODE_ENV === 'test') {
      const outDir = path.join(process.cwd(), 'Testes', 'PDFs');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `relatorio-transacoes-${timestamp}.pdf`;
      const outPath = path.join(outDir, filename);
      const fileStream = fs.createWriteStream(outPath);
      doc.pipe(fileStream);
      fileStream.on('finish', () => {
        console.log(`[PDF SAVED] ${outPath}`);
      });
    }
  } catch (e) {
    // Non-fatal: log and continue streaming to response
    console.warn('Aviso: não foi possível salvar PDF no disco durante testes.', e.message);
  }

  addHeader(doc, company, 'Relatório de Transações');

  if (transactions.length === 0) {
    doc.fontSize(12).text('Nenhuma transação encontrada para o período selecionado.');
  } else {
    // Tabela de transações
    let y = doc.y;
    const rowHeight = 20;
    const pageBottom = doc.page.height - 70; // Margem inferior para o rodapé

    const headers = [
      { text: 'Descrição', x: 50 },
      { text: 'Valor', x: 250 },
      { text: 'Tipo', x: 350 },
      { text: 'Data', x: 450, options: { width: 100, align: 'right' } }
    ];

    y = drawTableHeader(doc, y, headers);

    transactions.forEach(tx => {
      // Se a próxima linha não couber na página, adiciona uma nova página e redesenha o cabeçalho.
      if (y + rowHeight > pageBottom) {
        doc.addPage();
        addHeader(doc, company, 'Relatório de Transações (Continuação)');
        y = doc.y; // Reseta a posição Y para o topo da nova página
        y = drawTableHeader(doc, y, headers);
      }

      const cells = [
        { text: tx.description, x: 50, options: { width: 190 } },
        { text: tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), x: 250 },
        { text: tx.type === 'revenue' ? 'Receita' : 'Despesa', x: 350 },
        { text: new Date(tx.date).toLocaleDateString('pt-BR'), x: 450, options: { width: 100, align: 'right' } }
      ];

      drawTableRow(doc, y, cells);
      y += rowHeight;
    });
  }

  addFooter(doc);
  doc.end();
}

/**
 * Gera um PDF de relatório de clientes.
 * @param {object} data - Os dados para o relatório.
 * @param {Array} data.clients - A lista de clientes.
 * @param {object} data.company - Os dados da empresa.
 * @param {object} res - O objeto de resposta do Express.
 */
export function generateClientsReportPDF(data, res) {
  const gmock = (process && process.__pdfServiceMock) || globalThis.__pdfServiceMock;
  if (gmock && typeof gmock.generateClientsReportPDF === 'function') {
    return gmock.generateClientsReportPDF(data, res);
  }

  const { clients, company } = data;
    const doc = new PDFDocument({ margin: 50, bufferPages: true });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio-clientes.pdf');
    doc.pipe(res);

    try {
      if (process.env.NODE_ENV === 'test') {
        const outDir = path.join(process.cwd(), 'Testes', 'PDFs');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `relatorio-clientes-${timestamp}.pdf`;
        const outPath = path.join(outDir, filename);
        const fileStream = fs.createWriteStream(outPath);
        doc.pipe(fileStream);
        fileStream.on('finish', () => {
          console.log(`[PDF SAVED] ${outPath}`);
        });
      }
    } catch (e) {
      console.warn('Aviso: não foi possível salvar PDF no disco durante testes.', e.message);
    }

    addHeader(doc, company, 'Relatório de Clientes');

    if (clients.length === 0) {
        doc.fontSize(12).text('Nenhum cliente encontrado.');
    } else {
        let y = doc.y;
        const rowHeight = 20;
        const pageBottom = doc.page.height - 70;

        const headers = [
            { text: 'Nome', x: 50 },
            { text: 'Email', x: 250 },
            { text: 'Tipo', x: 450, options: { width: 100, align: 'right' } }
        ];

        y = drawTableHeader(doc, y, headers);

        clients.forEach(client => {
            if (y + rowHeight > pageBottom) {
                doc.addPage();
                addHeader(doc, company, 'Relatório de Clientes (Continuação)');
                y = doc.y;
                y = drawTableHeader(doc, y, headers);
            }

            const cells = [
                { text: client.name, x: 50, options: { width: 190 } },
                { text: client.email || '-', x: 250, options: { width: 190 } },
                { text: client.type === 'client' ? 'Cliente' : 'Fornecedor', x: 450, options: { width: 100, align: 'right' } }
            ];

            drawTableRow(doc, y, cells);
            y += rowHeight;
        });
    }

    addFooter(doc);
    doc.end();
}

/**
 * Gera uma fatura em PDF para uma transação.
 * @param {object} data - Os dados para a fatura.
 * @param {object} data.transaction - A transação.
 * @param {object} data.company - Os dados da empresa.
 * @param {object} data.client - Os dados do cliente (opcional).
 * @param {object} res - O objeto de resposta do Express.
 */
export function generateInvoicePDF(data, res) {
  const gmock = (process && process.__pdfServiceMock) || globalThis.__pdfServiceMock;
  if (gmock && typeof gmock.generateInvoicePDF === 'function') {
    return gmock.generateInvoicePDF(data, res);
  }

  const { transaction, company, client } = data;
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=fatura-${transaction._id}.pdf`);
    doc.pipe(res);

    try {
      if (process.env.NODE_ENV === 'test') {
        const outDir = path.join(process.cwd(), 'Testes', 'PDFs');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `fatura-${transaction._id}-${timestamp}.pdf`;
        const outPath = path.join(outDir, filename);
        const fileStream = fs.createWriteStream(outPath);
        doc.pipe(fileStream);
        fileStream.on('finish', () => {
          console.log(`[PDF SAVED] ${outPath}`);
        });
      }
    } catch (e) {
      console.warn('Aviso: não foi possível salvar PDF no disco durante testes.', e.message);
    }

    // Corpo da Fatura (simplificado)
    addHeader(doc, company, 'Fatura');
    doc.fontSize(12).text(`Fatura Nº: ${transaction._id}`);
    doc.text(`Data de Vencimento: ${new Date(transaction.date).toLocaleDateString('pt-BR')}`);
    doc.moveDown();
    if (client) {
        doc.fontSize(12).text('Cliente:');
        doc.text(client.name);
        doc.text(client.document || '');
    }
    doc.moveDown(2);
    doc.fontSize(14).text('Item');
    doc.text(`${transaction.description} - ${transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    doc.moveDown();
    doc.fontSize(16).text(`VALOR TOTAL: ${transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, { align: 'right' });

    addFooter(doc);
    doc.end();
}
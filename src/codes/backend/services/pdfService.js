/**
 * =================================================================================
 * ARQUIVO: services/pdfService.js
 * DESCRIÇÃO: Serviço responsável por centralizar toda a lógica de criação de
 *            documentos em formato PDF, como relatórios e faturas.
 *            Este serviço é chamado pelos controladores (`reportController`) e utiliza
 *            a biblioteca `pdfkit` para gerar os documentos.
 * =================================================================================
 */

/**
 * =================================================================================
 * ARQUIVO: services/pdfService.js
 * DESCRIÇÃO: Serviço responsável por centralizar toda a lógica de criação de
 *            documentos em formato PDF, como relatórios e faturas.
 *            Este serviço é chamado pelos controladores (`reportController`) e utiliza
 *            a biblioteca `pdfkit` para gerar os documentos.
 * =================================================================================
 */
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// --- Funções Auxiliares Internas ---

/**
 * Adiciona um cabeçalho padrão a um documento PDF.
 * @param {PDFDocument} doc - A instância do documento PDFKit.
 * @param {object} company - O objeto da empresa.
 * @param {string} title - O título do relatório.
 */
function addHeader(doc, company, title) {
  doc.fontSize(18).font('Helvetica-Bold').text(title, { align: 'center' });
  doc.moveDown();

  if (company) {
    doc.fontSize(12).font('Helvetica').text(`Empresa: ${company.name || 'N/A'}`);
    doc.fontSize(10).text(`CNPJ: ${company.cnpj || 'N/A'}`);
  }

  // Adiciona data e hora da emissão para maior precisão.
  const now = new Date();
  const dateTimeString = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  doc.fontSize(10).text(`Data de Emissão: ${dateTimeString}`);

  doc.moveDown();
  doc.lineCap('butt').moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();
}

/**
 * Desenha o cabeçalho de uma tabela de forma genérica e retorna a posição Y para a próxima linha.
 * @param {PDFDocument} doc - A instância do documento PDFKit.
 * @param {number} y - A posição Y inicial para desenhar.
 * @param {Array<object>} headers - Um array de objetos de cabeçalho. Ex: `[{ text: 'Nome', x: 50, options: {} }]`
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
 * @param {number} y - A posição Y inicial para desenhar a linha.
 * @param {Array<object>} cells - Um array de objetos de célula. Ex: [{ text: 'Valor', x: 50, options: {} }]
 */
function drawTableRow(doc, y, cells) {
  doc.fontSize(10);
  cells.forEach(cell => {
    doc.text(cell.text, cell.x, y, cell.options);
  });
}

/**
 * Adiciona um rodapé padrão com número de página a todas as páginas do documento.
 * @param {PDFDocument} doc - A instância do documento PDFKit.
 */
function addFooter(doc) {
  // Só tenta adicionar rodapé quando o modo de buffer de páginas estiver ativo.
  // `switchToPage` e `bufferedPageRange` dependem de `bufferPages: true` na criação do PDF.
  try {
    const range = doc.bufferedPageRange && doc.bufferedPageRange();
    if (!range || !range.count) return; // nada a fazer
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(8).text(`Página ${i + 1} de ${range.count}`, 50, doc.page.height - 50, { align: 'right' });
      doc.fontSize(8).text('Gerado por SmartGestao', 50, doc.page.height - 50, { align: 'left' });
    }
  } catch (e) {
    // Se algo falhar ao tentar adicionar o rodapé, não interrompe a geração do PDF.
    console.warn('Aviso: não foi possível adicionar rodapé ao PDF.', e.message);
  }
}

/**
 * Configura a resposta HTTP para streaming de PDF e opcionalmente salva o arquivo em disco durante os testes.
 * @param {object} res - O objeto de resposta do Express.
 * @param {PDFDocument} doc - A instância do documento PDFKit.
 * @param {string} filename - O nome do arquivo para o download.
 * @param {string} testSubfolder - O nome da subpasta para salvar o PDF em ambiente de teste.
 */
function setupPdfResponse(res, doc, filename, testSubfolder) {
  // 1. Configura os cabeçalhos da resposta para indicar que um arquivo PDF está sendo enviado.
  res.statusCode = res.statusCode || 200;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
  res.setHeader('Content-Transfer-Encoding', 'binary');

  // 2. Garante que os headers sejam enviados antes de iniciarmos o streaming do corpo do PDF.
  if (typeof res.flushHeaders === 'function') res.flushHeaders();

  // 3. Envia o conteúdo do PDF diretamente para a resposta HTTP (streaming).
  doc.pipe(res);

  // 4. Se estivermos em ambiente de teste, também salva uma cópia do PDF em disco
  //    para permitir a inspeção manual e a depuração.
  try {
    if (process.env.NODE_ENV === 'test') {
      const companyId = res.req.user.companyId;
      const date = new Date();
      const dateFolder = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;

      // Monta o caminho do diretório na ordem correta: idempresa > data > tipo
      const outDir = path.join(process.cwd(), 'Testes', 'PDFs', companyId.toString(), dateFolder, testSubfolder);

      // Cria a estrutura de pastas completa.
      fs.mkdirSync(outDir, { recursive: true });

      // Define um nome de arquivo único com timestamp para evitar sobreposições.
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const testFilename = `${filename.replace('.pdf', '')}-${timestamp}.pdf`;
      const outPath = path.join(outDir, testFilename);
      doc.pipe(fs.createWriteStream(outPath));
    }
  } catch (e) {
    console.warn('Aviso: não foi possível salvar o PDF no disco durante os testes.', e.message);
  }
}

// --- Funções de Serviço Exportadas ---

/**
 * Gera um PDF de relatório de transações financeiras.
 * @param {object} data - Os dados para o relatório.
 * @param {Array} data.transactions - A lista de transações.
 * @param {object} data.company - Os dados da empresa.
 * @param {object} res - O objeto de resposta do Express.
 */
export function generateFinancialReportPDF(data, res) {
  const { transactions, company } = data;
  const doc = new PDFDocument({ margin: 50, bufferPages: true });

  // Delega a configuração da resposta e o salvamento em teste para a função auxiliar.
  setupPdfResponse(res, doc, 'relatorio-financeiro.pdf', 'transactions');

    addHeader(doc, company, 'Relatório de Transações');

    if (transactions.length === 0) {
      doc.fontSize(12).text('Nenhuma transação encontrada para o período selecionado.');
    } else {
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
        // Lógica de paginação: se a próxima linha não couber, cria uma nova página.
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
 * Gera um PDF com a lista de clientes e fornecedores.
 * @param {object} data - Os dados para o relatório.
 * @param {Array} data.clients - A lista de clientes.
 * @param {object} data.company - Os dados da empresa.
 * @param {object} res - O objeto de resposta do Express.
 */
export function generateClientsReportPDF(data, res) {
  const { clients, company } = data;
    const doc = new PDFDocument({ margin: 50, bufferPages: true });

    // Delega a configuração da resposta e o salvamento em teste para a função auxiliar.
    setupPdfResponse(res, doc, 'relatorio-clientes.pdf', 'clients');

    addHeader(doc, company, 'Relatório de Clientes');

    if (clients.length === 0) {
        doc.fontSize(12).text('Nenhum cliente encontrado.');
    } else {
        let y = doc.y;
        const rowHeight = 20;
        const pageBottom = doc.page.height - 70; // Margem inferior

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
                y = doc.y; // Reseta a posição Y
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
 * Gera uma fatura simples em PDF para uma transação específica.
 * @param {object} data - Os dados para a fatura.
 * @param {object} data.transaction - A transação.
 * @param {object} data.company - Os dados da empresa.
 * @param {object} data.client - Os dados do cliente (opcional).
 * @param {object} res - O objeto de resposta do Express.
 */
export function generateInvoicePDF(data, res) {
  const { transaction, company, client } = data;
    const doc = new PDFDocument({ margin: 50, bufferPages: true });

    // Delega a configuração da resposta e o salvamento em teste para a função auxiliar.
    setupPdfResponse(res, doc, `fatura-${transaction._id}.pdf`, 'invoices');

    addHeader(doc, company, 'Fatura');
    // Usa apenas os 8 primeiros caracteres do ID para um número de fatura mais limpo.
    doc.fontSize(12).text(`Fatura Nº: ${transaction._id.toString().substring(0, 8).toUpperCase()}`);
    doc.text(`Data de Vencimento: ${new Date(transaction.date).toLocaleDateString('pt-BR')}`);
    doc.moveDown(2);

    // Dados do cliente (se existirem)
    if (client) {
        doc.fontSize(12).text('Cliente:');
        doc.text(client.name);
        if (client.document) doc.text(`Documento: ${client.document}`);
    } else {
        doc.fontSize(12).text('Cliente: Não informado');
    }

    doc.moveDown(3);
    doc.fontSize(14).text('Item');
    doc.text(`${transaction.description} - ${transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    doc.moveDown();
    doc.fontSize(16).text(`VALOR TOTAL: ${transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, { align: 'right' });

    addFooter(doc);
    doc.end();
}l
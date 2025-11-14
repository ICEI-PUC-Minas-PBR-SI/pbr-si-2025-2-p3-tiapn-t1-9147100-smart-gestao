// =================================================================================
// ARQUIVO: Testes/4-reports/reports.test.js
//
// DESCRIÇÃO:
//            Este arquivo testa os endpoints de geração de relatórios em PDF.
//            A abordagem aqui é "mockar" (simular) o serviço de geração de PDF
//            para validar se o controller está chamando o serviço com os dados
//            corretos, sem de fato gerar um arquivo PDF durante o teste.
//
// O QUE ELE VALIDA:
//            1. Se o endpoint de relatório de transações busca os dados corretos
//               (transações e empresa) e os passa para a função de geração de PDF.
//            2. Se o endpoint de relatório de clientes faz o mesmo para os clientes.
//            3. Se o endpoint de fatura individual busca os dados corretos e os
//               passa para a função de geração de fatura.
// =================================================================================
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Mocking o módulo de serviço de PDF antes de qualquer importação.
// Isso é crucial para que o Jest possa interceptar as chamadas às funções de geração de PDF.
jest.unstable_mockModule('../../services/pdfService.js', () => ({
  generateFinancialReportPDF: jest.fn(),
  generateClientsReportPDF: jest.fn(),
  generateInvoicePDF: jest.fn(),
}));

const SETUP_FILE = path.join('Testes', 'test-setup.json');

describe('8. Módulo de Relatórios', () => {
  // Variáveis que serão usadas em todos os testes deste bloco.
  let API_URL;
  let companyA;
  let generateFinancialReportPDF, generateClientsReportPDF, generateInvoicePDF;

  // O bloco `beforeAll` é executado uma única vez antes de todos os testes deste arquivo.
  // É o local ideal para configurar o ambiente de teste.
  beforeAll(async () => {
    // 1. Carrega os dados de setup, como a URL da API e o token de autenticação.
    const setupData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
    companyA = setupData.companyA;
    API_URL = setupData.apiUrl;

    // 2. Importa dinamicamente as funções MOCKADAS do serviço de PDF.
    //    Como fizemos o `jest.unstable_mockModule` no topo do arquivo, estas não são
    //    as funções reais, mas sim "espiões" do Jest que podemos monitorar.
    const pdfService = await import('../../services/pdfService.js');
    generateFinancialReportPDF = pdfService.generateFinancialReportPDF;
    generateClientsReportPDF = pdfService.generateClientsReportPDF;
    generateInvoicePDF = pdfService.generateInvoicePDF;
  });

  // O bloco `afterEach` é executado após cada teste (`test`).
  // Limpar os mocks garante que as chamadas de um teste não interfiram no próximo,
  // mantendo os testes isolados e independentes.
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('deve chamar o serviço de PDF com os dados corretos para o RELATÓRIO DE TRANSAÇÕES', async () => {
    // 1. Ação: Simula o cliente (frontend) chamando o endpoint para gerar o relatório.
    await axios.get(`${API_URL}/reports/export/transactions-pdf`, {
      headers: { Authorization: `Bearer ${companyA.token}` }
    });

    // 2. Verificação Principal: Garante que a função `generateFinancialReportPDF` do nosso serviço foi chamada.
    //    Isso prova que o controller executou a lógica correta.
    expect(generateFinancialReportPDF).toHaveBeenCalled();

    // 3. Validação dos Dados: Captura os argumentos com os quais a função foi chamada para inspecioná-los.
    const capturedData = generateFinancialReportPDF.mock.calls[0][0];

    // Valida se o controller buscou corretamente os dados da empresa e os passou para o serviço de PDF.
    expect(capturedData.company.name).toBe(companyA.name);
    // Valida que um array de transações foi passado, mesmo que esteja vazio.
    expect(capturedData.transactions).toBeInstanceOf(Array);
  });

  test('deve chamar o serviço de PDF com os dados corretos para o RELATÓRIO DE CLIENTES', async () => {
    // 1. Ação: Chama o endpoint de relatório de clientes.
    await axios.get(`${API_URL}/reports/export/clients-pdf`, {
      headers: { Authorization: `Bearer ${companyA.token}` }
    });

    // 2. Verificação Principal: Garante que a função correta do serviço de PDF foi acionada.
    expect(generateClientsReportPDF).toHaveBeenCalled();

    // 3. Validação dos Dados: Verifica se os dados passados para a geração do PDF estão corretos.
    const capturedData = generateClientsReportPDF.mock.calls[0][0];
    expect(capturedData.company.name).toBe(companyA.name);
    expect(capturedData.clients).toBeInstanceOf(Array);
  });

  test('deve chamar o serviço de PDF com os dados corretos para a FATURA', async () => {
    // 1. Ação: Chama o endpoint de exportação da fatura, usando o ID de uma transação de teste
    //    que foi criada no ambiente de setup (`mongo-test-environment.js`).
    await axios.get(`${API_URL}/reports/export/invoice/${companyA.testTransaction._id}`, {
      headers: { Authorization: `Bearer ${companyA.token}` }
    });

    // 2. Verificação Principal: Garante que a função de geração de fatura foi chamada.
    expect(generateInvoicePDF).toHaveBeenCalled();

    // 3. Validação dos Dados: Verifica se o controller passou os dados corretos da empresa e da transação específica.
    const capturedData = generateInvoicePDF.mock.calls[0][0];
    expect(capturedData.company.name).toBe(companyA.name);
    expect(capturedData.transaction.description).toBe(companyA.testTransaction.description);
  });
});
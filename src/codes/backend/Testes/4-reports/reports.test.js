import axios from 'axios';
import fs from 'fs';
import path from 'path';
// Solução para o conflito de módulos:
// A biblioteca `pdf-parse` é um módulo CommonJS, e nosso projeto usa ES Modules.
// A forma padrão de `import` não funciona corretamente no ambiente de teste do Jest.
// `createRequire` nos permite usar `require` de forma segura dentro de um ES Module.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

describe('8. Módulo de Relatórios', () => {
  let API_URL;
  let companyA;

  beforeAll(async () => {
    const SETUP_FILE = path.join(process.cwd(), 'Testes', 'test-setup.json');
    const setupData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
    companyA = setupData.companyA;
    API_URL = setupData.apiUrl;
  });

  test('deve gerar um PDF válido para o RELATÓRIO DE TRANSAÇÕES', async () => {
    const response = await axios.get(`${API_URL}/reports/export/transactions-pdf`, {
      headers: { Authorization: `Bearer ${companyA.token}` },
      responseType: 'arraybuffer' // Importante para lidar com dados binários
    });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
  });

  test('deve gerar um PDF válido para o RELATÓRIO DE CLIENTES', async () => {
    const response = await axios.get(`${API_URL}/reports/export/clients-pdf`, {
      headers: { Authorization: `Bearer ${companyA.token}` },
      responseType: 'arraybuffer'
    });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
  });

  test('deve gerar um PDF válido para a FATURA', async () => {
    // Garante que temos um ID de transação válido dos dados de setup
    expect(companyA.testTransaction?._id).toBeDefined();
    const response = await axios.get(`${API_URL}/reports/export/invoice/${companyA.testTransaction._id}`, {
      headers: { Authorization: `Bearer ${companyA.token}` },
      responseType: 'arraybuffer'
    });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
  });
});
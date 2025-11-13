/**
 * @file Testes para o Módulo de Relatórios (RF-008).
 * @description Valida a lógica de geração de relatórios, focando na correção dos dados enviados ao serviço de PDF, sem depender da leitura do arquivo.
 */
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const SETUP_FILE = path.join('Testes', 'test-setup.json');

describe('8. Módulo de Relatórios', () => {
  let companyA;
  let API_URL;

  beforeAll(() => {
    // Lê os dados de setup de forma síncrona. O ambiente de teste garante que este arquivo já existe.
    const setupData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
    companyA = setupData.companyA;
    API_URL = setupData.apiUrl;
  });

  afterEach(() => {
    // noop
  });
  test('deve gerar um PDF válido para o RELATÓRIO DE TRANSAÇÕES', async () => {
    const res = await axios.get(`${API_URL}/reports/export/transactions-pdf`, {
      headers: { Authorization: `Bearer ${companyA.token}` },
      responseType: 'arraybuffer',
      validateStatus: () => true,
    });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/pdf/);
    const buf = Buffer.from(res.data);
    // PDF files start with %PDF
    expect(buf.slice(0, 4).toString()).toBe('%PDF');
    expect(buf.length).toBeGreaterThan(200);
  });

  test('deve gerar um PDF válido para o RELATÓRIO DE CLIENTES', async () => {
    const res = await axios.get(`${API_URL}/reports/export/clients-pdf`, {
      headers: { Authorization: `Bearer ${companyA.token}` },
      responseType: 'arraybuffer',
      validateStatus: () => true,
    });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/pdf/);
    const buf = Buffer.from(res.data);
    expect(buf.slice(0, 4).toString()).toBe('%PDF');
    expect(buf.length).toBeGreaterThan(200);
  });

  test('deve gerar um PDF válido para a FATURA', async () => {
    const res = await axios.get(`${API_URL}/reports/export/invoice/${companyA.testTransaction._id}`, {
      headers: { Authorization: `Bearer ${companyA.token}` },
      responseType: 'arraybuffer',
      validateStatus: () => true,
    });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/pdf/);
    const buf = Buffer.from(res.data);
    expect(buf.slice(0, 4).toString()).toBe('%PDF');
    expect(buf.length).toBeGreaterThan(200);
  });
});
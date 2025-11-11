/**
 * @file Testes para o Módulo de Relatórios (RF-008).
 * @description Este arquivo contém testes automatizados seguindo a abordagem TDD,
 *              especificamente para a funcionalidade de exportação de relatórios. O teste
 *              deve falhar (com 404) até que o endpoint seja implementado.
 */
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const SETUP_FILE = path.join('Testes', 'test-setup.json');

describe('8. Módulo de Relatórios (TDD)', () => {
  let companyA;
  let API_URL;

  beforeAll(() => {
    const setupData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
    companyA = setupData.companyA;
    API_URL = setupData.apiUrl;
  });

  test('deve EXPORTAR um relatório de transações em formato PDF', async () => {
    const response = await axios.get(`${API_URL}/reports/export/pdf`, {
      headers: { Authorization: `Bearer ${companyA.token}` },
      responseType: 'arraybuffer', // Importante para receber arquivos binários
    });

    expect(response.status).toBe(200);
    // Verifica se o cabeçalho da resposta indica que o conteúdo é um PDF
    expect(response.headers['content-type']).toBe('application/pdf');
    const pdfBuffer = Buffer.from(response.data);
    expect(pdfBuffer.length).toBeGreaterThan(0);

    // Salva o PDF gerado para verificação manual
    const pdfDir = path.join(__dirname, 'PDFs');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    const pdfPath = path.join(pdfDir, `teste-relatorio-${Date.now()}.pdf`);
    fs.writeFileSync(pdfPath, pdfBuffer);

    console.log(`➡️  [PASS] Resposta da API: ${response.status}, PDF recebido com ${pdfBuffer.length} bytes e salvo em: ${pdfPath}`);
  });
});
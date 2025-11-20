/**
 * =================================================================================
 * ARQUIVO: Testes/2-features/uploads.test.js
 *
 * DESCRIÇÃO:
 *            Este arquivo testa a funcionalidade de upload de anexos para transações.
 *
 * =================================================================================
 */
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

// CORREÇÃO: __dirname não existe em ES Modules. Esta é a forma moderna de obter o caminho do diretório.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SETUP_FILE = path.join('Testes', 'test-setup.json');

let apiUrl;
let companyA;

describe('Feature: Uploads', () => {
    beforeAll(() => {
        const setupData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
        apiUrl = setupData.apiUrl;
        companyA = setupData.companyA;
    });

/**
 * Helper function to ensure a test file exists before trying to use it.
 * This prevents ENOENT errors and makes tests more robust.
 * @param {string} fileName - The name of the file to create (e.g., 'TestImage.png').
 * @returns {string} The full path to the file.
 */
const ensureTestFileExists = (fileName) => {
    const dir = path.join(__dirname, '../TesteUpload');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, fileName);
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, `fake data for ${fileName}`);
    return filePath;
};
    describe('Upload de PDF', () => {
        let transactionId;
        let attachmentPath;

        beforeAll(async () => {
            const response = await axios.post(
                `${apiUrl}/transactions`,
                {
                    description: 'Transação para Teste de Upload de PDF',
                    userId: companyA.userId,
                    amount: 500,
                    type: 'revenue',
                    date: new Date(),
                    status: 'completed',
                },
                { headers: { Authorization: `Bearer ${companyA.token}` } }
            );
            transactionId = response.data.data._id;
        });

        afterAll(async () => {
            if (transactionId) {
                await axios.delete(`${apiUrl}/transactions/${transactionId}`, {
                    headers: { Authorization: `Bearer ${companyA.token}` }
                }).catch(() => {});
            }
            if (attachmentPath && fs.existsSync(attachmentPath)) {
                fs.unlinkSync(attachmentPath);
            }
        });

        it('Deve permitir o upload de um anexo (PDF) para uma transação', async () => {
            const filePath = ensureTestFileExists('TesteUpload.pdf');
            const form = new FormData();
            form.append('attachment', fs.createReadStream(filePath));

            const response = await axios.post(
                `${apiUrl}/transactions/${transactionId}/upload`,
                form,
                { headers: { ...form.getHeaders(), Authorization: `Bearer ${companyA.token}` } }
            );

            expect(response.status).toBe(200);
            expect(response.data.message).toBe('Anexo enviado com sucesso.');
            expect(response.data.data.attachment).toContain(companyA._id);
            expect(response.data.data.attachment).toContain('/pdf/'); // Valida a nova subpasta
            expect(response.data.data.attachment).toContain('.pdf');

            attachmentPath = path.join(__dirname, '../../', response.data.data.attachment);
            expect(fs.existsSync(attachmentPath)).toBe(true);
        });

        it('Deve permitir a exclusão de um anexo (PDF) de uma transação', async () => {
            expect(attachmentPath).toBeDefined();

            const response = await axios.delete(
                `${apiUrl}/transactions/${transactionId}/upload`,
                { headers: { Authorization: `Bearer ${companyA.token}` } }
            );

            expect(response.status).toBe(200);
            expect(response.data.message).toBe('Anexo removido com sucesso.');
            expect(response.data.data.attachment).toBeNull();
            expect(fs.existsSync(attachmentPath)).toBe(false);

            attachmentPath = null;
        });
    });

    // Refatorado para testar múltiplos tipos de imagem com a mesma lógica.
    // Para adicionar um novo tipo (ex: 'gif'), basta adicioná-lo ao array.
    describe.each([
        ['PNG', 'png'],
        ['JPG', 'jpg'],
        ['JPEG', 'jpeg']
    ])('Upload de Imagem (%s)', (name, extension) => {
        let transactionId;
        let attachmentPath;

        beforeAll(async () => {
            const response = await axios.post(
                `${apiUrl}/transactions`,
                {
                    description: `Transação para Teste de Upload de ${name}`,
                    userId: companyA.userId,
                    amount: 250,
                    type: 'expense',
                    date: new Date(),
                },
                { headers: { Authorization: `Bearer ${companyA.token}` } }
            );
            transactionId = response.data.data._id;
        });

        afterAll(async () => {
            if (transactionId) {
                await axios.delete(`${apiUrl}/transactions/${transactionId}`, {
                    headers: { Authorization: `Bearer ${companyA.token}` }
                }).catch(() => {});
            }
            if (attachmentPath && fs.existsSync(attachmentPath)) {
                fs.unlinkSync(attachmentPath);
            }
        });

        it(`Deve permitir o upload de um anexo de imagem (.${extension}) para uma transação`, async () => {
            const filePath = ensureTestFileExists(`TestImage.${extension}`);

            const form = new FormData();
            form.append('attachment', fs.createReadStream(filePath));

            const response = await axios.post(
                `${apiUrl}/transactions/${transactionId}/upload`,
                form,
                { headers: { ...form.getHeaders(), Authorization: `Bearer ${companyA.token}` } }
            );

            expect(response.status).toBe(200);
            expect(response.data.data.attachment).toContain(companyA._id);
            expect(response.data.data.attachment).toContain('/img/'); // Valida a nova subpasta
            expect(response.data.data.attachment).toMatch(new RegExp(`\\.${extension}$`));

            attachmentPath = path.join(__dirname, '../../', response.data.data.attachment);
            expect(fs.existsSync(attachmentPath)).toBe(true);
        });

        it(`Deve permitir a exclusão de um anexo de imagem (.${extension})`, async () => {
            expect(attachmentPath).toBeDefined();
            const response = await axios.delete(
                `${apiUrl}/transactions/${transactionId}/upload`,
                { headers: { Authorization: `Bearer ${companyA.token}` } }
            );
            expect(response.status).toBe(200);
            expect(response.data.data.attachment).toBeNull();
            expect(fs.existsSync(attachmentPath)).toBe(false);
            attachmentPath = null;
        });
    });

    // Testes de cenários de erro e outros permanecem no nível superior
    describe('Cenários de Erro e Estruturais', () => {
        it('Deve retornar 404 ao tentar fazer upload para uma transação inexistente', async () => {
            const invalidId = '60d5f1f77c3d4a001f5e8e1z'; // ID inválido
            const filePath = ensureTestFileExists('TesteUpload.pdf');
            const form = new FormData();
            form.append('attachment', fs.createReadStream(filePath));

            await expect(
                axios.post(
                    `${apiUrl}/transactions/${invalidId}/upload`,
                    form,
                    { headers: { ...form.getHeaders(), Authorization: `Bearer ${companyA.token}` } }
                )
            ).rejects.toThrow('Request failed with status code 404');
        });

    });
});
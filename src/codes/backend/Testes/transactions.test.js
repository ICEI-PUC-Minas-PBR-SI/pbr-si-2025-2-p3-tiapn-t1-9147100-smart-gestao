import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000/api';
const SETUP_FILE = path.join('Testes', 'test-setup.json');

describe('4. Módulo de Transações (CRUD)', () => {
    let userToken;
    let createdTransactionId;

    // Antes de todos os testes, lê os dados da empresa de teste criada pelo setup global.
    beforeAll(async () => {
        const testData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
        // Este teste usará apenas a "Empresa A" para suas operações.
        userToken = testData.companyA.token;
        // console.log(`Debug transactions.test.js beforeAll: userToken=${userToken}, companyA.userId=${testData.companyA.userId}, companyA.companyId=${testData.companyA.companyId}`); // Removido log de depuração
    });

    it('RF-002: deve CRIAR uma nova transação com sucesso', async () => {
        const transactionData = {
            description: 'Venda de serviço de consultoria',
            amount: 1500.50,
            type: 'revenue',
            date: new Date().toISOString(),
            category: 'Serviços',
            status: 'completed',
            paymentMethod: 'pix'
        };

        const response = await axios.post(`${API_URL}/transactions`, transactionData, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('_id');
        expect(response.data.description).toBe(transactionData.description);
        expect(response.data.amount).toBe(transactionData.amount);

        // Guarda o ID da transação criada para usar nos testes seguintes
        createdTransactionId = response.data._id;
    });

    it('RF-003: deve LISTAR as transações do usuário logado', async () => {
        // Este teste depende que o anterior tenha criado uma transação
        expect(createdTransactionId).toBeDefined();

        const response = await axios.get(`${API_URL}/transactions`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        // Verifica se a lista contém ao menos uma transação
        expect(response.data.length).toBeGreaterThan(0);
        // Verifica se a transação que acabamos de criar está na lista
        const found = response.data.some(tx => tx._id === createdTransactionId);
        expect(found).toBe(true);
    });

    it('RF-004: deve OBTER uma transação específica pelo ID', async () => {
        expect(createdTransactionId).toBeDefined();

        const response = await axios.get(`${API_URL}/transactions/${createdTransactionId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(200);
        expect(response.data._id).toBe(createdTransactionId);
        expect(response.data.description).toBe('Venda de serviço de consultoria');
    });

    it('RF-005: deve ATUALIZAR uma transação existente', async () => {
        expect(createdTransactionId).toBeDefined();

        const updatedData = {
            description: 'Venda de consultoria (Valor Atualizado)',
            amount: 1800.00,
            status: 'completed'
        };

        const response = await axios.put(`${API_URL}/transactions/${createdTransactionId}`, updatedData, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(200);
        expect(response.data.description).toBe(updatedData.description);
        expect(response.data.amount).toBe(updatedData.amount);
    });

    it('RF-006: deve EXCLUIR uma transação existente', async () => {
        expect(createdTransactionId).toBeDefined();

        const response = await axios.delete(`${API_URL}/transactions/${createdTransactionId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Transaction removida com sucesso');

        // Tenta buscar a transação excluída e espera um erro 404
        await expect(
            axios.get(`${API_URL}/transactions/${createdTransactionId}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            })
        ).rejects.toThrow(expect.objectContaining({
            response: expect.objectContaining({
                status: 404
            })
        }));
    });
});
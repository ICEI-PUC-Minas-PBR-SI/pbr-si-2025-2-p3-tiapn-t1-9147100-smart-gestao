// =================================================================================
// ARQUIVO: Testes/transactions.test.js
// DESCRIÇÃO: Suíte de testes para o Módulo de Transações Financeiras (CRUD).
//            Valida o ciclo de vida completo de uma transação: criação, listagem,
//            obtenção por ID, atualização e exclusão.
// =================================================================================

import axios from 'axios';
import fs from 'fs';
import path from 'path';

const SETUP_FILE = path.join('Testes', 'test-setup.json');

/**
 * @describe Bloco de testes para o Módulo de Transações (CRUD).
 * @see roteiro de testes automatizados.md
 */
describe('4. Módulo de Transações (CRUD)', () => {
    let userToken;
    let API_URL;
    let createdTransactionId;

    beforeAll(async () => {
        // MOTIVO DA MUDANÇA: Todos os testes agora leem os dados de autenticação
        // do arquivo `test-setup.json`, que é gerado pelo `test-setup.js`
        // com dados criados diretamente no banco de dados em memória.
        const setupData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
        userToken = setupData.companyA.token;
        API_URL = setupData.apiUrl;
    });

    /**
     * @test Cenário de sucesso para a criação de uma nova transação.
     * @description Verifica se é possível criar uma transação financeira com dados válidos.
     */
    it('deve CRIAR uma nova transação com sucesso', async () => {
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

    /**
     * @test Cenário de falha ao tentar criar uma transação com dados inválidos.
     * @description Garante que a API retorne um erro de validação (Status 400 ou 500)
     *              se campos obrigatórios como 'amount' estiverem faltando.
     */
    it('deve falhar ao tentar criar uma transação com dados inválidos', async () => {
        const invalidTransactionData = {
            description: 'Transação Inválida',
            type: 'expense',
            // 'amount' está faltando
        };

        try {
            await axios.post(`${API_URL}/transactions`, invalidTransactionData, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            fail('A criação de transação com dados inválidos deveria ter falhado.');
        } catch (error) {
            expect(error.response.status).toBe(500); // Mongoose validation error results in 500 in this setup
        }
    });

    it('deve LISTAR as transações do usuário logado', async () => {
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

    it('deve OBTER uma transação específica pelo ID', async () => {
        expect(createdTransactionId).toBeDefined();

        const response = await axios.get(`${API_URL}/transactions/${createdTransactionId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(200);
        expect(response.data._id).toBe(createdTransactionId);
        expect(response.data.description).toBe('Venda de serviço de consultoria');
    });

    it('deve ATUALIZAR uma transação existente', async () => {
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

    it('deve EXCLUIR uma transação existente', async () => {
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
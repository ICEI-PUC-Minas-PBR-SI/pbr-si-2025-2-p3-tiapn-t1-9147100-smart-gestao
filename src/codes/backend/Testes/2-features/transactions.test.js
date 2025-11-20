// =================================================================================
// ARQUIVO: Testes/2-features/transactions.test.js
//
// DESCRIÇÃO: Suíte de testes para o Módulo de Transações Financeiras (CRUD).
//            Valida o ciclo de vida completo de uma transação: criação, listagem,
//            obtenção por ID, atualização e exclusão.
// =================================================================================
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const SETUP_FILE = path.join('Testes', 'test-setup.json'); // Caminho relativo para o arquivo de setup

describe('4. Módulo de Transações (CRUD)', () => {
    let userToken;
    let API_URL;
    let userId;
    let createdTransactionId;

    beforeAll(async () => {
        // Carrega os dados de setup, como a URL da API e o token de autenticação da Empresa A.
        // Lê os dados de setup de forma síncrona. O ambiente de teste garante que este arquivo já existe.
        const setupData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
        userId = setupData.companyA.userId;
        userToken = setupData.companyA.token;
        API_URL = setupData.apiUrl;
    });

    // Limpa a transação criada ao final de todos os testes deste arquivo
    // para garantir que não haja "lixo" de teste no banco de dados.
    afterAll(async () => {
        if (createdTransactionId) {
            await axios.delete(`${API_URL}/transactions/${createdTransactionId}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            }).catch(() => {}); // Ignora erros se já foi deletada
        }
    });

    /**
     * @test Cenário de sucesso para a criação de uma nova transação.
     * @description Verifica se é possível criar uma transação financeira com dados válidos.
     */
    test('deve CRIAR uma nova transação com sucesso', async () => { // MODIFICADO: Usa dados mais realistas e aleatórios
        const transactionData = { // MODIFICADO: Usa dados mais realistas e aleatórios
            description: `Venda de Produto Teste #${Date.now()}`,
            amount: parseFloat((Math.random() * 1000 + 1).toFixed(2)), // Valor aleatório entre 1 e 1001
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
        expect(response.data.data).toHaveProperty('_id');
        expect(response.data.data.description).toBe(transactionData.description);
        expect(response.data.data.amount).toBe(transactionData.amount);

        // Guarda o ID da transação criada para usar nos testes seguintes
        createdTransactionId = response.data.data._id;
    });

    /**
     * @test Cenário de falha ao tentar criar uma transação com dados inválidos.
     * @description Garante que a API retorne um erro de validação (Status 400 ou 500)
     *              se campos obrigatórios como 'amount' estiverem faltando.
     */
    test('deve falhar ao tentar criar uma transação com dados inválidos', async () => {
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
            expect(error.response.status).toBe(400);
        }
    });

    test('deve LISTAR as transações do usuário logado', async () => {
        // Este teste depende que o anterior tenha criado uma transação
        expect(createdTransactionId).toBeDefined();

        const response = await axios.get(`${API_URL}/transactions`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
        // Verifica se a lista contém ao menos uma transação
        expect(response.data.data.length).toBeGreaterThan(0);
        // Verifica se a transação que acabamos de criar está na lista
        const found = response.data.data.some(tx => tx._id === createdTransactionId);
        expect(found).toBe(true);
    });

    test('deve OBTER uma transação específica pelo ID', async () => {
        expect(createdTransactionId).toBeDefined();

        const response = await axios.get(`${API_URL}/transactions/${createdTransactionId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(200);
        expect(response.data.data._id).toBe(createdTransactionId);
        expect(response.data.data.description).toContain('Venda de Produto Teste');
    });

    test('deve ATUALIZAR uma transação existente', async () => {
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
        expect(response.data.data.description).toBe(updatedData.description);
        expect(response.data.data.amount).toBe(updatedData.amount);
    });

    test('deve EXCLUIR uma transação existente', async () => {
        expect(createdTransactionId).toBeDefined();

        const response = await axios.delete(`${API_URL}/transactions/${createdTransactionId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });

        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Transação removida com sucesso');

        const deletedId = createdTransactionId;
        createdTransactionId = null;

        // Tenta buscar a transação excluída e espera um erro 404
        await expect(
            axios.get(`${API_URL}/transactions/${deletedId}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            })
        ).rejects.toThrow('Request failed with status code 404');
    });
});
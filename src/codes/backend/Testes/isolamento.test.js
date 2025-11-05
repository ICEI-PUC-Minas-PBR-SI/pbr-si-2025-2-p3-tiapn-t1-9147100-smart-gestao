/**
 * @file Testes de isolamento de dados da API Smart Gestão
 * @description Este arquivo automatiza os testes para garantir que os dados de diferentes empresas
 * permaneçam isolados e inacessíveis umas às outras.
 *
 * Para rodar: `npm test` (após configurar o Jest)
 */
import axios from 'axios';

// URL base da sua API. Altere se for diferente.
const API_URL = 'http://localhost:5000/api';

// --- Dados de Teste (Reutilizando de api.test.js) ---
const empresaA = {
    email: `empresaA_${Date.now()}@test.com`,
    password: 'password123',
    companyName: `Empresa A Teste ${Date.now()}`,
    cnpj: `${Date.now()}`.slice(0, 14).padStart(14, '0'),
    name: 'Usuário A'
};

const empresaB = {
    email: `empresaB_${Date.now()}@test.com`,
    password: 'password123',
    companyName: `Empresa B Teste ${Date.now()}`,
    cnpj: `${Date.now()}`.slice(1, 15).padStart(14, '0'),
    name: 'Usuário B'
};

// Variáveis para armazenar os tokens de autenticação
let tokenEmpresaA;
let tokenEmpresaB;

/**
 * Bloco de testes para o Módulo de Isolamento de Dados.
 */
describe('2. Teste de Isolamento de Dados (Transações)', () => {


     beforeAll(async () => {
        // --- 1. Cadastrar e Logar Empresa A ---
        console.log('\n--- Configurando Empresa A ---');
        await axios.post(`${API_URL}/auth/register`, {
            name: empresaA.name,
            email: empresaA.email,
            password: empresaA.password,
            companyName: empresaA.companyName,
            cnpj: empresaA.cnpj
        });
        const loginA = await axios.post(`${API_URL}/auth/login`, {
            email: empresaA.email,
            password: empresaA.password
        });
        tokenEmpresaA = loginA.data.token;
        console.log('Empresa A configurada e logada.');

         // --- 2. Cadastrar e Logar Empresa B ---
        console.log('\n--- Configurando Empresa B ---');
        const registerB = await axios.post(`${API_URL}/auth/register`, {
            name: empresaB.name,
            email: empresaB.email,
            password: empresaB.password,
            companyName: empresaB.companyName,
            cnpj: empresaB.cnpj
        });

        console.log('Empresa B - Cadastro (Status):', registerB.status);
        console.log('Empresa B - Cadastro (Corpo):', JSON.stringify(registerB.data, null, 2));
        expect(registerB.status).toBe(201);

        const loginB = await axios.post(`${API_URL}/auth/login`, {
            email: empresaB.email,
            password: empresaB.password
        });

        // Armazena o token da Empresa B
        tokenEmpresaB = loginB.data.token;
        console.log('Empresa B configurada e logada.');
    }, 30000); // Aumenta o timeout para o setup, pois envolve várias requisições

    // Este teste agora é mais robusto e cobre múltiplos cenários de isolamento
    it('deve impedir o acesso, modificação e exclusão de transações entre empresas', async () => {
        // --- 1. Criar uma transação com tokenEmpresaA ---
        console.log('\n--- Criando transação para Empresa A ---');

        const createTransaction = await axios.post(`${API_URL}/transactions`, {
            description: 'Transação de Teste Empresa A',
            amount: 100,
            type: 'expense', // Campo obrigatório, usando o nome padronizado
            date: new Date() // Campo obrigatório
        }, {
            headers: {
                Authorization: `Bearer ${tokenEmpresaA}`
            }
        });

        console.log('Empresa A - Criar Transação (Status):', createTransaction.status);
        console.log('Empresa A - Criar Transação (Corpo):', JSON.stringify(createTransaction.data, null, 2));
        expect(createTransaction.status).toBe(201); // ou o status de sucesso que sua API retorna

        const transactionIdEmpresaA = createTransaction.data._id; // Assumindo que sua API retorna o ID da transação criada
        console.log('Empresa A - ID da Transação Criada:', transactionIdEmpresaA);

        // --- 2. Tentar buscar essa transação com tokenEmpresaB ---
        console.log('\n--- Tentando acessar transação da Empresa A com token da Empresa B ---');
        console.log(`Enviando: GET para ${API_URL}/transactions/${transactionIdEmpresaA} com token da Empresa B`);
        try {
            await axios.get(`${API_URL}/transactions/${transactionIdEmpresaA}`, {
                headers: { Authorization: `Bearer ${tokenEmpresaB}` }
            });
            // Se chegou aqui, o teste falhou, pois não deveria ter conseguido acessar
            throw new Error('Teste falhou: Empresa B conseguiu acessar transação da Empresa A');
        } catch (error) {
            console.log('Empresa B - Acessar Transação (Status):', error.response ? error.response.status : 'Sem resposta');
            console.log('Empresa B - Acessar Transação (Corpo):', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);

            // --- 3. Assertar que a requisição falhou com 403/404 ---
            // A melhor prática é retornar 404 para não vazar a informação de que o recurso existe.
            // Mas 403 (Forbidden) ou 401 (Unauthorized) também são respostas que indicam falha na autorização.
            expect(error.response.status).not.toBe(200); // Garante que não foi sucesso (200 OK)
            expect([401, 403, 404]).toContain(error.response.status);
        }

        // --- 4. Tentar modificar essa transação com tokenEmpresaB ---
        console.log('\n--- Tentando modificar transação da Empresa A com token da Empresa B ---');
        const updateData = { description: 'Tentativa de Modificação pela Empresa B', amount: 999 };
        console.log(`Enviando: PUT para ${API_URL}/transactions/${transactionIdEmpresaA} com token da Empresa B`);
        console.log('Dados da atualização:', JSON.stringify(updateData, null, 2));

        try {
            await axios.put(`${API_URL}/transactions/${transactionIdEmpresaA}`, updateData, {
                headers: { Authorization: `Bearer ${tokenEmpresaB}` }
            });
            throw new Error('Teste falhou: Empresa B conseguiu modificar transação da Empresa A');
        } catch (error) {
            console.log('Empresa B - Modificar Transação (Status):', error.response ? error.response.status : 'Sem resposta');
            console.log('Empresa B - Modificar Transação (Corpo):', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
            expect(error.response.status).not.toBe(200); // Garante que não foi sucesso (200 OK)
            expect([401, 403, 404]).toContain(error.response.status);
        }

        // --- 5. Tentar excluir essa transação com tokenEmpresaB ---
        console.log('\n--- Tentando excluir transação da Empresa A com token da Empresa B ---');
        console.log(`Enviando: DELETE para ${API_URL}/transactions/${transactionIdEmpresaA} com token da Empresa B`);

        try {
            await axios.delete(`${API_URL}/transactions/${transactionIdEmpresaA}`, {
                headers: { Authorization: `Bearer ${tokenEmpresaB}` }
            });
            throw new Error('Teste falhou: Empresa B conseguiu excluir transação da Empresa A');
        } catch (error) {
            console.log('Empresa B - Excluir Transação (Status):', error.response ? error.response.status : 'Sem resposta');
            console.log('Empresa B - Excluir Transação (Corpo):', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
            expect(error.response.status).not.toBe(200); // Garante que não foi sucesso (200 OK)
            expect([401, 403, 404]).toContain(error.response.status);
        }
    });

    it('deve impedir que a Empresa B liste todas as transações da Empresa A', async () => {
        // Este teste assume que o endpoint GET /transactions retorna apenas as transações da empresa logada.
        console.log('\n--- Tentando listar transações com token da Empresa B ---');
        console.log(`Enviando: GET para ${API_URL}/transactions com token da Empresa B`);

        // A requisição para listar transações da Empresa B precisa do token da Empresa B
        // para que o backend possa filtrar corretamente.
        const responseB = await axios.get(`${API_URL}/transactions`, { 
            headers: { Authorization: `Bearer ${tokenEmpresaB}` }
        });

        console.log('Empresa B - Listar Transações (Status):', responseB.status);
        console.log('Empresa B - Listar Transações (Corpo):', JSON.stringify(responseB.data, null, 2));

        // A resposta deve ser 200 (OK), mas a lista de transações deve estar vazia
        // ou não conter a transação da Empresa A.
        expect(responseB.status).toBe(200);

        // Verifica se a transação da Empresa A NÃO está na lista retornada para a Empresa B
        const transacaoEncontrada = Array.isArray(responseB.data) ? responseB.data.find(t => t._id === transactionIdEmpresaA) : undefined;
        expect(transacaoEncontrada).toBeUndefined();
    });

});
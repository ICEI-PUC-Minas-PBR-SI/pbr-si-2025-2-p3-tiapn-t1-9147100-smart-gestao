/**
 * @file Testes de integração da API Smart Gestão
 * @description Este arquivo automatiza o roteiro de testes definido em `Testes/testes.md`,
 * focando na validação da API (backend).
 *
 * Para rodar: `npm test` (após configurar o Jest)
 */

import axios from 'axios';

// URL base da sua API. Altere se for diferente.
const API_URL = 'http://localhost:5000/api';

// --- Dados de Teste ---
// Usaremos dados dinâmicos para evitar conflitos entre execuções de teste.
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

/**
 * Bloco de testes para o Módulo de Autenticação.
 * Corresponde à seção "1. Cadastro e Login" do roteiro de testes.
 */
describe('1. Módulo de Autenticação', () => {

    it('RF-001: deve cadastrar um novo usuário e empresa (Empresa A)', async () => {
        const requestBody = {
            name: empresaA.name,
            email: empresaA.email,
            password: empresaA.password,
            companyName: empresaA.companyName,
            cnpj: empresaA.cnpj
        };

        console.log('\n--- Teste: Cadastrar novo usuário ---');
        console.log('Enviando:', JSON.stringify(requestBody, null, 2));

        try {
            const response = await axios.post(`${API_URL}/auth/register`, requestBody);

            console.log('Recebido (Status):', response.status);
            console.log('Recebido (Corpo):', JSON.stringify(response.data, null, 2));

            // Espera-se que o cadastro retorne status 201 (Created)
            expect(response.status).toBe(201);
            expect(response.data.message).toBe('Usuário cadastrado com sucesso!');
        } catch (error) {
            console.log('Recebido (Status):', error.response ? error.response.status : 'Erro sem resposta');
            console.log('Recebido (Corpo):', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
            // Força o teste a falhar se um erro for capturado, já que este teste espera sucesso.
            throw error;
        }
    });

    it('deve barrar o cadastro de um usuário com e-mail já existente', async () => {
        const requestBody = {
            name: empresaA.name,
            email: empresaA.email, // E-mail repetido
            password: empresaA.password,
            companyName: 'Nome Duplicado',
            cnpj: '11223344556677'
        };

        console.log('\n--- Teste: Barrar e-mail duplicado ---');
        console.log('Enviando:', JSON.stringify(requestBody, null, 2));

        // Tenta cadastrar novamente com o mesmo e-mail da Empresa A
        try {
            await axios.post(`${API_URL}/auth/register`, requestBody);
        } catch (error) {
            console.log('Recebido (Status):', error.response.status);
            console.log('Recebido (Corpo):', JSON.stringify(error.response.data, null, 2));

            // Espera-se um erro 409 (Conflict)
            expect(error.response.status).toBe(409);
            expect(error.response.data.message).toContain('E-mail já cadastrado');
        }
    });

    it('deve falhar o login com senha incorreta', async () => {
        const requestBody = {
            email: empresaA.email,
            password: 'senha-errada'
        };

        console.log('\n--- Teste: Login com senha incorreta ---');
        console.log('Enviando:', JSON.stringify(requestBody, null, 2));

        try {
            await axios.post(`${API_URL}/auth/login`, requestBody);
        } catch (error) {
            console.log('Recebido (Status):', error.response.status);
            console.log('Recebido (Corpo):', JSON.stringify(error.response.data, null, 2));

            // Espera-se um erro 401 (Unauthorized)
            expect(error.response.status).toBe(401);
            expect(error.response.data.message).toBe('Credenciais inválidas.');
        }
    });

    it('deve realizar o login com sucesso para a Empresa A', async () => {
        const requestBody = {
            email: empresaA.email,
            password: empresaA.password
        };

        console.log('\n--- Teste: Login com sucesso ---');
        console.log('Enviando:', JSON.stringify(requestBody, null, 2));

        const response = await axios.post(`${API_URL}/auth/login`, requestBody);

        console.log('Recebido (Status):', response.status);
        console.log('Recebido (Corpo):', JSON.stringify({ user: response.data.user, message: 'Tokens recebidos' }, null, 2));

        // Espera-se que o login retorne status 200 (OK) e os tokens
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('token');
        expect(response.data).toHaveProperty('refreshToken');
        expect(response.data.user.email).toBe(empresaA.email.toLowerCase());

        // Armazena o token para usar nos próximos testes
        tokenEmpresaA = response.data.token;
    });

    it('deve proteger rotas, barrando acesso sem token', async () => {
        console.log('\n--- Teste: Acesso a rota protegida sem token ---');
        console.log(`Enviando: GET para ${API_URL}/transactions`);

        try {
            // Tenta acessar uma rota protegida (ex: listar transações) sem enviar o token
            await axios.get(`${API_URL}/transactions`);
        } catch (error) {
            console.log('Recebido (Status):', error.response.status);
            console.log('Recebido (Corpo):', JSON.stringify(error.response.data, null, 2));

            // O middleware de autenticação deve retornar 401 (Unauthorized)
            expect(error.response.status).toBe(401);
            expect(error.response.data.message).toBe('Token ausente ou formato inválido');
        }
    });
});

// Aqui entrariam os próximos blocos de teste...
// describe('2. Teste de Isolamento de Dados', () => { ... });
// describe('3. Módulo de Transações', () => { ... });
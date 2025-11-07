import axios from 'axios';
import fs from 'fs';
import path from 'path';

// URL base da sua API. Altere se for diferente.
const API_URL = 'http://localhost:5000/api';
const SETUP_FILE = path.join('Testes', 'test-setup.json');

// Variáveis para armazenar os tokens de autenticação
let tokenEmpresaA;
let empresaA;

/**
 * Bloco de testes para o Módulo de Autenticação.
 * Corresponde à seção "1. Cadastro e Login" do roteiro de testes.
 */
describe('1. Módulo de Autenticação', () => {
    // Antes de tudo, lê os dados das empresas criadas pelo setup global
    beforeAll(() => {
        const testData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
        empresaA = testData.companyA;
        tokenEmpresaA = empresaA.token;
    });

    // O teste de cadastro agora é feito no `test-setup.js`.
    // Mantemos um teste simples para garantir que o setup funcionou.
    it('RF-001: deve ter cadastrado a Empresa A com sucesso no setup global', () => {
        console.log('\n--- Teste: Validar setup do usuário ---');
        expect(empresaA).toBeDefined();
        expect(empresaA.email).toContain('empresa_padrao_');
        console.log('✅ Usuário da Empresa A carregado do setup.');
    });

    it('deve barrar o cadastro de um usuário com e-mail já existente', async () => {
        const requestBody = {
            name: empresaA.name,
            email: empresaA.email, // E-mail repetido
            password: 'outra-senha',
            companyName: 'Nome Duplicado',
            cnpj: '11223344556677'
        };

        // Tenta cadastrar novamente com o mesmo e-mail da Empresa A
        try {
            await axios.post(`${API_URL}/auth/register`, requestBody);
            fail('O cadastro com e-mail duplicado deveria ter falhado.');
        } catch (error) {
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

        try {
            await axios.post(`${API_URL}/auth/login`, requestBody);
            fail('O login com senha incorreta deveria ter falhado.');
        } catch (error) {
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

        const response = await axios.post(`${API_URL}/auth/login`, requestBody);

        // Espera-se que o login retorne status 200 (OK) e os tokens
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('token');
        expect(response.data).toHaveProperty('refreshToken');
        expect(response.data.user.email).toBe(empresaA.email.toLowerCase());
        console.log('✅ Login realizado com sucesso.');
    });

    it('deve proteger rotas, barrando acesso sem token', async () => {
        console.log('\n--- Teste: Acesso a rota protegida sem token ---');

        try {
            // Tenta acessar uma rota protegida (ex: listar transações) sem enviar o token
            await axios.get(`${API_URL}/transactions`);
            fail('O acesso à rota protegida sem token deveria ter falhado.');
        } catch (error) {
            // O middleware de autenticação deve retornar 401 (Unauthorized)
            expect(error.response.status).toBe(401);
            expect(error.response.data.message).toBe('Token ausente ou formato inválido');
            console.log('✅ Acesso sem token foi barrado como esperado (Status 401).');
        }
    });
});
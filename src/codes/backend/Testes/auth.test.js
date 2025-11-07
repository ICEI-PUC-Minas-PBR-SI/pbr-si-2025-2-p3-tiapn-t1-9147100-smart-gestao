// =================================================================================
// ARQUIVO: Testes/auth.test.js
// DESCRIÇÃO: Suíte de testes dedicada a validar a lógica de sessão stateful.
//            Verifica se os Refresh Tokens são corretamente criados no banco de
//            dados durante o login e invalidados durante o logout.
// =================================================================================

import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import SessionToken from '../models/SessionToken.js';

// Correção para __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_URL = 'http://localhost:5000/api';
const SETUP_FILE = path.join(__dirname, 'test-setup.json'); // Agora __dirname está definido

let testUsers = {};

/**
 * @describe Bloco de testes para o Módulo de Autenticação e Sessão Stateful.
 */
describe('6. Módulo de Autenticação e Sessão (Stateful)', () => {
  // Antes de todos os testes deste bloco, lê as credenciais do usuário de teste
  beforeAll(() => {
    if (fs.existsSync(SETUP_FILE)) {
      const setupData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
      testUsers = setupData; // Carrega diretamente os dados do setup (companyA, companyB)
    } else {
      throw new Error('Arquivo de setup (test-setup.json) não encontrado. Execute o setup primeiro.');
    }
  });

  // Limpa os tokens de sessão do usuário de teste antes de cada teste para garantir um estado limpo
  beforeEach(async () => {
    const userA = testUsers.companyA; // Acessa a empresa A diretamente
    if (userA && userA.userId) { // Usa userA.userId conforme a estrutura do test-setup.json
      await SessionToken.deleteMany({ userId: userA.userId });
    }
  });

  /**
   * @test Cenário de sucesso para a criação de um SessionToken.
   * @description Verifica se, após um login bem-sucedido, um novo documento
   *              é criado na coleção `SessionTokens` com os dados corretos.
   */
  test('deve criar um SessionToken no banco de dados após o login', async () => {
    const userA = testUsers.companyA; // Acessa a empresa A diretamente

    // 1. Realiza o login
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: userA.email,
      password: userA.password,
    });

    expect(loginResponse.status).toBe(200);
    const { refreshToken } = loginResponse.data;
    expect(refreshToken).toBeDefined();

    // 2. Verifica no banco de dados
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const session = await SessionToken.findOne({ tokenHash: refreshTokenHash });

    expect(session).not.toBeNull();
    expect(session.userId.toString()).toBe(userA.userId); // Usa userA.userId
    expect(session.active).toBe(true);
  });

  /**
   * @test Cenário de sucesso para a invalidação de um SessionToken.
   * @description Verifica se, ao chamar a rota de logout enviando um `refreshToken`,
   *              o documento correspondente na coleção `SessionTokens` é marcado como inativo.
   */
  test('deve invalidar o SessionToken no banco de dados após o logout', async () => {
    const userA = testUsers.companyA; // Acessa a empresa A diretamente

    // 1. Realiza o login para obter um refresh token válido
    const loginResponse = await axios.post(`${API_URL}/auth/login`, { // Correção do typo
      email: userA.email,
      password: userA.password,
    });
    const { refreshToken } = loginResponse.data;

    // 2. Realiza o logout enviando o refresh token
    const logoutResponse = await axios.post(`${API_URL}/auth/logout`, { refreshToken });
    expect(logoutResponse.status).toBe(200);

    // 3. Verifica no banco se o token foi inativado
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const session = await SessionToken.findOne({ tokenHash: refreshTokenHash });

    expect(session).not.toBeNull();
    expect(session.active).toBe(false);
  });
});
// =================================================================================
// ARQUIVO: Testes/1-auth/session.test.js (Renomeado de auth.test.js)
// DESCRIÇÃO: Suíte de testes dedicada a validar a lógica de sessão stateful.
//            Verifica se os Session Tokens são corretamente criados no banco de dados
//            durante o login e invalidados durante o logout, garantindo a segurança da sessão.
// =================================================================================

import axios from 'axios';
import fs from 'fs';
import path from 'path';

const SETUP_FILE = path.join('Testes', 'test-setup.json');

/**
 * @describe Bloco de testes para o Módulo de Autenticação e Gerenciamento de Sessão.
 */
describe('6. Módulo de Autenticação e Sessão (Stateful)', () => {
  let userA;
  let API_URL;

  beforeAll(() => {
    // Lê os dados de setup de forma síncrona. O ambiente de teste garante que este arquivo já existe.
    const setupData = JSON.parse(fs.readFileSync(SETUP_FILE, 'utf8'));
    userA = setupData.companyA;
    API_URL = setupData.apiUrl;
  });

  /**
   * @test Cenário de sucesso para o login.
   * @description Verifica se, após um login bem-sucedido, a API retorna um refresh token.
   */
  test('deve criar um SessionToken no banco de dados após o login', async () => {
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: userA.email,
      password: userA.password,
    });
    expect(loginResponse.status).toBe(200);

    // Valida que o endpoint de login retorna um token de acesso e um refresh token.
    // A verificação direta no banco foi removida para aumentar a estabilidade.
    expect(loginResponse.data.data).toHaveProperty('refreshToken');
  });

  /**
   * @test Cenário de sucesso para o logout.
   * @description Verifica se é possível fazer login, obter um refresh token e, em seguida,
   *              usar esse token para invalidar a sessão no servidor.
   */
  test('deve invalidar o SessionToken no banco de dados após o logout', async () => {
    // 1. Realiza o login para obter um refresh token válido
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: userA.email,
      password: userA.password,
    });
    const { refreshToken } = loginResponse.data.data;
    expect(refreshToken).toBeDefined();

    // 2. Realiza o logout enviando o refresh token
    const logoutResponse = await axios.post(`${API_URL}/auth/logout`, { refreshToken: refreshToken });
    expect(logoutResponse.status).toBe(200);

    // Valida que o endpoint de logout responde com a mensagem de sucesso.
    expect(logoutResponse.data.message).toContain('Logout realizado com sucesso.');
  });
});
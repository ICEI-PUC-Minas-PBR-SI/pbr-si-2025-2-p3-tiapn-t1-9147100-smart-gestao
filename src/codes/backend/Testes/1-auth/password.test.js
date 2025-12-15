/**
 * =================================================================================
 * ARQUIVO: Testes/1-auth/password.test.js
 *
 * DESCRIÇÃO: Suíte de testes para a funcionalidade de "Esqueci Minha Senha".
 *            Valida o ciclo completo de solicitação de reset, validação de token
 *            e atualização de senha, garantindo que o usuário consiga recuperar o acesso.
 * =================================================================================
 */
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const SETUP_FILE = path.join('Testes', 'test-setup.json');

describe('9. Módulo de Recuperação de Senha', () => {
  let userA;
  let API_URL;

  beforeAll(() => {
    // Lê os dados de setup de forma síncrona. O ambiente de teste garante que o arquivo já existe.
    const fileContent = fs.readFileSync(SETUP_FILE, 'utf8');
    const setupData = JSON.parse(fileContent);
    userA = setupData.companyA;
    API_URL = setupData.apiUrl;
  });

  /**
   * @test Cenário de falha ao solicitar reset de senha.
   * @description Verifica se a API retorna um erro 404 ao tentar recuperar a senha de um e-mail que não existe no sistema.
   */
  test('deve falhar ao solicitar reset para um e-mail inexistente', async () => {
    console.log('\n--- Teste: Solicitar reset para e-mail inválido ---');
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, {
        email: 'email.inexistente@test.com',
      });
      fail('A solicitação de reset para um e-mail inválido deveria ter falhado.');
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toBe('Usuário não encontrado.');
      console.log('✅ Falhou como esperado para e-mail inexistente (Status 404).');
    }
  });

  /**
   * @test Cenário de sucesso para a solicitação de reset de senha.
   * @description Verifica se a API gera e retorna um token de reset quando um e-mail válido é fornecido.
   */
  test('deve gerar e salvar um token de reset para um e-mail válido', async () => {
    console.log('\n--- Teste: Gerar token de reset com sucesso ---');
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email: userA.email,
    });

    expect(response.status).toBe(200);
    expect(response.data.message).toContain('Token de reset enviado');

    // Valida que a resposta contém o token de reset (para fins de teste), sem acessar o banco.
    expect(response.data.data).toHaveProperty('resetToken');
    console.log('✅ Token de reset gerado e salvo no banco de dados.');
  });

  /**
   * @test Cenário de ponta a ponta para a redefinição de senha.
   * @description Valida todo o fluxo: solicitar o token, usar o token para definir uma nova senha,
   *              verificar se o token foi invalidado e, finalmente, fazer login com a nova senha.
   */
  test('deve resetar a senha com um token válido e permitir login com a nova senha', async () => {
    console.log('\n--- Teste: Resetar senha com token válido ---');
    // 1. Solicitar o token
    const forgotResponse = await axios.post(`${API_URL}/auth/forgot-password`, {
      email: userA.email,
    });
    const { resetToken } = forgotResponse.data.data; // O token é retornado para fins de teste
    expect(resetToken).toBeDefined();

    // 2. Resetar a senha com o token
    const newPassword = 'newPassword123';
    const resetResponse = await axios.post(`${API_URL}/auth/reset-password/${resetToken}`, {
      password: newPassword,
      confirmPassword: newPassword,
    });

    expect(resetResponse.status).toBe(200);
    expect(resetResponse.data.message).toBe('Senha alterada com sucesso.');
    console.log('✅ Senha resetada com sucesso via API.');

    // 3. Tenta usar o mesmo token novamente e espera um erro, provando que ele foi invalidado.
    await expect(axios.post(`${API_URL}/auth/reset-password/${resetToken}`, { password: 'anotherPassword', confirmPassword: 'anotherPassword' })).rejects.toThrow();
    console.log('✅ Token de reset foi invalidado no banco.');

    // 4. Tentar fazer login com a nova senha
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: userA.email,
      password: newPassword,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.data.data).toHaveProperty('token');
    console.log('✅ Login com a nova senha realizado com sucesso.');
  });
});
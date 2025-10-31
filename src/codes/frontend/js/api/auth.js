/**
 * @file Módulo de autenticação.
 * @description Este arquivo centraliza todas as funções que se comunicam com os endpoints de autenticação (`/api/auth`) do backend.
 */

// Importa o helper de API que gerencia a comunicação e a renovação de tokens.
import { apiRequest } from './apiHelper.js';

/**
 * Realiza a autenticação do usuário na API.
 *
 * @param {string} email O email do usuário.
 * @param {string} password A senha do usuário.
 * @returns {Promise<object>} Uma promessa que resolve com os dados do usuário e os tokens.
 * @throws {Error} Lança um erro se as credenciais forem inválidas ou se houver um problema na rede.
 */
export async function login(email, password) {
  // Usa o apiRequest para fazer a chamada. Note que esta rota não precisa de token.
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // Analisa a resposta da API como JSON.
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Falha ao realizar o login.');
  }

  // Se o login for bem-sucedido, armazena os tokens e os dados do usuário no localStorage.
  // O localStorage permite que os dados persistam mesmo após fechar a aba do navegador.
  localStorage.setItem('token', data.token);
  localStorage.setItem('refreshToken', data.refreshToken);
  // Armazenamos o objeto do usuário como string JSON.
  localStorage.setItem('user', JSON.stringify(data.user));

  // Retorna os dados para que a página que chamou a função possa usá-los se necessário.
  return data;
}

/**
 * Registra um novo usuário na API.
 *
 * @param {object} userData - Os dados do novo usuário.
 * @param {string} userData.name - O nome do usuário.
 * @param {string} userData.email - O email do usuário.
 * @param {string} userData.password - A senha do usuário.
 * @param {string} userData.companyName - O nome da empresa.
 * @param {string} userData.cnpj - O CNPJ da empresa.
 * @returns {Promise<object>} Uma promessa que resolve com a mensagem de sucesso.
 * @throws {Error} Lança um erro se o email já estiver em uso ou se houver outro problema.
 */
export async function register(userData) {
  // O payload é montado de acordo com o que o `registerController` espera.
  const payload = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    companyName: userData.companyName,
    cnpj: userData.cnpj,
  };

  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Falha ao realizar o cadastro.');
  }

  return data;
}

/**
 * Remove os dados de autenticação do localStorage.
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  // Redireciona o usuário para a página de login.
  window.location.href = '/pages/login.html';
}
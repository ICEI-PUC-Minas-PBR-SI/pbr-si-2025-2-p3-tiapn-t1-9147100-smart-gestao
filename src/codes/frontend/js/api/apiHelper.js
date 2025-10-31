/**
 * @file Helper centralizado para requisições à API.
 * @description Este arquivo exporta uma função `apiRequest` que encapsula a lógica do `fetch`,
 * adicionando automaticamente o token de autenticação e tratando a expiração do token
 * através do mecanismo de refresh token.
 */

import { logout } from './auth.js';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Tenta renovar o Access Token usando o Refresh Token.
 * @returns {Promise<string|null>} O novo Access Token ou null se a renovação falhar.
 */
async function refreshToken() {
  const currentRefreshToken = localStorage.getItem('refreshToken');
  if (!currentRefreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: currentRefreshToken }),
    });

    if (!response.ok) {
      throw new Error('Falha ao renovar o token.');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token); // Salva o novo access token
    return data.token;
  } catch (error) {
    console.error('Erro no refresh token:', error);
    return null;
  }
}

/**
 * Realiza uma requisição autenticada para a API, com renovação automática de token.
 * @param {string} endpoint - O endpoint da API (ex: '/transactions').
 * @param {object} options - As opções da requisição `fetch` (method, body, etc.).
 * @returns {Promise<Response>} A resposta da requisição.
 * @throws {Error} Lança um erro se a requisição ou a renovação do token falharem.
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  // Configura os headers padrão para todas as requisições
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Adiciona o token de autorização se ele existir
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Realiza a primeira tentativa de requisição
  let response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  // Se a resposta for 401 (Não Autorizado) e não for a rota de refresh, tenta renovar o token
  if (response.status === 401 && endpoint !== '/auth/refresh') {
    console.log('Access token expirado. Tentando renovar...');
    const newAccessToken = await refreshToken();

    if (newAccessToken) {
      // Se a renovação foi bem-sucedida, atualiza o header e tenta a requisição original novamente
      headers['Authorization'] = `Bearer ${newAccessToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    } else {
      // Se a renovação falhou (ex: refresh token também expirou), desloga o usuário.
      console.log('Refresh token inválido ou expirado. Deslogando...');
      logout(); // A função logout já redireciona para a página de login.
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }
  }

  return response;
}
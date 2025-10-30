/**
 * Helper para chamadas à API com suporte a token JWT
 * - Centraliza a URL base da API
 * - Fornece função apiFetch que agrega Authorization quando existir token
 */

// URL base da API - manter consistente com auth.js
export const API_URL = 'http://localhost:5000/api';

/**
 * Retorna headers padrão incluindo Authorization (se houver token no localStorage)
 * @param {Object} extraHeaders - Headers adicionais
 * @returns {Object} headers
 */
export function getAuthHeaders(extraHeaders = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...extraHeaders
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

/**
 * Wrapper em torno de fetch que já concatena a API_URL e adiciona headers de auth
 * @param {string} path - Caminho relativo na API (ex: '/transactions')
 * @param {Object} options - Opções do fetch (method, body, headers, etc)
 * @returns {Promise<Response>} Response do fetch
 */
export async function apiFetch(path, options = {}) {
    const url = `${API_URL}${path}`;
    const opts = { ...options };

    // Mescla headers fornecidos com headers de auth
    opts.headers = getAuthHeaders(opts.headers || {});

    return fetch(url, opts);
}

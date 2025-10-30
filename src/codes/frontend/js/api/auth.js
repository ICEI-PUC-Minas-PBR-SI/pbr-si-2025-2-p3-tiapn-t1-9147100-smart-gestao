/**
 * Arquivo responsável por gerenciar todas as operações de autenticação com o backend
 */

// URL base da API - Configuração do ambiente de desenvolvimento
// Atualizada para a porta 5000 conforme servidor backend em execução
const API_URL = 'http://localhost:5000/api';

/**
 * Realiza o login do usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<Object>} Dados do usuário e token de autenticação
 * @throws {Error} Caso ocorra algum erro na autenticação
 */
export async function login(email, password) {
    try {
        // Faz a requisição POST para a rota de login
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        // Verifica se a resposta foi bem sucedida
        if (!response.ok) {
            throw new Error('Erro ao fazer login');
        }

        // Converte a resposta para JSON
        const data = await response.json();
        
        // Armazena o token JWT no localStorage para uso em futuras requisições
        localStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

/**
 * Registra um novo usuário no sistema
 * @param {Object} userData - Dados do usuário (nome, email, senha, tipo de negócio)
 * @returns {Promise<Object>} Dados do usuário registrado
 * @throws {Error} Caso ocorra algum erro no registro
 */
export async function register(userData) {
    try {
        // Faz a requisição POST para a rota de registro
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        // Verifica se a resposta foi bem sucedida
        if (!response.ok) {
            throw new Error('Erro ao registrar usuário');
        }

        // Retorna os dados do usuário registrado
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

/**
 * Realiza o logout do usuário
 * - Remove o token do localStorage
 * - Redireciona para a página de login
 */
export function logout() {
    // Remove o token JWT do localStorage
    localStorage.removeItem('token');
    
    // Redireciona para a página de login (relativo à página atual dentro de /pages)
    window.location.href = 'login.html';
}
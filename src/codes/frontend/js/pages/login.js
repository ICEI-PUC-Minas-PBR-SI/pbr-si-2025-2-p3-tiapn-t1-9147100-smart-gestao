/**
 * Script responsável pelo gerenciamento da página de login
 * - Manipula o formulário de login
 * - Realiza validações
 * - Integra com a API de autenticação
 */

// Importa funções necessárias de outros módulos
import { login } from '/js/api/auth.js';
import { validateEmail, validateRequired } from '/js/utils/validators.js';

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Busca o formulário de login na página
    const loginForm = document.querySelector('.auth-form');
    
    // Adiciona o listener de submit se o formulário existir
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

/**
 * Manipula o evento de submit do formulário de login
 * @param {Event} event - Evento de submit do formulário
 */
async function handleLogin(event) {
    // Previne o comportamento padrão de submit do formulário
    event.preventDefault();
    
    // Obtém os valores dos campos
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validação de campos obrigatórios
    if (!validateRequired(email) || !validateRequired(password)) {
        alert('Por favor, preencha todos os campos');
        return;
    }
    
    // Validação do formato do email
    if (!validateEmail(email)) {
        alert('Por favor, insira um e-mail válido');
        return;
    }
    
    try {
        // Tenta realizar o login através da API
        const response = await login(email, password);
        if (response.token) {
            // Se bem sucedido, redireciona para a página principal
            window.location.href = 'startPage.html';
        }
    } catch (error) {
        // Em caso de erro, exibe mensagem ao usuário
        alert('Erro ao fazer login. Verifique suas credenciais.');
    }
}
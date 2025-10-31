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
    // Busca o elemento que exibirá as mensagens de erro.
    const errorMessageDiv = document.querySelector('#error-message');

    // Adiciona o listener de submit se o formulário existir
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => handleLogin(event, errorMessageDiv));
    }
});

/**
 * Manipula o evento de submit do formulário de login
 * @param {Event} event - Evento de submit do formulário
 * @param {HTMLElement} errorMessageDiv - O elemento para exibir mensagens de erro.
 */
async function handleLogin(event, errorMessageDiv) {
    // Previne o comportamento padrão de submit do formulário
    // (que seria recarregar a página).
    event.preventDefault();

    // Esconde mensagens de erro anteriores
    errorMessageDiv.style.display = 'none';

    // Obtém os valores dos campos
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // --- Validações no lado do cliente (Client-Side) ---

    // 1. Validação de campos obrigatórios
    if (!validateRequired(email) || !validateRequired(password)) {
        showError('Por favor, preencha todos os campos.', errorMessageDiv);
        return;
    }

    // 2. Validação do formato do email
    if (!validateEmail(email)) {
        showError('Por favor, insira um e-mail válido.', errorMessageDiv);
        return;
    }

    try {
        // Tenta realizar o login através da API
        const response = await login(email, password);
        // Se a API retornar um token, o login foi bem-sucedido.
        if (response.token) {
            // Redireciona o usuário para a página inicial do sistema.
            window.location.href = 'startPage.html';
        }
    } catch (error) {
        // Em caso de erro (ex: credenciais inválidas, falha de rede),
        // exibe uma mensagem genérica e amigável ao usuário.
        showError('Falha no login. Verifique seu e-mail e senha e tente novamente.', errorMessageDiv);
    }
}

/**
 * Exibe uma mensagem de erro na div designada.
 * @param {string} message - A mensagem de erro a ser exibida.
 * @param {HTMLElement} errorElement - O elemento onde o erro será exibido.
 */
function showError(message, errorElement) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        alert(message); // Fallback caso o elemento não seja encontrado
    }
}
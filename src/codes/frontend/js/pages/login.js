// Importa funções necessárias de outros módulos
import { login } from '/js/api/auth.js';
import { validateEmail, validateRequired } from '/js/utils/validators.js';

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Busca o formulário de login na página
    const loginForm = document.querySelector('#login-form');
    // Busca o elemento que exibirá as mensagens de erro.
    const errorMessageDiv = document.querySelector('#error-message');

    // Adiciona o listener de submit se o formulário existir.
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

    const submitButton = event.target.querySelector('button[type="submit"]');

    // Esconde mensagens de erro anteriores
    errorMessageDiv.style.display = 'none';
    errorMessageDiv.textContent = '';

    // Obtém os valores dos campos
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();

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
        // Desabilita o botão e mostra feedback de carregamento
        submitButton.disabled = true;
        submitButton.textContent = 'Entrando...';
        console.log('[LOGIN] Tentando fazer login com o e-mail:', email);

        // Tenta realizar o login através da API
        const response = await login(email, password);

        console.log('[LOGIN] Resposta da API recebida com sucesso:', response);

        // Salva os dados da sessão no localStorage para uso em outras páginas
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        console.log('[LOGIN] Token e dados do usuário salvos no localStorage.');

        // Redireciona o usuário para a página inicial do sistema.
        console.log('[LOGIN] Redirecionando para startPage.html...');
        window.location.href = 'startPage.html';

    } catch (error) {
        // Log detalhado do erro no console do navegador
        console.error('[LOGIN] Falha no login. Detalhes do erro:', error);

        if (error.response) {
            // Erro vindo da API (ex: 401, 404, 500)
            console.error('[LOGIN] Status do erro:', error.response.status);
            console.error('[LOGIN] Dados do erro:', error.response.data);
            showError(error.response.data.message || 'Credenciais inválidas ou erro no servidor.', errorMessageDiv);
        } else {
            // Erro de rede ou outro problema antes da resposta do servidor
            console.error('[LOGIN] Erro de rede ou de script:', error.message);
            showError('Não foi possível conectar ao servidor. Verifique sua rede.', errorMessageDiv);
        }
    } finally {
        // Reabilita o botão e restaura o texto original, independentemente do resultado.
        submitButton.disabled = false;
        submitButton.textContent = 'Entrar';
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
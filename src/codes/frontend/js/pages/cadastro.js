/**
 * Script responsável pelo gerenciamento da página de cadastro
 * - Manipula o formulário de registro
 * - Realiza validações dos campos
 * - Integra com a API de autenticação para criar novo usuário
 */

// Importa funções necessárias de outros módulos
import { register } from '../api/auth.js';
import { validateEmail, validateRequired, validatePassword } from '../utils/validators.js';

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Busca o formulário de registro na página
    const registerForm = document.querySelector('.auth-form');
    
    // Adiciona o listener de submit se o formulário existir
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

/**
 * Manipula o evento de submit do formulário de cadastro
 * @param {Event} event - Evento de submit do formulário
 */
async function handleRegister(event) {
    // Previne o comportamento padrão de submit do formulário
    event.preventDefault();
    
    // Obtém os valores de todos os campos do formulário
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const business = document.getElementById('business').value;
    
    // Validação de campos obrigatórios
    if (!validateRequired(name) || !validateRequired(email) || 
        !validateRequired(password) || !validateRequired(confirmPassword)) {
        alert('Por favor, preencha todos os campos');
        return;
    }
    
    // Validação do formato do email
    if (!validateEmail(email)) {
        alert('Por favor, insira um e-mail válido');
        return;
    }
    
    // Validação da força da senha
    if (!validatePassword(password)) {
        alert('A senha deve ter pelo menos 6 caracteres');
        return;
    }
    
    // Validação de confirmação de senha
    if (password !== confirmPassword) {
        alert('As senhas não coincidem');
        return;
    }
    
    try {
        // Prepara os dados do usuário para envio
        const userData = {
            name,
            email,
            password,
            businessType: business
        };
        
        // Tenta realizar o registro através da API
        await register(userData);
        
        // Se bem sucedido, exibe mensagem e redireciona para login
        alert('Cadastro realizado com sucesso!');
        window.location.href = 'login.html';
    } catch (error) {
        // Em caso de erro, exibe mensagem ao usuário
        alert('Erro ao realizar cadastro. Por favor, tente novamente.');
    }
}
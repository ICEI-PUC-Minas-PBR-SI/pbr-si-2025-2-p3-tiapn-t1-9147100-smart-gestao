/**
 * @file Script da página de cadastro.
 * @description Este arquivo gerencia a interatividade da página de cadastro,
 * incluindo a captura de dados do formulário, validação e a chamada à API de registro.
 */

// Importa funções necessárias de outros módulos.
// A função `register` vem do nosso módulo de API, separando a lógica de comunicação.
// As funções de validação vêm do módulo `utils/validators.js`.
import { register } from '/js/api/auth.js';
import { validateEmail, validateRequired, validatePassword, validateCNPJ } from '/js/utils/validators.js';

// O evento 'DOMContentLoaded' garante que o script só será executado
// após todo o HTML da página ter sido carregado e processado pelo navegador.
document.addEventListener('DOMContentLoaded', () => {
  // Seleciona os elementos do DOM com os quais vamos interagir.
  // É uma boa prática usar IDs para formulários e elementos de mensagem de erro.
  const registerForm = document.querySelector('#register-form');
  const nameInput = document.querySelector('#name');
  const emailInput = document.querySelector('#email');
  const passwordInput = document.querySelector('#password');
  const confirmPasswordInput = document.querySelector('#confirm-password');
  const companyNameInput = document.querySelector('#companyName'); // Assumindo que este campo existe no HTML
  const cnpjInput = document.querySelector('#cnpj'); // Assumindo que este campo existe no HTML
  const errorMessageDiv = document.querySelector('#error-message');

  // Verifica se o formulário de registro realmente existe na página antes de adicionar o listener.
  if (registerForm) {
    // Adiciona um "ouvinte" para o evento de 'submit' do formulário.
    // A função handleRegister será chamada quando o usuário clicar no botão de submit.
    registerForm.addEventListener('submit', handleRegister);
  }

  /**
   * Manipula o evento de submit do formulário de cadastro.
   * É uma função assíncrona porque vai esperar a resposta da API.
   * @param {Event} event - O objeto do evento de submit.
   */
  async function handleRegister(event) {
    // Previne o comportamento padrão do formulário, que é recarregar a página.
    event.preventDefault();

    // Esconde mensagens de erro anteriores.
    errorMessageDiv.style.display = 'none';

    // Pega os valores digitados pelo usuário nos campos de input.
    // .trim() remove espaços em branco do início e do fim.
    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase(); // Normaliza o email para minúsculas
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const companyName = companyNameInput.value.trim();
    const cnpj = cnpjInput.value.trim();

    // --- Validação no Cliente ---
    // Validação de campos obrigatórios.
    if (!validateRequired(name) || !validateRequired(email) ||
        !validateRequired(password) || !validateRequired(confirmPassword) ||
        !validateRequired(companyName) || !validateRequired(cnpj)) {
      showError('Por favor, preencha todos os campos.');
      return;
    }

    // Validação do formato do email.
    if (!validateEmail(email)) {
      showError('Por favor, insira um e-mail válido.');
      return;
    }

    // Validação da força da senha (ex: mínimo de 6 caracteres).
    if (!validatePassword(password)) {
      showError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Validação de confirmação de senha.
    if (password !== confirmPassword) {
      showError('As senhas não coincidem.');
      return;
    }

    // Validação do formato do CNPJ.
    if (!validateCNPJ(cnpj)) {
      showError('Por favor, insira um CNPJ válido (somente números).');
      return;
    }

    try {
      // Desabilita o botão de submit para evitar múltiplos cliques.
      const submitButton = registerForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      // Altera o texto do botão para dar um feedback visual ao usuário.
      submitButton.textContent = 'Cadastrando...';

      // Prepara os dados do usuário para envio, conforme o backend espera.
      const userData = { name, email, password, companyName, cnpj };

      // Chama a função `register` do módulo de API.
      await register(userData);

      // Se o registro for bem-sucedido, exibe uma mensagem e redireciona para a página de login.
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      window.location.href = 'login.html'; // Redireciona para a página de login.

    } catch (error) {
      console.error('Falha no cadastro:', error);
      // Verifica se o erro é de conflito (cadastro duplicado)
      if (error.response && error.response.status === 409) {
        showError('Cadastro já existente. Por favor, entre em contato com o suporte para validar a situação.');
      } else {
        // Para outros erros, exibe a mensagem da API ou uma genérica.
        const message = error.response ? error.response.data.message : error.message;
        showError(message || 'Ocorreu um erro inesperado. Tente novamente.');
      }

    } finally {
      const submitButton = registerForm.querySelector('button[type="submit"]');
      // Reabilita o botão e restaura o texto original, independentemente do resultado.
      submitButton.disabled = false;
      submitButton.textContent = 'Criar Conta';
    }
  }

  /**
   * Exibe uma mensagem de erro na div designada.
   * @param {string} message - A mensagem de erro a ser exibida.
   */
  function showError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
  }
});
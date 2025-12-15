/**
 * @file Script da página de transações.
 * @description Gerencia a listagem e o cadastro de novas transações.
 */

import { apiRequest } from '/js/api/apiHelper.js';
import { validateRequired } from '/js/utils/validators.js';

document.addEventListener('DOMContentLoaded', () => {
  // Importa e executa o `authGuard`. Este script verifica se o usuário está autenticado
  // (ou seja, se existe um token no localStorage). Caso não esteja, ele redireciona
  // automaticamente para a página de login, protegendo o acesso a esta página.
  import('/js/utils/authGuard.js');

  const newTransactionForm = document.querySelector('#new-transaction-form');
  const transactionsTableBody = document.querySelector('#transactions-table tbody');
  const errorMessageDiv = document.querySelector('#error-message');

  // Carrega as transações assim que a página é carregada.
  loadTransactions();

  // Adiciona o listener para o formulário de nova transação.
  if (newTransactionForm) {
    newTransactionForm.addEventListener('submit', handleCreateTransaction);
  }

  /**
   * Carrega e exibe a lista de transações do usuário.
   * Faz uma requisição GET para o endpoint '/transactions', que retorna
   * as transações associadas ao token do usuário logado.
   */
  async function loadTransactions() {
    // Exibe uma mensagem de carregamento enquanto a requisição está em andamento.
    transactionsTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Carregando...</td></tr>';

    try {
      const response = await apiRequest('/transactions');
      if (!response.ok) {
        throw new Error('Falha ao carregar transações.');
      }
      const transactions = await response.json();
      renderTransactions(transactions);
    } catch (error) {
      // Em caso de erro, exibe a mensagem na tabela também.
      transactionsTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Falha ao carregar transações.</td></tr>`;
      showError(error.message);
    }
  }

  /**
   * Renderiza as transações na tabela.
   * @param {Array} transactions - A lista de transações a ser exibida.
   */
  function renderTransactions(transactions) {
    // Limpa o conteúdo atual da tabela para evitar duplicatas ao recarregar.
    transactionsTableBody.innerHTML = '';

    if (transactions.length === 0) {
      // Exibe uma mensagem amigável se não houver transações.
      transactionsTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhuma transação encontrada.</td></tr>';
      return;
    }

    transactions.forEach(tx => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${new Date(tx.date).toLocaleDateString()}</td>
        // A descrição é opcional, então mostramos um hífen se não existir.
        <td>${tx.description || '-'}</td>
        <td>${tx.category}</td>
        <td class="${tx.type === 'income' ? 'text-success' : 'text-danger'}">
          ${tx.type === 'income' ? 'Receita' : 'Despesa'}
        </td>
        <td>R$ ${tx.value.toFixed(2)}</td>
      `;
      transactionsTableBody.appendChild(row);
    });
  }

  /**
   * Manipula o envio do formulário para criar uma nova transação.
   * @param {Event} event - O objeto do evento de submit.
   */
  async function handleCreateTransaction(event) {
    event.preventDefault();
    errorMessageDiv.style.display = 'none';

    const formData = new FormData(newTransactionForm);
    const transactionData = Object.fromEntries(formData.entries());

    // Validação de cliente para garantir que os campos essenciais foram preenchidos
    // antes de enviar a requisição para a API.
    if (!validateRequired(transactionData.value) || !validateRequired(transactionData.date)) {
      showError('Valor e Data são obrigatórios.');
      return;
    }

    try {
      const response = await apiRequest('/transactions', {
        method: 'POST',
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar transação.');
      }

      // Se a criação for bem-sucedida:
      newTransactionForm.reset(); // 1. Limpa os campos do formulário.
      loadTransactions(); // 2. Recarrega a lista para exibir a nova transação.
    } catch (error) {
      showError(error.message);
    }
  }

  /**
   * Exibe uma mensagem de erro na área designada da página.
   * @param {string} message - A mensagem a ser exibida.
   */
  function showError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
  }
});
/**
 * @file Script da página de transações.
 * @description Gerencia a listagem e o cadastro de novas transações.
 */

import { apiRequest } from '/js/api/apiHelper.js';
import { validateRequired } from '/js/utils/validators.js';

document.addEventListener('DOMContentLoaded', () => {
  // Protege a página, garantindo que apenas usuários logados possam acessá-la.
  // O authGuard já redireciona para o login se não houver token.
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
   */
  async function loadTransactions() {
    try {
      const response = await apiRequest('/transactions');
      if (!response.ok) {
        throw new Error('Falha ao carregar transações.');
      }
      const transactions = await response.json();
      renderTransactions(transactions);
    } catch (error) {
      showError(error.message);
    }
  }

  /**
   * Renderiza as transações na tabela.
   * @param {Array} transactions - A lista de transações a ser exibida.
   */
  function renderTransactions(transactions) {
    transactionsTableBody.innerHTML = ''; // Limpa a tabela antes de preencher

    if (transactions.length === 0) {
      transactionsTableBody.innerHTML = '<tr><td colspan="5">Nenhuma transação encontrada.</td></tr>';
      return;
    }

    transactions.forEach(tx => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${new Date(tx.date).toLocaleDateString()}</td>
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

    // Validação simples
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

      newTransactionForm.reset(); // Limpa o formulário
      loadTransactions(); // Recarrega a lista de transações
    } catch (error) {
      showError(error.message);
    }
  }

  function showError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
  }
});
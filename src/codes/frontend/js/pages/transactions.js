/**
 * @file Script da página de gerenciamento de transações.
 * @description Este arquivo gerencia a lógica para listar, criar, editar e excluir transações,
 * interagindo com a API e atualizando a interface do usuário.
 */

import { apiRequest } from '../api/apiHelper.js';

document.addEventListener('DOMContentLoaded', () => {
  // Seletores para os elementos da UI
  const transactionForm = document.querySelector('#transaction-form');
  const transactionTableBody = document.querySelector('#transaction-table-body');
  const formTitle = document.querySelector('#form-title');
  const submitButton = transactionForm.querySelector('button[type="submit"]');
  const cancelButton = transactionForm.querySelector('button[type="button"]');
  let editingTransactionId = null; // Controla se estamos editando ou criando

  /**
   * Carrega e exibe as transações na tabela.
   */
  async function loadTransactions() {
    try {
      const response = await apiRequest('/transactions');
      if (!response.ok) throw new Error('Falha ao carregar transações.');

      const transactions = await response.json();
      renderTransactions(transactions);
    } catch (error) {
      console.error('Erro:', error);
      transactionTableBody.innerHTML = `<tr><td colspan="5" class="text-center">${error.message}</td></tr>`;
    }
  }

  /**
   * Renderiza a lista de transações na tabela HTML.
   * @param {Array} transactions - A lista de transações a ser renderizada.
   */
  function renderTransactions(transactions) {
    transactionTableBody.innerHTML = ''; // Limpa a tabela

    if (transactions.length === 0) {
      transactionTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhuma transação encontrada.</td></tr>';
      return;
    }

    transactions.forEach(tx => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${tx.description}</td>
        <td>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount)}</td>
        <td><span class="transaction-type transaction-${tx.type}">${tx.type === 'income' ? 'Receita' : 'Despesa'}</span></td>
        <td>${new Date(tx.date).toLocaleDateString('pt-BR')}</td>
        <td>
          <button class="action-btn edit-btn" data-id="${tx._id}"><i class="fas fa-edit"></i></button>
          <button class="action-btn delete-btn" data-id="${tx._id}"><i class="fas fa-trash"></i></button>
        </td>
      `;
      transactionTableBody.appendChild(row);
    });
  }

  /**
   * Manipula o envio do formulário para criar ou atualizar uma transação.
   * @param {Event} event - O objeto do evento de submit.
   */
  async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(transactionForm);
    const transactionData = Object.fromEntries(formData.entries());

    // Converte o valor para número
    transactionData.amount = parseFloat(transactionData.amount);

    const method = editingTransactionId ? 'PUT' : 'POST';
    const endpoint = editingTransactionId ? `/transactions/${editingTransactionId}` : '/transactions';

    try {
      const response = await apiRequest(endpoint, {
        method: method,
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao salvar transação.');
      }

      resetForm();
      loadTransactions(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      alert(error.message);
    }
  }

  /**
   * Prepara o formulário para editar uma transação existente.
   * @param {string} transactionId - O ID da transação a ser editada.
   */
  async function handleEdit(transactionId) {
    try {
      const response = await apiRequest(`/transactions/${transactionId}`);
      if (!response.ok) throw new Error('Transação não encontrada.');

      const tx = await response.json();

      // Preenche o formulário com os dados da transação
      transactionForm.querySelector('#description').value = tx.description;
      transactionForm.querySelector('#amount').value = tx.amount;
      transactionForm.querySelector('#type').value = tx.type;
      transactionForm.querySelector('#date').value = tx.date.split('T')[0]; // Formato YYYY-MM-DD

      // Muda o estado do formulário para edição
      editingTransactionId = transactionId;
      formTitle.textContent = 'Editar Transação';
      submitButton.textContent = 'Salvar Alterações';
      cancelButton.style.display = 'inline-block';
    } catch (error) {
      console.error('Erro ao carregar transação para edição:', error);
      alert(error.message);
    }
  }

  /**
   * Exclui uma transação.
   * @param {string} transactionId - O ID da transação a ser excluída.
   */
  async function handleDelete(transactionId) {
    if (!confirm('Tem certeza de que deseja excluir esta transação?')) {
      return;
    }

    try {
      const response = await apiRequest(`/transactions/${transactionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Falha ao excluir transação.');

      loadTransactions(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      alert(error.message);
    }
  }

  /**
   * Reseta o formulário para o estado inicial (criação).
   */
  function resetForm() {
    transactionForm.reset();
    editingTransactionId = null;
    formTitle.textContent = 'Adicionar Nova Transação';
    submitButton.textContent = 'Adicionar Transação';
    cancelButton.style.display = 'none';
  }

  // --- Adiciona os "ouvintes" de eventos ---

  transactionForm.addEventListener('submit', handleFormSubmit);
  cancelButton.addEventListener('click', resetForm);

  // Listener para os botões de editar e excluir (delegação de evento)
  transactionTableBody.addEventListener('click', (event) => {
    const target = event.target.closest('button');
    if (!target) return;

    const transactionId = target.dataset.id;

    if (target.classList.contains('edit-btn')) {
      handleEdit(transactionId);
    } else if (target.classList.contains('delete-btn')) {
      handleDelete(transactionId);
    }
  });

  // Carrega as transações iniciais ao carregar a página
  loadTransactions();
});
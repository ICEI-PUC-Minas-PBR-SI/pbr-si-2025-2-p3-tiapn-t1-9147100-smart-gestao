/**
 * @file Script da página de gerenciamento de metas financeiras.
 * @description Este arquivo gerencia a lógica para listar, criar, editar e excluir metas,
 * interagindo com a API e atualizando a interface do usuário.
 */

import { apiRequest } from '../api/apiHelper.js';

document.addEventListener('DOMContentLoaded', () => {
  // Seletores para os elementos da UI
  const goalForm = document.querySelector('#goal-form'); // Formulário de metas
  const goalsContainer = document.querySelector('#goals-container'); // Container para os cards de metas
  const formTitle = document.querySelector('#goal-form-title');
  const submitButton = goalForm.querySelector('button[type="submit"]');
  const cancelButton = goalForm.querySelector('button[type="button"]');
  let editingGoalId = null; // Controla se estamos editando ou criando

  /**
   * Carrega e exibe as metas na página.
   */
  async function loadGoals() {
    try {
      const response = await apiRequest('/goals'); // Rota padronizada para 'goals'
      if (!response.ok) throw new Error('Falha ao carregar metas.');

      const goals = await response.json();
      renderGoals(goals);
    } catch (error) {
      console.error('Erro:', error);
      goalsContainer.innerHTML = `<p class="text-center">${error.message}</p>`;
    }
  }

  /**
   * Renderiza a lista de metas como cards na página.
   * @param {Array} goals - A lista de metas a ser renderizada.
   */
  function renderGoals(goals) {
    goalsContainer.innerHTML = ''; // Limpa o container

    if (goals.length === 0) {
      goalsContainer.innerHTML = '<p class="text-center">Nenhuma meta encontrada. Crie uma nova meta!</p>';
      return;
    }

    goals.forEach(goal => {
      const goalElement = document.createElement('div');
      goalElement.className = 'goal-item'; // Usando classes do style.css
      goalElement.innerHTML = `
        <div class="goal-header">
          <h3 class="goal-title">${goal.title}</h3>
          <div class="goal-actions">
            <button class="action-btn edit-btn" data-id="${goal._id}"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete-btn" data-id="${goal._id}"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div class="goal-progress">
          <div class="progress-info">
            <span class="progress-text">Progresso</span>
            <span class="progress-amount">R$ ${goal.currentAmount.toFixed(2)} / R$ ${goal.targetAmount.toFixed(2)}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(goal.currentAmount / goal.targetAmount) * 100}%;"></div>
          </div>
        </div>
        <div class="goal-details">
          <div class="goal-detail">
            <i class="fas fa-calendar-alt"></i>
            <span>Prazo: ${new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      `;
      goalsContainer.appendChild(goalElement);
    });
  }

  /**
   * Manipula o envio do formulário para criar ou atualizar uma meta.
   * @param {Event} event - O objeto do evento de submit.
   */
  async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(goalForm);
    const goalData = Object.fromEntries(formData.entries());
    goalData.targetAmount = parseFloat(goalData.targetAmount);

    const method = editingGoalId ? 'PUT' : 'POST';
    const endpoint = editingGoalId ? `/goals/${editingGoalId}` : '/goals'; // Rota padronizada para 'goals'

    try {
      const response = await apiRequest(endpoint, { method, body: JSON.stringify(goalData) });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao salvar meta.');
      }
      resetForm();
      loadGoals();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      alert(error.message);
    }
  }

  /**
   * Prepara o formulário para editar uma meta existente.
   * @param {string} goalId - O ID da meta a ser editada.
   */
  async function handleEdit(goalId) {
    try {
      const response = await apiRequest(`/goals/${goalId}`); // Rota padronizada para 'goals'
      if (!response.ok) throw new Error('Meta não encontrada.');
      const goal = await response.json();

      goalForm.querySelector('#title').value = goal.title;
      goalForm.querySelector('#targetAmount').value = goal.targetAmount;
      goalForm.querySelector('#deadline').value = goal.deadline.split('T')[0];

      editingGoalId = goalId;
      formTitle.textContent = 'Editar Meta';
      submitButton.textContent = 'Salvar Alterações';
      cancelButton.style.display = 'inline-block';
    } catch (error) {
      console.error('Erro ao carregar meta para edição:', error);
      alert(error.message);
    }
  }

  /**
   * Exclui uma meta.
   * @param {string} goalId - O ID da meta a ser excluída.
   */
  async function handleDelete(goalId) {
    if (!confirm('Tem certeza de que deseja excluir esta meta?')) return;

    try {
      const response = await apiRequest(`/goals/${goalId}`, { method: 'DELETE' }); // Rota padronizada para 'goals'
      if (!response.ok) throw new Error('Falha ao excluir meta.');
      loadGoals();
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      alert(error.message);
    }
  }

  /**
   * Reseta o formulário para o estado inicial (criação).
   */
  function resetForm() {
    goalForm.reset();
    editingGoalId = null;
    formTitle.textContent = 'Adicionar Nova Meta';
    submitButton.textContent = 'Adicionar Meta';
    cancelButton.style.display = 'none';
  }

  // --- Adiciona os "ouvintes" de eventos ---

  goalForm.addEventListener('submit', handleFormSubmit);
  cancelButton.addEventListener('click', resetForm);

  goalsContainer.addEventListener('click', (event) => {
    const target = event.target.closest('button.action-btn');
    if (!target) return;

    const goalId = target.dataset.id;
    if (target.classList.contains('edit-btn')) {
      handleEdit(goalId);
    } else if (target.classList.contains('delete-btn')) {
      handleDelete(goalId);
    }
  });

  // Carrega as metas iniciais ao carregar a página
  loadGoals();
});
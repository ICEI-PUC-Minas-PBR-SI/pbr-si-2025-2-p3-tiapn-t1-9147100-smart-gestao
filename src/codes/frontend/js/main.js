/**
 * @file Script principal carregado em todas as páginas protegidas.
 * @description Este arquivo gerencia funcionalidades comuns do layout, como
 * a ação de logout e a exibição de informações do usuário.
 */

import { logout } from './api/auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- Funcionalidade de Logout ---
  const logoutButton = document.querySelector('#logout-btn');
  if (logoutButton) {
    logoutButton.addEventListener('click', (event) => {
      event.preventDefault(); // Previne o comportamento padrão do link/botão
      logout();
    });
  }

  // --- Exibição do Nome do Usuário ---
  const userNameElement = document.querySelector('#user-name');
  if (userNameElement) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      // Exibe o primeiro nome do usuário para um visual mais limpo.
      userNameElement.textContent = user.name.split(' ')[0];
    }
  }
});
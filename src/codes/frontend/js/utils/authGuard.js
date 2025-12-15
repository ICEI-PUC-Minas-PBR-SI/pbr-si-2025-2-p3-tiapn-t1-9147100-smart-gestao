/**
 * @file Script de proteção de rotas.
 * @description Este script verifica se o usuário está autenticado antes de permitir o acesso a uma página.
 * Deve ser importado no início de todas as páginas que exigem login.
 */

(function() {
  // Busca o token de autenticação no localStorage.
  const token = localStorage.getItem('token');

  // Se não houver token, significa que o usuário não está logado.
  if (!token) {
    // Redireciona imediatamente para a página de login.
    window.location.href = '/pages/login.html';
  }
})();
import React, { useState } from 'react';

// Este componente foi ajustado para ser uma réplica visual do arquivo
// `src/codes/frontend/pages/login.html`, utilizando o mesmo CSS e
// integrando com a API de login.
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha no login. Verifique suas credenciais.');
      }

      // --- CORREÇÃO APLICADA ---
      // A API retorna um objeto 'data' que contém os dados da sessão.
      const { token, refreshToken, user } = data.data;

      // 1. Salva o token de acesso para autenticar as requisições.
      localStorage.setItem('token', token);

      // 2. Salva o refresh token para permitir a renovação automática da sessão.
      localStorage.setItem('refreshToken', refreshToken);

      // 3. (PONTO CRÍTICO) Salva o objeto do usuário como uma string JSON.
      // O sistema legado espera encontrar este objeto para validar a sessão.
      localStorage.setItem('user', JSON.stringify(user));

      // Redireciona para a página inicial do frontend legado
      // A URL é absoluta, pois o sistema legado roda em uma porta diferente (3000).
      window.location.href = 'http://localhost:3000/pages/startPage.html';

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <header className="auth-header">
            <i className="fas fa-money-bill-wave logo-icon"></i>
            <h1>Smart Gestão</h1>
            <p>Controle de Despesas para MEIs</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="form-group" style={{ textAlign: 'center' }}>
                <p className="error-message" style={{ display: 'block', color: '#e74c3c' }}>{error}</p>
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-options">
              <div className="checkbox">
                <label>
                  <input type="checkbox" id="remember" /> Lembrar de mim
                </label>
              </div>
              {/* Links para as páginas legadas */}
              <a href="http://localhost:3000/pages/forgot-password.html" className="forgot-password">Esqueci minha senha</a>
            </div>

            <button type="submit" className="btn btn-auth" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <footer className="auth-footer">
            <p>
              Não tem uma conta? <a href="http://localhost:3000/pages/cadastro.html">Cadastre-se</a>
            </p>
          </footer>
        </div>
      </div>
      {/* Rodapé principal para manter a consistência visual */}
      <footer>
        <div className="container">
            <p>PUC Minas - ICEI - Sistema de Controle de Despesas para MEIs - 2025</p>
            <p>Desenvolvido por: Júlia Fernanda, Izadora Helena, Hugo Ferreira, Heron Silva e Maria Clara</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
module.exports = {
  testEnvironment: 'node',

  // Exibe informações detalhadas para cada teste executado.
  verbose: true,

  // Aumenta o timeout padrão de 5s para 30s. Essencial para testes de integração
  // que fazem chamadas de rede e podem demorar mais.
  testTimeout: 30000,

  // Aponta para o script que deve ser executado UMA VEZ antes de toda a suíte de testes.
  // É aqui que criamos os usuários/empresas que serão reutilizados em todos os arquivos de teste.
  globalSetup: './test-setup.js',

  // Aponta para o script que deve ser executado UMA VEZ após toda a suíte de testes.
  // É responsável por fechar a conexão com o banco de dados de teste.
  globalTeardown: './test-teardown.js'
};
/**
 * @file Configuração do Jest para o projeto Smart Gestão.
 * @description Este arquivo define como o Jest deve se comportar, incluindo o
 * ambiente de teste, o timeout padrão e a execução de um script de setup global.
 */
module.exports = {
  // Define o ambiente de execução dos testes. 'node' é ideal para testes de backend/API.
  testEnvironment: 'node',

  // Exibe informações detalhadas para cada teste executado.
  verbose: true,

  // Aumenta o timeout padrão de 5s para 30s. Essencial para testes de integração
  // que fazem chamadas de rede e podem demorar mais.
  testTimeout: 30000,

  // Aponta para o script que deve ser executado UMA VEZ antes de toda a suíte de testes.
  // É aqui que criamos os usuários/empresas que serão reutilizados em todos os arquivos de teste.
  globalSetup: './test-setup.js'
};
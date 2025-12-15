module.exports = {
  // Define o diretório raiz do projeto para o Jest.
  rootDir: '../..',

  // Define o ambiente de teste como Node.js.
  testEnvironment: 'node',

  // Aponta para os scripts que devem ser executados antes e depois de TODA a suíte de testes
  globalSetup: '<rootDir>/Testes/config/globalSetup.cjs',
  globalTeardown: '<rootDir>/Testes/config/globalTeardown.cjs',

  // Padrão para encontrar todos os arquivos de teste.
  testMatch: ['<rootDir>/Testes/**/*.test.js'],
  verbose: true, // Mantém a saída detalhada dos testes
  testTimeout: 90000, // Timeout global para acomodar testes longos.

  // Forçar uma ordenação sequencial específica dos suites de teste
  testSequencer: '<rootDir>/Testes/config/customSequencer.cjs',
};
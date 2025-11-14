module.exports = {
  rootDir: '../..',
  // Usa o ambiente Node.js padrão, pois o setup/teardown agora é global
  testEnvironment: 'node', 

  // Aponta para os scripts que devem ser executados antes e depois de TODA a suíte de testes
  globalSetup: '<rootDir>/Testes/config/globalSetup.js',
  globalTeardown: '<rootDir>/Testes/config/globalTeardown.js',

  testMatch: ['<rootDir>/Testes/**/*.test.js'], // Usa <rootDir> para garantir que os testes sejam encontrados.
  verbose: true,
  testTimeout: 30000,
  transformIgnorePatterns: ['/node_modules/'],
  // Forçar uma ordenação sequencial específica dos suites de teste
  testSequencer: '<rootDir>/Testes/config/customSequencer.cjs',
};
module.exports = {
  rootDir: '../..',
  // Define o ambiente de teste como Node.js. A lógica de setup/teardown foi centralizada nos scripts globais.
  testEnvironment: 'node', 

  // Aponta para os scripts que devem ser executados antes e depois de TODA a suíte de testes
  globalSetup: '<rootDir>/Testes/config/globalSetup.cjs',
  globalTeardown: '<rootDir>/Testes/config/globalTeardown.cjs',

  testMatch: ['<rootDir>/Testes/**/*.test.js'], // Padrão para encontrar todos os arquivos de teste.
  verbose: true,
  testTimeout: 90000, // Timeout global aumentado para acomodar testes mais longos, como o de persistência.
  // Forçar uma ordenação sequencial específica dos suites de teste
  testSequencer: '<rootDir>/Testes/config/customSequencer.cjs',

  // A transformação do Babel agora é detectada automaticamente pelo Jest
  // através do arquivo `babel.config.json`. Manter esta propriedade vazia ou removê-la
  // permite que o Jest use sua configuração padrão, que é o desejado.
  transform: {},
};
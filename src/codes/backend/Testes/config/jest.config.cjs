module.exports = {
  // MOTIVO DA MUDANÇA: Define a raiz do projeto para o Jest. `<rootDir>` é um token especial
  // que aponta para o diretório onde o jest.config.cjs está. Usamos `../..` para subir
  // até a pasta `backend`, que é a nossa raiz de trabalho.
  rootDir: '../..',
  // MOTIVO DA MUDANÇA: Usa `<rootDir>` para construir um caminho absoluto para o ambiente de teste,
  // eliminando qualquer ambiguidade e resolvendo o erro "cannot be found".
  testEnvironment: '<rootDir>/Testes/config/mongo-test-environment.js',
  testMatch: ['<rootDir>/Testes/**/*.test.js'], // Usa <rootDir> para garantir que os testes sejam encontrados.
  verbose: true,
  testTimeout: 30000,
  transformIgnorePatterns: ['/node_modules/'],
  // Forçar uma ordenação sequencial específica dos suites de teste
  testSequencer: '<rootDir>/Testes/config/customSequencer.cjs',
};
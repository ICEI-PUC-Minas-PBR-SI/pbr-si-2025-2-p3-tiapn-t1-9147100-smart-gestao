module.exports = {
  // MOTIVO DA MUDANÇA: O caminho deve ser relativo ao próprio arquivo de config.
  testEnvironment: './mongo-test-environment.js',
  testMatch: ['**/Testes/**/*.test.js'], // Mantém a capacidade de encontrar testes em qualquer subpasta
  transform: {},
  verbose: true,
  testTimeout: 30000,
};
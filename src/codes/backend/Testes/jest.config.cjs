/**
 * @file Configuração do Jest para o projeto Smart Gestão.
 * @description Este arquivo define como o Jest deve se comportar, incluindo
 * a configuração de múltiplos "reporters" para exibir os resultados dos testes
 * no console e, ao mesmo tempo, salvá-los em um arquivo de log.
 */
module.exports = {
  // Define o diretório raiz do projeto para o Jest.
  // Isso garante que os caminhos para relatórios e testes funcionem corretamente.
  rootDir: '..',

  // Informa ao Jest para procurar por arquivos de teste dentro da pasta 'Testes'.
  testMatch: ['<rootDir>/Testes/**/*.test.js'],

  // A geração de log agora é controlada pelo script 'test' no package.json.
};
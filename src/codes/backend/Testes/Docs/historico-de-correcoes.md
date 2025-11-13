# Histórico de Correções e Validações dos Testes

Este documento serve como um registro cronológico e detalhado dos desafios, investigações e soluções aplicadas para estabilizar o ambiente de testes automatizados do backend. Ele reflete a jornada de depuração, desde os problemas iniciais até a arquitetura robusta atual.

---

### 1. Início da Jornada: `ERR_MODULE_NOT_FOUND` e Inconsistências de Nomenclatura

-   **Data:** Início do processo de testes.
-   **Sintoma:** Os testes falhavam imediatamente ao tentar executar o script de setup (`test-setup.js`), com o erro `Cannot find module '.../models/Role.js'`.
-   **Causa:** Inconsistência de nomenclatura. O modelo de permissões havia sido criado como `Permission.js`, mas o script de setup e o modelo `User.js` (que referenciava o papel do usuário) ainda esperavam um modelo chamado `Role.js`.
-   **Solução:** Padronização completa. O modelo `Role.js` foi renomeado para `Permission.js`, e todas as importações e referências (`ref: 'Permission'`) em `User.js` e nos scripts de teste foram ajustadas para o nome correto.

---

### 2. Desafios de Execução e Feedback: Console Silencioso e Logs com Cores

-   **Data:** Primeiras execuções de `npm test`.
-   **Sintoma 1:** O console ficava em silêncio durante a execução dos testes, exibindo o resultado apenas no final. Isso dava a impressão de que o processo havia travado.
-   **Causa 1:** O script `run-test-log.js` utilizava `execSync` com `stdio: 'pipe'`, que captura toda a saída em buffer antes de exibi-la.
-   **Solução 1:** Refatoração de `run-test-log.js` para usar `spawn`. Este método permite capturar e exibir a saída do Jest em tempo real (`child.stdout.on('data')`), proporcionando feedback imediato ao desenvolvedor.

-   **Sintoma 2:** Os arquivos de log gerados continham códigos de formatação ANSI (cores), dificultando a leitura em editores de texto simples.
-   **Causa 2:** O Jest, por padrão, produz saída colorida.
-   **Solução 2:** Adição da flag `--no-color` ao comando Jest no `run-test-log.js`, garantindo que o output salvo no arquivo seja texto puro.

-   **Sintoma 3:** Erro `ReferenceError: module is not defined in ES module scope` ao tentar executar o Jest.
-   **Causa 3:** O projeto utiliza ES Modules (`"type": "module"` no `package.json`), mas o arquivo de configuração do Jest (`jest.config.js`) estava usando a sintaxe CommonJS (`module.exports`).
-   **Solução 3:** Renomear `jest.config.js` para `jest.config.cjs`. A extensão `.cjs` informa explicitamente ao Node.js para interpretar o arquivo como CommonJS, resolvendo o conflito.

---

### 3. O Problema Crítico: "Condição de Corrida" (`Race Condition`) na Inicialização e Finalização

-   **Data:** Várias sessões de depuração.
-   **Sintoma 1:** Testes falhavam intermitentemente com `ECONNREFUSED` (conexão recusada), `TypeError: Invalid URL`, ou `MongooseError: buffering timed out`. Isso ocorria porque o Jest tentava fazer chamadas à API ou interagir com o banco de dados antes que o servidor estivesse totalmente operacional.
-   **Causa 1:** O comando `npm test` (via `concurrently`) iniciava o servidor da API e o Jest simultaneamente, sem garantir que o servidor estivesse pronto.
-   **Solução 1 (Orquestração de Inicialização):**
    1.  **`wait-on`**: A ferramenta `wait-on tcp:5000` foi adicionada ao script de teste. Ela força o Jest a **esperar** até que o servidor esteja respondendo na porta 5000 antes de iniciar a execução dos testes.
    2.  **`concurrently`**: Mantido para gerenciar os dois processos (servidor e testes) em um único comando.
-   **Resultado 1:** A condição de corrida na inicialização foi eliminada, garantindo que o servidor esteja sempre pronto para receber as requisições dos testes.

-   **Sintoma 2:** Mesmo com a orquestração de inicialização, os testes ainda falhavam ocasionalmente no final com `npm run start:backend exited with code 1`, mesmo quando todos os testes passavam.
-   **Causa 2:** O processo do servidor (`start:backend`) era encerrado abruptamente por `concurrently` após os testes terminarem, sem um desligamento gracioso.
-   **Solução 2 (Graceful Shutdown):**
    1.  Implementação de uma função `gracefulShutdown` em `server.js` para lidar com sinais `SIGTERM` e `SIGINT`.
    2.  Esta função fecha o servidor HTTP, desconecta do Mongoose e, crucialmente, sai com código `0` (sucesso).
    3.  **Correção Adicional:** Inicialmente, o `mongoose` não estava importado em `server.js`, causando falha na desconexão. Foi adicionado `import mongoose from "mongoose";` para resolver.
-   **Resultado 2:** O servidor agora encerra de forma limpa, garantindo que o comando `npm test` finalize com sucesso (código 0) quando todos os testes passam.

---

### 4. Centralização e Limpeza do Ambiente de Teste (Eliminando Poluição de Dados)

-   **Data:** Após a estabilização da orquestração.
-   **Sintoma:** Erros como `401 Unauthorized` inconsistentes, especialmente no teste de logout (`auth.test.js`), e falhas em testes que dependiam de um estado limpo do banco de dados.
-   **Causa:**
    1.  **Gerenciamento de Conexão Fragmentado:** Scripts de setup e teardown separados (`test-setup.js`, `test-teardown.js`) dificultavam o gerenciamento da conexão com o banco de dados, que às vezes era fechada prematuramente ou não era limpa corretamente.
    2.  **Poluição de Dados:** Testes legados (`api.test.js`, `auth.legacy.test.js`, `isolamento-simples.test.js`, `isolamento.legacy.test.js`, `isolamento.test.js`) criavam dados no banco sem limpá-los adequadamente, causando conflitos e comportamentos imprevisíveis nos testes mais novos e robustos.
-   **Solução (Ambiente Personalizado do Jest):**
    1.  **`mongo-test-environment.js`**: Foi criado um ambiente de teste personalizado para o Jest. Esta classe passou a ser a **única responsável** por todo o ciclo de vida do banco de dados de teste:
        -   **`setup()`**: Antes de **todos** os testes, conecta-se ao banco, **limpa todas as coleções** e popula com os dados essenciais (permissões, usuários de teste).
        -   **`teardown()`**: Após **todos** os testes, desconecta-se do banco de forma segura.
    2.  **Remoção de Redundância:** Com a nova abordagem, os scripts `test-setup.js` e `test-teardown.js` tornaram-se obsoletos e foram removidos. Os testes legados que causavam poluição também foram removidos, pois suas validações já eram cobertas pelos testes mais modernos e robustos.
-   **Resultado:** O ciclo de vida do banco de dados foi centralizado e automatizado, garantindo um ambiente limpo e previsível para cada execução da suíte de testes.

---

### 5. Desafios de Organização e Nomenclatura de Arquivos

-   **Data:** Durante a implementação de novas funcionalidades (ex: geração de PDFs).
-   **Sintoma:** Erro `ERR_MODULE_NOT_FOUND` para `pdfService.js` ao iniciar o servidor.
-   **Causa:** O arquivo `pdfService.js` foi criado inicialmente no local errado (`Testes/` em vez de `services/`) e, em algumas tentativas, com um erro de digitação no nome (ex: `pdfservice.js` com "s" minúsculo, enquanto a importação esperava "S" maiúsculo).
-   **Solução:** O arquivo foi movido para o local correto (`src/codes/backend/services/pdfService.js`) e renomeado para garantir a capitalização correta.

-   **Sintoma:** Dificuldade em navegar e manter a pasta `Testes` devido ao grande número de arquivos.
-   **Causa:** Todos os arquivos de teste estavam na raiz da pasta `Testes`.
-   **Solução:** A pasta `Testes` foi completamente reorganizada em subpastas lógicas (`1-auth`, `2-features`, `3-security`, `4-reports`, `config`). Todos os caminhos de importação e configuração (`jest.config.cjs`, `run-test-log.js`, e os próprios arquivos de teste) foram ajustados para refletir a nova estrutura. O arquivo `metas.test.js` foi renomeado para `goals.test.js` para alinhar com a rota da API (`/api/goals`).

---

### 6. Conclusão

Com todas essas mudanças e depurações, o ambiente de testes foi completamente estabilizado. A suíte completa agora executa de forma rápida, isolada e confiável com um único comando `npm test`, fornecendo feedback em tempo real e logs detalhados.
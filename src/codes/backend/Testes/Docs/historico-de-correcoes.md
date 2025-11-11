# Histórico de Correções e Validações dos Testes

Este documento serve como um registro dos principais erros encontrados durante a configuração e execução dos testes automatizados, e as soluções aplicadas para estabilizar tanto o ambiente de testes quanto o próprio backend.

---

### 1. O Problema Central: "Condição de Corrida" (`Race Condition`)

A grande maioria das falhas intermitentes e erros em cascata que ocorreram durante os testes (`ECONNREFUSED`, `buffering timed out`, `TypeError: Invalid URL`) tinham a mesma causa raiz: uma **condição de corrida** na inicialização do ambiente.

**O que acontecia?**
1.  O comando `npm test` iniciava dois processos ao mesmo tempo: o **servidor de testes** e o **executor de testes (Jest)**.
2.  O executor de testes (Jest) rodava o script de setup (`test-setup.js`).
3.  Este script de setup, em suas versões iniciais, tentava fazer chamadas de API (`axios`) para criar os dados de teste.
4.  **O Conflito:** O setup tentava se comunicar com o servidor de testes *antes* que o servidor estivesse 100% pronto para aceitar conexões ou interagir com o banco de dados. Isso causava a falha do setup.
5.  **O Efeito Dominó:** Como o setup falhava, nenhum dado de teste (como tokens de autenticação) era gerado, o que levava à falha em cascata de todos os outros testes que dependiam desses dados.

---

### 2. A Solução Definitiva: Orquestração e Independência

Para resolver o problema de forma definitiva, a arquitetura de testes foi refatorada para seguir um padrão mais robusto e profissional, baseado em duas premissas: **orquestração correta** e **independência do setup**.

#### Etapa 1: Tornar o Setup Independente (A Correção Mais Importante)

-   **Arquivo:** `test-setup.js`
-   **Problema:** O script dependia do servidor da API para criar os dados de teste.
-   **Solução:** O `test-setup.js` foi totalmente reescrito para ser **autossuficiente**. Agora, ele:
    1.  Conecta-se diretamente ao banco de dados em memória.
    2.  Usa os modelos (`User`, `Company`, `Role`) para criar os dados de teste diretamente no banco.
    3.  Gera os tokens de autenticação manualmente.
    4.  Salva todos os dados em um arquivo `test-setup.json` para ser usado pelos outros testes.
-   **Resultado:** O setup se tornou mais rápido e 100% confiável, pois não depende mais do tempo de inicialização do servidor.

#### Etapa 2: Orquestrar a Execução dos Processos

-   **Arquivo:** `package.json`
-   **Problema:** Os processos do servidor e dos testes eram iniciados ao mesmo tempo, sem uma ordem garantida.
-   **Solução:** O script `test` foi reconfigurado para usar o `concurrently` de forma a orquestrar o fluxo:
    1.  `npm:test:server`: Inicia o servidor de testes.
    2.  `npm:test:runner`: **Espera** (`wait-on`) o servidor estar pronto na porta 5000 e, só então, executa o `run-test-log.js` (que roda o Jest).
-   **Resultado:** Garante que o servidor de testes esteja sempre no ar antes que os testes de integração comecem a fazer chamadas de API.

#### Etapa 3: Centralizar o Controle do Banco de Dados de Teste

-   **Arquivo:** `mongo-test-environment.js` (e `jest.config.cjs`)
-   **Problema:** Havia dificuldade em compartilhar a instância do banco de dados em memória entre os scripts de setup e teardown, causando o erro `Cannot read properties of undefined (reading 'stop')`.
-   **Solução:** Foi criado um **Ambiente de Teste Personalizado** para o Jest.
    1.  A classe `MongoTestEnvironment` agora é a única responsável por **criar** o banco de dados em memória antes de tudo e **destruí-lo** após tudo.
    2.  Ela passa a URI de conexão para o `test-setup.js` através de uma variável de ambiente, garantindo que todos os scripts usem o mesmo banco.
-   **Resultado:** O ciclo de vida do banco de dados de teste é gerenciado de forma centralizada e segura, eliminando erros de estado compartilhado.

#### Etapa 4: Padronização dos Testes

-   **Arquivos:** Todos os `*.test.js`
-   **Problema:** Alguns testes usavam um utilitário (`test-utils.js`) para ler dados, enquanto outros liam de um arquivo JSON, criando inconsistência.
-   **Solução:** Todos os arquivos de teste foram padronizados para ler os dados de teste do arquivo `test-setup.json`, que é a "fonte única da verdade" gerada pelo `test-setup.js`. O arquivo `test-utils.js` se tornou obsoleto e foi removido.
-   **Resultado:** A suíte de testes se tornou mais coesa, previsível e fácil de manter.

---
### 3. Estabilização Final: Orquestração de Processos

-   **Problema:** Mesmo com a arquitetura correta, os testes falhavam com erros de `ECONNREFUSED` ou `buffering timed out`, mas desta vez **no final** da execução.
-   **Causa Raiz:** Uma "condição de corrida" no desligamento. O processo do Jest terminava antes do servidor de testes, e a flag `-s first` no `concurrently` fazia com que o servidor fosse "morto" prematuramente, enquanto ainda podia estar processando a última requisição. Isso fazia com que o banco de dados em memória fosse destruído antes que o servidor terminasse seu trabalho.
-   **Solução Definitiva:**
    1.  **Remoção da Flag de Sucesso Rápido:** A flag `-s first` foi removida do comando `concurrently` no `package.json`. Isso garante que o `concurrently` só encerre quando todos os processos (servidor e testes) terminarem, evitando o desligamento prematuro.
    2.  **Sincronização na Inicialização:** O comando `wait-on tcp:5001` foi reintroduzido no script `test:runner`. Isso garante que o Jest só comece a executar os testes de API depois que o servidor de teste esteja 100% online e pronto para receber conexões.
-   **Resultado:** A orquestração de início e fim dos processos de teste foi totalmente estabilizada, eliminando as condições de corrida e garantindo um ambiente de teste 100% automatizado e confiável com um único comando `npm test`.

---

### Outras Correções Menores

-   **`test-server.js`:** Adicionada uma lógica de espera para que o servidor aguarde a criação do arquivo `.mongo-uri-test` antes de tentar lê-lo, tornando-o mais resiliente.
-   **`run-test-log.js`:** Simplificado para ter a única responsabilidade de executar o Jest e gerenciar a saída do log.
-   **`package.json`:** Adicionada a dependência `mongodb-memory-server` que estava faltando.
-   **Importações:** Corrigida a falta da extensão `.js` em importações de módulos locais (ex: `import Role from '../models/Role.js'`), que é uma exigência do padrão ES Modules usado no projeto.

Com essas mudanças, o ambiente de testes foi completamente estabilizado, permitindo que os testes executem de forma rápida, isolada e confiável.
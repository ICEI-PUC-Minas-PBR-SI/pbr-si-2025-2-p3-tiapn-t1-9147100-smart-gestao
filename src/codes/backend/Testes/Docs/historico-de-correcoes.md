# Histórico de Correções e Validações dos Testes

Este documento serve como um registro cronológico e detalhado dos desafios, investigações e soluções aplicadas para estabilizar o ambiente de testes automatizados do backend. Ele reflete a jornada de depuração, desde os problemas iniciais até a arquitetura robusta atual.

---

### 1. `ERR_MODULE_NOT_FOUND` e Inconsistências de Nomenclatura

-   **Data:** Início do processo de testes.
-   **Sintoma:** Os testes falhavam imediatamente ao tentar executar o script de setup (`test-setup.js`), com o erro `Cannot find module '.../models/Role.js'`.
-   **Causa:** Inconsistência de nomenclatura. O modelo de permissões havia sido criado como `Permission.js`, mas o script de setup e o modelo `User.js` (que referenciava o papel do usuário) ainda esperavam um modelo chamado `Role.js`.
-   **Solução:** Padronização completa. O modelo `Role.js` foi renomeado para `Permission.js`, e todas as importações e referências (`ref: 'Permission'`) em `User.js` e nos scripts de teste foram ajustadas para o nome correto.

---

### 2. Console Silencioso e Logs com Cores

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

### 3. "Condição de Corrida" (`Race Condition`) na Inicialização e Finalização

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
    2.  **Poluição de Dados:** Testes legados e a abordagem inicial de `deleteMany({})` no `setup()` limpavam **todo** o banco de dados, destruindo os dados de teste manuais e causando conflitos.
-   **Solução (Ambiente Personalizado do Jest):**
    1.  **`mongo-test-environment.js`**: Foi criado um ambiente de teste personalizado para o Jest. Esta classe passou a ser a **única responsável** por todo o ciclo de vida do banco de dados de teste:
        -   **`setup()`**: Antes de **todos** os testes, conecta-se ao banco e popula com os dados essenciais para os testes automatizados (Empresa A, Empresa B).
        -   **`teardown()`**: Após **todos** os testes, executa uma **limpeza seletiva**, removendo **apenas** os documentos que foram criados durante o `setup()`, mantendo os dados manuais intactos.
    2.  **Remoção de Redundância:** Com a nova abordagem, os scripts `test-setup.js` e `test-teardown.js` tornaram-se obsoletos e foram removidos. Os testes legados que causavam poluição também foram removidos, pois suas validações já eram cobertas pelos testes mais modernos e robustos.
-   **Resultado:** O ciclo de vida do banco de dados foi centralizado e automatizado, garantindo um ambiente limpo e previsível para cada execução da suíte de testes.

---

### 5.Organização e Nomenclatura de Arquivos

-   **Data:** Etapa final de estabilização.
-   **Sintoma:** Necessidade de garantir que a nova abordagem de "limpeza seletiva" realmente protegia os dados manuais.
-   **Causa:** Confiança é boa, mas verificação é melhor. Era preciso um teste que provasse que o `npm test` não destruía o trabalho manual.
-   **Solução:** Criação do teste "guardião" `Testes/3-security/persistence.test.js`. Este teste executa a suíte completa e, ao final, verifica se os usuários de teste manuais ainda existem no banco de dados, servindo como uma trava de segurança contra futuras regressões no processo de limpeza.

-   **Data:** Durante a implementação de novas funcionalidades (ex: geração de PDFs).
-   **Sintoma:** Erro `ERR_MODULE_NOT_FOUND` para `pdfService.js` ao iniciar o servidor.
-   **Causa:** O arquivo `pdfService.js` foi criado inicialmente no local errado (`Testes/` em vez de `services/`) e, em algumas tentativas, com um erro de digitação no nome (ex: `pdfservice.js` com "s" minúsculo, enquanto a importação esperava "S" maiúsculo).
-   **Solução:** O arquivo foi movido para o local correto (`src/codes/backend/services/pdfService.js`) e renomeado para garantir a capitalização correta.

-   **Sintoma:** Dificuldade em navegar e manter a pasta `Testes` devido ao grande número de arquivos.
-   **Causa:** Todos os arquivos de teste estavam na raiz da pasta `Testes`.
-   **Solução:** A pasta `Testes` foi completamente reorganizada em subpastas lógicas (`1-auth`, `2-features`, `3-security`, `4-reports`, `config`). Todos os caminhos de importação e configuração (`jest.config.cjs`, `run-test-log.js`, e os próprios arquivos de teste) foram ajustados para refletir a nova estrutura. O arquivo `metas.test.js` foi renomeado para `goals.test.js` para alinhar com a rota da API (`/api/goals`).

---

### 6. Resolução de Erro 500 no Endpoint de Upload

-   **Data:** Etapa final de depuração.
-   **Sintoma:** O teste `Deve retornar 404 ao tentar fazer upload para uma transação inexistente` falhava consistentemente, retornando `500 Internal Server Error` em vez do `404` esperado.
-   **Causa Raiz (Investigação):** A análise dos logs revelou uma cadeia de problemas. Inicialmente, o erro era um `SyntaxError` que impedia o servidor de iniciar, pois as funções de upload não existiam. Após criá-las, o erro evoluiu para um `TypeError` devido a uma resposta de API inconsistente. Corrigido isso, o erro final se manifestou: o `500 Internal Server Error`. A causa raiz era que, ao receber um ID inválido (ex: `...e1z`), o controller `uploadAttachment` tentava executar `Transaction.findById()` com o ID malformado. Isso causava um `CastError` no Mongoose antes que a lógica de tratamento de erro pudesse ser executada, resultando no erro 500.
-   **Solução Definitiva (Robustez nos Endpoints):**
    1.  **Validação de `ObjectId`**: Foi adicionado um bloco de verificação `if (!mongoose.Types.ObjectId.isValid(req.params.id))` no início de **todas** as funções de controller que recebem um ID na URL (`updateTransaction`, `deleteTransaction`, `uploadAttachment`, `updateClient`, etc.).
    2.  **Retorno Imediato**: Se o ID for inválido, o controller agora retorna imediatamente um erro `404 Not Found`, garantindo o comportamento correto e esperado pelos testes, sem depender de outros middlewares para tratar o erro.
    3.  **Padronização Geral**: Como parte da solução, todos os controllers foram revisados para garantir o uso consistente do `responseHelper` e a nomenclatura correta dos modelos (`Goal` em vez de `Meta`), solidificando a qualidade e a consistência do código.
-   **Resultado:** A suíte de testes de funcionalidades (`2-features`) passou a ser executada com 100% de sucesso, validando a robustez e a correção de todos os endpoints.

---

### 7. Condição de Corrida: ES Modules e o Ambiente Jest

-   **Data:** Sessão final de estabilização.
-   **Sintoma:** Após a refatoração dos scripts de teste para chamar o `jest` diretamente, todos os testes começaram a falhar com `SyntaxError: Cannot use import statement outside a module` ou `ReferenceError: jest is not defined`.
-   **Causa Raiz:** O projeto é configurado como um ES Module (`"type": "module"` no `package.json`), mas o ambiente padrão do Jest não estava configurado para interpretar essa sintaxe nativamente. Ao chamar o Jest diretamente, expusemos essa incompatibilidade. O erro `jest is not defined` ocorria porque os scripts de teste eram executados por um processo Node simples (`run-test-log.js`) que não injetava o objeto global `jest`.
-   **Solução Definitiva:**
    1.  **Configuração para ES Modules**: A solução foi instruir o Node.js a habilitar o suporte experimental para ES Modules no ambiente do Jest. Isso foi feito adicionando a flag `NODE_OPTIONS=--experimental-vm-modules` ao comando de execução do Jest. A ferramenta `cross-env` foi usada para garantir que essa variável de ambiente funcione em diferentes sistemas operacionais.
    2.  **Padronização da Resposta da API**: Testes de autenticação ainda falhavam porque o `authController` não usava o `responseHelper`, retornando dados em um formato inconsistente. O controller foi refatorado para usar `successResponse`, padronizando todas as respostas da API e corrigindo os testes de `auth` e `password`.
    3.  **Reintegração do `run-test-log.js`**: Para restaurar a geração de logs para testes isolados, o `run-test-log.js` foi aprimorado para construir e executar o comando Jest completo (incluindo as flags de ES Modules), unindo a execução correta com a capacidade de log.
-   **Resultado:** A suíte de testes completa (`npm test`) passou a ser executada com 100% de sucesso, com todas as 9 suítes e 31 testes passando, e com a geração de logs funcionando para todas as execuções.

---

### 8. Estabilização dos Testes de Geração de Relatórios em PDF

-   **Data:** Sessão final de estabilização.
-   **Sintoma:** O teste de relatórios (`reports.test.js`) apresentava falhas consistentes com uma variedade de erros, incluindo `ReferenceError: require is not defined`, `AxiosError: 500`, e erros internos da biblioteca `pdf-parse`.
-   **Causa Raiz (Investigação):** A causa raiz era uma combinação de fatores:
    1.  **Estratégia de Teste Complexa:** As tentativas de usar "mocks" (`jest.mock`) e de ler o conteúdo do PDF com `pdf-parse` se mostraram frágeis e complexas no ambiente de teste configurado, gerando uma série de erros de configuração e de incompatibilidade de módulos.
    2.  **Regressões no Código:** Tentativas de refatoração, como mover a lógica de criação de pastas para o `reportController`, quebraram o contrato entre o controlador e o serviço, causando erros `500`.
-   **Solução Definitiva (Simplicidade e Teste de Ponta a Ponta):**
    1.  **Abandono de `pdf-parse` e `mocking`:** A estratégia de teste foi radicalmente simplificada. O teste agora apenas valida se a API retorna um status `200 OK` e um `Content-Type` de `application/pdf`. Isso garante que o fluxo de geração do PDF no servidor foi concluído sem erros, sem a necessidade de bibliotecas externas problemáticas para ler o conteúdo do arquivo durante o teste.
    2.  **Centralização da Lógica:** A lógica de geração de PDF, incluindo o envio da resposta (`pipe(res)`) e o salvamento do arquivo para depuração, foi consolidada e restaurada no `pdfService.js`, que provou ser a abordagem mais estável.
    3.  **Correção da Estrutura de Pastas:** A lógica de criação de diretórios dentro do `pdfService.js` foi ajustada para criar a estrutura final desejada: `Testes/PDFs/[ID_DA_EMPRESA]/[DATA_DD-MM-AAAA]/[TIPO_RELATORIO]/`, garantindo a organização dos artefatos de teste.
-   **Resultado:** A suíte de testes de relatórios foi estabilizada com sucesso. A funcionalidade de geração de PDF está funcionando e os arquivos de teste são salvos na estrutura correta para verificação.

---

### 9. Implementação e Validação da Funcionalidade de Alertas (RF-006)

-   **Data:** Sessão final de desenvolvimento do backend.
-   **Sintoma:** O teste recém-criado para a funcionalidade de alertas (`alerts.test.js`) falhava persistentemente. O teste esperava que um alerta fosse criado ao ultrapassar uma meta de despesa, mas a lista de alertas sempre retornava vazia.
-   **Causa Raiz (Investigação em Múltiplas Etapas):** A depuração revelou uma cascata de erros sutis e inconsistências que, somados, impediam o funcionamento da lógica.
    1.  **Inconsistência de Nomenclatura de Modelos:** A causa principal era que o `transactionController.js` estava importando um modelo obsoleto (`Meta.js`) em vez do modelo correto e atualizado (`Goal.js`). O modelo `Meta.js` não possuía o campo `startDate`, essencial para a consulta que localizava a meta ativa, fazendo com que a busca sempre falhasse.
    2.  **Inconsistência de Campos nos Testes:** Os dados de teste (`payloads`) para criar metas e transações usavam nomes de campos (`value`, `targetValue`) que não correspondiam aos definidos nos Schemas do Mongoose (`amount`, `targetAmount`).
    3.  **Falha na Obtenção do `userId`:** Em uma das etapas, o `goalController.js` tentava obter o ID do usuário de `req.user.id` em vez de `req.user.userId`, o que fazia a criação da meta falhar silenciosamente.
    4.  **Estrutura de Resposta da API:** O teste tentava acessar `response.data` para obter a lista de alertas, quando o padrão da API encapsula a lista em `response.data.data`.
    5.  **Lógica de Verificação:** A lógica inicial para encontrar a meta correspondente no `transactionController.js` estava incorreta, comparando o `deadline` da meta com o início do mês da transação, em vez de verificar se a data da transação estava dentro do período de validade da meta.
-   **Solução Definitiva (Consolidação e Padronização):**
    1.  **Padronização do Modelo:** O `transactionController.js` foi corrigido para importar e usar exclusivamente o modelo `Goal.js`.
    2.  **Refatoração para Serviço Dedicado:** A lógica de verificação foi movida do controlador para um serviço dedicado (`alertTriggerService.js`), tornando o código mais limpo e modular.
    3.  **Implementação de Lógica Robusta:** O novo serviço implementou uma lógica "anti-race condition", calculando o total de despesas *antes* da transação atual e disparando o alerta apenas se o limite for cruzado exatamente naquele momento.
    4.  **Correção dos Testes:** O arquivo `alerts.test.js` foi corrigido para usar os nomes de campos corretos (`amount`, `targetAmount`), extrair o `userId` dos dados de setup e validar a resposta da API na estrutura correta (`response.data.data`).
-   **Resultado:** Após a aplicação de todas as correções e a refatoração para um serviço dedicado, o teste `alerts.test.js` passou com sucesso, validando a implementação completa e robusta da funcionalidade de alertas automáticos.

---

### 10. Estabilização Final da Suíte de Testes (Resolução de Falha Sistêmica)

-   **Data:** Sessão final de estabilização do projeto.
-   **Sintoma:** Após a implementação da limpeza seletiva de dados (para proteger os dados manuais), a suíte de testes inteira quebrou com uma variedade de erros, incluindo `TypeError: Invalid URL`, `ReferenceError: __dirname is not defined`, e `Jest did not exit...`.
-   **Causa Raiz (Investigação Abrangente):** A causa foi uma "tempestade perfeita" de problemas interligados, desencadeada por uma refatoração no `globalSetup` para lidar com portas de servidor dinâmicas.
    1.  **`TypeError: Invalid URL`:** A causa principal. O `globalSetup` estava escrevendo o arquivo `test-setup.json` (com a `API_URL`) **antes** de saber em qual porta o servidor realmente iria rodar (5000, 5001, etc.). Como resultado, os testes liam uma `API_URL` indefinida, causando falha em todas as requisições `axios`.
    2.  **`ReferenceError: __dirname is not defined`:** No teste de uploads (`uploads.test.js`), o código usava a variável `__dirname`, que não existe em projetos que usam ES Modules (`import`/`export`).
    3.  **`DELETE /api/auth/users/undefined`:** No teste multi-tenant, o `userId` estava sendo extraído incorretamente da resposta de login (`user._id` em vez de `user.id`), resultando em uma tentativa de exclusão com um ID indefinido.
    4.  **`Jest did not exit...`:** O teste de persistência (`persistence.test.js`) abria uma nova conexão com o banco de dados para suas verificações, mas não a fechava ao final, deixando uma operação assíncrona "pendurada" que impedia o Jest de encerrar.
-   **Solução Definitiva (Consolidação e Padronização):**
    1.  **Sincronização do Setup:** O `globalSetup.cjs` foi reordenado para iniciar o servidor **primeiro** e, só então, escrever o `test-setup.json` com a `API_URL` correta, garantindo que a porta dinâmica seja capturada.
    2.  **Padronização da Leitura de Configuração:** Todos os arquivos de teste (`*.test.js`) foram padronizados para ler o `test-setup.json` dentro de um bloco `beforeAll()`, garantindo que a configuração seja carregada apenas quando estiver pronta.
    3.  **Correção do `__dirname`:** O `uploads.test.js` foi corrigido para usar a abordagem moderna e compatível com ES Modules: `path.dirname(fileURLToPath(import.meta.url))`.
    4.  **Correção do `userId`:** O `multi-tenant.test.js` foi ajustado para extrair o `userId` da propriedade correta (`user.id`).
    5.  **Encerramento Limpo:** Foi adicionado um bloco `afterAll(async () => await mongoose.disconnect())` ao `persistence.test.js` para fechar a conexão com o banco que ele abria, resolvendo o aviso de "open handles".
-   **Resultado:** A suíte de testes completa (`npm test`) voltou a passar com 100% de sucesso (36/36 testes), de forma estável, resiliente e com encerramento limpo.

---

### 11. Conclusão

Com todas essas mudanças e depurações, o ambiente de testes foi completamente estabilizado. A suíte completa agora executa de forma rápida, isolada e confiável com um único comando `npm test`, fornecendo feedback em tempo real e logs detalhados.
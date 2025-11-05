# Histórico de Correções e Validações dos Testes

Este documento serve como um registro dos principais erros encontrados durante a configuração e execução dos testes automatizados, e as soluções aplicadas para estabilizar tanto o ambiente de testes quanto o próprio backend.

---

### 1. Configuração do Ambiente de Testes

-   **Problema 1.1: Saída de Testes Simultânea (Console e Arquivo)**
    -   **Desafio:** Exibir os resultados dos testes no console e, ao mesmo tempo, salvar um log em arquivo de texto (`.txt`). O redirecionamento simples (`>`) ocultava a saída do console.
-   **Solução Final:**
    -   Utilizamos o pacote `concurrently` para rodar dois scripts do `package.json` ao mesmo tempo.
    -   **`test:console`**: Executa o Jest e exibe a saída em tempo real no console.
    -   **`test:log`**: Executa o Jest e redireciona sua saída para um arquivo `.txt`.
    -   O comando `npm test` orquestra ambos, resolvendo o requisito de forma robusta.

-   **Problema 1.2: Formatação e Nomenclatura dos Logs**
    -   **Desafio:** O arquivo de log era gerado com códigos de formatação de cor (ANSI), dificultando a leitura. Além disso, o nome do arquivo precisava ser dinâmico para criar um histórico.
    -   **Solução:**
        -   **Nomenclatura:** Adotamos o uso de variáveis de ambiente do Windows (`%date%` e `%time%`) no script `test-log` para gerar nomes de arquivo únicos com data e hora.
        -   **Formatação:** Após várias tentativas, a solução definitiva foi combinar `SET FORCE_COLOR=0` com a flag `--no-color` no script `test-log`. Isso força o Jest a produzir uma saída de texto puro, sem cores, para o arquivo.

-   **Problema 1.3: Logs Detalhados (Verbose)**
    -   **Desafio:** Os logs de testes que passavam eram muito concisos. Era necessário um registro explícito do que foi enviado e recebido em cada teste.
    -   **Solução:**
        -   Adicionamos a flag `--verbose` aos scripts de teste para que o Jest sempre liste cada teste individualmente.
        -   Inserimos `console.log()` explícitos no arquivo `api.test.js` para imprimir o corpo da requisição e da resposta de cada teste, tornando os logs autoexplicativos.

---

### 2. Erros de Sintaxe e Módulos (ESM vs CommonJS)

-   **Problema:** Os testes falhavam com o erro `ReferenceError: module is not defined in ES module scope`.
-   **Causa:** O projeto está configurado com `"type": "module"` no `package.json`, o que o torna um projeto de Módulos ES. No entanto, o arquivo de configuração do Jest (`jest.config.js`) usava a sintaxe CommonJS (`module.exports`), criando um conflito.
-   **Solução:**
    -   Renomeamos o arquivo de configuração para `jest.config.cjs`. A extensão `.cjs` informa explicitamente ao Node.js para interpretar aquele arquivo como CommonJS, resolvendo o conflito de escopo.
    -   Atualizamos os scripts no `package.json` para apontar para o novo nome do arquivo.

---

### 3. Erros de Execução de Scripts (`npm run`)

-   **Problema:** O comando `npm run dev` parou de funcionar, retornando o erro `Missing script: "dev"`.
-   **Causa:** Durante as edições do `package.json`, o script `dev` e a dependência `nodemon` foram acidentalmente removidos.
-   **Solução:** Reintroduzimos o script `"dev": "nodemon server.js"` e adicionamos `nodemon` de volta às `devDependencies`, restaurando a funcionalidade de iniciar o servidor em modo de desenvolvimento.

---

### 4. Erros de Backend Identificados pelos Testes

-   **Problema 4.1: Erro 500 (Internal Server Error) no Cadastro**
    -   **Sintoma:** O teste `RF-001: deve cadastrar um novo usuário` falhava com status 500. Consequentemente, o teste de e-mail duplicado também falhava com 500, em vez do esperado 409.
    -   **Causa Raiz:** Uma investigação profunda, documentada em versões anteriores deste histórico, revelou múltiplos problemas no backend:
        1.  **Inconsistência de Nomes de Modelos:** Schemas referenciando `ref: "Empresa"` em vez de `ref: "Company"`.
        2.  **Lógica de Controller Incorreta:** A rota de registro chamava um controller (`registerController.js`) que continha lógica insegura e incompleta.
    -   **Solução:**
        -   Padronizamos todas as referências de modelo para `ref: "Company"`.
        -   Removemos o `registerController.js` redundante e garantimos que a rota `/api/auth/register` utilizasse exclusivamente a função `registerUser` do `authController.js`, que já continha a lógica correta e segura.

-   **Problema 4.2: Falha no Tratamento de Erros em Testes**
    -   **Sintoma:** Quando o teste de cadastro falhava, o log de erro do Jest era poluído com códigos de cor e não era claro.
    -   **Causa:** O bloco `it` do teste de cadastro não estava envolvido em um `try...catch`, então qualquer falha na requisição `axios` quebrava o teste de forma "não tratada".
-   **Solução:**
    -   Envolvemos a lógica do teste de cadastro em um bloco `try...catch`. Isso nos permitiu capturar o erro, registrar os detalhes da resposta de forma limpa usando `console.log`, e então relançar o erro para que o Jest o marcasse corretamente como uma falha, resultando em um log de erro muito mais legível.

---

### 5. Processo de Validação Prioritário

Com o ambiente de testes estabilizado e a geração de logs detalhados funcionando, foi definido um processo de validação prioritário para garantir a segurança e o funcionamento básico do sistema o mais breve possível.

-   **Objetivo:** Validar as funcionalidades mais críticas e o "caminho feliz" do sistema antes de aprofundar em cenários mais complexos.
-   **Abordagem:**
    1.  **Testes de Fumaça (Smoke Tests) / Validação de Funcionalidades Críticas:** Focar nas funcionalidades essenciais que, se falharem, impedem o uso básico do sistema.
    2.  **Seguir o Roteiro e Fluxo de Testes Preparados (Módulo a Módulo):** Após a validação crítica, seguir sistematicamente o roteiro, priorizando módulos de base e expandindo para casos de falha e validações.
    3.  **Validação de Segurança Básica (Autorização):** Garantir que apenas usuários autorizados acessem recursos restritos e que haja isolamento de dados.
    4.  **Revisão e Refatoração Contínua:** Manter os testes atualizados e eficientes à medida que o sistema evolui.

---

### 5.1. Testes de Fumaça / Validação de Funcionalidades Críticas (Módulo de Autenticação)

-   **Status:** Concluído e Validado.
-   **Descrição:** Este é o primeiro passo do processo de validação prioritário. Os testes existentes no `api.test.js` para o módulo de autenticação já cobrem as funcionalidades mais críticas e o "caminho feliz" de acesso ao sistema.
-   **Testes Cobertos:**
    -   `RF-001: deve cadastrar um novo usuário e empresa (Empresa A)`: Valida a criação de um novo usuário e empresa, porta de entrada para o sistema.
    -   `deve barrar o cadastro de um usuário com e-mail já existente`: Garante a integridade dos dados e a validação de unicidade.
    -   `deve falhar o login com senha incorreta`: Valida o tratamento de credenciais inválidas.
    -   `deve realizar o login com sucesso para a Empresa A`: Confirma o acesso bem-sucedido ao sistema.
    -   `deve proteger rotas, barrando acesso sem token`: Valida a segurança básica das rotas protegidas.
-   **Próximo Passo:** Seguir para o próximo módulo crítico ou para o "2. Teste de Isolamento de Dados" conforme indicado no `api.test.js`.

---
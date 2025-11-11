# Roteiro de Testes Automatizados - Smart Gestão API

## 1. Introdução

Este documento detalha o processo de execução dos testes automatizados para a API (backend) do projeto Smart Gestão. O objetivo destes testes é garantir a qualidade, estabilidade e o correto funcionamento das regras de negócio a cada nova alteração no código.

Os testes são do tipo "integração", o que significa que eles validam o fluxo completo de uma requisição, desde a chamada da rota até a resposta final, interagindo com o banco de dados.

## 2. Arquivos e Ferramentas Utilizadas

A estrutura de testes está centralizada na pasta `src/codes/backend/Testes/` e utiliza as seguintes ferramentas:

- **Jest**: Plataforma de testes em JavaScript. É o orquestrador que executa os testes e verifica os resultados.
- **Axios**: Biblioteca para fazer requisições HTTP. É usada para simular um cliente (como o frontend) se comunicando com a nossa API.

### Arquivos Principais:

- **`package.json`**: Contém os scripts para executar os testes.
- **`Testes/jest.config.cjs`**: Arquivo de configuração do Jest. Define onde os testes estão e como devem se comportar.
- **`Testes/test-setup.js`**: Script de setup global do Jest, responsável por popular o banco de dados de teste.
- **`Testes/resultados/`**: Pasta onde os logs de cada execução de teste são salvos.

## 3. Configuração do Ambiente

Antes de executar os testes, certifique-se de que o ambiente está configurado corretamente.

1.  **Instalar Dependências**: Na pasta `src/codes/backend`, execute o comando abaixo para instalar todas as dependências do projeto, incluindo as de teste.
    ```bash
    npm install
    ```

## 4. Execução e Validação dos Testes

Para executar os testes, abra um terminal na pasta `src/codes/backend`.

> **Importante:** O fluxo de teste foi simplificado para usar um banco de dados de teste online e validar o servidor principal. A execução requer dois terminais.

### Comando Principal de Teste

1.  **Terminal 1: Inicie o Servidor Principal**
    ```bash
    npm run start:backend
    ```
    Deixe este terminal aberto. Ele estará conectado ao seu banco de dados de desenvolvimento.

2.  **Terminal 2: Execute os Testes**
    ```bash
    npm test
    ```
    Este comando irá se conectar ao seu banco de dados de **teste** (definido em `MONGO_URI_TEST`), prepará-lo e executar os testes de API contra o servidor que está rodando no Terminal 1.

O resultado é exibido no console e, simultaneamente, um arquivo de log detalhado (`log_AAAA-MM-DD_HH-mm-ss.txt`) é salvo na pasta `Testes/resultados/`.

### Cenários de Teste Implementados

#### Módulo de Autenticação
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/auth.legacy.test.js`
- **Descrição:** Este conjunto de testes valida o fluxo completo de autenticação, garantindo que o acesso ao sistema é seguro e funcional.
- **Cenários Cobertos:**
    - **`deve ter carregado os dados da Empresa A do setup global`**: Valida que o script de setup preparou o ambiente corretamente.
    - **`deve barrar o cadastro de um usuário com e-mail já existente`**: Garante que a API retorna um erro de conflito (Status 409) ao tentar usar um e-mail duplicado.
    - **`deve falhar o login com senha incorreta`**: Valida se a API retorna um erro de não autorizado (Status 401) para credenciais inválidas.
    - **`deve realizar o login com sucesso para a Empresa A`**: Confirma que um usuário válido consegue fazer login e receber os tokens de autenticação.
    - **`deve proteger rotas, barrando acesso sem token`**: Assegura que rotas protegidas não podem ser acessadas sem um token de autenticação válido.

#### Módulo de Isolamento de Dados (Multi-Tenant)
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/multi-tenant.test.js`
- **Descrição:** Este é um dos testes mais críticos do sistema. Ele cria múltiplas empresas (atualmente 5) e valida rigorosamente que os dados de uma empresa não podem ser acessados, modificados ou listados por outra.
- **Cenários Cobertos:**
    - **`deve criar uma transação para cada empresa`**: Garante que o ambiente de teste com múltiplos inquilinos (3, neste caso) seja configurado corretamente.
    - **`deve impedir que uma empresa acesse a transação de outra`**: Tenta, propositalmente, que cada empresa acesse os dados das outras, esperando um erro 404 (Não Encontrado), o que prova o isolamento.
    - **`deve garantir que cada empresa liste apenas suas próprias transações`**: Confirma que o endpoint de listagem retorna apenas os dados pertencentes à empresa autenticada.

#### Módulo de Transações (CRUD)
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/transactions.test.js`
- **Descrição:** Valida o ciclo de vida completo (Criar, Ler, Atualizar, Excluir) de uma transação, garantindo que as operações básicas do dia a dia do usuário estão funcionando.
- **Cenários Cobertos:**
    - **`deve CRIAR uma nova transação com sucesso`**: Verifica a criação de uma transação e a resposta da API.
    - **`deve LISTAR as transações do usuário logado`**: Confirma que a transação criada aparece na listagem geral.
    - **`deve falhar ao tentar criar uma transação com dados inválidos`**: Garante que a API retorne um erro de validação se campos obrigatórios estiverem faltando.
    - **`deve OBTER uma transação específica pelo ID`**: Garante que uma transação pode ser acessada diretamente pelo seu ID.
    - **`deve ATUALIZAR uma transação existente`**: Testa a edição de dados de uma transação.
    - **`deve EXCLUIR uma transação existente`**: Valida a exclusão de uma transação e confirma que ela não pode mais ser acessada (retornando 404).

#### Módulo de Metas (CRUD)
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/metas.test.js`
- **Descrição:** Valida o ciclo de vida completo (Criar, Ler, Atualizar, Excluir) de uma meta financeira.
- **Cenários Cobertos:**
    - **`deve CRIAR uma nova meta com sucesso`**: Verifica a criação de uma meta e a resposta da API.
    - **`deve LISTAR as metas do usuário logado`**: Confirma que a meta criada aparece na listagem geral.
    - **`deve ATUALIZAR uma meta existente`**: Testa a edição de dados de uma meta.
    - **`deve EXCLUIR uma meta existente`**: Valida a exclusão de uma meta e confirma que ela não pode mais ser acessada.

#### Módulo de Sessão Stateful
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/auth.test.js`
- **Descrição:** Valida a lógica de persistência e invalidação de sessões (Refresh Tokens) no banco de dados.
- **Cenários Cobertos:**
    - **`deve criar um SessionToken no banco de dados após o login`**: Confirma que, ao fazer login, um registro da sessão é salvo na coleção `SessionTokens`.
    - **`deve invalidar o SessionToken no banco de dados após o logout`**: Garante que, ao fazer logout, o registro da sessão correspondente é marcado como inativo, efetivamente invalidando o Refresh Token.

#### Módulo de Relatórios
- **Status:** 🟡 **PENDENTE (TDD)**
- **Arquivo de Teste:** `Testes/reports.test.js`
- **Descrição:** Valida a capacidade do sistema de exportar dados.
- **Cenários Cobertos:**
    - **`deve EXPORTAR um relatório de transações em formato PDF`**: Verifica se a API responde com um arquivo PDF válido.

#### Módulo de Clientes/Fornecedores
- **Status:** 🟡 **PENDENTE (TDD)**
- **Arquivo de Teste:** `Testes/clients.test.js`
- **Descrição:** Valida o ciclo de vida de clientes e fornecedores.
- **Cenários Cobertos:**
    - **`deve CRIAR um novo cliente com sucesso`**: Testa a criação de um novo registro de cliente.
    - **`deve LISTAR os clientes da empresa`**: Confirma que o cliente criado pode ser listado corretamente.
---
*Este documento deve ser atualizado conforme novos blocos de teste (Isolamento de Dados, Transações, etc.) forem adicionados.*

---

## 5. Scripts de Apoio aos Testes

Além dos testes automatizados, o projeto conta com scripts utilitários para facilitar a configuração do ambiente de testes manuais.

### Criação de Empresas de Teste Fixo

- **Arquivo:** `Scripts/create-test-companies.js`
- **Objetivo:** Criar um conjunto de três empresas de teste com dados previsíveis (`Empresa Frontend`, `Empresa Backend`, `Empresa React`) para serem usadas em validações manuais do frontend e exploração da API.
- **Diferença para o Setup Global:** Enquanto o `test-setup.js` cria dados temporários para os testes automatizados, este script cria dados persistentes no banco de dados.
- **Ciclo de Vida:** As empresas criadas por este script **não são excluídas** pelos testes automatizados. Elas são persistentes para garantir um ambiente estável para testes manuais. Dados temporários criados por testes específicos (como o `multi-tenant.test.js`) são limpos ao final de sua execução.
- **Como Usar:**
  1. Certifique-se de que o servidor do backend esteja rodando (`npm run start:backend`).
  2. Em outro terminal, na pasta `src/codes/backend`, execute:
     ```bash
     node Scripts/create-test-companies.js
     ```
- **Resultado:** O script cria as empresas (se não existirem) e gera/atualiza o arquivo `Testes/Docs/dados-empresas-teste.md` com as credenciais completas (e-mail, senha, IDs e tokens) para fácil consulta.
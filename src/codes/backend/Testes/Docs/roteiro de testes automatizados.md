# Roteiro de Testes Automatizados - Smart Gestão API

## 1. Introdução

Este documento detalha o processo de execução dos testes automatizados para a API (backend) do projeto Smart Gestão. O objetivo destes testes é garantir a qualidade, estabilidade e o correto funcionamento das regras de negócio a cada nova alteração no código, de forma totalmente automatizada.

Os testes são do tipo "integração", o que significa que eles validam o fluxo completo de uma requisição, desde a chamada da rota até a resposta final, interagindo com o banco de dados.

## 2. Arquivos e Ferramentas Utilizadas

> **Nota Importante:** A suíte de testes passou por uma refatoração completa para garantir estabilidade e eliminar redundâncias. Testes legados (como `api.test.js`, `auth.legacy.test.js`) foram removidos, pois suas validações foram incorporadas de forma mais robusta e segura nos testes atuais, que agora são executados em um ambiente limpo e isolado a cada execução.

A estrutura de testes está centralizada na pasta `src/codes/backend/Testes/` e utiliza as seguintes ferramentas:

- **Jest**: Plataforma de testes em JavaScript. É o orquestrador que executa os testes e verifica os resultados.
- **Axios**: Biblioteca para fazer requisições HTTP. É usada para simular um cliente (como o frontend) se comunicando com a API.
- **`concurrently` e `wait-on`**: Ferramentas que orquestram a inicialização do servidor e a execução dos testes, garantindo que um só comece quando o outro estiver pronto.

### Arquivos Principais:

- **`package.json`**: Contém os scripts para executar os testes.
- **`Testes/config/jest.config.cjs`**: Arquivo de configuração do Jest.
- **`Testes/config/mongo-test-environment.js`**: Ambiente de teste personalizado que gerencia o ciclo de vida do banco de dados, limpando e populando os dados antes de cada execução.
- **`Testes/resultados/`**: Pasta onde os logs de cada execução de teste são salvos.

## 3. Configuração do Ambiente

Antes de executar os testes, certifique-se de que o ambiente está configurado corretamente.

1.  **Instalar Dependências**: Na pasta `src/codes/backend`, execute o comando abaixo para instalar todas as dependências do projeto, incluindo as de teste.
    ```bash
    npm install
    ```

## 4. Execução e Validação dos Testes

O processo de teste foi totalmente automatizado e simplificado. Para executar a suíte completa, basta um único comando.

### Comando Principal de Teste

1.  Abra um terminal na pasta `src/codes/backend`.
2.  Execute o comando:
    ```bash
    npm test
    ```

**O que este comando faz?**
1.  Inicia o servidor da API (`npm:start:backend`).
2.  Aguarda o servidor ficar pronto na porta 5000 (`wait-on tcp:5000`).
3.  Executa o Jest, que por sua vez utiliza o `mongo-test-environment.js` para limpar o banco de dados e criar dados de teste.
4.  Roda todas as suítes de teste contra o servidor.
5.  Encerra todos os processos de forma limpa ao final.

O resultado é exibido no console e, simultaneamente, um arquivo de log detalhado (`log_AAAA-MM-DD_HH-mm-ss.txt`) é salvo na pasta `Testes/resultados/`.

### Cenários de Teste Implementados

#### Módulo de Isolamento de Dados (Multi-Tenant)
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/3-security/6-multi-tenant.test.js`
- **Descrição:** Este é um dos testes mais críticos do sistema. Ele cria múltiplas empresas e valida rigorosamente que os dados de uma empresa não podem ser acessados, modificados ou listados por outra.
- **O que ele valida?**
    - **Criação de Dados Isolados**: Confirma que é possível criar transações para a `Empresa A` e para a `Empresa B` de forma independente.
    - **Bloqueio de Acesso Direto**: Prova que o `Usuário A` não consegue acessar uma transação específica do `Usuário B` (e vice-versa), recebendo um erro `404 Not Found`, como se o dado não existisse.
    - **Filtragem em Listagens**: Garante que, ao listar todas as transações, o `Usuário A` veja *apenas* as suas, e não as da `Empresa B`.

#### Módulo de Transações (CRUD)
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/2-features/3-transactions.test.js`
- **Descrição:** Valida o ciclo de vida completo (Criar, Ler, Atualizar, Excluir) de uma transação, garantindo que as operações básicas do dia a dia do usuário estão funcionando.
- **O que ele valida?**
    - **Criação (`POST /api/transactions`)**: Confirma que uma nova transação é criada com os dados corretos.
    - **Listagem (`GET /api/transactions`)**: Verifica se a transação recém-criada aparece na lista de transações do usuário.
    - **Leitura (`GET /api/transactions/:id`)**: Garante que uma transação específica pode ser recuperada pelo seu ID.
    - **Atualização (`PUT /api/transactions/:id`)**: Testa a modificação de uma transação existente e verifica se os dados foram alterados.
    - **Exclusão (`DELETE /api/transactions/:id`)**: Valida a remoção de uma transação e confirma que ela não é mais encontrada.
    - **Validação de Dados**: Assegura que a API retorna um erro `400 Bad Request` ao tentar criar uma transação com dados inválidos (ex: sem valor).

#### Módulo de Metas (CRUD)
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/2-features/5-goals.test.js`
- **Descrição:** Valida o ciclo de vida completo (Criar, Ler, Atualizar, Excluir) de uma meta financeira.
- **O que ele valida?**
    - **Criação (`POST /api/goals`)**: Confirma que uma nova meta é criada corretamente.
    - **Listagem (`GET /api/goals`)**: Verifica se a meta recém-criada aparece na lista de metas do usuário.
    - **Atualização (`PUT /api/goals/:id`)**: Testa a modificação de uma meta existente.
    - **Exclusão (`DELETE /api/goals/:id`)**: Valida a remoção de uma meta.

#### Módulo de Autenticação e Sessão
- **Status:** ✅ **Validado**
- **Arquivos de Teste:** `Testes/1-auth/1-session.test.js`, `Testes/1-auth/2-password.test.js`
- **Descrição:** Valida a lógica de persistência e invalidação de sessões (Refresh Tokens) e o fluxo de recuperação de senha.
- **O que ele valida?**
    - **Persistência de Sessão**: Confirma que um `SessionToken` é criado no banco de dados após o login, essencial para o mecanismo de "refresh token".
    - **Invalidação de Sessão**: Garante que o `SessionToken` é invalidado (marcado como inativo) no banco de dados após o logout, impedindo que o token seja reutilizado.
    - **Recuperação de Senha**: Valida todo o fluxo de "esqueci minha senha", desde a geração do token de reset até a redefinição da senha e o login bem-sucedido com a nova credencial.

#### Módulo de Relatórios
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/4-reports/7-reports.test.js`
- **Descrição:** Valida a capacidade do sistema de exportar dados.
- **O que ele valida?**
    - **Exportação de PDF (`GET /api/reports/export/pdf`)**: Confirma que o endpoint responde com o `Content-Type` correto (`application/pdf`) e que o corpo da resposta é um PDF válido, sem de fato salvar o arquivo em disco durante o teste.

#### Módulo de Clientes/Fornecedores
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/2-features/4-clients.test.js`
- **Descrição:** Valida o ciclo de vida de clientes e fornecedores.
- **O que ele valida?**
    - **Criação (`POST /api/clients`)**: Testa a criação de um novo registro de cliente.
    - **Listagem (`GET /api/clients`)**: Confirma que o cliente criado pode ser listado corretamente, validando o CRUD básico para esta funcionalidade.
---

## 5. Scripts de Apoio aos Testes

O ambiente de testes automatizados agora é autossuficiente e não requer scripts de apoio para sua execução. No entanto, para fins de teste manual ou exploração da API, o seguinte script pode ser útil.

### Criação de Empresas de Teste Fixo

- **Arquivo:** `Scripts/create-test-companies.js`
- **Objetivo:** Criar um conjunto de três empresas de teste com dados previsíveis (`Empresa Frontend`, `Empresa Backend`, `Empresa React`) para serem usadas em validações manuais do frontend e exploração da API.
- **Importante:** O ambiente de testes automatizados (`npm test`) **limpará** qualquer dado criado por este script. Use-o apenas em um ambiente de desenvolvimento (`npm run dev`).
- **Como Usar:**
  1. Certifique-se de que o servidor do backend esteja rodando (`npm run start:backend`).
  2. Em outro terminal, na pasta `src/codes/backend`, execute:
     ```bash
     node Scripts/create-test-companies.js
     ```
- **Resultado:** O script cria as empresas (se não existirem) e gera/atualiza o arquivo `Testes/Docs/dados-empresas-teste.md` com as credenciais completas para fácil consulta.
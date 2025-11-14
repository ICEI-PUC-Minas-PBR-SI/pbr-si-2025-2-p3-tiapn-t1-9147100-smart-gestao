# Roteiro de Testes Automatizados - Smart Gestão API

## 1. Introdução

Este documento detalha o processo de execução dos testes automatizados para a API (backend) do projeto Smart Gestão. O objetivo destes testes é garantir a qualidade, estabilidade e o correto funcionamento das regras de negócio a cada nova alteração no código, de forma totalmente automatizada.

Os testes são do tipo "integração", o que significa que eles validam o fluxo completo de uma requisição, desde a chamada da rota até a resposta final, interagindo com o banco de dados.

## 2. Arquivos e Ferramentas Utilizadas

> **Nota Importante:** A suíte de testes passou por uma refatoração completa para garantir estabilidade e eliminar redundâncias. Testes legados (como `api.test.js`, `auth.legacy.test.js`) foram removidos, pois suas validações foram incorporadas de forma mais robusta e segura nos testes atuais, que agora são executados em um ambiente limpo e isolado a cada execução.

A estrutura de testes está centralizada na pasta `src/codes/backend/Testes/` e utiliza as seguintes ferramentas:

- **Jest**: Plataforma de testes em JavaScript. É o orquestrador que executa os testes e verifica os resultados.
- **Axios**: Biblioteca para fazer requisições HTTP. É usada para simular um cliente (como o frontend) se comunicando com a API.
- **`concurrently` e `wait-on`**: Ferramentas que **orquestravam** a inicialização do servidor e a execução dos testes. **Foram substituídas por uma abordagem mais robusta e integrada ao Jest**, onde o próprio ambiente de teste gerencia o ciclo de vida do servidor.

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
1.  Executa o Jest, que por sua vez utiliza o ambiente de teste personalizado `mongo-test-environment.js`.
2.  Este ambiente orquestra todo o ciclo de vida do teste de forma automatizada:
    a. Inicia o servidor da API em-processo, garantindo que ele esteja pronto antes dos testes começarem.
    b. Limpa o banco de dados de teste e cria um conjunto de dados temporários (como a Empresa A e a Empresa B) para uso nos testes.
3.  Roda todas as suítes de teste (`*.test.js`) contra o servidor.
4.  Ao final de tudo, **remove apenas os dados que foram criados durante os testes**, mantendo os dados de desenvolvimento manual intactos, e encerra o servidor e a conexão com o banco de forma limpa.

O resultado é exibido no console e, simultaneamente, um arquivo de log detalhado (`log_AAAA-MM-DD_HH-mm-ss.txt`) é salvo na pasta `Testes/resultados/`.

### Cenários de Teste Implementados

#### Módulo de Isolamento de Dados (Multi-Tenant)
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/3-security/multi-tenant.test.js`
- **Descrição:** Este é um dos testes mais críticos do sistema. Ele cria múltiplas empresas e valida rigorosamente que os dados de uma empresa não podem ser acessados, modificados ou listados por outra.
- **O que ele valida?**
    - **Criação de Dados Isolados**: Confirma que é possível criar transações para a `Empresa A` e para a `Empresa B` de forma independente.
    - **Bloqueio de Acesso Direto**: Prova que o `Usuário A` não consegue acessar uma transação específica do `Usuário B` (e vice-versa), recebendo um erro `404 Not Found`, como se o dado não existisse.
    - **Filtragem em Listagens**: Garante que, ao listar todas as transações, o `Usuário A` veja *apenas* as suas, e não as da `Empresa B`.

#### Módulo de Transações (CRUD)
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/2-features/transactions.test.js`
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
- **Arquivo de Teste:** `Testes/2-features/goals.test.js`
- **Descrição:** Valida o ciclo de vida completo (Criar, Ler, Atualizar, Excluir) de uma meta financeira.
- **O que ele valida?**
    - **Criação (`POST /api/goals`)**: Confirma que uma nova meta é criada corretamente.
    - **Listagem (`GET /api/goals`)**: Verifica se a meta recém-criada aparece na lista de metas do usuário.
    - **Atualização (`PUT /api/goals/:id`)**: Testa a modificação de uma meta existente.
    - **Exclusão (`DELETE /api/goals/:id`)**: Valida a remoção de uma meta.

#### Módulo de Autenticação e Sessão
- **Status:** ✅ **Validado**
- **Arquivos de Teste:** `Testes/1-auth/session.test.js`, `Testes/1-auth/password.test.js`
- **Descrição:** Valida a lógica de persistência e invalidação de sessões (Refresh Tokens) e o fluxo de recuperação de senha.
- **O que ele valida?**
    - **Persistência de Sessão**: Confirma que um `SessionToken` é criado no banco de dados após o login, essencial para o mecanismo de "refresh token".
    - **Invalidação de Sessão**: Garante que o `SessionToken` é invalidado (marcado como inativo) no banco de dados após o logout, impedindo que o token seja reutilizado.
    - **Recuperação de Senha**: Valida todo o fluxo de "esqueci minha senha", desde a geração do token de reset até a redefinição da senha e o login bem-sucedido com a nova credencial.

#### Módulo de Relatórios
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/4-reports/reports.test.js`
- **Descrição:** Valida a capacidade do sistema de exportar dados.
- **O que ele valida?**
    - **Exportação de PDF**: Confirma que os endpoints de exportação (ex: `/api/reports/export/transactions-pdf`) respondem com o `Content-Type` correto (`application/pdf`) e que o corpo da resposta é um PDF válido, sem de fato salvar o arquivo em disco durante o teste.

#### Módulo de Clientes/Fornecedores
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/2-features/clients.test.js`
- **Descrição:** Valida o ciclo de vida de clientes e fornecedores.
- **O que ele valida?**
    - **Criação (`POST /api/clients`)**: Testa a criação de um novo registro de cliente.
    - **Listagem (`GET /api/clients`)**: Confirma que o cliente criado pode ser listado corretamente, validando o CRUD básico para esta funcionalidade.

#### Módulo de Upload de Anexos
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/2-features/uploads.test.js`
- **Descrição:** Valida a funcionalidade de upload de anexos para transações.
- **O que ele valida?**
    - **Upload de PDF e Imagens**: Confirma que a API aceita arquivos `.pdf`, `.png` e `.jpg`.
    - **Estrutura de Pastas**: Garante que os arquivos são salvos na estrutura de diretórios correta (`uploads/[companyId]/[img|pdf]/...`).
    - **Exclusão de Anexo**: Verifica se o anexo é removido do banco de dados e se o arquivo físico é deletado do servidor.

#### Módulo de Segurança de Dados (Persistência)
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/3-security/persistence.test.js`
- **Descrição:** Este teste "guardião" valida que a execução da suíte completa de testes (`npm test`) **não apaga** os dados criados manualmente para desenvolvimento (como as empresas "Frontend", "Backend" e "React").
- **O que ele valida?**
    - **Criação de Dados Manuais**: Garante que as empresas de teste manuais existam.
    - **Execução dos Testes**: Roda a suíte de testes completa.
    - **Verificação de Persistência**: Confirma que, após a limpeza seletiva dos testes, os dados manuais ainda estão no banco de dados.
---

## 5. Scripts de Apoio aos Testes

O ambiente de testes automatizados agora é autossuficiente. No entanto, para fins de teste manual ou exploração da API, o seguinte script é essencial.

### Criação de Empresas de Teste Fixo

- **Arquivo:** `Scripts/create-test-companies.js`
- **Objetivo:** Criar um conjunto de três empresas de teste com dados previsíveis (`Empresa Frontend`, `Empresa Backend`, `Empresa React`) para serem usadas em validações manuais do frontend e exploração da API.
- **Importante:** Graças à implementação da limpeza seletiva, o ambiente de testes automatizados (`npm test`) **NÃO apaga mais** os dados criados por este script. Você pode rodar os testes com segurança.
- **Como Usar:**
  1. Certifique-se de que o servidor do backend esteja rodando (`npm run start:backend`).
  2. Em outro terminal, na pasta `src/codes/backend`, execute:
     ```bash
     node Scripts/create-test-companies.js
     ```
- **Resultado:** O script cria as empresas (se não existirem) e gera/atualiza o arquivo `Testes/Docs/dados-empresas-teste.md` com as credenciais completas para fácil consulta.
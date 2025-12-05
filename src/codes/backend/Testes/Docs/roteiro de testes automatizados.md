# Roteiro de Testes Automatizados - Smart Gestão API

## 1. Visão Geral

Este documento detalha o processo de execução dos testes automatizados para a API (backend) do projeto Smart Gestão. O objetivo destes testes é garantir a qualidade, estabilidade e o correto funcionamento das regras de negócio a cada nova alteração no código, de forma totalmente automatizada.

Os testes são do tipo **integração**, o que significa que eles validam o fluxo completo de uma requisição, desde a chamada da rota até a resposta final, interagindo com o banco de dados.

> **Analogia:** Imagine testar um carro. Em vez de testar apenas o motor ou os freios isoladamente (o que seriam "testes unitários"), nós dirigimos o carro na rua para ver se tudo funciona em conjunto. É exatamente isso que nossos testes de integração fazem com a API.

## 2. Arquivos e Ferramentas Utilizadas

> **Nota Histórica:** A suíte de testes passou por uma refatoração completa para garantir estabilidade. Testes legados (como `api.test.js`) foram removidos, pois suas validações foram incorporadas de forma mais robusta nos testes atuais, que agora são executados em um ambiente limpo e isolado a cada execução.

A estrutura de testes está centralizada na pasta `src/codes/backend/Testes/` e utiliza as seguintes ferramentas:

- **Jest**: Plataforma de testes em JavaScript. É o orquestrador que executa os testes e verifica os resultados.
- **Axios**: Biblioteca para fazer requisições HTTP. É usada para simular um cliente (como o frontend) se comunicando com a API.
- **`concurrently` e `wait-on`**: Ferramentas que **orquestravam** a inicialização do servidor e a execução dos testes. **Foram substituídas por uma abordagem mais robusta e integrada ao Jest**, onde o próprio ambiente de teste gerencia o ciclo de vida do servidor.

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
1.  **Prepara o Ambiente (`globalSetup.js`):** Antes de qualquer teste, um script especial conecta ao banco de dados, limpa dados de testes anteriores, cria empresas e usuários temporários (Empresa A, Empresa B) e inicia o servidor da API.
    -   **Resiliência de Porta:** Se a porta padrão (5000) estiver em uso, o script tentará automaticamente iniciar o servidor em uma porta alternativa (ex: 5001), garantindo que os testes possam rodar sem conflitos.
2.  **Executa os Testes:** O Jest roda todas as suítes de teste (`*.test.js`) em sequência contra o servidor que está no ar.
3.  **Limpa o Ambiente (`globalTeardown.js`):** Ao final de tudo, outro script executa uma **limpeza seletiva**, removendo **apenas** os dados temporários que foram criados para os testes. Isso garante que os dados de desenvolvimento manual (criados com `npm run create-test-users`) permaneçam intactos. Em seguida, encerra o servidor e a conexão com o banco de forma limpa, prevenindo "open handles".

O resultado é exibido no console e, simultaneamente, um arquivo de log detalhado (`log_AAAA-MM-DD_HH-mm-ss.txt`) é salvo na pasta `Testes/resultados/`, com o caminho copiado para a área de transferência.

### Cenários de Teste Implementados

#### Módulo de Autenticação e Sessão
- **Status:** ✅ **Validado**
- **Arquivos de Teste:** `Testes/1-auth/auth.test.js`, `Testes/1-auth/password.test.js`
- **Descrição:** Valida a lógica de persistência e invalidação de sessões (Refresh Tokens) e o fluxo de recuperação de senha.
- **O que ele valida?**
    - **Persistência de Sessão**: Confirma que um `SessionToken` é criado no banco de dados após o login, essencial para o mecanismo de "refresh token".
    - **Invalidação de Sessão**: Garante que o `SessionToken` é invalidado (marcado como inativo) no banco de dados após o logout, impedindo que o token seja reutilizado.
    - **Recuperação de Senha**: Valida todo o fluxo de "esqueci minha senha", desde a geração do token de reset até a redefinição da senha e o login bem-sucedido com a nova credencial.
- **Por que é importante?** Assegura que o sistema de login é seguro, que o logout funciona como esperado e que um usuário que esqueceu sua senha consegue recuperar o acesso à sua conta.

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
- **Por que é importante?** Confirma que as operações mais básicas do dia a dia do usuário (adicionar, ver, editar e apagar uma despesa) funcionam sem falhas.

#### Módulo de Metas (CRUD)
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/2-features/goals.test.js`
- **Descrição:** Valida o ciclo de vida completo (Criar, Ler, Atualizar, Excluir) de uma meta financeira.
- **O que ele valida?**
    - **Criação (`POST /api/goals`)**: Confirma que uma nova meta é criada corretamente.
    - **Listagem (`GET /api/goals`)**: Verifica se a meta recém-criada aparece na lista de metas do usuário.
    - **Atualização (`PUT /api/goals/:id`)**: Testa a modificação de uma meta existente.
    - **Exclusão (`DELETE /api/goals/:id`)**: Valida a remoção de uma meta.
- **Por que é importante?** Garante que a funcionalidade de planejamento financeiro, essencial para o usuário, está operando corretamente.

#### Módulo de Clientes/Fornecedores
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/2-features/clients.test.js`
- **Descrição:** Valida o ciclo de vida de clientes e fornecedores.
- **O que ele valida?**
    - **Criação (`POST /api/clients`)**: Testa a criação de um novo registro de cliente.
    - **Listagem (`GET /api/clients`)**: Confirma que o cliente criado pode ser listado corretamente, validando o CRUD básico para esta funcionalidade.
- **Por que é importante?** Valida que o usuário pode gerenciar sua carteira de clientes e fornecedores, uma função de suporte essencial para o controle financeiro.

#### Módulo de Upload de Anexos
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/2-features/uploads.test.js`
- **Descrição:** Valida a funcionalidade de upload de anexos para transações.
- **O que ele valida?**
    - **Upload de PDF e Imagens**: Confirma que a API aceita arquivos `.pdf`, `.png` e `.jpg`.
    - **Estrutura de Pastas**: Garante que os arquivos são salvos na estrutura de diretórios correta (`uploads/[companyId]/[img|pdf]/...`).
    - **Exclusão de Anexo**: Verifica se o anexo é removido do banco de dados e se o arquivo físico é deletado do servidor.
- **Por que é importante?** Garante que o usuário pode anexar comprovantes e notas fiscais às suas transações, uma funcionalidade crucial para a organização e conformidade fiscal.

#### Módulo de Segurança de Dados (Persistência)
- **Status:** ✅ **
- **Descrição:** Este teste "guardião" valida que a execução da suíte completa de testes (`npm test`) **não apaga** os dados criados manualmente para o desenvolvimento do frontend.
- **O que ele valida?**
    - **Execução Fina**
    - **Execução Final:** É o último teste a ser executado na suíte, garantindo que ele rode após todas as outras operações, incluindo a limpeza de dados temporários.
    - **Verificação de Persistêncial:: Ele se conecta ao banco de dados e verifica se os usuários das empresas manuais (ex: `empresa-frontend@test.com`) ainda existem, provando que a limpeza seletiva do `globalTeardown` funcionou corretamente.** É o último teste a ser executado na suíte, garantindo que ele rode após todas as outras operações, incluindo a limpeza de dados temporários.
    - **Verificação de Persistência**: Ele se conecta ao banco de dados e verifica se os usuários das empresas manuais (ex: `empresa-frontend@test.com`) ainda existem, provando que a limpeza seletiva do `globalTeardown` funcionou corretamente.
- **Por que é importante?** Protege o ambiente de desenvolvimento, garantindo que os testes automatizados não destruam o trabalho manual dos desenvolvedores do frontend.

#### Módulo de Alertas de Metas
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/2-features/alerts.test.js`
- **Descrição:** Valida a funcionalidade de geração automática de alertas ao atingir uma meta de despesa.
- **O que ele valida?**
    - **Criação da Meta:** Cria uma meta de despesa para uma categoria específica.
    - **Registro de Transações:** Simula o registro de transações que, progressivamente, ultrapassam o valor da meta.
    - **Geração do Alerta:** Confirma que um alerta é criado no banco de dados no momento exato em que a meta é ultrapassada, e que alertas duplicados não são gerados.
- **Por que é importante?** Garante que a lógica de negócio para notificar os usuários sobre seus gastos está funcionando como esperado.

#### Módulo de Segurança de Dados (Multi-Tenant)
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/3-security/multi-tenant.test.js`
- **Descrição:** Este é um dos testes mais críticos do sistema. Ele cria múltiplas empresas e valida rigorosamente que os dados de uma empresa não podem ser acessados por outra.
- **O que ele valida?**
    - **Criação de Dados Isolados**: Confirma que é possível criar transações para a `Empresa A` e para a `Empresa B` de forma independente.
    - **Bloqueio de Acesso Direto**: Prova que o `Usuário A` não consegue acessar uma transação específica do `Usuário B` (e vice-versa), recebendo um erro `404 Not Found`, como se o dado não existisse.
    - **Filtragem em Listagens**: Garante que, ao listar todas as transações, o `Usuário A` veja *apenas* as suas, e não as da `Empresa B`.
- **Por que é importante?** Garante a privacidade e a segurança dos dados de cada cliente, como se cada um tivesse seu próprio cofre.

#### Módulo de Segurança de Dados (Persistência)
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/3-security/persistence.test.js`
- **Descrição:** Este teste "guardião" valida que a execução da suíte completa de testes (`npm test`) **não apaga** os dados criados manualmente para o desenvolvimento do frontend.
- **O que ele valida?**
    - **Execução Final:** É o último teste a ser executado na suíte, garantindo que ele rode após todas as outras operações, incluindo a limpeza de dados temporários.
    - **Verificação de Persistência**: Ele se conecta ao banco de dados e verifica se os usuários das empresas manuais (ex: `empresa-frontend@test.com`) ainda existem, provando que a limpeza seletiva do `globalTeardown` funcionou corretamente.
- **Por que é importante?** Protege o ambiente de desenvolvimento, garantindo que os testes automatizados não destruam o trabalho manual dos desenvolvedores do frontend.
---

## 5. Scripts de Apoio aos Testes

O ambiente de testes automatizados agora é autossuficiente. No entanto, para fins de teste manual ou exploração da API, o seguinte script é essencial.

### Criação de Empresas de Teste Fixo

- **Arquivo:** `Testes/populate-db.js`
- **Objetivo:** Criar um ambiente de desenvolvimento rico e consistente, populando o banco de dados com 3 empresas de teste (`Empresa FrontEnd`, `Empresa BackEnd`, `Empresa React`), cada uma com seu administrador, usuários comuns e dados de exemplo (transações, metas, etc.).
- **Importante:** Graças à implementação da limpeza seletiva, o ambiente de testes automatizados (`npm test`) **NÃO apaga mais** os dados criados por este script. Você pode rodar os testes com segurança.
- **Como Usar:**
  1. Certifique-se de que o servidor do backend esteja rodando (`npm run start:backend`).
  2. Em outro terminal, na pasta `src/codes/backend`, execute:
     ```bash
     npm run db:populate
     ```
- **Resultado:** O script cria ou valida as empresas e seus usuários, popula o banco com dados aleatórios e, ao final, gera/atualiza o arquivo `Testes/Docs/dados-empresas-teste.md` com as credenciais completas e tokens de acesso para fácil consulta.
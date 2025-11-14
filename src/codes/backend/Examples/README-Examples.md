# 📄 Exemplos de Dados (JSON)

Esta pasta contém arquivos JSON que servem como exemplos da estrutura de dados utilizada pela API do Smart Gestão. Como o formato JSON não suporta comentários, este documento explica a finalidade de cada arquivo.

Estes exemplos são úteis para:
-   Entender o formato esperado nos corpos (body) das requisições `POST` e `PUT`.
-   Servir como base para a criação de testes automatizados.
-   Auxiliar desenvolvedores do frontend a mockar dados durante o desenvolvimento.

---

### `users.json`

**Função:** Representa os dados de um **usuário** do sistema.
-   Contém informações de login (email, senha), o nome do usuário e a qual empresa (`companyId`) e permissão (`role`) ele está associado.
-   **Observação:** O campo `password` é enviado apenas no momento do cadastro. O sistema o converte para um `passwordHash` e nunca o armazena em texto plano.

### `companies.json` (Empresas)

**Função:** Representa os dados de uma **empresa** cliente do sistema.
-   Cada empresa funciona como um "inquilino" (tenant) isolado, com seus próprios usuários, transações, etc.
-   Contém informações cadastrais como nome, CNPJ, e o plano contratado (`plan`).

### `transactions.json`

**Função:** Representa uma **transação financeira** (receita ou despesa).
-   Este é um dos principais documentos do sistema. Ele registra o valor (`amount`), tipo (`type`), categoria, data e método de pagamento de cada operação.

### `clients.json` (Clientes/Fornecedores)

**Função:** Representa um **cliente** ou **fornecedor** associado a uma empresa.
-   O campo `type` define se o registro é um `"client"` (de quem a empresa recebe) ou `"supplier"` (para quem a empresa paga).

### `goals.json` (Metas)

**Função:** Representa uma **meta financeira** que a empresa deseja acompanhar.
-   Pode ser uma meta de receita (`revenue`), despesa (`expense`) ou economia (`saving`). Contém o valor alvo (`targetAmount`) e um prazo (`deadline`).

### `alerts.json` (Alertas)

**Função:** Representa um **alerta** gerado pelo sistema.
-   Alertas são criados automaticamente quando uma meta está próxima de ser atingida ou é ultrapassada, por exemplo.

### `logs.json` (Logs de Auditoria)

**Função:** Representa um registro de **auditoria**.
-   O sistema cria um log para cada ação importante (criação, atualização, exclusão) realizada por um usuário, registrando quem fez, o que fez e quando.

### `permissions.json` (Permissões)

**Função:** Representa um **nível de acesso** ou papel (role) dentro do sistema.
-   Define o que um usuário pode ou não fazer. Exemplos: `ROOT`, `ADMIN_COMPANY`, `USER_COMPANY`.
-   Estes registros são criados e gerenciados internamente pelo sistema.

### `sessionTokens.json` (Tokens de Sessão)

**Função:** Representa um **token de atualização** (refresh token) ativo para um usuário.
-   É usado para implementar um mecanismo de sessão mais seguro, permitindo a renovação de tokens de acesso sem exigir um novo login e possibilitando a invalidação de sessões no servidor (logout stateful).
-   **Observação:** Por segurança, o sistema armazena apenas o `hash` do token, e não o token em si.
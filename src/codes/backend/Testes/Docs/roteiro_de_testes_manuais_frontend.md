# Roteiro de Testes Manuais - Frontend

Este documento fornece um guia passo a passo para validar manualmente as funcionalidades do frontend, garantindo que a interface do usuário funcione corretamente e se integre bem com o backend.

---

### Empresas de Teste Pré-configuradas

Para garantir um ambiente estável e previsível para os testes manuais, utilize as empresas de teste fixas.

> **Importante:** Os testes automatizados (`npm test`) agora não apagam mais as empresas de teste manuais. No entanto, se você precisar recriar ou garantir que elas existam, certifique-se de que o backend esteja rodando (`npm start`) e, em outro terminal, na pasta `src/codes/backend`, execute o comando:
> ```bash
> npm run create-test-users
> ```

A execução deste comando gera/atualiza o arquivo `dados-empresas-teste.md` dentro desta mesma pasta (`Testes/Docs/`). **Consulte este arquivo para obter os dados completos de cada empresa**, incluindo:
- ID da Empresa (`companyId`)
- ID do Usuário (`userId`)
- Access Token
- E outras informações de cadastro.

- **Empresa Frontend:**
  - **E-mail:** `empresa-frontend@test.com`
  - **Senha:** `password123`
- **Empresa Backend:**
  - **E-mail:** `empresa-backend@test.com`
  - **Senha:** `password123`
- **Empresa React:**
  - **E-mail:** `empresa-react@test.com`
  - **Senha:** `password123`

---

## 1. Autenticação e Acesso

O objetivo é garantir que o fluxo de login, logout e proteção de rotas está funcionando.

- [ ] **Execução do Ambiente Completo:**
    - **Ação:** No terminal, a partir da pasta `backend`, execute `npm run start:full-demo` para iniciar todos os servidores.

- [ ] **Login com Sucesso:**
    - **Ação:** Acesse a página de login, insira as credenciais da **Empresa A** e clique em "Entrar".
    - **Resultado Esperado:** O usuário deve ser redirecionado para a página inicial (`startPage.html`) e seu nome deve aparecer no cabeçalho.

- [ ] **Falha de Login (Senha Incorreta):**
    - **Ação:** Tente fazer login com a **Empresa A**, mas com uma senha errada (ex: `errada`).
    - **Resultado Esperado:** Uma mensagem de erro "Credenciais inválidas" (ou similar) deve ser exibida. O usuário não deve ser redirecionado.

- [ ] **Proteção de Rota (Auth Guard):**
    - **Ação:** Certifique-se de que não está logado (limpe o cache do navegador se necessário). Tente acessar a URL `http://localhost:3000/startPage.html` diretamente.
    - **Resultado Esperado:** O sistema deve redirecionar você imediatamente para a página de login (`login.html`).

- [ ] **Logout:**
    - **Ação:** Faça login com qualquer empresa e, em seguida, clique no botão "Sair".
    - **Resultado Esperado:** A sessão deve ser encerrada e o usuário redirecionado para a página de login.

- [ ] **Login com Sucesso (Prova de Conceito React):**
    - **Ação:** Acesse a URL da aplicação React: `http://localhost:3001`. Insira as credenciais da **Empresa React** e clique em "Entrar".
    - **Resultado Esperado:** O usuário deve ser redirecionado para a página inicial do **sistema legado** (`http://localhost:3000/pages/startPage.html`) e a sessão deve estar ativa (nome do usuário no cabeçalho).

- [ ] **Recuperação de Senha:**
    - **Ação:** Na tela de login, clique em "Esqueci minha senha", insira um e-mail válido e siga o fluxo (em ambiente de teste, pode ser necessário simular o clique no link recebido).
    - **Resultado Esperado:** O usuário deve conseguir definir uma nova senha e, em seguida, fazer login com ela.

---

## 2. Teste de Isolamento de Dados (Multi-Tenant)

Este é o teste mais crítico para o frontend. Valida que a interface de um usuário não exibe dados de outro.

- [ ] **Cenário de Preparação (Empresa A):**
    1.  Faça login com a **Empresa Frontend**.
    2.  Navegue até "Transações" e crie uma transação de receita única e facilmente identificável, por exemplo: `Venda Consultoria Teste Manual`.
    3.  Navegue até "Metas" e crie uma meta única, por exemplo: `Meta Teste Manual`.
    4.  Faça logout.

- [ ] **Cenário de Validação (Empresa B):**
    1.  Faça login com a **Empresa Backend**.
    2.  Navegue até a página de "Transações".
    3.  **Resultado Esperado:** A lista de transações deve estar **vazia** ou conter apenas transações da **Empresa Backend**. A transação `Venda Consultoria Teste Manual` **NÃO** deve aparecer.
    4.  Navegue até a página de "Metas".
    5.  **Resultado Esperado:** A lista de metas deve estar **vazia** ou conter apenas metas da **Empresa Backend**. A meta `Meta Teste Manual` **NÃO** deve aparecer.

---

## 3. Módulo de Transações

Valida o ciclo completo de gerenciamento de transações.

- [ ] **Criar Transação:**
    - **Ação:** Crie uma receita de `R$ 1.000,00` e uma despesa de `R$ 250,00`.
    - **Resultado Esperado:** Os cards no dashboard devem ser atualizados para "Receitas: R$ 1.000,00", "Despesas: R$ 250,00" e "Saldo: R$ 750,00". Ambas as transações devem aparecer na lista.

- [ ] **Validação de Formulário (Criar Transação):**
    - **Ação:** Tente criar uma transação deixando o campo "Valor" ou "Descrição" em branco.
    - **Resultado Esperado:** O formulário deve exibir uma mensagem de erro (ex: "Este campo é obrigatório") e não deve permitir o envio da transação.

- [ ] **Editar Transação:**
    - **Ação:** Edite a despesa de `R$ 250,00` para `R$ 300,00`.
    - **Resultado Esperado:** O valor na lista deve ser atualizado. O card "Despesas" no dashboard deve mudar para `R$ 300,00` e o "Saldo" para `R$ 700,00`.

- [ ] **Excluir Transação:**
    - **Ação:** Exclua a transação de receita de `R$ 1.000,00`.
    - **Resultado Esperado:** A transação deve desaparecer da lista. Os cards do dashboard devem ser recalculados para "Receitas: R$ 0,00" e "Saldo: -R$ 300,00".

- [ ] **Filtrar Transações:**
    - **Ação:** Use os filtros de tipo ("Receita", "Despesa") e período.
    - **Resultado Esperado:** A lista de transações deve ser atualizada dinamicamente para mostrar apenas os resultados que correspondem aos filtros selecionados.

---

## 4. Módulo de Metas

- [ ] **Criar Meta:**
    - **Ação:** Crie uma nova meta com título "Economizar para férias".
    - **Resultado Esperado:** A meta deve aparecer na lista de metas.

- [ ] **Editar Meta:**
    - **Ação:** Edite o título da meta para "Economizar para férias de verão".
    - **Resultado Esperado:** O título na lista deve ser atualizado.

- [ ] **Excluir Meta:**
    - **Ação:** Exclua a meta criada.
    - **Resultado Esperado:** A meta deve ser removida da lista.

---

## 5. Módulo de Uploads

- [ ] **Anexar Arquivo a uma Transação:**
    - **Ação:** Em uma transação existente, clique no ícone de anexo, selecione um arquivo (PDF ou imagem) e confirme.
    - **Resultado Esperado:** A interface deve indicar que o anexo foi enviado com sucesso. Um ícone ou link para visualizar o anexo deve aparecer ao lado da transação.

- [ ] **Remover Anexo:**
    - **Ação:** Em uma transação que já possui um anexo, clique na opção para remover o anexo.
    - **Resultado Esperado:** O anexo deve ser removido e a interface atualizada para refletir que não há mais um anexo associado.

---

## 6. Módulo de Relatórios

- [ ] **Gerar e Exportar Relatórios via Menu:**
    - **Ação:** Com algumas transações cadastradas, vá para a página de relatórios.
    - **Resultado Esperado (Visualização):** Os gráficos e a tabela de resumo devem exibir totais que correspondam aos dados das transações cadastradas.
    - **Ação:** Clique no menu "Exportar Relatório" e selecione a opção "Relatório de Transações".
    - **Resultado Esperado (Exportação de Transações):** Um arquivo PDF (`relatorio-transacoes.pdf`) deve ser baixado, contendo a lista de transações.
    - **Ação:** No mesmo menu, selecione a opção "Lista de Clientes".
    - **Resultado Esperado (Exportação de Clientes):** Um arquivo PDF (`relatorio-clientes.pdf`) deve ser baixado, contendo a lista de clientes cadastrados.
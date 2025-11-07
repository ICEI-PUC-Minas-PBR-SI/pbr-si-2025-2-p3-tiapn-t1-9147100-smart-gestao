# Roteiro de Testes Manuais - Frontend

Este documento fornece um guia passo a passo para validar manualmente as funcionalidades do frontend, garantindo que a interface do usuário funcione corretamente e se integre bem com o backend.

---

### Empresas de Teste Pré-configuradas

Para agilizar os testes, utilize as credenciais das empresas criadas pelo ambiente de testes automatizados.

- **Empresa A:**
  - **E-mail:** `empresa-a@test.com`
  - **Senha:** `password123`
- **Empresa B:**
  - **E-mail:** `empresa-b@test.com`
  - **Senha:** `password123`

---

## 1. Autenticação e Acesso

O objetivo é garantir que o fluxo de login, logout e proteção de rotas está funcionando.

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

- [ ] **Recuperação de Senha:**
    - **Ação:** Na tela de login, clique em "Esqueci minha senha", insira um e-mail válido e siga o fluxo (em ambiente de teste, pode ser necessário simular o clique no link recebido).
    - **Resultado Esperado:** O usuário deve conseguir definir uma nova senha e, em seguida, fazer login com ela.

---

## 2. Teste de Isolamento de Dados (Multi-Tenant)

Este é o teste mais crítico para o frontend. Valida que a interface de um usuário não exibe dados de outro.

- [ ] **Cenário de Preparação (Empresa A):**
    1.  Faça login com a **Empresa A**.
    2.  Navegue até "Transações" e crie uma nova transação de receita: `Venda de Consultoria` | `R$ 500,00`.
    3.  Navegue até "Metas" e crie uma nova meta: `Comprar notebook novo`.
    4.  Faça logout.

- [ ] **Cenário de Validação (Empresa B):**
    1.  Faça login com a **Empresa B**.
    2.  Navegue até a página de "Transações".
    3.  **Resultado Esperado:** A lista de transações deve estar **vazia** ou conter apenas transações da Empresa B. A transação `Venda de Consultoria` **NÃO** deve aparecer.
    4.  Navegue até a página de "Metas".
    5.  **Resultado Esperado:** A lista de metas deve estar **vazia** ou conter apenas metas da Empresa B. A meta `Comprar notebook novo` **NÃO** deve aparecer.

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

## 5. Módulo de Relatórios

- [ ] **Gerar Relatório:**
    - **Ação:** Com algumas transações cadastradas, vá para a página de relatórios e gere um relatório para o período correspondente.
    - **Resultado Esperado:** Os gráficos e a tabela de resumo devem exibir totais que correspondam aos dados das transações cadastradas.
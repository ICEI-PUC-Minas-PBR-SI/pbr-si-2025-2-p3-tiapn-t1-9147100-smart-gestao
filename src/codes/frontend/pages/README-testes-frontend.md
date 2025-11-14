# Roteiro de Testes e Validação do Frontend

Este documento serve como um guia completo para a validação manual de todas as funcionalidades da interface do usuário (frontend). O objetivo é garantir que cada componente visual e cada interação do usuário funcionem conforme o esperado e se integrem corretamente com a API do backend.

---

## Preparação do Ambiente

Antes de iniciar, certifique-se de que:

1.  **O ambiente completo está rodando:** Na pasta `src/codes/backend`, execute `npm start` para iniciar todos os servidores.
2.  **Os usuários de teste existem:** Caso necessário, recrie os usuários de teste manuais executando `npm run create-test-users` em um novo terminal (na pasta do backend). Consulte o arquivo `dados-empresas-teste.md` para as credenciais.

---

## 1. Módulo de Autenticação e Acesso

- [ ] **Login com Sucesso:**
    - **Ação:** Acesse `http://localhost:3000`. Use as credenciais da "Empresa Frontend".
    - **Resultado Esperado:** Redirecionamento para a página inicial (`startPage.html`) com o nome do usuário visível no cabeçalho.

- [ ] **Login com Falha (Credenciais Inválidas):**
    - **Ação:** Tente fazer login com uma senha incorreta.
    - **Resultado Esperado:** Uma mensagem de erro "Credenciais inválidas" deve ser exibida na tela, sem redirecionamento.

- [ ] **Proteção de Rota (Acesso Direto):**
    - **Ação:** Faça logout. Tente acessar a URL `http://localhost:3000/pages/transactions.html` diretamente no navegador.
    - **Resultado Esperado:** Redirecionamento imediato para a página de login.

- [ ] **Logout:**
    - **Ação:** Após o login, clique no botão "Sair".
    - **Resultado Esperado:** Redirecionamento para a página de login. O acesso a páginas internas deve ser bloqueado.

- [ ] **Recuperação de Senha:**
    - **Ação:** Na tela de login, clique em "Esqueci minha senha", insira um e-mail válido e siga o fluxo.
    - **Resultado Esperado:** O usuário deve conseguir definir uma nova senha e fazer login com ela.

- [ ] **Interoperabilidade com React:**
    - **Ação:** Acesse `http://localhost:3001`. Faça login com as credenciais da "Empresa React".
    - **Resultado Esperado:** Redirecionamento para a página inicial do sistema legado (`startPage.html`) com a sessão já ativa.

---

## 2. Teste Crítico: Isolamento de Dados (Multi-Tenant)

- [ ] **Cenário de Preparação (Empresa A):**
    1.  Faça login com a **Empresa Frontend**.
    2.  Crie uma transação única, como `Receita Teste Isolamento`.
    3.  Faça logout.

- [ ] **Cenário de Validação (Empresa B):**
    1.  Faça login com a **Empresa Backend**.
    2.  Navegue até a lista de transações.
    3.  **Resultado Esperado:** A transação `Receita Teste Isolamento` **NÃO** deve estar visível.

---

## 3. Módulo de Transações (CRUD)

- [ ] **Criar Transação:**
    - **Ação:** Crie uma receita de `R$ 1.500,00` e uma despesa de `R$ 500,00`.
    - **Resultado Esperado:** As transações devem aparecer na lista. O dashboard deve atualizar os saldos corretamente.

- [ ] **Validação de Formulário:**
    - **Ação:** Tente criar uma transação sem preencher o valor ou a descrição.
    - **Resultado Esperado:** Mensagens de erro devem aparecer nos campos obrigatórios, e a transação não deve ser criada.

- [ ] **Editar Transação:**
    - **Ação:** Edite a despesa de `R$ 500,00` para `R$ 600,00`.
    - **Resultado Esperado:** O valor deve ser atualizado na lista e o saldo do dashboard deve ser recalculado.

- [ ] **Excluir Transação:**
    - **Ação:** Exclua a receita de `R$ 1.500,00`.
    - **Resultado Esperado:** A transação deve sumir da lista e o saldo do dashboard deve ser recalculado.

---

## 4. Módulo de Anexos (Upload)

- [ ] **Fazer Upload de Anexo:**
    - **Ação:** Em uma transação existente, use a função de upload para anexar um arquivo PDF e, em outra, um arquivo de imagem (PNG/JPG).
    - **Resultado Esperado:** A interface deve indicar que o anexo foi enviado com sucesso (ex: exibindo um ícone de clipe ou o nome do arquivo).

- [ ] **Validação de Tipo de Arquivo (Opcional/Avançado):**
    - **Ação:** Tente fazer o upload de um arquivo não permitido (ex: `.txt` ou `.zip`).
    - **Resultado Esperado:** O sistema deve exibir uma mensagem de erro "Tipo de arquivo inválido" e rejeitar o upload.

- [ ] **Excluir Anexo:**
    - **Ação:** Em uma transação que possui um anexo, use a função para removê-lo.
    - **Resultado Esperado:** A indicação do anexo na interface deve desaparecer.

---

## 5. Módulo de Metas (CRUD)

- [ ] **Criar Meta:**
    - **Ação:** Crie uma nova meta financeira (ex: "Economizar para equipamento").
    - **Resultado Esperado:** A meta deve aparecer na lista.

- [ ] **Editar Meta:**
    - **Ação:** Edite o título ou o valor da meta criada.
    - **Resultado Esperado:** As informações devem ser atualizadas na lista.

- [ ] **Excluir Meta:**
    - **Ação:** Exclua a meta.
    - **Resultado Esperado:** A meta deve ser removida da lista.

---

## 6. Módulo de Relatórios

- [ ] **Exportar Relatório de Transações:**
    - **Ação:** Com algumas transações cadastradas, vá para a página de relatórios e clique em "Exportar Relatório de Transações".
    - **Resultado Esperado:** Um arquivo PDF chamado `relatorio-transacoes.pdf` (ou similar) deve ser baixado pelo navegador.

- [ ] **Exportar Relatório de Clientes:**
    - **Ação:** Com alguns clientes cadastrados, clique em "Exportar Lista de Clientes".
    - **Resultado Esperado:** Um arquivo PDF com a lista de clientes deve ser baixado.

- [ ] **Exportar Fatura (Invoice):**
    - **Ação:** Em uma transação específica, encontre e clique na opção "Gerar Fatura".
    - **Resultado Esperado:** Um arquivo PDF da fatura correspondente àquela transação deve ser baixado.
# 📄 Guia de Integração Frontend-Backend (Exemplos Práticos)

Este documento é um guia técnico que detalha como o frontend (construído com HTML, CSS e JavaScript puro) se comunica com a API RESTful do backend para criar uma aplicação funcional.

## 1. Arquitetura de Comunicação

A comunicação é baseada em uma arquitetura cliente-servidor desacoplada:

-   **Frontend (Cliente):** Responsável pela interface do usuário. Não possui lógica de negócio ou acesso direto ao banco de dados.
-   **Backend (Servidor):** Expõe uma API RESTful que o frontend consome para buscar, criar, atualizar e deletar dados.

Toda a comunicação acontece através de requisições HTTP (usando a `Fetch API` do JavaScript) para os endpoints do backend (ex: `http://localhost:5000/api/transactions`).

## 2. Fluxo de Autenticação e Gerenciamento de Sessão

A segurança e o acesso aos dados são controlados por JSON Web Tokens (JWT).

### a. Login

1.  **Ação:** O usuário preenche o e-mail e a senha em `login.html` e clica em "Entrar".
2.  **Frontend (`login.js`):** Envia uma requisição `POST` para `/api/auth/login` com as credenciais.
3.  **Backend:** Valida as credenciais. Se corretas, gera um `token` (access token, de curta duração) e um `refreshToken` (longa duração) e os retorna.
4.  **Frontend:** Recebe os tokens e os salva no `localStorage` do navegador. O `localStorage` é um armazenamento persistente que mantém os dados mesmo após fechar o navegador.
    ```javascript
    // Exemplo de código em /js/pages/login.js
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user)); // Salva dados do usuário para exibição na UI
    ```
5.  **Redirecionamento:** O usuário é redirecionado para a `startPage.html`.

### b. Acesso a Dados Protegidos

Uma vez logado, toda requisição para buscar ou modificar dados em rotas protegidas precisa ser autenticada.
**Contexto:** `transacoes.html` e `js/pages/transactions.js`.

1.  **Frontend (`transactions.js`):** Pega o token salvo: `const token = localStorage.getItem('token');`
2.  **Frontend (`transactions.js`):** Monta a requisição `fetch`, adicionando o token ao cabeçalho `Authorization`. **Este é o passo mais importante.**
    ```javascript
    // Exemplo de busca de transações em js/pages/transactions.js
    const response = await fetch('/api/transactions', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Token é enviado aqui!
        }
    });
    const transactions = await response.json();
    ```
3.  **Backend:** O middleware `authMiddleware.js` no servidor intercepta a requisição, valida o token e extrai o `companyId` do usuário. A busca no banco de dados é então filtrada por este `companyId`, garantindo o isolamento dos dados.

### c. Logout

1.  **Ação:** O usuário clica em "Sair".
2.  **Frontend (Logout Simples):** O método principal é limpar o `localStorage` para remover os dados da sessão do navegador.
    ```javascript
    // Exemplo de código em um script de logout
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
    ```
3.  **Frontend (Logout Seguro - Stateful):** Para maior segurança, o frontend também notifica o backend para invalidar a sessão no servidor.
    ```javascript
    // Pega o refreshToken antes de limpar o localStorage
    const refreshToken = localStorage.getItem('refreshToken');

    // Limpa o localStorage
    localStorage.clear();

    // Notifica o backend para invalidar a sessão (opcional, mas recomendado)
    await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
    });

    // Redireciona para o login
    window.location.href = 'login.html';
    ```

### d. Renovação Automática de Sessão (Refresh Token)

**Objetivo:** Manter o usuário logado de forma transparente, mesmo após a expiração do token de acesso, melhorando a experiência do usuário sem comprometer a segurança.

*   **Scripts Principais:** Um interceptador de requisições (em uma implementação mais avançada com `axios`) ou uma função wrapper para `fetch`.
*   **Como Funciona:**
    1.  **Token Expirado:** O frontend faz uma requisição normal para a API (ex: `GET /api/transactions`) usando um `token` de acesso que já expirou.
    2.  **Resposta do Backend:** O backend detecta que o token está expirado e retorna um erro `401 Unauthorized`.
    3.  **Ação do Frontend (O Interceptador):**
        a.  O script do frontend intercepta essa resposta `401`.
        b.  Ele pega o `refreshToken` que está salvo no `localStorage`.
        c.  Faz uma requisição `POST` para o endpoint `/api/auth/refresh-token` enviando o `refreshToken`.
    4.  **Resposta do Backend (Refresh):** Se o `refreshToken` for válido, o backend gera um **novo** `token` de acesso e o retorna.
    5.  **Ação Final do Frontend:**
        a.  O script salva o novo `token` no `localStorage`, substituindo o antigo.
        b.  Ele **refaz automaticamente a requisição original** (`GET /api/transactions`), desta vez com o novo token.
        c.  A página carrega os dados normalmente, e o usuário nem percebe que a sessão foi renovada.

*   **Validação:** Este é um fluxo mais complexo de testar manualmente, mas pode ser observado nas Ferramentas de Desenvolvedor (aba "Network"), onde se veria uma falha 401 seguida por uma chamada para `/refresh-token` e, então, o sucesso da requisição original.

## 3. Guia de Integração por Funcionalidade

Esta seção serve como um guia rápido para consumir os principais endpoints da API.

---

### a. Transações (CRUD)
**Contexto:** `transacoes.html` e `js/pages/transactions.js`.

-   **Listar todas as transações:** `GET /api/transactions`
-   **Criar uma nova transação:** `POST /api/transactions`
    -   **Body**: `{ "description": "Venda de Consultoria", "amount": 1500, "type": "revenue", "date": "2025-11-13T12:00:00.000Z" }`
-   **Atualizar uma transação:** `PUT /api/transactions/{id}`
    -   **Body**: `{ "status": "completed" }`
-   **Excluir uma transação:** `DELETE /api/transactions/{id}`

---

### b. Anexos de Transações
**Contexto:** `transacoes.html` (em um modal de detalhes da transação).

-   **Fazer Upload de um anexo (PDF ou Imagem):** `POST /api/transactions/{id}/upload`
    -   **Body**: Requer um objeto `FormData` contendo o arquivo.
    -   **Exemplo de implementação no Frontend:**
        ```javascript
        // Em um script que manipula o formulário de upload
        const fileInput = document.querySelector('#meu-input-de-arquivo');
        const transactionId = 'ID_DA_TRANSACAO';
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('attachment', fileInput.files); // 'attachment' é o nome do campo esperado pelo backend

        fetch(`/api/transactions/${transactionId}/upload`, {
          method: 'POST',
          headers: { 
            // NÃO defina 'Content-Type', o navegador fará isso automaticamente para FormData
            'Authorization': `Bearer ${token}` 
          },
          body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Upload bem-sucedido:', data.message);
            // Aqui você pode atualizar a UI para mostrar o link do anexo
        })
        .catch(error => console.error('Erro no upload:', error));
        ```
-   **Excluir um anexo:** `DELETE /api/transactions/{id}/upload`

---

### c. Metas (CRUD)
**Contexto:** `metas.html` e `js/pages/goals.js`.

-   **Listar todas as metas:** `GET /api/goals`
-   **Criar uma nova meta:** `POST /api/goals`
    -   **Body**: `{ "title": "Economizar para Férias", "targetAmount": 5000, "type": "saving" }`
-   **Atualizar uma meta:** `PUT /api/goals/{id}`
-   **Excluir uma meta:** `DELETE /api/goals/{id}`

---

### d. Clientes (CRUD)
**Contexto:** `clients.html` (página a ser criada) e `js/pages/clients.js`.

-   **Listar todos os clientes:** `GET /api/clients`
-   **Criar um novo cliente:** `POST /api/clients`
    -   **Body**: `{ "name": "Cliente Exemplo", "email": "cliente@exemplo.com", "type": "client" }`

---

### e. Geração de Relatórios
**Contexto:** `relatorios.html` e `js/pages/reports.js`.

-   **Exportar Relatório de Transações em PDF:** `GET /api/reports/export/transactions-pdf`
    -   **Explicação:** Este endpoint retorna um arquivo PDF diretamente. O frontend precisa tratar a resposta como um `blob` para iniciar o download.
    -   **Exemplo de implementação no Frontend:**
        ```javascript
        // Em um script na página de relatórios
        const token = localStorage.getItem('token');

        fetch('/api/reports/export/transactions-pdf', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => response.blob()) // Converte a resposta para um blob
        .then(blob => {
            const url = window.URL.createObjectURL(blob); // Cria uma URL temporária para o arquivo
            const a = document.createElement('a'); // Cria um link temporário
            a.href = url;
            a.download = 'relatorio-transacoes.pdf'; // Define o nome do arquivo
            document.body.appendChild(a);
            a.click(); // Simula o clique para iniciar o download
            a.remove(); // Remove o link da página
            window.URL.revokeObjectURL(url); // Libera a memória
        })
        .catch(error => console.error('Erro ao gerar relatório:', error));
        ```

---

### f. Recuperação de Senha
**Contexto:** `forgot-password.html` e `reset-password.html`.

Este é um fluxo de duas etapas.

1.  **Solicitar a Redefinição:**
    -   **Endpoint:** `POST /api/auth/forgot-password`
    -   **Body:** `{ "email": "email.do.usuario@exemplo.com" }`
    -   **Ação do Frontend (`forgot-password.html`):** Após o usuário inserir o e-mail e clicar em "Enviar", o frontend faz essa chamada. Se bem-sucedida, deve exibir uma mensagem como "Verifique seu e-mail para as instruções de redefinição."

2.  **Redefinir a Senha:**
    -   **Endpoint:** `POST /api/auth/reset-password/:token`
    -   **Ação do Frontend (`reset-password.html`):** O usuário clica no link recebido por e-mail, que o leva para esta página com o token na URL (`?token=...`). O frontend deve:
        1.  Extrair o `token` da URL.
        2.  Permitir que o usuário digite e confirme a nova senha.
        3.  Enviar a nova senha para o endpoint, usando o token na URL.
    -   **Body:** `{ "password": "novaSenhaForte" }`
    -   **Exemplo de implementação na página de reset:**
        ```javascript
        // Em um script para a página reset-password.html
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const novaSenha = document.querySelector('#nova-senha').value;

        fetch(`/api/auth/reset-password/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: novaSenha })
        })
        .then(res => {
            if (res.ok) {
                alert('Senha redefinida com sucesso! Você será redirecionado para o login.');
                window.location.href = 'login.html';
            } else {
                alert('Token inválido ou expirado. Por favor, solicite a redefinição novamente.');
            }
        });
        ```

---

### g. Notificações Push
**Contexto:** `perfil.html` (em uma seção de configurações).

-   **Inscrever um navegador para receber notificações:** `POST /api/notifications/subscribe`
    -   **Body**: O objeto `PushSubscription` gerado pelo navegador. O frontend deve obter este objeto (após o usuário permitir notificações) e enviá-lo para este endpoint.
    -   **Exemplo de implementação no Frontend:**
        ```javascript
        // Esta função pode ser chamada quando o usuário ativa um toggle de notificações
        async function subscribeUser() {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: 'SUA_VAPID_PUBLIC_KEY_DO_BACKEND'
            });

            // Envia o objeto 'subscription' para o backend
            await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(subscription)
            });
        }
        ```
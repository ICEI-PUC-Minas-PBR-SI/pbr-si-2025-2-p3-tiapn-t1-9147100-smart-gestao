# 📄 Guia de Integração Frontend-Backend

Este documento é um guia técnico que detalha como o frontend (construído com HTML, CSS e JavaScript puro) se comunica com a API do backend para criar uma aplicação funcional.

## 1. Arquitetura de Comunicação

A comunicação é baseada em uma arquitetura cliente-servidor desacoplada:

-   **Frontend (Cliente):** Responsável pela interface do usuário. Não possui lógica de negócio ou acesso direto ao banco de dados.
-   **Backend (Servidor):** Expõe uma API RESTful que o frontend consome para buscar, criar, atualizar e deletar dados.

Toda a comunicação acontece através de requisições HTTP (usando a `Fetch API` do JavaScript) para os endpoints do backend (ex: `http://localhost:5000/api/transactions`).

## 2. O Ciclo de Vida da Autenticação

A segurança e o acesso a dados são controlados por JSON Web Tokens (JWT).

### a. Login

1.  **Ação:** O usuário preenche o e-mail e a senha em `login.html` e clica em "Entrar".
2.  **Frontend (`login.js`):** Envia uma requisição `POST` para `/api/auth/login`.
3.  **Backend:** Valida as credenciais. Se corretas, gera um `token` (curta duração) e um `refreshToken` (longa duração).
4.  **Frontend:** Recebe os tokens e os salva no `localStorage` do navegador. O `localStorage` é um armazenamento persistente que mantém os dados mesmo após fechar o navegador.
    ```javascript
    // Exemplo em login.js
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user)); // Salva dados do usuário para exibição
    ```
5.  **Redirecionamento:** O usuário é redirecionado para a `startPage.html`.

### b. Proteção de Páginas (`authGuard.js`)

1.  **Ação:** O usuário tenta acessar uma página protegida, como `transactions.html`.
2.  **Frontend (`authGuard.js`):** Este script é executado **antes** de a página carregar.
3.  **Verificação:** Ele checa se `localStorage.getItem('token')` existe.
4.  **Decisão:**
    -   **Se não há token:** Redireciona o usuário imediatamente para `login.html`. A página protegida nunca é exibida.
    -   **Se há token:** Permite que a página continue carregando.

## 3. Acessando Dados Protegidos

Uma vez logado, toda requisição para buscar ou modificar dados precisa ser autenticada.

1.  **Ação:** A página `transactions.html` carrega e precisa exibir a lista de transações.
2.  **Frontend (`transactions.js`):**
    a.  Pega o token salvo: `const token = localStorage.getItem('token');`
    b.  Monta a requisição `fetch`, adicionando o token ao cabeçalho `Authorization`. Este é o passo mais importante.
        ```javascript
        // Exemplo de busca de transações
        async function fetchTransactions() {
            const token = localStorage.getItem('token');
            
            try {
                const response = await fetch('/api/transactions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Token é enviado aqui!
                    }
                });

                if (!response.ok) {
                    // Se o token expirou (401), o authGuard redirecionará na próxima página
                    if (response.status === 401) {
                        window.location.href = 'login.html';
                    }
                    throw new Error('Falha ao buscar dados.');
                }

                const transactions = await response.json();
                renderTransactions(transactions); // Função que exibe os dados na tela

            } catch (error) {
                console.error('Erro:', error);
            }
        }
        ```
    c.  **Backend:** O middleware `authMiddleware.js` no servidor intercepta a requisição, valida o token e extrai o `companyId` do usuário. A busca no banco de dados é então filtrada por este `companyId`, garantindo o isolamento dos dados.

## 4. Renderização Dinâmica de Dados

O frontend não possui dados "hardcoded". Ele atua como um template que é preenchido com os dados vindos da API.

1.  **Recebimento:** O script (ex: `transactions.js`) recebe um array de objetos JSON da API.
2.  **Iteração:** Ele percorre cada item do array.
3.  **Criação de HTML:** Para cada item, ele cria dinamicamente os elementos HTML (ex: uma linha de tabela `<tr>` com suas células `<td>`).
    ```javascript
    // Exemplo em transactions.js
    function renderTransactions(transactions) {
        const tbody = document.querySelector('#transactions-table tbody');
        tbody.innerHTML = ''; // Limpa a tabela antes de preencher

        transactions.forEach(tx => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tx.description}</td>
                <td>${new Date(tx.date).toLocaleDateString()}</td>
                <td class="${tx.type === 'revenue' ? 'text-success' : 'text-danger'}">
                    ${tx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editTransaction('${tx._id}')">Editar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    ```

## 5. Logout

1.  **Ação:** O usuário clica em "Sair".
2.  **Frontend:** O script de logout simplesmente remove os tokens e os dados do usuário do `localStorage`.
    ```javascript
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    ```
3.  **Redirecionamento:** O usuário é enviado de volta para `login.html`. A sessão no servidor continua "viva" até o token expirar, mas como o frontend não tem mais o token, o acesso é efetivamente bloqueado pelo `authGuard.js`.
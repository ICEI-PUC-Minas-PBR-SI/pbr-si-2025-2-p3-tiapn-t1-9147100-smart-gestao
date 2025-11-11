# Fluxo de Funcionamento do Frontend para Validação

Este documento detalha a lógica e o comportamento esperado dos scripts do frontend (`.js`) durante os principais fluxos de interação do usuário. Ele serve como um guia técnico para desenvolvedores e testadores entenderem *como* a interface deve funcionar.

---

## Fluxo 1: Proteção de Rota (O Guardião da Aplicação)

**Objetivo:** Impedir que usuários não autenticados acessem páginas internas do sistema.

*   **Script Principal:** `authGuard.js`
*   **Como Funciona:**
    1.  Este script é incluído no `<head>` de todas as páginas protegidas (ex: `startPage.html`, `transactions.html`).
    2.  Ele é executado **antes** do resto da página ser renderizada.
    3.  Ele verifica se existe um item `token` no `localStorage` do navegador.
    4.  **Se o token não existir**, o script imediatamente executa `window.location.href = 'login.html'`, redirecionando o usuário para a página de login antes que qualquer conteúdo da página protegida seja exibido.

*   **Validação:** A tentativa de acesso direto a uma URL interna sem login deve resultar em um redirecionamento instantâneo para a tela de login.

---

## Fluxo 2: Cadastro de Novo Usuário

**Objetivo:** Validar os dados no cliente e fornecer feedback claro durante o processo de registro.

*   **Script Principal:** `cadastro.js`
*   **Como Funciona:**
    1.  **Validação no Cliente:** Ao clicar em "Criar Conta", o script primeiro realiza validações locais (campos vazios, formato de e-mail, senhas coincidem). Isso evita requisições desnecessárias à API.
    2.  **Feedback Visual:** Se as validações locais passarem, o script deve fornecer um feedback visual ao usuário, como desabilitar o botão e mudar seu texto para "Cadastrando...".
    3.  **Requisição à API:** Envia uma requisição `POST` para `/api/auth/register`.
    4.  **Tratamento da Resposta:**
        *   **Sucesso (201):** Exibe uma mensagem de sucesso (ex: "Cadastro realizado!") e redireciona para `login.html`.
        *   **Erro (409 Conflict):** Exibe uma mensagem específica, como "E-mail ou CNPJ já cadastrado."
        *   **Outros Erros (500):** Exibe uma mensagem genérica de erro.
    5.  Em caso de erro, o botão de cadastro deve ser reabilitado para que o usuário possa tentar novamente.

---

## Fluxo 3: Login e Gerenciamento de Sessão

**Objetivo:** Autenticar o usuário e gerenciar o estado da sessão no navegador.

*   **Script Principal:** `login.js`
*   **Como Funciona:**
    1.  **Requisição à API:** Ao clicar em "Entrar", envia uma requisição `POST` para `/api/auth/login` com o e-mail e a senha.
    2.  **Tratamento da Resposta:**
        *   **Sucesso (200):** A API retorna um objeto contendo `token`, `refreshToken` e `user`. O script `login.js` deve:
            1.  Salvar o `token` no `localStorage`.
            2.  Salvar o `refreshToken` no `localStorage`.
            3.  Salvar o objeto `user` (contendo nome, e-mail, etc.) no `localStorage`.
            4.  Redirecionar para `startPage.html`.
        *   **Erro (401 Unauthorized):** Exibe uma mensagem de erro "Credenciais inválidas." na tela.

*   **Validação:** Após o login, verifique o `localStorage` do navegador (usando as Ferramentas de Desenvolvedor) para confirmar que os itens `token`, `refreshToken` e `user` foram salvos corretamente.

---

## Fluxo 4: Exibição de Dados em Páginas Protegidas

**Objetivo:** Buscar e renderizar dados específicos do usuário autenticado.

*   **Scripts Principais:** `transactions.js`, `metas.js`, etc.
*   **Como Funciona:**
    1.  **Busca do Token:** Quando a página carrega (ex: `transactions.html`), o script `transactions.js` primeiro lê o `token` do `localStorage`.
    2.  **Requisição à API com Autorização:** O script faz uma requisição `GET` para o endpoint correspondente (ex: `/api/transactions`). Crucialmente, ele adiciona o cabeçalho de autorização à requisição:
        ```javascript
        headers: {
          'Authorization': `Bearer ${token}`
        }
        ```
    3.  **Renderização dos Dados:** Ao receber a lista de dados (transações, metas, etc.) do backend, o script percorre a lista e gera dinamicamente o HTML (linhas de tabela, cards, etc.) para exibir os dados na página.
    4.  **Feedback de Carregamento:** Idealmente, o script deve exibir um indicador de "Carregando..." enquanto a requisição à API está em andamento e escondê-lo quando os dados forem renderizados ou se ocorrer um erro.

*   **Validação:** A chave aqui é que o backend, ao receber o token, filtra os dados. O frontend apenas renderiza o que recebe. O teste manual de isolamento de dados valida este fluxo de ponta a ponta.

---

## Fluxo 5: Logout

**Objetivo:** Encerrar a sessão do usuário no lado do cliente.

*   **Script Principal:** Um script global ou parte de um `layout.js`.
*   **Como Funciona:**
    1.  **Ação do Usuário:** O usuário clica no botão "Sair".
    2.  **Limpeza do `localStorage`:** O script remove os seguintes itens do `localStorage`:
        *   `localStorage.removeItem('token');`
        *   `localStorage.removeItem('refreshToken');`
        *   `localStorage.removeItem('user');`
    3.  **Redirecionamento:** Após limpar o armazenamento, o script redireciona o usuário para `login.html`.

*   **Validação:** Após o logout, qualquer tentativa de usar o botão "Voltar" do navegador para acessar uma página interna deve ser bloqueada pelo `authGuard.js`.

---

## Fluxo 6: Renovação Automática de Sessão (Refresh Token)

**Objetivo:** Manter o usuário logado de forma transparente, mesmo após a expiração do token de acesso principal, melhorando a experiência do usuário sem comprometer a segurança.

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
*   **Validação:** Após o logout, qualquer tentativa de usar o botão "Voltar" do navegador para acessar uma página interna deve ser bloqueada pelo `authGuard.js`.

---

## Fluxo 7: Interoperabilidade com a Prova de Conceito (React)

**Objetivo:** Validar que a sessão iniciada por uma aplicação externa (React) é reconhecida e mantida pelo sistema legado.

*   **Scripts Principais:** `authGuard.js`
*   **Como Funciona:**
    1.  **Login no React:** O usuário faz login na aplicação React (`http://localhost:3001`).
    2.  **Armazenamento do Token:** A aplicação React, após receber a confirmação do backend, salva o `token` de autenticação no `localStorage` do navegador.
    3.  **Armazenamento do Usuário:** Para garantir a compatibilidade, o React também salva o objeto `user` no `localStorage`.
    3.  **Redirecionamento:** O React redireciona o usuário para uma página protegida do sistema legado (ex: `startPage.html`).
    4.  **Validação pelo Guardião:** O script `authGuard.js` da página legada é executado. Ele encontra o `token` e o `user` no `localStorage`, considera a sessão válida e permite que a página seja carregada normalmente.

*   **Validação:** Este fluxo demonstra que a autenticação é desacoplada da interface, permitindo uma migração gradual ou a coexistência de diferentes tecnologias de frontend consumindo a mesma API.
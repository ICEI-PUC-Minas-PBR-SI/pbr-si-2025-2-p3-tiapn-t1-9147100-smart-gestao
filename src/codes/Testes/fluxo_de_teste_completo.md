# Fluxo de Funcionamento Completo para Validação de Testes

Este documento descreve o passo a passo do funcionamento do sistema, detalhando as ações que acontecem no **Frontend** (o que o usuário vê e o que o código do navegador faz) e no **Backend** (o que o servidor faz). Use este guia para validar se cada etapa dos seus testes está se comportando como esperado.

---

## Fluxo 1: Cadastro de Novo Usuário e Empresa

Este é o ponto de partida para qualquer novo usuário. O objetivo é criar um usuário e uma empresa associada a ele.

#### **Etapa 1: Preenchimento do Formulário de Cadastro**

*   **Ação do Usuário (Frontend):**
    *   Acessa a página `cadastro.html`.
    *   Preenche os campos: Nome, E-mail, Senha, Confirmar Senha, Nome da Empresa e CNPJ.

*   **O que o Frontend Faz (`cadastro.js`):**
    *   Enquanto o usuário digita, nenhuma ação de API é chamada.
    *   Ao clicar em "Criar Conta", o script primeiro executa validações no navegador:
        *   Verifica se todos os campos obrigatórios foram preenchidos.
        *   Valida se o e-mail tem um formato válido.
        *   Confere se a senha tem o mínimo de caracteres exigido.
        *   Verifica se os campos "Senha" e "Confirmar Senha" são idênticos.
    *   Se alguma validação falhar, exibe uma mensagem de erro na tela e interrompe o processo.

#### **Etapa 2: Envio dos Dados para o Backend**

*   **Ação do Usuário (Frontend):**
    *   Clica no botão "Criar Conta" após preencher tudo corretamente.

*   **O que o Frontend Faz (`cadastro.js`):**
    *   Exibe um feedback visual (ex: o botão muda para "Cadastrando..." e fica desabilitado).
    *   Monta um objeto JSON com os dados do formulário.
    *   Envia uma requisição `POST` para o endpoint da API: `http://localhost:5000/api/auth/register`.

*   **O que o Backend Faz (`authController.js`):**
    *   Recebe a requisição no endpoint de registro.
    *   Realiza uma validação de segurança: verifica no banco de dados se o e-mail ou o CNPJ já existem. Se sim, retorna um erro `409` (Conflict) com a mensagem "E-mail já cadastrado" ou similar.
    *   Criptografa a senha do usuário (gera um hash).
    *   Cria um novo documento para a **Empresa** na coleção `companies` do MongoDB.
    *   Cria um novo documento para o **Usuário** na coleção `users`, associando-o ao `empresaId` da empresa recém-criada.
    *   Retorna uma resposta de sucesso (código `201 Created`).

*   **Resultado Esperado (Frontend):**
    *   O `cadastro.js` recebe a resposta de sucesso.
    *   Exibe um alerta/mensagem como "Cadastro realizado com sucesso!".
    *   Redireciona o usuário automaticamente para a página `login.html`.

---

## Fluxo 2: Login e Gerenciamento de Sessão

Este fluxo valida a autenticação e o acesso a páginas protegidas.

#### **Etapa 1: Tentativa de Login**

*   **Ação do Usuário (Frontend):**
    *   Na página `login.html`, insere seu e-mail e senha.
    *   Clica no botão "Entrar".

*   **O que o Frontend Faz (`login.js`):**
    *   Envia uma requisição `POST` para `http://localhost:5000/api/auth/login` com o e-mail and senha no corpo.

*   **O que o Backend Faz (`authController.js`):**
    *   Busca o usuário no banco de dados pelo e-mail. Se não encontrar, retorna erro `401 Unauthorized`.
    *   Compara a senha enviada com a senha criptografada no banco. Se não bater, retorna erro `401`.
    *   Se as credenciais estiverem corretas, gera dois tokens JWT:
        1.  **Access Token:** Curta duração (ex: 30 min). Contém `userId` e `empresaId`.
        2.  **Refresh Token:** Longa duração (ex: 7 dias).
    *   Retorna uma resposta de sucesso (código `200 OK`) contendo os dois tokens e os dados do usuário.

*   **Resultado Esperado (Frontend):**
    *   O `login.js` recebe a resposta com os tokens.
    *   Salva o `token`, o `refreshToken` e os dados do `user` no `localStorage` do navegador.
    *   Redireciona o usuário para a página principal do sistema (ex: `startPage.html`).

#### **Etapa 2: Acesso a uma Página Protegida**

*   **Ação do Usuário (Frontend):**
    *   Tenta acessar diretamente a URL `startPage.html` (ou qualquer outra página interna) sem ter feito login.

*   **O que o Frontend Faz (`authGuard.js`):**
    *   Este script é executado antes de a página carregar.
    *   Ele verifica se existe um `token` no `localStorage`.
    *   Se **não** houver token, ele impede o carregamento da página e redireciona imediatamente para `login.html`.

*   **O que o Backend Faz:**
    *   Nenhuma requisição chega ao backend, pois o frontend barrou o acesso antes.

*   **Resultado Esperado (Frontend):**
    *   O usuário é sempre direcionado para a tela de login se não estiver autenticado.

---

## Fluxo 3: Teste de Isolamento de Dados (Multi-Tenant)

Este é o teste mais crítico. Ele garante que os dados de uma empresa não vazem para outra.

#### **Etapa 1: Criação de Dados na "Empresa A"**

*   **Ação do Usuário (Frontend):**
    *   Faz login com o usuário da **Empresa A**.
    *   Navega até a página de transações e cria uma nova receita (ex: "Venda Produto X").

*   **O que o Frontend Faz:**
    *   Envia uma requisição `POST` para `/api/transactions`, incluindo o `token` de acesso no cabeçalho `Authorization`.

*   **O que o Backend Faz:**
    *   O `authMiddleware` valida o token, extrai o `userId` e o `empresaId` ("Empresa A").
    *   O `transactionController` recebe os dados da nova transação.
    *   Ao salvar no banco, ele **adiciona o `empresaId` da "Empresa A"** ao novo documento da transação.
    *   Retorna sucesso.

#### **Etapa 2: Validação na "Empresa B"**

*   **Ação do Usuário (Frontend):**
    *   Faz logout da "Empresa A".
    *   Faz login com um usuário da **Empresa B**.
    *   Navega para a página de transações.

*   **O que o Frontend Faz:**
    *   Envia uma requisição `GET` para `/api/transactions` para listar as transações, usando o `token` do usuário da "Empresa B".

*   **O que o Backend Faz:**
    *   O `authMiddleware` valida o token e extrai o `empresaId` ("Empresa B").
    *   O `transactionController` executa uma busca no banco de dados: `Transaction.find({ empresaId: "ID_DA_EMPRESA_B" })`.
    *   O banco de dados retorna **apenas** as transações que pertencem à "Empresa B". A transação "Venda Produto X" da "Empresa A" não é incluída no resultado.
    *   O backend retorna uma lista (potencialmente vazia) de transações para o frontend.

*   **Resultado Esperado (Frontend):**
    *   A página de transações da "Empresa B" é exibida **vazia** ou apenas com transações da própria "Empresa B". A transação da "Empresa A" **não deve aparecer**.

---

## Fluxo 4: Logout

*   **Ação do Usuário (Frontend):**
    *   Clica no botão "Sair".

*   **O que o Frontend Faz:**
    *   Chama a função de logout.
    *   Remove o `token`, `refreshToken` e `user` do `localStorage`.
    *   Redireciona o usuário para a página `login.html`.

*   **O que o Backend Faz:**
    *   Opcionalmente, o frontend pode chamar uma rota `POST /api/auth/logout`. No modelo atual, o logout é principalmente uma ação do lado do cliente. Em sistemas mais complexos, o backend poderia invalidar o `refreshToken` aqui.

*   **Resultado Esperado (Frontend):**
    *   A sessão do usuário é encerrada no navegador e ele é levado para a tela de login. Qualquer tentativa de voltar para uma página interna usando o botão "Voltar" do navegador deve ser barrada pelo `authGuard.js`.
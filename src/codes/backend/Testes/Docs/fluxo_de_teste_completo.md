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
    *   O backend possui um endpoint `POST /api/auth/logout` que, ao receber um `refreshToken`, o marca como inativo no banco de dados.
    *   **Melhoria de Segurança:** Embora o frontend atual realize o logout apenas limpando o `localStorage`, a prática mais segura (já suportada pelo backend) é também chamar este endpoint. Isso invalida a sessão no servidor, impedindo que um `refreshToken` roubado seja usado para gerar novos tokens de acesso.

*   **Resultado Esperado (Frontend):**
    *   A sessão do usuário é encerrada no navegador e ele é levado para a tela de login. Qualquer tentativa de voltar para uma página interna usando o botão "Voltar" do navegador deve ser barrada pelo `authGuard.js`.

---

## Fluxo 5: Recuperação de Senha

Este fluxo permite que um usuário que esqueceu sua senha possa redefini-la de forma segura.

#### **Etapa 1: Solicitação de Redefinição**

*   **Ação do Usuário (Frontend):**
    *   Na página de login, clica em "Esqueci minha senha".
    *   Na página `forgot-password.html`, insere o e-mail cadastrado e clica em "Enviar".

*   **O que o Frontend Faz (`forgot-password.js`):**
    *   Envia uma requisição `POST` para `/api/auth/forgot-password` com o e-mail do usuário.

*   **O que o Backend Faz (`authController.js`):**
    *   Busca o usuário pelo e-mail. Se não existir, retorna um erro que (idealmente) não informa se o e-mail é válido ou não, por segurança.
    *   Gera um token de redefinição de senha único e com tempo de expiração curto.
    *   Salva o token (ou seu hash) no documento do usuário no banco de dados.
    *   **(Simulação)** Em um ambiente real, enviaria um e-mail para o usuário com um link contendo este token. No nosso ambiente de teste, o token pode ser retornado na resposta para simular o clique no link.

#### **Etapa 2: Redefinição da Nova Senha**

*   **Ação do Usuário (Frontend):**
    *   Acessa a página `reset-password.html` com o token de redefinição na URL.
    *   Digita a nova senha e a confirmação.

*   **O que o Frontend Faz (`reset-password.js`):**
    *   Extrai o token da URL.
    *   Envia uma requisição `POST` para `/api/auth/reset-password/:token` com a nova senha.

*   **O que o Backend Faz (`authController.js`):**
    *   Valida o token (se existe, não expirou e corresponde ao usuário).
    *   Criptografa a nova senha e a atualiza no banco de dados.
    *   Invalida o token de redefinição para que não possa ser usado novamente.
    *   Retorna uma mensagem de sucesso.

*   **Resultado Esperado (Frontend):**
    *   Exibe uma mensagem "Senha redefinida com sucesso!" e redireciona para a página de login, onde o usuário agora pode entrar com a nova senha.

---

## Fluxo 4: Upload de Anexo para uma Transação

Este fluxo valida como o sistema lida com o envio de arquivos (comprovantes, notas fiscais).

#### **Etapa 1: Envio do Arquivo pelo Usuário**

*   **Ação do Usuário (Frontend):**
    *   Em uma transação existente, clica no ícone/botão "Anexar Comprovante".
    *   Seleciona um arquivo (PDF ou imagem) do seu computador.

*   **O que o Frontend Faz:**
    *   Cria um objeto `FormData`.
    *   Adiciona o arquivo selecionado ao `FormData`.
    *   Envia uma requisição `POST` para `/api/transactions/:id/upload`, incluindo o `FormData` no corpo e o token de acesso no cabeçalho `Authorization`.

*   **O que o Backend Faz (`uploadMiddleware.js` e `transactionController.js`):**
    *   O `uploadMiddleware` (configurado com `multer`) intercepta a requisição.
    *   Ele valida o tipo do arquivo (`fileFilter`), rejeitando tipos não permitidos.
    *   Ele determina o diretório de destino seguro com base no `companyId` do usuário (`uploads/[companyId]/[img|pdf]/...`).
    *   Salva o arquivo no diretório final, renomeando-o com um timestamp para evitar conflitos.
    *   O `transactionController` recebe a requisição (já com `req.file` populado pelo middleware).
    *   Ele valida se o ID da transação na URL é um `ObjectId` válido. Se não for, retorna `404 Not Found`.
    *   Atualiza o documento da transação no banco de dados, salvando o caminho do arquivo no campo `attachment`.
    *   Retorna uma resposta de sucesso com os dados da transação atualizada.

*   **Resultado Esperado (Frontend):**
    *   Recebe a confirmação de sucesso.
    *   Atualiza a interface para mostrar um link ou ícone indicando que a transação agora possui um anexo.

---

## Fluxo 5: Geração Automática de Alerta de Meta

Este fluxo valida a lógica de negócio que gera um alerta quando uma meta de despesa é atingida.

#### **Etapa 1: Criação da Meta de Despesa**

*   **Ação do Usuário (Frontend):**
    *   Faz login.
    *   Navega até a página de "Metas".
    *   Cria uma nova meta do tipo "Despesa" para a categoria "Alimentação" com um valor de `R$ 500,00` para o mês atual.

*   **O que o Backend Faz (`goalController.js`):**
    *   Recebe a requisição `POST /api/goals`.
    *   Cria e salva um novo documento `Goal` no banco de dados com os dados fornecidos.

#### **Etapa 2: Registro de Despesas**

*   **Ação do Usuário (Frontend):**
    *   Navega até a página de "Transações".
    *   Cria uma primeira despesa na categoria "Alimentação" com valor de `R$ 450,00`.
    *   Cria uma segunda despesa na mesma categoria com valor de `R$ 60,00`.

*   **O que o Backend Faz (`transactionController.js` e `alertTriggerService.js`):**
    *   **Na primeira transação (R$ 450):**
        *   O `transactionController` cria a transação e chama o `alertTriggerService`.
        *   O serviço calcula que o total de despesas (R$ 450) ainda está abaixo da meta (R$ 500). Nenhuma ação é tomada.
    *   **Na segunda transação (R$ 60):**
        *   O `transactionController` cria a transação e chama o `alertTriggerService`.
        *   O serviço calcula que o total anterior era R$ 450 e o novo total é R$ 510.
        *   Como `novoTotal >= meta` e `totalAnterior < meta`, a condição para gerar o alerta é satisfeita.
        *   O serviço cria um novo documento na coleção `Alerts` com a mensagem "Sua meta de gastos para a categoria 'Alimentação' foi atingida!".

*   **Resultado Esperado (Frontend):**
    *   Na próxima vez que o frontend buscar os alertas (ex: ao carregar a página ou através de um polling), ele receberá o novo alerta da API e poderá exibi-lo para o usuário, por exemplo, em um ícone de sino no cabeçalho.

---

## Fluxo 6: Logout

*   **Ação do Usuário (Frontend):**
    *   Clica no botão "Sair".

*   **O que o Frontend Faz:**
    *   Chama a função de logout.
    *   **Ação Principal:** Remove o `token`, `refreshToken` e `user` do `localStorage`.
    *   **Ação de Segurança (Stateful):** Envia uma requisição `POST` para `/api/auth/logout` com o `refreshToken` para invalidar a sessão no servidor.
    *   Redireciona o usuário para a página `login.html`.

*   **O que o Backend Faz:**
    *   Recebe a requisição de logout.
    *   Busca o `SessionToken` correspondente ao `refreshToken` no banco de dados e o marca como inativo.

*   **Resultado Esperado (Frontend):**
    *   A sessão do usuário é encerrada no navegador e no servidor. Qualquer tentativa de usar o `refreshToken` antigo para gerar um novo `accessToken` falhará.

---

## Fluxo 7: Recuperação de Senha

Este fluxo permite que um usuário que esqueceu sua senha possa redefini-la de forma segura.

#### **Etapa 1: Solicitação de Redefinição**

*   **Ação do Usuário (Frontend):**
    *   Na página de login, clica em "Esqueci minha senha".
    *   Na página `forgot-password.html`, insere o e-mail cadastrado e clica em "Enviar".

*   **O que o Frontend Faz (`forgot-password.js`):**
    *   Envia uma requisição `POST` para `/api/auth/forgot-password` com o e-mail do usuário.

*   **O que o Backend Faz (`authController.js`):**
    *   Busca o usuário pelo e-mail. Se não existir, retorna um erro que (idealmente) não informa se o e-mail é válido ou não, por segurança.
    *   Gera um token de redefinição de senha único e com tempo de expiração curto.
    *   Salva o token (ou seu hash) no documento do usuário no banco de dados.
    *   **(Simulação)** Em um ambiente real, enviaria um e-mail para o usuário com um link contendo este token. No nosso ambiente de teste, o token pode ser retornado na resposta para simular o clique no link.

#### **Etapa 2: Redefinição da Nova Senha**

*   **Ação do Usuário (Frontend):**
    *   Acessa a página `reset-password.html` com o token de redefinição na URL.
    *   Digita a nova senha e a confirmação.

*   **O que o Frontend Faz (`reset-password.js`):**
    *   Extrai o token da URL.
    *   Envia uma requisição `POST` para `/api/auth/reset-password/:token` com a nova senha.

*   **O que o Backend Faz (`authController.js`):**
    *   Valida o token (se existe, não expirou e corresponde ao usuário).
    *   Criptografa a nova senha e a atualiza no banco de dados.
    *   Invalida o token de redefinição para que não possa ser usado novamente.
    *   Retorna uma mensagem de sucesso.

*   **Resultado Esperado (Frontend):**
    *   Exibe uma mensagem "Senha redefinida com sucesso!" e redireciona para a página de login, onde o usuário agora pode entrar com a nova senha.

---

## Fluxo 8: Login via Prova de Conceito (React)

Este fluxo demonstra a capacidade do backend de servir a diferentes clientes e a interoperabilidade entre uma aplicação moderna (React) e o sistema legado.

#### **Etapa 1: Acesso e Login na Aplicação React**

*   **Ação do Usuário (Frontend):**
    *   Acessa a URL da aplicação React: `http://localhost:3001`.
    *   A página de login, construída em React, é exibida.
    *   Insere as credenciais (e-mail e senha) de uma das empresas de teste.

*   **O que o Frontend React Faz:**
    *   Ao clicar em "Entrar", o componente React envia uma requisição `POST` para o mesmo endpoint de login da API: `http://localhost:5000/api/auth/login`.

*   **O que o Backend Faz (`authController.js`):**
    *   O processo é idêntico ao do Fluxo 2: o backend valida as credenciais e, se corretas, retorna os tokens de acesso (`token` e `refreshToken`).

#### **Etapa 2: Redirecionamento e Continuidade da Sessão**

*   **O que o Frontend React Faz:**
    *   Recebe a resposta de sucesso da API.
    *   Salva o `token` e o `refreshToken` no `localStorage` do navegador.
    *   Salva também o objeto `user` no `localStorage` para garantir compatibilidade com o `authGuard.js` legado.
    *   **Redireciona o navegador** para a página inicial do sistema legado: `http://localhost:3000/pages/startPage.html`.

*   **O que o Frontend Legado Faz (`authGuard.js`):**
    *   Ao carregar a `startPage.html`, o `authGuard.js` é executado. Ele encontra tanto o `token` quanto o objeto `user` salvos pelo React no `localStorage`, considera o usuário autenticado e permite o acesso direto à página. A sessão continua normalmente dentro do sistema legado.
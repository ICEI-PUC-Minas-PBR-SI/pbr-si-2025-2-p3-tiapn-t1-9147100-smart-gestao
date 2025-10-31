# Backend - Smart Gestão

Backend da aplicação Smart Gestão, construído com Node.js, Express e MongoDB. Este documento serve como um guia técnico para desenvolvedores.

## 1. Arquitetura

A arquitetura segue um padrão modular, inspirado em MVC (Model-View-Controller), com uma forte ênfase em middlewares para lidar com responsabilidades transversais como autenticação, autorização e auditoria.

- **Modularidade**: O código é dividido por funcionalidade (`routes`, `controllers`, `models`), facilitando a manutenção e a escalabilidade.
- **Stateless (Sem Estado)**: A autenticação via JWT garante que o servidor não precise armazenar informações de sessão, tornando-o ideal para ambientes distribuídos e escaláveis.
- **Multi-empresa (Multi-tenant)**: O sistema é projetado para isolar os dados de diferentes empresas de forma segura, utilizando o `empresaId` como chave de separação em todas as operações.

## 2. Estrutura de Diretórios

- **`config/`**: Configurações centrais, como a conexão com o banco de dados (`db.js`).
- **`controllers/`**: Contém a lógica de negócio. Cada função aqui manipula a requisição, interage com os models e envia uma resposta.
- **`middlewares/`**: Funções que interceptam e processam requisições antes de chegarem aos controllers. Usado para autenticação (`authMiddleware`), auditoria (`auditMiddleware`), autorização (`roleMiddleware`) e tratamento de erros (`errorHandler`).
- **`models/`**: Define os schemas do Mongoose, que representam a estrutura dos documentos nas coleções do MongoDB.
- **`modelJson/`**: Contém exemplos de payloads JSON para as requisições da API, servindo como documentação e guia para testes.
- **`routes/`**: Define os endpoints da API, associando URLs e métodos HTTP (GET, POST, etc.) às funções dos controllers.
- **`scripts/`**: Scripts utilitários, como `initPermissions.js` para popular o banco com dados iniciais.
- **`utils/`**: Funções auxiliares reutilizáveis (helpers) para tarefas como criptografia, manipulação de JWT e formatação de respostas.
- **`server.js`**: Ponto de entrada da aplicação. Inicializa o Express, registra os middlewares globais e as rotas.

## 3. Ciclo de Vida de uma Requisição

Uma requisição HTTP para uma rota protegida segue o fluxo abaixo:

1.  **`server.js`**: A requisição chega e é direcionada para o arquivo de rotas correspondente (ex: `transactionRoutes.js`).
2.  **`routes/*.js`**: A rota específica é encontrada. Ela define quais middlewares serão executados em sequência.
3.  **`authMiddleware.js`**: Valida o token JWT do cabeçalho `Authorization`. Se for válido, anexa os dados do usuário (`req.user`) à requisição. Caso contrário, bloqueia com erro `401`.
4.  **`roleMiddleware.js` (se aplicável)**: Verifica se o `req.user.role` tem permissão para acessar a rota. Bloqueia com erro `403` se não tiver.
5.  **`*Controller.js`**: A função do controller é executada. Ela lê os dados da requisição (`req.body`, `req.params`), aplica a lógica de negócio e usa os `Models` para interagir com o banco de dados.
6.  **`Models/*.js`**: O Mongoose executa a operação no MongoDB (ex: `Transaction.find()`).
7.  **`*Controller.js`**: O controller recebe os dados do model e formata uma resposta de sucesso.
8.  **`auditMiddleware.js` (se aplicável)**: Se a rota for de escrita (POST, PUT, DELETE), este middleware é executado *após* a resposta ser enviada, registrando a ação no log de auditoria.
9.  **`errorHandler.js`**: Se ocorrer qualquer erro durante o processo, este middleware captura o erro e envia uma resposta JSON padronizada.

## 4. Fluxo de Autenticação (JWT)

O sistema usa um par de tokens (Access e Refresh) com **Token Fingerprinting** para aumentar a segurança.

1.  **Login**: O usuário envia credenciais. O backend gera uma "impressão digital" (`fingerprint`) a partir do IP e User-Agent do usuário.
2.  **Geração de Tokens**:
    *   **Access Token**: É gerado com curta duração (ex: `30m`). Contém o `userId` e o `fingerprint`. É usado para autorizar o acesso a rotas protegidas.
    *   **Refresh Token**: É gerado com longa duração (ex: `7d`). Também contém o `userId` e o `fingerprint`. Sua única finalidade é obter um novo Access Token.
3.  **Validação em Cada Requisição**: O `authMiddleware` verifica:
    *   A validade e expiração do Access Token.
    *   Se o `fingerprint` da requisição atual corresponde ao `fingerprint` armazenado no token. Se não corresponder, a requisição é negada, impedindo o uso de tokens roubados.
4.  **Renovação de Token**:
    *   Se o Access Token expira, o frontend usa o Refresh Token para chamar a rota `/api/auth/refresh`.
    *   O backend valida o Refresh Token e seu `fingerprint` antes de emitir um novo Access Token.
    *   Se o Refresh Token também estiver expirado, o usuário é deslogado.

## 5. Arquitetura Multi-empresa (Isolamento de Dados)

A segurança para que uma empresa não acesse dados de outra é a principal premissa da arquitetura.

- **`empresaId` nos Models**: Quase todos os documentos no banco de dados (usuários, transações, clientes, etc.) possuem um campo `empresaId` obrigatório.
- **`empresaId` nas Queries**: Todas as operações de banco de dados nos controllers **devem** usar o `empresaId` do usuário logado (`req.user.empresaId`) como filtro.

**Exemplo de consulta segura em um controller:**
```javascript
const transactions = await Transaction.find({ empresaId: req.user.empresaId });
```
Isso garante que, mesmo que um usuário tente forçar um ID de outro recurso na URL, a consulta ao banco sempre estará restrita ao escopo de sua própria empresa.

---

## 6. Configuração e Execução

### Pré-requisitos
- Node.js v18 ou superior.
- Uma string de conexão do MongoDB (local ou Atlas).

### Instalação
1.  Clone o repositório.
2.  Navegue até `src/codes/backend`.
3.  Crie um arquivo `.env` na raiz de `src/codes/backend` com base no `.env.example` e preencha as variáveis:
    ```env
    # Porta do servidor
    PORT=5000

    # String de conexão do MongoDB
    MONGO_URI=mongodb+srv://...

    # Segredos para os tokens JWT
    JWT_SECRET=sua_chave_secreta_aqui
    JWT_REFRESH_SECRET=sua_outra_chave_secreta_aqui

    # Tempo de expiração dos tokens (ex: 30m, 1h, 7d)
    ACCESS_TOKEN_EXPIRATION=30m
    REFRESH_TOKEN_EXPIRATION=7d
    ```
4.  Instale as dependências:
    ```bash
    npm install
    ```

### Execução
- Para desenvolvimento (com auto-reload):
  ```bash
  npm run dev
  ```
- Para produção:
  ```bash
  npm start
  ```
O servidor estará disponível em `http://localhost:5000`.

### Health Check
Para verificar se o servidor está no ar, acesse: `GET http://localhost:5000/api/health`.

---

## 7. Guia de Testes com API (Postman/cURL)

Este projeto está documentado para uso tanto via Postman quanto via curl. Os exemplos abaixo usam as mesmas URLs, headers e payloads, garantindo consistência entre ferramentas.

## Variáveis e convenções

- BASE_URL: http://localhost:5000
- Endpoints iniciam com /api
- Content-Type: application/json (quando houver body)
- Authorization: Bearer <token> (para rotas protegidas)

No Postman, configure um Environment com as variáveis:
- baseUrl = http://localhost:5000
- token = (preenchido após login)
- refreshToken = (preenchido após login)

No curl (Windows cmd), use os exemplos prontos abaixo. Substitua os placeholders SEU_TOKEN_AQUI e SEU_REFRESH_TOKEN_AQUI.

## Auth

1) Login — POST {{baseUrl}}/api/auth/login
- Requisitos: email e password no body.

Postman
- Body -> raw -> JSON:
{
  "email": "usuario@empresa.com",
  "password": "Senha123"
}

curl (Windows cmd)
```
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"usuario@empresa.com\",\"password\":\"Senha123\"}"
```

Resposta esperada (200):
{
  "message": "Login realizado com sucesso!",
  "token": "...",
  "refreshToken": "...",
  "user": { "id": "...", "name": "...", "email": "...", "role": "..." }
}

2) Refresh — POST {{baseUrl}}/api/auth/refresh
- Requisitos: refresh token válido no body.
- Observação: esta rota não deve exigir o access token; ela valida o refresh token.

Postman
- Body -> raw -> JSON:
{ "token": "{{refreshToken}}" }

curl (Windows cmd)
```
curl -X POST http://localhost:5000/api/auth/refresh ^
  -H "Content-Type: application/json" ^
  -d "{\"token\":\"SEU_REFRESH_TOKEN_AQUI\"}"
```

Resposta esperada (200):
{
  "token": "NOVO_ACCESS_TOKEN"
}

3) Logout — POST {{baseUrl}}/api/auth/logout
- Requisitos: Authorization: Bearer {{token}}
- Observação: atualmente, apenas responde sucesso; em evolução futura, poderá invalidar refresh tokens persistidos (SessionToken).

Postman
- Headers -> Authorization: Bearer {{token}}

curl (Windows cmd)
```
curl -X POST http://localhost:5000/api/auth/logout ^
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

Resposta esperada (200):
{
  "message": "Logout realizado com sucesso."
}

## Rotas protegidas (exemplo: GET /api/clients)

Postman
- Authorization -> Type: Bearer Token -> Token: {{token}}

curl (Windows cmd)
```
curl http://localhost:5000/api/clients ^
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Boas práticas

- Versione no repositório uma Collection do Postman e um Environment em docs/postman/:
  - docs/postman/collection.json
  - docs/postman/environment-local.json
- Sempre que atualizar um endpoint, mantenha os exemplos do Postman e os comandos curl sincronizados neste README.
- Padronize respostas usando utils/responseHelper.js nos controllers para consistência: 
  - Sucesso: { success: true, message, data }
  - Erro: { success: false, message, errors }
- Use .env.example como base; garanta as variáveis: MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, PORT.

## Observações sobre Windows PowerShell e Linux/macOS

- Se usar PowerShell ou shells Unix, remova o acento circunflexo (^) e use uma única linha ou a barra invertida (\) apropriada do shell.
- Exemplo em PowerShell (uma linha):
```
curl -Method POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -Body '{"email":"usuario@empresa.com","password":"Senha123"}'
```

---

Com este guia, qualquer membro da equipe pode optar por Postman ou cURL mantendo a mesma experiência de teste e validação.
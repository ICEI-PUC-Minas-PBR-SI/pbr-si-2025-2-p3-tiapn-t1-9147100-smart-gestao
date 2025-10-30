# Backend - Smart Gestão

Este diretório contém o backend do projeto Smart Gestão, desenvolvido com Node.js, Express e MongoDB.

## Requisitos

- Node.js 18+
- MongoDB Atlas (ou MongoDB local)

## Configuração

1. Crie um arquivo `.env` baseado no `.env.example`.
2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor em desenvolvimento:

```bash
npm run dev
```

4. Health check:

```bash
GET http://localhost:5000/api/health
```

## Estrutura

- server.js: inicialização do servidor, middlewares globais e registro de rotas
- config/db.js: conexão com MongoDB
- routes/*: rotas por domínio
- controllers/*: handlers de endpoints
- models/*: modelos Mongoose
- middlewares/*: autenticação, auditoria, etc.
- utils/*: helpers (jwt, bcrypt, responses, logger)
- scripts/initPermissions.js: cria permissões/roles padrão

## Rotas Principais

- /api/auth: login, logout, refresh token
- /api/users: CRUD de usuários
- /api/clients, /api/companies, /api/transactions, etc.

---

# Guia de uso: Postman e curl (padronizado)

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

## Boas práticas para o time

- Versione no repositório uma Collection do Postman e um Environment em docs/postman/:
  - docs/postman/collection.json
  - docs/postman/environment-local.json
- Sempre que atualizar um endpoint, mantenha os exemplos do Postman e os comandos curl sincronizados neste README.
- Padronize respostas usando utils/responseHelper.js nos controllers para consistência: 
  - Sucesso: { success: true, message, data }
  - Erro: { success: false, message, errors }
- Use .env.example como base; garanta as variáveis: MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, PORT.

## Observações para Windows (cmd e PowerShell)

- Windows cmd: use ^ para quebrar linhas ou mantenha tudo em uma linha.
- Windows PowerShell: prefira uma linha ou use splatting/parâmetros nomeados; exemplo abaixo em uma linha:
```
curl -Method POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -Body '{"email":"usuario@empresa.com","password":"Senha123"}'
```

---

Com este guia, qualquer membro do time pode optar por Postman ou curl (no Windows) mantendo a mesma experiência de teste e validação.
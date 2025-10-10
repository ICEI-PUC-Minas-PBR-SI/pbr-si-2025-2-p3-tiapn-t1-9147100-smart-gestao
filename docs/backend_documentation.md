# 🧱 Backend Documentation — Smart Gestão

## 📘 Visão Geral do Projeto

O **Smart Gestão** é um sistema web voltado para **microempreendedores e pequenas empresas**, oferecendo ferramentas de **gestão financeira** com foco em controle de receitas, despesas, relatórios, metas e alertas.  

A aplicação segue uma **arquitetura modular** com **Node.js**, **Express** e **MongoDB**, permitindo:
- Escalabilidade horizontal;  
- Separação clara de responsabilidades (MVC + Middlewares);  
- Suporte multiempresa;  
- Controle de acesso baseado em papéis (roles);  
- Auditoria e logs detalhados de operações.

---

## 🗂️ Estrutura do Projeto (em ordem alfabética)

```text
src/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── alertController.js
│   │   ├── authController.js
│   │   ├── clientController.js
│   │   ├── companyController.js
│   │   ├── logController.js
│   │   ├── metaController.js
│   │   ├── permissionController.js
│   │   ├── reportController.js
│   │   ├── transactionController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── auditMiddleware.js
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Alert.js
│   │   ├── Client.js
│   │   ├── Company.js
│   │   ├── Logs.js
│   │   ├── Meta.js
│   │   ├── Permission.js
│   │   ├── SessionToken.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── alertRoutes.js
│   │   ├── authRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── logRoutes.js
│   │   ├── metaRoutes.js
│   │   ├── permissionRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
│   ├── Scripts/
│   │   └── initPermissions.js
│   ├── utils/
│   │   ├── encrypt.js
│   │   ├── jwt.js
│   │   └── logger.js
│   ├── server.js
│   └── package.json
│
└── .env

```

## ⚙️ Configuração do Servidor (server.js)

```json

// Importa módulos essenciais
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// Importa conexão com banco e rotas
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Middlewares personalizados
import { errorHandler } from "./middlewares/errorMiddleware.js";

// Inicializa o Express
dotenv.config();
const app = express();

// Configurações globais
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Conexão com o MongoDB
connectDB();

// Definição das rotas principais
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/users", userRoutes);

// Middleware global de tratamento de erros
app.use(errorHandler);

// Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

```
## 🧱 Configuração do Banco de Dados (db.js)
```
// Configura e conecta ao MongoDB usando Mongoose
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erro de conexão: ${error.message}`);
    process.exit(1);
  }
};
```
## 🧩 Middlewares
### 🔐 authMiddleware.js

Autentica o usuário com base no token JWT.
Garante que apenas usuários logados acessem rotas protegidas.

### 🏢 companyScopeMiddleware.js

Filtra automaticamente todas as requisições pelo empresaId do usuário autenticado, garantindo isolamento de dados.

### 🧾 auditMiddleware.js

Registra logs automáticos de ações críticas (criação, atualização, exclusão).
Cada log armazena: empresaId, usuarioId, rota, ação, statusCode, data, IP.

### ⚠️ errorMiddleware.js

Captura erros globais e envia resposta padronizada em JSON.

### 🧍‍♂️ roleMiddleware.js

Valida o papel (role) do usuário antes de acessar uma rota específica.
Exemplo: apenas ADMIN_COMPANY pode cadastrar novos usuários.

---

## 🧮 Models (Mongoose) — Explicação por Arquivo (ordem alfabética)

Todos os modelos incluem o campo empresaId para isolar dados entre empresas e garantir segurança multiempresa.

### 🔔 Alert.js

Armazena alertas financeiros automáticos.
Relaciona-se com Meta.

### 👥 Client.js

Registra clientes e fornecedores.
Campos principais: empresaId, tipo, nome_razao, cpf_cnpj, email, categoria.

### 🏢 Company.js

Define as empresas registradas no sistema.
Campos: nome, cnpj, email_contato, plano, ativo.

### 📜 Logs.js

Armazena logs de atividades via auditMiddleware.
Campos: empresaId, usuarioId, acao, rota, ip.

### 📈 Meta.js

Define metas financeiras por categoria e período.
Relaciona-se com Alert.

### 🛡️ Permission.js

Define papéis e níveis de acesso.
Usado pelo roleMiddleware e initPermissions.js.

### 🔑 SessionToken.js

Controla sessões ativas e tokens de login.
Armazena apenas o hash do token (por segurança).

### 💰 Transaction.js

Registra entradas e saídas financeiras.
Campos: tipo, categoria, valor, data_transacao, status.

### 👤 User.js

Armazena dados dos usuários vinculados a uma empresa.
Campos: empresaId, uuid, nome, email, senha_hash, role.
Índice único composto { empresaId, email }.

---

## 🧭 Rotas Principais

| Recurso      | Rota Base           | Middleware Principal                 | Controlador                |
| ------------ | ------------------- | ------------------------------------ | -------------------------- |
| Autenticação | `/api/auth`         | —                                    | `authController.js`        |
| Clientes     | `/api/clients`      | `authMiddleware` + `companyScope`    | `clientController.js`      |
| Empresas     | `/api/companies`    | `authMiddleware`                     | `companyController.js`     |
| Transações   | `/api/transactions` | `authMiddleware` + `auditMiddleware` | `transactionController.js` |
| Relatórios   | `/api/reports`      | `authMiddleware`                     | `reportController.js`      |
| Metas        | `/api/meta`         | `authMiddleware`                     | `metaController.js`        |
| Alertas      | `/api/alerts`       | `authMiddleware`                     | `alertController.js`       |
| Usuários     | `/api/users`        | `authMiddleware` + `roleMiddleware`  | `userController.js`        |

## 🧩 Scripts e Utilitários

- utils/bcryptHelper.js

> Criptografa e valida senhas com bcrypt.

- utils/jwtHelper.js

> Gera e valida tokens JWT.

- utils/logger.js

> Gerencia logs do sistema.

- utils/validationSchemas.js

> Define esquemas de validação Joi para entradas de dados.

## 🔒 Segurança e Acesso

Senhas sempre armazenadas com bcrypt.

Tokens JWT possuem tempo de expiração definido no .env.

Toda requisição autenticada é vinculada ao empresaId do usuário.

O middleware de escopo impede acesso a dados de outras empresas.

Logs armazenam todas as ações de escrita com data, usuário e IP.

## 🌐 Configuração do MongoDB (Cloud)

- Crie uma conta em MongoDB Atlas (
    > https://www.mongodb.com/atlas/database)

- Crie um novo cluster gratuito.

- Copie o link de conexão (URI) e adicione ao .env: 
    > MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/smartgestao

Ajuste as variáveis de ambiente no .env.example: 
    > PORT=5000
    > JWT_SECRET=chaveSeguraAqui
    > TOKEN_EXPIRATION=1d

## 🧾 Logs e Auditoria

- Cada requisição com impacto em dados (POST, PUT, DELETE) gera um registro no MongoDB com:

> empresaId

> usuarioId

> rota

> ação

> IP

> statusCode

> data

- Esses logs são armazenados na coleção Logs e servem como base para relatórios de auditoria.

---

## 📊 Relatórios e Dashboard

- O reportController centraliza geração de relatórios financeiros:

> Resumo de receitas/despesas por categoria;

> Lucro líquido mensal;

> Acompanhamento de metas;

> Alertas financeiros.

- Todos os relatórios são filtrados por empresaId e usuário autenticado.

## Banco de dados


``` text

🧭 Backend Documentation — Smart Gestão

📘 Documentação técnica completa do backend do sistema Smart Gestão
Versão acadêmica — arquitetura modular, conexão em nuvem e boas práticas de desenvolvimento.
Banco de dados principal: MongoDB Atlas

📁 Estrutura de Diretórios
src/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── alertController.js
│   │   ├── authController.js
│   │   ├── clientController.js
│   │   ├── companyController.js
│   │   ├── logController.js
│   │   ├── metaController.js
│   │   ├── permissionController.js
│   │   ├── reportController.js
│   │   ├── transactionController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── auditMiddleware.js
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Alert.js
│   │   ├── Client.js
│   │   ├── Company.js
│   │   ├── Logs.js
│   │   ├── Meta.js
│   │   ├── Permission.js
│   │   ├── SessionToken.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── alertRoutes.js
│   │   ├── authRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── logRoutes.js
│   │   ├── metaRoutes.js
│   │   ├── permissionRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
│   ├── Scripts/
│   │   └── initPermissions.js
│   ├── utils/
│   │   ├── encrypt.js
│   │   ├── jwt.js
│   │   └── logger.js
│   ├── server.js
│   └── package.json
│
└── .env

⚙️ 1. Configuração de Ambiente
📄 Arquivo .env
# 🌐 Configurações de servidor
PORT=5000

# 🔐 Configurações de segurança
JWT_SECRET=chaveSeguraAqui
TOKEN_EXPIRATION=1d

# 🧩 Configuração de banco de dados (MongoDB Atlas)
MONGO_URI=mongodb+srv://adminSmart:PUC@SmartG&stao@smartgestaodb.qgvbre5.mongodb.net/


⚠️ Importante: nunca publique este arquivo no GitHub.
O .env contém credenciais sensíveis e deve ser protegido via .gitignore.

📄 Arquivo .gitignore
# Ignorar dependências e arquivos sensíveis
node_modules/
.env
.DS_Store
package-lock.json
.vscode/

🧱 2. Configuração do Banco de Dados
🔗 Conexão (config/db.js)

Responsável por estabelecer conexão entre o backend e o MongoDB Atlas.

Utiliza dotenv para ler a variável MONGO_URI.

Em caso de falha, encerra o processo (process.exit(1)).

Exibe no console o status da conexão.

await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


📊 Status no console:

✅ Conexão com MongoDB estabelecida com sucesso!
🌍 Servidor do banco: cluster0-shard.mongodb.net

🧠 3. Modelagem de Dados

MongoDB é um banco de dados NoSQL orientado a documentos,
e utiliza coleções e documentos JSON em vez de tabelas e registros.

🧩 Entidades Principais
Entidade	Descrição	Relacionamentos
User	Usuário autenticado do sistema	pertence a uma Company
Company	Empresa cadastrada no sistema	possui muitos Users e Transactions
Client	Cliente ou fornecedor vinculado a uma empresa	pertence a uma Company
Transaction	Registro de receita ou despesa	pertence a um Client e a uma Company
Meta	Metas financeiras	pertence a uma Company
Alert	Alertas de desempenho financeiro	pertence a uma Meta
Permission	Perfis e papéis de acesso (admin, read-only, etc.)	referência em User
Logs	Auditoria de ações do usuário	pertence a um User e Company
SessionToken	Armazena tokens ativos e sessões de login	pertence a um User
💡 Representação Textual do DER
Company (1) ───< (N) User  
Company (1) ───< (N) Client  
Company (1) ───< (N) Transaction  
Company (1) ───< (N) MetaFinanceira  
MetaFinanceira (1) ───< (N) Alert  
User (1) ───< (N) Logs

🧩 4. Fluxo de Autenticação e Acesso

Login (/api/auth/login)

Usuário informa email e senha.

O sistema gera JWT (JSON Web Token).

O token é armazenado em SessionToken.

Validação de Sessão

Cada rota privada usa authMiddleware.

O middleware valida o token antes de permitir acesso.

Controle de Permissões

As permissões são inicializadas por initPermissions.js.

Cada usuário possui um nível de acesso (Root, Admin, User, ReadOnly).

Auditoria e Logs

Toda ação de escrita (POST, PUT, DELETE) passa por auditMiddleware.

As informações são registradas em Logs.js:

usuário

empresa

ação

IP

data e hora

🧮 5. Relatórios e Dashboards

O reportController.js centraliza os relatórios financeiros por empresa:

Resumo de receitas e despesas

Lucro líquido mensal

Metas atingidas

Alertas gerados

Logs de auditoria (opcional)

Todos os relatórios são filtrados automaticamente por empresaId e usuário autenticado.

🧾 6. Logs e Auditoria

Cada modificação importante (como criar, alterar ou excluir dados) gera um log automático no MongoDB.

Exemplo de documento na coleção Logs:

{
  "empresaId": "ObjectId('6720e2c2...')",
  "usuarioId": "ObjectId('6720e2c2...')",
  "rota": "/api/transactions/create",
  "acao": "CREATE_TRANSACTION",
  "statusCode": 201,
  "ip": "192.168.1.10",
  "data": "2025-10-10T13:35:00Z"
}

🔐 7. Segurança

Mesmo sendo um projeto acadêmico, já há boas práticas aplicadas:

Senhas armazenadas com bcrypt (hash seguro)

Tokens JWT assinados com JWT_SECRET

Filtros por companyId para evitar acesso indevido

Estrutura modular pronta para receber helmet, rate-limit e mongo-sanitize futuramente

💬 Observação: a segurança ainda pode ser aprimorada com essas bibliotecas se o projeto evoluir para uso real.

📊 8. Testes de Conexão

Após iniciar o servidor:

npm run dev


Verifique no navegador:

http://localhost:5000/api/health


Resposta esperada:

{
  "status": "ok",
  "message": "Servidor Smart Gestão ativo!",
  "timestamp": "2025-10-10T17:30:00.000Z"
}

```
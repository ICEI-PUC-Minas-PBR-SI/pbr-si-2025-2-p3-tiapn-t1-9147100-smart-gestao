# 🧱 Backend Documentation — Smart Gestão

## 📘 Visão Geral do Projeto

O **Smart Gestão** é um sistema web voltado para **microempreendedores e profissionais autônomos**, oferecendo ferramentas de **gestão financeira** com foco em controle de receitas, despesas, relatórios, metas e alertas.

A aplicação segue uma **arquitetura modular** com **Node.js**, **Express** e **MongoDB**, permitindo:
-   **Escalabilidade**: A arquitetura permite o crescimento futuro do sistema.
-   **Separação de Responsabilidades**: A estrutura segue o padrão MVC (Model-View-Controller) enriquecido com uma camada de Serviços e Middlewares, tornando o código mais organizado e fácil de manter.
-   **Segurança Multi-Tenant**: Garante que os dados de uma empresa sejam completamente isolados dos de outra.
-   **Controle de Acesso Baseado em Papéis (RBAC)**: Define diferentes níveis de permissão para os usuários (ex: administrador, usuário padrão).
-   **Auditoria**: Registra ações importantes realizadas no sistema para fins de segurança e rastreabilidade.

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
│   │   ├── goalController.js
│   │   ├── logController.js
│   │   ├── permissionController.js
│   │   ├── reportController.js
│   │   ├── transactionController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── auditMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── companyScopeMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Alert.js
│   │   ├── Client.js
│   │   ├── Company.js
│   │   ├── Goal.js
│   │   ├── Logs.js
│   │   ├── Permission.js
│   │   ├── SessionToken.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── alertRoutes.js
│   │   ├── authRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── permissionRoutes.js
│   │   ├── logRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
│   ├── Scripts/
│   │   ├── create-test-companies.js
│   │   ├── initPermissions.js
│   │   └── print-summary.js
│   ├── services/
│   │   ├── pdfService.js
│   │   └── alertTriggerService.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── responseHelper.js
│   └── Testes/
│       ├── 1-auth/
│       ├── 2-features/
│       ├── 3-security/
│       ├── 4-reports/
│       ├── config/
│       ├── Docs/
│       └── resultados/
│   ├── server.js
│   └── package.json
│
└── .env

```

## ⚙️ Configuração do Servidor (server.js)

```json

import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
// ... (outras importações)

dotenv.config();
const app = express();

// Middlewares globais
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Registro de todas as rotas da API
app.use("/api/auth", authRoutes);
// ... (outras rotas)

// Função de inicialização
export async function startServer() {
  await connectDB();
  await initPermissions();
  app.listen(PORT, () => console.log(`🚀 Servidor rodando...`));
}

// Definição das rotas principais
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/users", userRoutes);

```
## 🧱 Configuração do Banco de Dados (db.js)
```
// Configura e conecta ao MongoDB usando Mongoose
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    // Conecta ao MongoDB. Em versões recentes do Mongoose, as opções de configuração
    // como `useNewUrlParser` e `useUnifiedTopology` são padrão e não precisam ser declaradas.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    // Em caso de falha na conexão, exibe o erro e encerra a aplicação.
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

Verifica se um recurso acessado via ID (ex: `/api/clients/:id`) pertence à empresa do usuário autenticado. Se não pertencer, retorna 404 para não vazar a existência do recurso, garantindo o isolamento de dados (multi-tenant).

### 🧾 auditMiddleware.js

Registra logs automáticos de ações críticas (criação, atualização, exclusão).
Cada log armazena: empresaId, usuarioId, rota, ação, statusCode, data, IP.

---

## 🧮 Models (Mongoose) — Explicação por Arquivo (ordem alfabética)

Todos os modelos incluem o campo empresaId para isolar dados entre empresas e garantir segurança multiempresa.

### 🔔 Alert.js

Armazena alertas financeiros, como metas de despesas atingidas. Sua criação é gerenciada automaticamente pelo `alertTriggerService.js` quando uma nova transação de despesa ultrapassa o limite de uma meta.

### 📜 Logs.js

Armazena logs de atividades via auditMiddleware.
Campos: empresaId, usuarioId, action, route, ip.
 
### 📈 Goal.js

Define metas financeiras (ex: limite de gastos, objetivo de receita) por período.

### 🛡️ Permission.js

Define papéis e níveis de acesso. Usado pelo `roleMiddleware` e `initPermissions.js`.

### 👥 Client.js

Registra clientes e fornecedores.
Campos principais: empresaId, tipo, nome_razao, cpf_cnpj, email, categoria.

### 🏢 Company.js

Define as empresas registradas no sistema. Campos: nome, cnpj, email_contato, plano, ativo.

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
| Metas        | `/api/goals`        | `authMiddleware`                     | `goalController.js`        |
| Alertas      | `/api/alerts`       | `authMiddleware`                     | `alertController.js`       |
| Usuários     | `/api/users`        | `authMiddleware` + `roleMiddleware`  | `userController.js`        |

---

## 7. 🧩 Scripts e Utilitários

-   **`Scripts/initPermissions.js`**: Garante que as permissões de sistema (`ROOT`, `ADMIN_COMPANY`, etc.) existam no banco de dados. É executado automaticamente na inicialização do servidor para garantir a consistência do ambiente.
-   **`Testes/populate-db.js`**: Popula o banco de dados com um conjunto rico de dados de teste (empresas, usuários, transações) para desenvolvimento e validação manual. É executado via `npm run db:populate`.
-   **`Scripts/print-summary.js`**: Exibe um resumo formatado com os links de acesso de todos os serviços após a inicialização completa do ambiente (`npm start`).

---

## 8. 🔒 Segurança e Acesso

-   **Autenticação**: Senhas são sempre armazenadas com hash `bcrypt`. O acesso é controlado por tokens JWT com tempo de expiração curto (access token) e um mecanismo de renovação (refresh token).
-   **Isolamento de Dados (Multi-Tenant)**: O `companyScopeMiddleware` é um pilar da segurança, garantindo que um usuário de uma empresa não possa, sob nenhuma hipótese, acessar dados de outra.
-   **Encerramento Seguro**: A lógica de `gracefulShutdown` em `server.js` garante que as conexões com o banco de dados e o próprio servidor sejam encerradas de forma limpa, evitando corrupção de dados e processos "zumbis".
-   **Testes Seguros**: O ambiente de teste (`globalSetup.cjs` e `globalTeardown.cjs`) foi configurado para realizar uma **limpeza seletiva**, removendo apenas os dados temporários que ele mesmo criou. Isso garante que os dados de desenvolvimento manual (criados com `npm run db:populate`) permaneçam intactos, o que é validado pelo teste `persistence.test.js`.

---

## 9. 📊 Relatórios e Dashboard

-   O `reportController` centraliza a geração de relatórios financeiros, como resumo de transações e lista de clientes.
-   Todos os relatórios são filtrados pelo `companyId` do usuário autenticado.
-   A geração de arquivos PDF é gerenciada pelo `pdfService`, mantendo a lógica desacoplada.

---

## 10. 🧪 Testes Automatizados

O projeto possui uma suíte de testes de integração robusta, gerenciada pelo **Jest**.

-   **Execução**: `npm test` na pasta do backend.
-   **Ambiente**: Utiliza scripts globais (`globalSetup` e `globalTeardown`) que orquestram todo o ciclo de vida: iniciam o servidor, criam dados de teste temporários, executam os testes e limpam apenas os dados criados.
-   **Cobertura**: Os testes validam os principais módulos, incluindo autenticação, isolamento de dados (multi-tenant), CRUDs de funcionalidades e geração de relatórios.

Para mais detalhes, consulte o `roteiro de testes automatizados.md`.

```
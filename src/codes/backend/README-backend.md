# 🚀 Backend - Smart Gestão API

Este documento é o guia técnico completo para o backend da aplicação Smart Gestão. Ele detalha a arquitetura, a estrutura de pastas, os arquivos principais e as instruções para configuração, execução e teste do servidor.

## 1. Arquitetura e Tecnologias

O backend é uma API RESTful construída sobre a stack **Node.js**, utilizando as seguintes tecnologias principais:

-   **Node.js**: Ambiente de execução para JavaScript no servidor.
-   **Express.js**: Framework web minimalista para a criação da API, gerenciamento de rotas e middlewares.
-   **MongoDB**: Banco de dados NoSQL orientado a documentos, utilizado para armazenar todos os dados da aplicação.
-   **Mongoose**: Biblioteca de modelagem de dados (ODM) para o MongoDB, que facilita a definição de schemas, validações e interações com o banco.
-   **JSON Web Tokens (JWT)**: Padrão utilizado para a autenticação segura e stateless dos usuários.

## 2. Estrutura de Pastas

O projeto é organizado de forma modular para separar as responsabilidades e facilitar a manutenção.

```
backend/
├── config/             # Configuração da conexão com o banco de dados.
├── controllers/        # Contém a lógica de negócio da aplicação.
├── coverage/           # Relatórios de cobertura de testes (gerado automaticamente).
├── Examples/           # Exemplos de documentos completos (como são retornados pela API).
├── middlewares/        # Funções que interceptam requisições (autenticação, autorização, logs).
├── models/             # Definição dos Schemas do Mongoose (a estrutura dos dados).
├── modelsJson/         # Exemplos de payloads de requisição (o que o cliente envia).
├── node_modules/       # Dependências do projeto (ignorado pelo Git).
├── routes/             # Definição dos endpoints (rotas) da API.
├── Scripts/            # Scripts de inicialização e manutenção.
├── Testes/             # Suíte de testes automatizados (Jest).
│   ├── 1-auth/         # Testes de autenticação e senha.
│   ├── 2-features/     # Testes de funcionalidades (CRUDs).
│   ├── 3-security/     # Testes de segurança e isolamento de dados.
│   ├── 4-reports/      # Testes de geração de relatórios.
│   └── config/         # Arquivos de configuração do ambiente de teste.
├── utils/              # Funções utilitárias reutilizáveis (helpers).
├── .env                # Arquivo de variáveis de ambiente (local, ignorado pelo Git).
├── .env.example        # Arquivo de exemplo para as variáveis de ambiente.
├── .gitignore          # Especifica arquivos e pastas a serem ignorados pelo Git.
├── package.json        # Define os metadados do projeto e suas dependências.
├── package-lock.json   # Registra as versões exatas das dependências.
└── server.js           # Ponto de entrada principal da aplicação.
```

## 3. Arquivos Principais Explicados

Alguns arquivos são a espinha dorsal do projeto e não permitem comentários internos. Sua função é explicada aqui.

### `server.js`

É o coração da aplicação. Suas responsabilidades são:
1.  Importar todas as dependências e módulos necessários.
2.  Configurar os middlewares globais (como `cors` para permitir acesso do frontend e `express.json` para interpretar requisições).
3.  Registrar todas as rotas da API, associando cada endpoint (ex: `/api/transactions`) ao seu respectivo arquivo de rotas.
4.  Iniciar a conexão com o banco de dados MongoDB.
5.  Executar scripts de inicialização, como o `initPermissions`.
6.  "Subir" o servidor, fazendo-o ouvir por requisições na porta configurada.

### `package.json`

Este arquivo é o manifesto do projeto Node.js. Ele define:
-   **`name`, `version`, `description`**: Metadados básicos do projeto.
-   **`main`**: O ponto de entrada da aplicação (`server.js`).
-   **`type`: "module"**: Especifica que o projeto utiliza a sintaxe de ES Modules (`import`/`export`).
-   **`dependencies`**: Pacotes necessários para a aplicação rodar em produção (Express, Mongoose, etc.).
-   **`devDependencies`**: Pacotes usados apenas durante o desenvolvimento e teste (Nodemon, Jest, etc.).
-   **`scripts`**: Comandos de atalho para executar tarefas comuns:
    -   `npm start`: Inicia o backend e o frontend simultaneamente para uso normal.
    -   `npm run dev`: Inicia o backend em modo de desenvolvimento com `nodemon`, que reinicia o servidor automaticamente a cada alteração no código.
    -   `npm test`: Executa a suíte completa de testes automatizados.
    -   `npm run start:full-demo`: Inicia todos os servidores (backend, frontend legado e a prova de conceito em React) para a demonstração completa da arquitetura.
    -   `npm run start:full-demo`: Inicia todos os servidores (backend, frontend legado e a prova de conceito em React) para a demonstração completa da arquitetura de interoperabilidade.

### `.gitignore`

Este arquivo instrui o Git sobre quais arquivos e pastas ele deve **ignorar** e **nunca** enviar para o repositório remoto (como o GitHub). Sua importância é crucial para:
-   **Segurança**: Impede que arquivos com informações sensíveis, como o `.env` (que contém senhas de banco de dados e segredos de token), sejam acidentalmente expostos.
-   **Eficiência**: Evita o envio de pastas pesadas e desnecessárias, como `node_modules`, que podem ser facilmente reinstaladas a partir do `package.json`.
-   **Limpeza**: Mantém o repositório livre de arquivos temporários, logs e arquivos de configuração de IDEs.

## 4. Configuração e Execução

Siga os passos abaixo para executar o backend localmente.

### Pré-requisitos

-   Node.js (versão 16 ou superior)
-   Uma instância do MongoDB (local ou em um serviço como o MongoDB Atlas)

### Passos

1.  **Clone o Repositório**: Se ainda não o fez, clone o projeto para a sua máquina.

2.  **Instale as Dependências**: Navegue até a pasta `src/codes/backend` e execute:
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente**:
    -   Na pasta `src/codes/backend`, crie uma cópia do arquivo `.env.example` e renomeie-a para `.env`.
    -   Abra o arquivo `.env` e preencha as variáveis com suas informações:
        ```env
        # String de conexão com seu banco de dados MongoDB
        MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/smartgestao?retryWrites=true&w=majority

        # Porta em que o servidor irá rodar
        PORT=5000

        # Chaves secretas para gerar os tokens JWT. Use geradores de senhas fortes.
        JWT_SECRET=SEU_SEGREDO_SUPER_SEGURO_PARA_ACCESS_TOKEN
        REFRESH_TOKEN_SECRET=OUTRO_SEGREDO_SUPER_SEGURO_PARA_REFRESH_TOKEN
        ```

4.  **Inicie o Servidor**:
    -   Para desenvolvimento (com reinício automático):
        ```bash
        npm run dev
        ```
    -   Para iniciar o backend e o frontend juntos (simulando produção):
        ```bash
        npm start
        ```

O servidor backend estará disponível em `http://localhost:5000`. Você pode verificar seu status acessando a rota de "health check": `http://localhost:5000/api/health`.

## 5. Executando os Testes

A suíte de testes automatizados valida a integridade da API. O processo de execução foi simplificado para garantir estabilidade e focar na validação do backend.

Para instruções detalhadas sobre como configurar e executar a suíte de testes, consulte o guia oficial na pasta de testes:

> **Consulte: Roteiro de Testes Automatizados**

## 6. Validação e Conclusão da Função Backend

Após um ciclo completo de desenvolvimento, testes automatizados, refatoração e documentação, a função de desenvolvedor backend para o núcleo do projeto foi concluída e validada.

O backend demonstrou ser:
- **Robusto**: Com uma suíte de testes cobrindo as principais funcionalidades.
- **Seguro**: Implementando autenticação JWT, invalidação de sessão e isolamento de dados (multi-tenant).
- **Flexível**: Capaz de servir diferentes clientes, como o frontend legado (HTML/JS) e a prova de conceito em React, provando a eficácia da arquitetura de API desacoplada.

As funcionalidades pendentes (Exportação de PDF, Cadastro de Clientes/Fornecedores e Alertas Automáticos) foram documentadas e podem ser desenvolvidas sobre a base sólida estabelecida.
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
    -   `"start"`: Inicia o ambiente de demonstração completo (backend, frontend legado e React). Este é o comando principal para executar o sistema.
    -   `"start:backend"`: Inicia **apenas** o servidor do backend.
    -   `"start:frontend"`: Inicia um servidor estático simples para o frontend legado na porta 3000.
    -   `"test"`: Executa a suíte completa de testes automatizados com Jest.
    -   `"create-test-users"`: Cria um conjunto de empresas de teste fixas para uso em validações manuais, salvando as credenciais em um arquivo de documentação.

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
        npm run start:backend
        ```
    -   Para iniciar o ambiente de demonstração completo (recomendado):
        ```bash
        npm start
        ```

O servidor backend estará disponível em `http://localhost:5000`. Você pode verificar seu status acessando a rota de "health check": `http://localhost:5000/api/health`.

## 5. Executando os Testes

A suíte de testes automatizados valida a integridade da API. O processo de execução foi simplificado para garantir estabilidade e focar na validação do backend.

Para instruções detalhadas sobre como configurar e executar a suíte de testes, que agora utiliza um sistema de limpeza seletiva para proteger os dados de desenvolvimento, consulte o guia oficial na pasta de testes:
> **Consulte: [Roteiro de Testes Automatizados](Testes/Docs/roteiro%20de%20testes%20automatizados.md)**

## 6. Validação e Conclusão da Função Backend

Após um ciclo completo de desenvolvimento, testes automatizados, refatoração e documentação, a função de desenvolvedor backend para o núcleo do projeto foi concluída e validada.

O backend demonstrou ser:
- **Robusto**: Com uma suíte de testes cobrindo as principais funcionalidades.
- **Seguro**: Implementando autenticação JWT, invalidação de sessão e isolamento de dados (multi-tenant).
- **Flexível**: Capaz de servir diferentes clientes, como o frontend legado (HTML/JS) e a prova de conceito em React, provando a eficácia da arquitetura de API desacoplada.

As funcionalidades pendentes (Exportação de PDF, Cadastro de Clientes/Fornecedores e Alertas Automáticos) foram documentadas e podem ser desenvolvidas sobre a base sólida estabelecida.

---

## 7. Melhorias Futuras e Considerações de Produção

Como um projeto acadêmico, certas simplificações foram feitas para focar no núcleo da funcionalidade dentro do prazo estabelecido. Para uma versão de produção, as seguintes melhorias seriam recomendadas:

### 7.1. Segurança Avançada

-   **Gerenciamento de Refresh Token**: A abordagem atual de enviar o `refreshToken` no corpo da resposta e armazená-lo no `localStorage` do frontend é funcional, mas vulnerável a ataques de Cross-Site Scripting (XSS). A prática recomendada em produção é enviar o `refreshToken` em um **cookie `HttpOnly` e `Secure`**. Isso impede que scripts maliciosos no navegador tenham acesso a ele.
-   **Proteção CSRF (Cross-Site Request Forgery)**: Para aplicações web tradicionais que dependem de cookies para sessão, seria crucial implementar tokens anti-CSRF para garantir que as requisições venham de fontes confiáveis.
-   **Rate Limiting e Prevenção de Brute-Force**: Implementar um middleware de "rate limiting" em endpoints sensíveis (como `/login` e `/forgot-password`) para bloquear IPs que façam muitas tentativas em um curto período, prevenindo ataques de força bruta.

### 7.2. Escalabilidade e Performance

-   **Cache**: Implementar uma camada de cache com uma ferramenta como **Redis**. Dados que não mudam com frequência (como o perfil do usuário ou permissões) poderiam ser cacheados para reduzir a carga no banco de dados e diminuir a latência das requisições.
-   **Otimização de Índices no Banco de Dados**: À medida que o volume de dados cresce, seria necessário analisar as consultas mais lentas (`slow queries`) e criar índices compostos mais complexos no MongoDB para otimizar a performance.

### 7.3. Exclusão Lógica (Soft Deletes)

-   **O Problema da Exclusão Física**: Atualmente, a maioria das operações de exclusão (`DELETE`) remove os dados permanentemente do banco de dados (`findOneAndDelete`). Em um ambiente de produção, isso é arriscado e pode violar regulamentações como a LGPD, que exigem a retenção de dados por um certo período.
-   **A Solução "Soft Delete"**: A melhor prática seria implementar a exclusão lógica. Em vez de apagar o registro, um campo como `deleted: true` e `deletedAt: new Date()` seria adicionado. Todas as consultas (`find`, `findOne`, etc.) seriam então modificadas para incluir a condição `{ deleted: { $ne: true } }`, garantindo que os dados "excluídos" não apareçam para o usuário, mas permaneçam no banco para fins de auditoria ou recuperação.

### 7.4. Testes e CI/CD

-   **Testes Unitários**: A suíte de testes atual é focada em integração. Para uma maior granularidade, seria importante adicionar testes unitários para validar a lógica de funções específicas em `services` e `utils` de forma isolada, sem depender de um banco de dados ou servidor.
-   **Pipeline de CI/CD (Integração e Entrega Contínua)**: Configurar um pipeline automatizado (usando ferramentas como GitHub Actions, Jenkins ou GitLab CI) que, a cada `push` para o repositório:
    1.  Execute a suíte de testes completa (`npm test`).
    2.  Verifique a qualidade do código (linting).
    3.  Se tudo passar, construa uma imagem Docker da aplicação.
    4.  Faça o deploy automático para um ambiente de homologação ou produção.

### 7.5. Sistema de Alertas e Tarefas em Background

-   **Filas de Mensagens**: A implementação atual de alertas é síncrona. Para um sistema mais robusto, o envio de notificações (e-mail, push) deveria ser gerenciado por uma fila de mensagens (como RabbitMQ ou SQS). O controlador apenas publicaria uma mensagem na fila, e um "worker" separado e independente seria responsável por processar a fila e enviar as notificações, tornando a API mais rápida e resiliente a falhas no serviço de envio.

---

## 7. Melhorias Futuras e Considerações de Produção

Como um projeto acadêmico, certas simplificações foram feitas para focar no núcleo da funcionalidade dentro do prazo estabelecido. Para uma versão de produção, as seguintes melhorias seriam recomendadas:

### 7.1. Segurança Avançada

-   **Gerenciamento de Refresh Token**: A abordagem atual de enviar o `refreshToken` no corpo da resposta e armazená-lo no `localStorage` do frontend é funcional, mas vulnerável a ataques de Cross-Site Scripting (XSS). A prática recomendada em produção é enviar o `refreshToken` em um **cookie `HttpOnly` e `Secure`**. Isso impede que scripts maliciosos no navegador tenham acesso a ele.
-   **Proteção CSRF (Cross-Site Request Forgery)**: Para aplicações web tradicionais que dependem de cookies para sessão, seria crucial implementar tokens anti-CSRF para garantir que as requisições venham de fontes confiáveis.
-   **Rate Limiting e Prevenção de Brute-Force**: Implementar um middleware de "rate limiting" em endpoints sensíveis (como `/login` e `/forgot-password`) para bloquear IPs que façam muitas tentativas em um curto período, prevenindo ataques de força bruta.

### 7.2. Escalabilidade e Performance

-   **Cache**: Implementar uma camada de cache com uma ferramenta como **Redis**. Dados que não mudam com frequência (como o perfil do usuário ou permissões) poderiam ser cacheados para reduzir a carga no banco de dados e diminuir a latência das requisições.
-   **Otimização de Índices no Banco de Dados**: À medida que o volume de dados cresce, seria necessário analisar as consultas mais lentas (`slow queries`) e criar índices compostos mais complexos no MongoDB para otimizar a performance.

### 7.3. Exclusão Lógica (Soft Deletes)

-   **O Problema da Exclusão Física**: Atualmente, a maioria das operações de exclusão (`DELETE`) remove os dados permanentemente do banco de dados (`findOneAndDelete`). Em um ambiente de produção, isso é arriscado e pode violar regulamentações como a LGPD, que exigem a retenção de dados por um certo período.
-   **A Solução "Soft Delete"**: A melhor prática seria implementar a exclusão lógica. Em vez de apagar o registro, um campo como `deleted: true` e `deletedAt: new Date()` seria adicionado. Todas as consultas (`find`, `findOne`, etc.) seriam então modificadas para incluir a condição `{ deleted: { $ne: true } }`, garantindo que os dados "excluídos" não apareçam para o usuário, mas permaneçam no banco para fins de auditoria ou recuperação.

### 7.4. Testes e CI/CD

-   **Testes Unitários**: A suíte de testes atual é focada em integração. Para uma maior granularidade, seria importante adicionar testes unitários para validar a lógica de funções específicas em `services` e `utils` de forma isolada, sem depender de um banco de dados ou servidor.
-   **Pipeline de CI/CD (Integração e Entrega Contínua)**: Configurar um pipeline automatizado (usando ferramentas como GitHub Actions, Jenkins ou GitLab CI) que, a cada `push` para o repositório:
    1.  Execute a suíte de testes completa (`npm test`).
    2.  Verifique a qualidade do código (linting).
    3.  Se tudo passar, construa uma imagem Docker da aplicação.
    4.  Faça o deploy automático para um ambiente de homologação ou produção.

### 7.5. Sistema de Alertas e Tarefas em Background

-   **Filas de Mensagens**: A implementação atual de alertas é síncrona. Para um sistema mais robusto, o envio de notificações (e-mail, push) deveria ser gerenciado por uma fila de mensagens (como RabbitMQ ou SQS). O controlador apenas publicaria uma mensagem na fila, e um "worker" separado e independente seria responsável por processar a fila e enviar as notificações, tornando a API mais rápida e resiliente a falhas no serviço de envio.
# 🚀 Backend - Smart Gestão API

Este documento é o guia técnico completo para o backend da aplicação Smart Gestão. Ele detalha a arquitetura, a estrutura de pastas, os arquivos principais e as instruções para configuração, execução e teste do servidor da API.

## 1. Arquitetura e Tecnologias

O backend é uma API RESTful construída sobre a stack **Node.js**, utilizando as seguintes tecnologias e padrões:

-   **Node.js**: Ambiente de execução para JavaScript no servidor.
-   **Express.js**: Framework web minimalista para a criação da API, gerenciamento de rotas e middlewares.
-   **MongoDB**: Banco de dados NoSQL orientado a documentos, utilizado para armazenar todos os dados da aplicação.
-   **Mongoose**: Biblioteca de modelagem de dados (ODM) para o MongoDB, que facilita a definição de schemas, validações e interações com o banco.
-   **JSON Web Tokens (JWT)**: Padrão utilizado para a autenticação segura e stateless dos usuários.

O projeto segue uma arquitetura em camadas (MVC adaptado), com uma clara separação entre `Controllers` (orquestração), `Services` (lógica de negócio) e `Models` (acesso a dados), garantindo alta coesão e baixo acoplamento.
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
│   ├── services/           # Lógica de negócio desacoplada (ex: geração de PDF, disparo de alertas).
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

A suíte de testes automatizados valida a integridade da API. O processo de execução foi completamente refatorado para garantir estabilidade, isolamento e segurança dos dados.

Para instruções detalhadas sobre como configurar e executar a suíte de testes, que agora utiliza um sistema de limpeza seletiva para proteger os dados de desenvolvimento, consulte o guia oficial na pasta de testes:
> **Consulte: Roteiro de Testes Automatizados**

## 6. Validação e Conclusão da Função Backend

Após um ciclo completo de desenvolvimento, testes automatizados, refatoração e documentação, a função de desenvolvedor backend para o núcleo do projeto foi concluída e validada.

O backend demonstrou ser:
- **Robusto**: Com uma suíte de testes cobrindo as principais funcionalidades.
- **Seguro**: Implementando autenticação JWT, invalidação de sessão e isolamento de dados (multi-tenant).
- **Flexível**: Capaz de servir diferentes clientes, como o frontend legado (HTML/JS) e a prova de conceito em React, provando a eficácia da arquitetura de API desacoplada.

A funcionalidade de **Alertas Automáticos** para metas de despesas foi implementada e validada, completando o escopo principal do backend. A base sólida agora suporta todas as funcionalidades críticas definidas na especificação do projeto.

---

## 7. Melhorias Futuras e Considerações de Produção

Como um projeto acadêmico com prazo definido, certas simplificações foram feitas para focar no núcleo da funcionalidade. Esta seção detalha as implementações atuais e como elas evoluiriam em um ambiente de produção para garantir maior segurança, escalabilidade e manutenibilidade.

### 7.1. Segurança Avançada

#### **Gerenciamento de Sessão (Refresh Token)**
-   **Implementação Atual (Funcional):** O `refreshToken` é enviado no corpo da resposta de login e armazenado no `localStorage` do navegador. Embora funcional para o escopo do projeto, esta abordagem é vulnerável a ataques de Cross-Site Scripting (XSS), onde um script malicioso poderia roubar o token.
-   **Implementação Robusta (Nível de Produção):** A prática recomendada seria enviar o `refreshToken` em um **cookie `HttpOnly` e `Secure`**.
    -   **`HttpOnly`**: Impede que o cookie seja acessado por JavaScript no navegador, mitigando o risco de XSS.
    -   **`Secure`**: Garante que o cookie só seja enviado em requisições HTTPS.
    -   **`SameSite=Strict`**: Protege contra ataques de Cross-Site Request Forgery (CSRF).

#### **Prevenção de Ataques de Força Bruta**
-   **Implementação Atual (Simplificada):** Não há um mecanismo para limitar o número de tentativas de login.
-   **Implementação Robusta (Nível de Produção):** Implementar um middleware de **Rate Limiting** em endpoints sensíveis como `/api/auth/login` e `/api/auth/forgot-password`. Ferramentas como `express-rate-limit` poderiam ser usadas para bloquear um endereço de IP após um certo número de tentativas falhas em um curto período.

#### **Validação e Sanitização de Entradas**
-   **Implementação Atual (Funcional):** A validação de dados é feita principalmente pela camada do Mongoose (`Schema`). Isso é eficaz para garantir a integridade dos dados no banco, mas ocorre tardiamente no ciclo da requisição.
-   **Implementação Robusta (Nível de Produção):** Utilizar uma biblioteca de validação de schema, como **`Joi`** ou **`express-validator`**, em um middleware no início da rota. Isso permite:
    -   **Fail Fast:** Rejeitar requisições malformadas imediatamente, antes de tocar na lógica de negócio, economizando recursos do servidor.
    -   **Segurança:** Proteger contra ataques de injeção de NoSQL, sanitizando as entradas.
    -   **Mensagens de Erro Claras:** Retornar erros de validação detalhados e padronizados para o cliente.

### 7.2. Escalabilidade e Performance

#### **Cache de Dados**
-   **Implementação Atual (Simplificada):** Todas as requisições de leitura consultam o banco de dados diretamente.
-   **Implementação Robusta (Nível de Produção):** Implementar uma camada de cache com uma ferramenta como **Redis**. Dados que não mudam com frequência (como permissões, perfil do usuário, ou relatórios mensais) poderiam ser armazenados em cache. Isso reduziria drasticamente a carga no banco de dados e diminuiria a latência das requisições.

#### **Clusterização e Balanceamento de Carga**
-   **Implementação Atual (Simplificada):** O servidor roda em um único processo Node.js, utilizando apenas um núcleo da CPU.
-   **Implementação Robusta (Nível de Produção):** Utilizar o módulo `cluster` nativo do Node.js ou uma ferramenta como o **`PM2`** para criar um "cluster" de processos, permitindo que a aplicação utilize todos os núcleos da CPU. Em uma infraestrutura maior, múltiplos servidores seriam colocados atrás de um **Load Balancer** (como Nginx) para distribuir o tráfego.

### 7.3. Exclusão Lógica (Soft Deletes)

#### **Gerenciamento de Dados Excluídos**
-   **Implementação Atual (Simplificada):** As operações de exclusão (`DELETE`) removem os dados permanentemente do banco de dados (`findOneAndDelete`). Esta é uma **exclusão física (hard delete)**.
-   **Implementação Robusta (Nível de Produção):** A melhor prática seria implementar a **exclusão lógica (soft delete)**.
    -   **Como Funciona:** Em vez de apagar o registro, um campo como `deleted: true` e `deletedAt: new Date()` seria adicionado ao documento.
    -   **Vantagens:**
        1.  **Recuperação de Dados:** Permite restaurar dados "excluídos" acidentalmente.
        2.  **Auditoria e Conformidade:** Mantém um histórico completo dos dados, o que é crucial para auditorias e para estar em conformidade com regulamentações como a LGPD, que exigem a retenção de dados por um certo período.
    -   **Implementação:** Todas as consultas de leitura (`find`, `findOne`) seriam modificadas para incluir a condição `{ deleted: { $ne: true } }`, garantindo que os dados "excluídos" não apareçam para o usuário.

### 7.4. Testes e CI/CD

#### **Estratégia de Testes**
-   **Implementação Atual (Funcional):** A suíte de testes é focada em **testes de integração**, que validam o fluxo completo da API. Isso é excelente para garantir que os módulos funcionem bem juntos.
-   **Implementação Robusta (Nível de Produção):** Adicionar **testes unitários** para validar a lógica de funções específicas em `services` e `utils` de forma isolada, sem depender de um banco de dados ou servidor (usando "mocks"). Isso torna os testes mais rápidos, granulares e fáceis de depurar. Adicionar também **testes de ponta a ponta (E2E)** com ferramentas como Cypress ou Playwright para simular a jornada completa do usuário no navegador.

#### **Automação de Deploy (CI/CD)**
-   **Implementação Atual (Simplificada):** O processo de teste e deploy é manual.
-   **Implementação Robusta (Nível de Produção):** Configurar um pipeline de **Integração e Entrega Contínua (CI/CD)** usando ferramentas como GitHub Actions. A cada `push` para o repositório, o pipeline poderia:
    1.  Executar a suíte de testes completa (`npm test`).
    2.  Verificar a qualidade do código com um "linter".
    3.  Se tudo passar, construir uma imagem Docker da aplicação.
    4.  Fazer o deploy automático para um ambiente de homologação ou produção.

### 7.5. Sistema de Alertas e Tarefas em Background

#### **Processamento Assíncrono**
-   **Implementação Atual (Funcional):** A geração de alertas é síncrona. O `transactionController` chama e espera (`await`) a conclusão do `alertTriggerService`. Para tarefas mais pesadas (como enviar um e-mail ou uma notificação push), isso aumentaria o tempo de resposta da API.
-   **Implementação Robusta (Nível de Produção):** Utilizar **filas de mensagens** (como RabbitMQ ou AWS SQS).
    -   **Como Funciona:** Em vez de executar a tarefa imediatamente, o `transactionController` apenas publicaria uma mensagem na fila (ex: `"meta_verificar", { transactionId: "..." }`). Um processo "worker" separado e independente ouviria essa fila, processaria a tarefa (verificar a meta, enviar e-mail, etc.) e marcaria como concluída.
    -   **Vantagens:** Torna a API muito mais rápida e resiliente. Se o serviço de envio de e-mails estiver fora do ar, por exemplo, a API não falha; a mensagem simplesmente permanece na fila para ser reprocessada mais tarde. Além disso, tarefas agendadas (`cron jobs`) poderiam ser usadas para manutenção, como limpar tokens de sessão expirados ou gerar relatórios noturnos.
# Smart Gestão

`SISTEMAS DE INFORMAÇÃO`

`TRABALHO INTERDISCIPLINAR : APLICAÇÕES PARA PROCESSO DE NEGÓCIOS`

`02.2025`

Nosso projeto tem como objetivo desenvolver um sistema de controle de despesas para microempreendedores individuais (MEIs) e profissionais autônomos, visando solucionar a falta de organização financeira, uma dificuldade comum desse público. Muitos ainda utilizam métodos informais, como cadernos ou planilhas simples, dificultando o acompanhamento do fluxo de caixa e a tomada de decisões estratégicas. O sistema propõe oferecer uma ferramenta prática, acessível e intuitiva, capaz de registrar e categorizar transações, gerar relatórios, definir metas e emitir alertas, contribuindo para uma gestão financeira mais eficiente.

Além de atender a uma necessidade concreta dos pequenos negócios, o projeto promove a educação financeira ao incentivar o uso contínuo de recursos tecnológicos. A solução prioriza simplicidade e usabilidade, sem abrir mão de funcionalidades essenciais como segurança das informações e compatibilidade com múltiplas plataformas, ajudando os usuários a reduzir gastos desnecessários, melhorar o planejamento estratégico e alcançar maior sustentabilidade em seus empreendimentos.

## Integrantes

* Heron Victor Vieira da Silva
* Hugo Ferreira Silva
* Izadora Helena Pedrosa Soares Pereira
* Júlia Fernanda Alves
* Maria Clara Silva Botelho

## Orientador

* Cleia Marcia Gomes Amaral
  
## Instruções de utilização

Como este é um projeto de desenvolvimento local, qualquer membro da equipe pode configurar e executar o sistema completo em sua própria máquina. Esta seção orienta como fazer isso.

> **Nota:** Estas instruções são voltadas para a equipe de desenvolvimento. O usuário final da aplicação não precisa executar nenhum destes passos.

### Pré-requisitos
- **Node.js**: Versão 16 ou superior.
- Conta MongoDB Atlas (ou outra instância MongoDB acessível) e string de conexão

### Configuração (uma única vez)
1.  **Configure as Variáveis de Ambiente:**
    -   **Localização:** `src/codes/backend/`
    -   **Ação:** Crie uma cópia do arquivo `.env.example` e renomeie-a para `.env`. Abra este novo arquivo e preencha com suas informações, como a string de conexão do MongoDB e os segredos JWT.
    ```env
    # String de conexão com seu banco de dados MongoDB
    MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/smartgestao?retryWrites=true&w=majority
 
    # Porta em que o servidor irá rodar
    PORT=5000
 
    # Chaves secretas para gerar os tokens JWT. Use geradores de senhas fortes.
    JWT_SECRET=SEU_SEGREDO_SUPER_SEGURO_PARA_ACCESS_TOKEN
    REFRESH_TOKEN_SECRET=OUTRO_SEGREDO_SUPER_SEGURO_PARA_REFRESH_TOKEN
    ```
2.  **Instale as Dependências (Backend e React):** Este passo é crucial e precisa ser feito para ambos os projetos.
    
    -   **Passo 2.1: Instalar dependências do Backend**
    ```bash
    # Navegue até a pasta do backend
    cd src/codes/backend
    npm install
    ```
    -   **Passo 2.2: Instalar dependências do React**
    ```bash
    # A partir da pasta 'backend', suba um nível e entre na pasta 'react'
    cd ../react
    npm install
    ```

### Execução
Para iniciar todo o ambiente de desenvolvimento, o ponto de partida é sempre a pasta do backend.

1.  Navegue até a pasta do backend:
    ```bash
    cd src/codes/backend
    ```
2.  Execute o comando para a demonstração completa:
    ```bash
    npm start
    ```
    Este comando é o ponto de entrada principal e iniciará todos os serviços necessários para a demonstração completa (Backend, Frontend Legado e a Prova de Conceito em React) nas suas respectivas portas.

### Acesso rápido (fluxo mínimo)

Após iniciar o sistema, estes são os links para acessar cada ambiente no seu navegador:

-   **Aplicação Principal (Frontend Legado):**
    -   [http://localhost:3000](http://localhost:3000)
-   **Prova de Conceito (Frontend React):**
    -   [http://localhost:3001](http://localhost:3001)
-   **Verificação de Saúde da API (Backend):**
    -   [http://localhost:5000/api/health](http://localhost:5000/api/health)

1) Após iniciar o sistema, acesse `http://localhost:3000` para usar a aplicação principal ou `http://localhost:3001` para testar o login via React.
2) Caso não tenha usuário, clique em "Cadastre-se" para criar uma nova conta.
3) Faça login; ao sucesso, será redirecionado para a página inicial
4) Utilize as páginas de Transações, Metas e Relatórios

### Troubleshooting (problemas comuns)
- Porta 3000 em uso (EADDRINUSE):
  - Feche o processo que ocupa a porta ou altere a porta no script do frontend no package.json do backend (ex.: 3001).
- 401 Unauthorized nas chamadas da API:
  - Verifique se o token está salvo no localStorage e sendo enviado no header Authorization (Bearer <token>).
  - Faça logout/login novamente para renovar o token.
- Erro de CORS ao acessar API:
  - Em desenvolvimento, o backend já expõe cors(); se precisar, verifique se está ativo e/ou ajuste origens permitidas.
- Conexão com MongoDB falhando:
  - Confirme MONGODB_URI no .env, usuário/senha corretos, e whitelist de IPs no Atlas.
- Falha ao iniciar o frontend:
  - O script npm start do backend usa um servidor estático simples (http-server). Caso 3000 esteja ocupada, ajuste a porta no script.

### Executando os Testes Automatizados

Para garantir a qualidade e a estabilidade do backend, o projeto conta com uma suíte de testes de integração completa.

1.  Navegue até a pasta do backend: `cd src/codes/backend`
2.  Execute o comando:
    ```bash
    npm test
    ```
Este comando irá conectar-se ao seu banco de dados configurado, criar dados de teste temporários, executar todos os testes de validação da API e, ao final, **remover apenas os dados que ele criou**, garantindo que seus dados de desenvolvimento permaneçam intocados. Para mais detalhes, consulte o Roteiro de Testes Automatizados.

## Guia Rápido da API (Para Integração)

Esta seção serve como um guia de referência para consumir os principais endpoints da API. Todos os exemplos assumem que um token de autenticação (`$TOKEN`) foi obtido após o login e está sendo enviado no cabeçalho `Authorization: Bearer $TOKEN`.

---

#### Autenticação e Sessão
- **Registro:** `POST /api/auth/register`
  - Body: `{ "companyName", "cnpj", "name", "email", "password" }`
- **Login:** `POST /api/auth/login`
  - Body: `{ "email", "password" }`
- **Logout (Recomendado):** `POST /api/auth/logout`
  - Body: `{ "refreshToken" }`

---

#### Transações (CRUD)
- **Listar:** `GET /api/transactions`
- **Criar:** `POST /api/transactions`
  - Body: `{ "description", "amount", "type", "date" }`
- **Atualizar:** `PUT /api/transactions/{id}`
  - Body: `{ "description", "amount", "status", ... }`
- **Excluir:** `DELETE /api/transactions/{id}`

---

#### Anexos de Transações
- **Upload (PDF/Imagem):** `POST /api/transactions/{id}/upload`
  - **Body**: Requer um `FormData` com o campo `attachment`. O frontend não deve definir o `Content-Type`, pois o navegador o fará automaticamente.
- **Excluir Anexo:** `DELETE /api/transactions/{id}/upload`

---

#### Metas (CRUD)
- **Listar:** `GET /api/goals`
- **Criar:** `POST /api/goals`
  - Body: `{ "title", "targetAmount", "type" }`
- **Atualizar:** `PUT /api/goals/{id}`
- **Excluir:** `DELETE /api/goals/{id}`

---

#### Clientes (CRUD)
- **Listar:** `GET /api/clients`
- **Criar:** `POST /api/clients`
  - Body: `{ "name", "email", "type" }`

---

#### Funcionalidades Avançadas

- **Exportar Relatório PDF:** `GET /api/reports/export/transactions-pdf`
  - **Consumo no Frontend:** A resposta deve ser tratada como um `blob` para forçar o download do arquivo no navegador.

- **Recuperação de Senha:**
  1. `POST /api/auth/forgot-password` (Body: `{ "email" }`)
  2. `POST /api/auth/reset-password/:token` (Body: `{ "password" }`)

- **Subscrição para Notificações Push:** `POST /api/notifications/subscribe`
  - **Body**: O objeto `PushSubscription` gerado pelo navegador.

> **Nota**: Para uma validação completa e automatizada, execute `npm test` na pasta do backend ou consulte a documentação da suíte de testes em `src/codes/backend/Testes/Docs/roteiro de testes automatizados.md`.

## Arquitetura e Prova de Conceito com React

O projeto foi desenvolvido com uma arquitetura desacoplada, onde o **backend (API RESTful)** é totalmente independente do **frontend**. Embora a implementação principal do frontend utilize HTML, CSS e JavaScript puro, a robustez da API permite que ela seja consumida por qualquer tipo de cliente.

Para demonstrar essa flexibilidade e a viabilidade de uma futura modernização, foi criada uma **prova de conceito** com a implementação da página de login utilizando **React**.

### Objetivo da Prova de Conceito
- **Validar a API**: Demonstrar que o backend está pronto para servir aplicações modernas.
- **Simular Migração Gradual**: Mostrar como novas funcionalidades poderiam ser desenvolvidas em React e integradas ao sistema legado.
- **Interoperabilidade**: Provar que a autenticação via React funciona em conjunto com o sistema legado, compartilhando a mesma sessão de usuário.

> Para executar e entender os detalhes desta demonstração, consulte a documentação específica no diretório: [`src/codes/react/Readme-React.md`](src/codes/react/Readme-React.md).

# Documentação

<ol>
<li><a href="docs/1-Contexto-SG.md"> Documentação de Contexto</a></li>
<li><a href="docs/2-Especificação.md"> Especificação do Projeto</a></li>
<li><a href="docs/3-Modelagem-Processos-Negócio.md"> Modelagem dos Processos de Negocio</a></li>
<li><a href="docs/4-Projeto-Solucao.md"> Projeto da solução</a></li>
<li><a href="docs/5-Gerenciamento-Projeto.md"> Gerenciamento do Projeto</a></li>
<li><a href="docs/6-Interface-Sistema.md"> Interface do Sistema</a></li>
<li><a href="docs/7-Conclusão.md"> Conclusão</a></li>
<li><a href="docs/8-Referências.md"> Referências</a></li>
</ol>

# Código

<li><a href="src/codes/README.md"> Código Fonte</a></li>

# Apresentação

<li><a href="presentation/README.md"> Apresentação da solução</a></li>

## Histórico de versões
* 0.3.14
    * **CHANGE**: Correção final da suíte de testes. Adição de validação de `ObjectId` em todos os controllers para tratamento robusto de IDs inválidos, resolvendo a falha no teste de upload e garantindo que todos os 23 testes de funcionalidades passem com sucesso.
* 0.3.13
    * **CHANGE**: Padronização completa da nomenclatura do módulo de "Metas". O `metaController.js`, `metaRoutes.js` e o modelo `Meta.js` foram renomeados para `goalController.js`, `goalRoutes.js` e `Goal.js`, respectivamente. Todas as referências e importações foram ajustadas, e os endpoints padronizados com o `responseHelper`, eliminando inconsistências e melhorando a clareza da arquitetura.
* 0.3.12
    * **CHANGE**: Implementação de um ambiente de testes robusto com limpeza seletiva, garantindo que os testes automatizados não interfiram nos dados de desenvolvimento manual. Adição de um teste de "persistência" para validar essa garantia.
* 0.3.11
    * **CHANGE**: Implementação da funcionalidade de upload de anexos (PDF, PNG, JPG, JPEG) para transações, com organização de arquivos em uma estrutura de pastas robusta e segura no backend. Adição de testes automatizados para validar o upload e a exclusão de anexos.
* 0.3.10
    * **CHANGE**: Criação da estrutura base para o sistema de alertas automáticos, utilizando `node-cron` para agendamento de tarefas e um serviço de notificação modular, preparando o terreno para futuras implementações de notificações push.
* 0.3.9
    * **CHANGE**: Reorganização e renumeração da suíte de testes automatizados para seguir uma sequência lógica. Atualização da documentação do projeto (planejamento e READMEs) para refletir o estado atual do desenvolvimento e a arquitetura de testes.
* 0.3.8
    * **CHANGE**: Adição de testes automatizados para funcionalidades pendentes (Exportação de PDF e Cadastro de Clientes), seguindo a abordagem de Desenvolvimento Guiado por Testes (TDD). Organização da suíte de testes em arquivos modulares.
* 0.3.7
    * **CHANGE**: Finalização dos scripts de lógica do frontend (Transações, Metas, Exportação) e criação de um guia de integração detalhado para o desenvolvedor frontend, garantindo a correta vinculação entre HTML e JavaScript.
* 0.3.6
    * **CHANGE**: Finalização e estabilização da prova de conceito em React. Correção do fluxo de login para garantir a interoperabilidade de sessão com o sistema legado sem a necessidade de login duplo. Documentação do processo de depuração e da solução final.
* 0.3.5
    * **CHANGE**: Criação de uma prova de conceito com React para a página de login, demonstrando a flexibilidade da API do backend. Adição de scripts (`start:full-demo`) para orquestrar a execução simultânea de todos os ambientes (backend, frontend legado e React).
* 0.3.4
    * **CHANGE**: Validação final de toda a estrutura de documentação e comentários do projeto. Ajustes de consistência e correção de informações nos arquivos README principais e documentos de planejamento.
* 0.3.3
    * **CHANGE**: Refatoração completa dos comentários em todo o código do backend (controllers, models, routes, middlewares, utils, scripts) para melhorar a clareza e a manutenibilidade. Criação e aprimoramento da documentação técnica (`README.md`) em todas as pastas principais.
* 0.2.9
    * **CHANGE**: Implementação de segurança de sessão avançada com expiração de token por inatividade (30 min), renovação automática (refresh token) e proteção contra roubo de token (fingerprinting). Adição de `authGuard` para proteger rotas do frontend. Correção da inicialização do servidor de desenvolvimento.
* 0.2.3
    * **CHANGE**: Padronização do feedback de erro e carregamento no frontend, removendo `alerts` e adicionando indicadores visuais para melhorar a experiência do usuário. 
* 0.2.2
    * **CHANGE**: Refatoração do backend para incluir um middleware de escopo (`companyScopeMiddleware`), garantindo que os dados de uma empresa não sejam acessados por outra.
* 0.2.1
    * **CHANGE**: Criação de modelos JSON para requisições da API e organização da documentação técnica para padronizar o desenvolvimento.
* 0.2.0
    * **CHANGE**: Implementação completa da integração frontend-backend. Sistema de autenticação JWT implementado. Reorganização da estrutura de arquivos para melhor manutenção. Documentação técnica detalhada adicionada.
* 0.1.11
    * **CHANGE**: Configuração do backend para utilizar variáveis de ambiente (`.env`), separando configurações sensíveis (como segredos de token e string de conexão do banco de dados) do código-fonte.
* 0.1.9
    * **CHANGE**: Desenvolvimento do backend em Node.js/Express. Implementação das APIs RESTful para transações e metas financeiras. Configuração do MongoDB e modelos de dados.
* 0.1.8
    * **CHANGE**: Desenvolvimento do frontend com HTML5/CSS3/JS. Implementação das telas de cadastro, login, transações e relatórios. Adição de validações e feedback visual.
* 0.1.7
    * **CHANGE**: Atualização da documentação técnica. Criação dos diagramas de arquitetura e fluxos de dados. Definição dos endpoints da API.
* 0.1.6
    * **CHANGE**: Definição da arquitetura do sistema. Escolha das tecnologias e frameworks. Configuração inicial do ambiente de desenvolvimento.
* 0.1.5
    * **CHANGE**: Finalização da modelagem de processos. Definição dos requisitos técnicos e regras de negócio.
* 0.1.4
    * **CHANGE**: Atualização das documentações. Códigos de estruturação do programa ajustados para simular as melhores práticas de programação. Reajuste na estrutura das pastas do projeto.
* 0.1.3
    * **CHANGE**: Atualização das documentações. Códigos de estruturação do programa iniciados. Reajuste na estrutura das pastas do projeto.
* 0.1.2
    * **CHANGE**: Atualização das documentações. Código permaneceu inalterado. Reajuste na estrutura das pastas e localização de arquivos.
* 0.1.1
    * **CHANGE**: Atualização das documentações. Código permaneceu inalterado.
* 0.1.0
    * **CHANGE**: Início da especificação do projeto com a definição de Personas, Histórias de Usuários e levantamento de Requisitos Funcionais e Não Funcionais.
* 0.0.1
    * **CHANGE**: Trabalhando na modelagem do processo de negócio.

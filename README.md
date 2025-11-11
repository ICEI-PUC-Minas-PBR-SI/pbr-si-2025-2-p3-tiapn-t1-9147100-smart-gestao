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

Esta seção orienta como executar o sistema localmente para fins acadêmicos/demonstração. Usuários finais não precisam executar servidores; esta instrução é voltada à equipe/desenvolvedores.

### Pré-requisitos
- Node.js instalado
- Conta MongoDB Atlas (ou outra instância MongoDB acessível) e string de conexão

### Configuração (uma única vez)
1.  **Navegue até a pasta do backend:**
    ```bash
    cd src/codes/backend
    ```
2.  **Crie o arquivo de ambiente:**
    Copie o arquivo `.env.example` (se existir) para um novo arquivo chamado `.env` na mesma pasta (`src/codes/backend`).
3.  **Configure as variáveis de ambiente:**
    Abra o arquivo `.env` e preencha com suas informações, como a string de conexão do MongoDB e os segredos JWT.
    ```env
    # String de conexão com seu banco de dados MongoDB
    MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/smartgestao?retryWrites=true&w=majority

    # Porta em que o servidor irá rodar
    PORT=5000

    # Chaves secretas para gerar os tokens JWT. Use geradores de senhas fortes.
    JWT_SECRET=SEU_SEGREDO_SUPER_SEGURO_PARA_ACCESS_TOKEN
    REFRESH_TOKEN_SECRET=OUTRO_SEGREDO_SUPER_SEGURO_PARA_REFRESH_TOKEN
    ```
4.  **Instale as dependências do projeto:**
   ```bash
   npm install
   ```

### Execução
Para iniciar os servidores do backend e frontend, execute o seguinte comando a partir da pasta `src/codes/backend`:
```bash
npm start
```
Isso inicia:
- Backend em http://localhost:5000 (health: http://localhost:5000/api/health)
- Frontend (servidor estático) em http://localhost:3000

### Acesso rápido (fluxo mínimo)
1) Abra http://localhost:3000 no seu navegador. Você será redirecionado para a tela de login.
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

### Testes de integração (para a equipe)
Objetivo: validar o fluxo ponta a ponta sem ferramentas complexas.

- Auth
  - Registro: via cadastro.html ou requisição direta
    ```powershell
    # PowerShell: ajuste email/senha
    Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/auth/register -Body (@{name='Teste'; email='teste@ex.com'; password='123456'} | ConvertTo-Json) -ContentType 'application/json'
    ```
  - Login: via login.html; valida que o token é salvo no localStorage e ocorre redirecionamento.
- Transações
  - Listar:
    - Após login, a página de transações deve exibir dados; alternativamente via API com Authorization: Bearer <token>.
  - Criar:
    - Enviar formulário da página de transações; validar que aparece na listagem.
- Metas
  - Criar e listar metas pela página correspondente, confirmando persistência.
- Relatórios
  - Acessar a página ou endpoint GET /api/reports com filtros básicos.

> **Nota**: Para uma validação mais completa e automatizada, consulte a documentação da suíte de testes em `src/codes/backend/Testes/Docs/roteiro de testes automatizados.md`.

Critérios de sucesso:
- Respostas 2xx com payload esperado; em 401, redireciona para login; erros 4xx/5xx exibem mensagem clara.

Notas:
- Estes testes são para a equipe/admin em ambiente local. Usuário final não precisa executar servidores ou testes.

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
<li><a href="docs/1-Contexto.md"> Documentação de Contexto</a></li>
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

* 0.3.10
    * CHANGE: Estabilização completa do ambiente de testes automatizados. Refatoração do setup de testes para interação direta com o banco de dados em memória, eliminando condições de corrida e garantindo um ambiente isolado e confiável. Orquestração precisa dos scripts de teste e servidor.
* 0.3.9
    * CHANGE: Adição de testes automatizados para funcionalidades pendentes (Exportação de PDF e Cadastro de Clientes), seguindo a abordagem de Desenvolvimento Guiado por Testes (TDD). Organização da suíte de testes em arquivos modulares.
* 0.3.8
    * CHANGE: Finalização dos scripts de lógica do frontend (Transações, Metas, Exportação) e criação de um guia de integração detalhado para o desenvolvedor frontend, garantindo a correta vinculação entre HTML e JavaScript.
* 0.3.7
    * CHANGE: Finalização e estabilização da prova de conceito em React. Correção do fluxo de login para garantir a interoperabilidade de sessão com o sistema legado sem a necessidade de login duplo. Documentação do processo de depuração e da solução final.
* 0.3.6
    * CHANGE: Criação de uma prova de conceito com React para a página de login, demonstrando a flexibilidade da API do backend. Adição de scripts (`start:full-demo`) para orquestrar a execução simultânea de todos os ambientes (backend, frontend legado e React).
* 0.3.5
    * CHANGE: Validação final de toda a estrutura de documentação e comentários do projeto. Ajustes de consistência e correção de informações nos arquivos README principais e documentos de planejamento.
* 0.3.4
    * CHANGE: Refatoração completa dos comentários em todo o código do backend (controllers, models, routes, middlewares, utils, scripts) para melhorar a clareza e a manutenibilidade. Criação e aprimoramento da documentação técnica (`README.md`) em todas as pastas principais.
* 0.3.3
    * CHANGE: Implementação de uma suíte de testes automatizados de integração para a API, cobrindo os módulos de Autenticação, Isolamento de Dados (Multi-Tenant), Transações (CRUD) e Metas (CRUD) para garantir a estabilidade e qualidade do backend.
* 0.3.2
    * CHANGE: Implementação da funcionalidade de exclusão de usuário e todos os seus dados associados (empresa, transações, metas), em conformidade com as boas práticas de gestão de dados.
* 0.3.1
    * CHANGE: Implementação do fluxo de recuperação de senha ("Esqueci minha senha"), incluindo novas rotas no backend e a criação das páginas de solicitação e redefinição no frontend.
* 0.3.0
    * CHANGE: Implementação de segurança de sessão avançada com expiração de token por inatividade (30 min), renovação automática (refresh token) e proteção contra roubo de token (fingerprinting). Adição de `authGuard` para proteger rotas do frontend. Correção da inicialização do servidor de desenvolvimento.
* 0.2.3
    * CHANGE: Padronização do feedback de erro e carregamento no frontend, removendo `alerts` e adicionando indicadores visuais para melhorar a experiência do usuário. 
* 0.2.2
    * CHANGE: Refatoração do backend para incluir um middleware de escopo (`companyScopeMiddleware`), garantindo que os dados de uma empresa não sejam acessados por outra.
* 0.2.1
    * CHANGE: Criação de modelos JSON para requisições da API e organização da documentação técnica para padronizar o desenvolvimento.
* 0.2.0
    * CHANGE: Implementação completa da integração frontend-backend. Sistema de autenticação JWT implementado. Reorganização da estrutura de arquivos para melhor manutenção. Documentação técnica detalhada adicionada.
* 0.1.11
    * CHANGE: Configuração do backend para utilizar variáveis de ambiente (`.env`), separando configurações sensíveis (como segredos de token e string de conexão do banco de dados) do código-fonte.
* 0.1.9
    * CHANGE: Desenvolvimento do backend em Node.js/Express. Implementação das APIs RESTful para transações e metas financeiras. Configuração do MongoDB e modelos de dados.
* 0.1.8
    * CHANGE: Desenvolvimento do frontend com HTML5/CSS3/JS. Implementação das telas de cadastro, login, transações e relatórios. Adição de validações e feedback visual.
* 0.1.7
    * CHANGE: Atualização da documentação técnica. Criação dos diagramas de arquitetura e fluxos de dados. Definição dos endpoints da API.
* 0.1.6
    * CHANGE: Definição da arquitetura do sistema. Escolha das tecnologias e frameworks. Configuração inicial do ambiente de desenvolvimento.
* 0.1.5
    * CHANGE: Finalização da modelagem de processos. Definição dos requisitos técnicos e regras de negócio.
* 0.1.4
    * CHANGE: Atualização das documentações. Códigos de estruturação do programa ajustados para simular as melhores práticas de programação. Reajuste na estrutura das pastas do projeto.
* 0.1.3
    * CHANGE: Atualização das documentações. Códigos de estruturação do programa iniciados. Reajuste na estrutura das pastas do projeto.
* 0.1.2
    * CHANGE: Atualização das documentações. Código permaneceu inalterado. Reajuste na estrutura das pastas e localização de arquivos.
* 0.1.1
    * CHANGE: Atualização das documentações. Código permaneceu inalterado.
* 0.1.0
    * CHANGE: Início da especificação do projeto com a definição de Personas, Histórias de Usuários e levantamento de Requisitos Funcionais e Não Funcionais.
* 0.0.1
    * Trabalhando na modelagem do processo de negócio.

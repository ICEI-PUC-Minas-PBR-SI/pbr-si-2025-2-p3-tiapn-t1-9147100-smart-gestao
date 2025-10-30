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
- Conta MongoDB Atlas já criada e banco configurado no portal, com:
  - Cluster/projeto ativo
  - Database e usuário ADMIN já provisionados
  - IP do desenvolvedor liberado em Network Access
  - String de conexão (MONGODB_URI) disponível

### Configuração (uma única vez)
1) Backend: instalar dependências
   ```bash
   cd src/codes/backend
   npm install
   ```
2) Backend: criar arquivo .env (baseado em .env.example se houver)
   Crie src/codes/backend/.env com conteúdo semelhante:
   ```env
   MONGODB_URI=sua_string_conexao_mongodb
   JWT_SECRET=um_segredo_aleatorio_seguro
   PORT=5000
   LOG_LEVEL=info
   ```
   Observações importantes:
   - MONGODB_URI: copie do portal do MongoDB Atlas (Connection string). Ex.: mongodb+srv://usuarioAdmin:senha@cluster.../nomeBanco?retryWrites=true&w=majority
   - Liberação de IP: em Network Access, adicione seu IP (ou 0.0.0.0/0 somente para desenvolvimento).
   - Usuário ADMIN: use credenciais administrativas para permitir criação inicial de coleções/registros.
   - JWT_SECRET: defina um segredo aleatório para assinar tokens.
   - PORT: mantenha 5000 para compatibilidade com o frontend (que sobe em 3000).

### Execução (sobe backend e frontend juntos)
No diretório do backend execute:
```bash
cd src/codes/backend
npm start
```
Isso inicia:
- Backend em http://localhost:5000 (health: http://localhost:5000/api/health)
- Frontend (servidor estático) em http://localhost:3000 (servindo páginas em src/codes/frontend/pages)

Ordem recomendada de verificação:
1) Verifique health: abra http://localhost:5000/api/health (deve responder OK com status e data)
2) Abra o frontend: http://localhost:3000/login.html
3) Realize cadastro/login conforme perfil (admin primeiro, depois usuários comuns)
4) Navegue pelas páginas internas (transações, metas, relatórios)

### Acesso rápido (fluxo mínimo)
1) Admin: realizar primeiro acesso
   - Se o ambiente estiver zerado, efetue o cadastro do usuário admin (ou use seed/política definida) e acesse o sistema.
   - Admin cria os primeiros usuários finais (sem privilégios administrativos).
2) Usuário final: login
   - Acessa http://localhost:3000/login.html
   - Informa as credenciais fornecidas pelo admin
3) Uso do sistema
   - Navega pelas páginas e executa processos: cadastrar transações, definir metas, consultar relatórios, etc.

### Troubleshooting (problemas comuns)
- Porta 3000 em uso (EADDRINUSE):
  - Feche o processo que ocupa a porta ou altere a porta no script do frontend no package.json do backend (ex.: 3001).
- 401 Unauthorized nas chamadas da API:
  - Verifique se o token está salvo no localStorage e sendo enviado no header Authorization (Bearer <token>).
  - Faça logout/login novamente para renovar o token.
- Erro de CORS ao acessar API:
  - Em desenvolvimento, o backend já expõe cors(); se precisar, verifique se está ativo e/ou ajuste origens permitidas.
- Conexão com MongoDB falhando:
  - Confirme MONGODB_URI no .env, usuário/senha corretos; teste conexão no portal (Connect > Drivers) e verifique whitelist de IPs no Atlas.
  - Verifique se o usuário ADMIN possui permissão no database alvo.
- Falha ao iniciar o frontend:
  - O script npm start do backend usa um servidor estático simples (http-server). Caso 3000 esteja ocupada, ajuste a porta no script.
- Permissões/Perfis:
  - Caso um usuário sem privilégios tente acessar rotas administrativas, o backend retornará 403; revise as permissões do perfil.

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

Critérios de sucesso:
- Respostas 2xx com payload esperado; em 401, redireciona para login; erros 4xx/5xx exibem mensagem clara.

Notas:
- Estes testes são para a equipe/admin em ambiente local. Usuário final não precisa executar servidores ou testes.

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

<li><a href="src/README.md"> Código Fonte</a></li>

# Apresentação

<li><a href="presentation/README.md"> Apresentação da solução</a></li>

## Histórico de versões

* 0.2.0
    * CHANGE: Implementação completa da integração frontend-backend. Sistema de autenticação JWT implementado. Reorganização da estrutura de arquivos para melhor manutenção. Documentação técnica detalhada adicionada.
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
    * Implementação da funcionalidade X pertencente ao processo P.
* 0.0.1
    * Trabalhando na modelagem do processo de negócio.


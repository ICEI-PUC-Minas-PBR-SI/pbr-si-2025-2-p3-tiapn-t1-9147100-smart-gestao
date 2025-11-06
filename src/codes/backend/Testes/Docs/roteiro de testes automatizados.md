# Roteiro de Testes Automatizados - Smart Gestão API

## 1. Introdução

Este documento detalha o processo de execução dos testes automatizados para a API (backend) do projeto Smart Gestão. O objetivo destes testes é garantir a qualidade, estabilidade e o correto funcionamento das regras de negócio a cada nova alteração no código.

Os testes são do tipo "integração", o que significa que eles validam o fluxo completo de uma requisição, desde a chamada da rota até a resposta final, interagindo com o banco de dados.

## 2. Arquivos e Ferramentas Utilizadas

A estrutura de testes está centralizada na pasta `src/codes/backend/Testes/` e utiliza as seguintes ferramentas:

- **Jest**: Plataforma de testes em JavaScript. É o orquestrador que executa os testes e verifica os resultados.
- **Axios**: Biblioteca para fazer requisições HTTP. É usada para simular um cliente (como o frontend) se comunicando com a nossa API.
- **`concurrently`**: Ferramenta que nos permite rodar múltiplos scripts ao mesmo tempo (exibir no console e salvar em log).

### Arquivos Principais:

- **`package.json`**: Contém os scripts para executar os testes.
- **`Testes/jest.config.js`**: Arquivo de configuração do Jest. Define onde os testes estão e como devem se comportar.
- **`Testes/api.test.js`**: O coração dos nossos testes. É aqui que os cenários de teste (cadastro, login, etc.) são escritos.
- **`Testes/resultados/`**: Pasta onde os logs de cada execução de teste são salvos.

## 3. Configuração do Ambiente

Antes de executar os testes, certifique-se de que o ambiente está configurado corretamente.

1.  **Instalar Dependências**: Na pasta `src/codes/backend`, execute o comando abaixo para instalar todas as dependências do projeto, incluindo as de teste.
    ```bash
    npm install
    ```

2.  **Iniciar o Servidor Backend**: Os testes de integração precisam que a API esteja no ar para receber as requisições. Em um terminal, na pasta `src/codes/backend`, inicie o servidor em modo de desenvolvimento.
    ```bash
    npm run dev
    ```
    Aguarde a mensagem "🚀 Servidor rodando na porta 5000" para confirmar que o servidor iniciou com sucesso.

## 4. Execução e Validação dos Testes

Com o servidor backend rodando, abra um **segundo terminal** na mesma pasta (`src/codes/backend`) para executar os testes.

### Comando Principal de Teste

Execute o seguinte comando:

```bash
npm test
```

Este comando foi configurado para realizar duas ações simultaneamente:

1.  **Exibição no Console**: Os resultados dos testes (sucessos e falhas) serão exibidos em tempo real no seu console. Isso permite um feedback rápido e visual durante o desenvolvimento.
2.  **Geração de Log**: Um novo arquivo de log em formato de texto (`.txt`) será criado na pasta `Testes/resultados/`. O nome do arquivo conterá a data e a hora da execução (ex: `log_2025-11-05_23-10-15.txt`), garantindo um histórico completo e organizado de cada execução.

### Cenários de Teste Implementados

#### Módulo de Autenticação
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/api.test.js`
- **Descrição:** Este conjunto de testes valida o fluxo completo de autenticação, garantindo que o acesso ao sistema é seguro e funcional.
- **Cenários Cobertos:**
    - **`RF-001: deve cadastrar um novo usuário e empresa`**: Verifica se um usuário pode ser criado com sucesso (Status 201).
    - **`deve barrar o cadastro de um usuário com e-mail já existente`**: Garante que a API retorna um erro de conflito (Status 409) ao tentar usar um e-mail duplicado.
    - **`deve falhar o login com senha incorreta`**: Valida se a API retorna um erro de não autorizado (Status 401) para credenciais inválidas.
    - **`deve realizar o login com sucesso para a Empresa A`**: Confirma que um usuário válido consegue fazer login e receber os tokens de autenticação.
    - **`deve proteger rotas, barrando acesso sem token`**: Assegura que rotas protegidas não podem ser acessadas sem um token de autenticação válido.

#### Módulo de Isolamento de Dados (Multi-Tenant)
- **Status:** ✅ **Validado**
- **Arquivo de Teste:** `Testes/multi-tenant.test.js`
- **Descrição:** Este é um dos testes mais críticos do sistema. Ele cria múltiplas empresas (atualmente 5) e valida rigorosamente que os dados de uma empresa não podem ser acessados, modificados ou listados por outra.
- **Cenários Cobertos:**
    - **`deve criar uma transação para cada empresa`**: Garante que o ambiente de teste com múltiplos inquilinos seja configurado corretamente.
    - **`deve impedir que uma empresa acesse a transação de outra`**: Tenta, propositalmente, que cada empresa acesse os dados das outras, esperando um erro 404 (Não Encontrado), o que prova o isolamento.
    - **`deve garantir que cada empresa liste apenas suas próprias transações`**: Confirma que o endpoint de listagem retorna apenas os dados pertencentes à empresa autenticada.

---
*Este documento deve ser atualizado conforme novos blocos de teste (Isolamento de Dados, Transações, etc.) forem adicionados.*
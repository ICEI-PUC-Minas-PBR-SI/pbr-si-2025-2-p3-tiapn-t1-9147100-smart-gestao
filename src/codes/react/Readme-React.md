# ⚛️ Prova de Conceito com React - Smart Gestão

Este diretório (`src/codes/react`) contém uma implementação da tela de login utilizando a biblioteca **React**.

## 1. Objetivo

O principal objetivo desta implementação não é substituir o frontend legado (baseado em HTML, CSS e JavaScript puro), mas sim servir como uma **prova de conceito (Proof of Concept - PoC)** e demonstração técnica.

O intuito é validar e demonstrar os seguintes pontos cruciais da arquitetura do projeto:

1.  **Robustez do Backend**: Provar que a API RESTful é agnóstica à tecnologia do cliente, podendo ser consumida de forma idêntica tanto pelo frontend legado (HTML/JS) quanto por uma aplicação moderna em React.
2.  **Capacidade de Migração Gradual**: Demonstrar um caminho viável para modernizar o sistema. O fluxo implementado (login em React que redireciona para o sistema legado) simula um cenário onde novas funcionalidades poderiam ser desenvolvidas em React e integradas ao sistema existente sem a necessidade de uma reescrita completa e imediata.
3.  **Interoperabilidade de Sessão**: Provar que a autenticação é desacoplada da interface. O React gerencia o login, salva o token JWT no `localStorage` e, em seguida, o sistema legado utiliza esse mesmo token para autorizar o usuário, garantindo uma experiência de usuário contínua e sem interrupções.

## 2. Funcionalidade Implementada

Apenas a **página de login** foi recriada como um componente React, servindo como uma réplica visual e funcional da página `login.html` original.

O fluxo de funcionamento é o seguinte:
1.  O usuário acessa a aplicação React (que exibe a tela de login).
2.  Ele insere suas credenciais (e-mail e senha).
3.  O componente React envia uma requisição `POST` para o endpoint `/api/auth/login` do backend.
4.  Em caso de sucesso:
    *   O token JWT e os dados do usuário são recebidos.
    *   Esses dados são salvos no `localStorage` do navegador.
    *   O usuário é **redirecionado** para a página `startPage.html` do sistema legado.
5.  A partir deste ponto, o script `authGuard.js` do sistema legado assume o controle. Ele verifica a existência do token no `localStorage`, autoriza a sessão e permite que o usuário navegue normalmente pelas páginas HTML/JS existentes.

## 3. Como Executar esta Demonstração

Para evitar conflitos de porta e simplificar a execução, foi criado um script que orquestra todos os servidores necessários (API, frontend legado e frontend React).

1.  **Instale as Dependências (Apenas na primeira vez):**
    Antes de iniciar, garanta que as dependências de ambos os projetos (backend e react) estejam instaladas.
    ```bash
    # No diretório src/codes/backend
    npm install
    
    # No diretório src/codes/react
    npm install
    ```

2.  **Inicie o Ambiente Completo:**
    Abra um único terminal na pasta `src/codes/backend` e execute o comando de demonstração:
    ```bash
    npm start
    ```
    Este comando irá iniciar simultaneamente:
    - O **Backend (API)** na porta `5000`.
    - O **Frontend Legado** na porta `3000`.
    - O **Frontend React** na porta `3001`.

3.  **Acesse a Demonstração:**
    Abra seu navegador e acesse **`http://localhost:3001`**.

Ao fazer login na página em React, você será redirecionado para o sistema legado em `http://localhost:3000/pages/startPage.html`, com a sessão de usuário funcionando perfeitamente.

## 4. Desafios e Soluções no Desenvolvimento

Durante a configuração e integração desta prova de conceito, diversos desafios técnicos foram encontrados e superados, servindo como aprendizado e reforçando a robustez da arquitetura final.

1.  **Erro de `react-scripts`**:
    -   **Sintoma:** O ambiente React não iniciava devido a uma dependência corrompida no `package-lock.json`.
    -   **Solução:** Limpeza completa das dependências (`rm -rf node_modules package-lock.json`) e fixação da versão do `react-scripts` no `package.json` para garantir a estabilidade.
2.  **Estrutura de Pastas Incorreta**:
    -   **Sintoma:** A aplicação falhava ao compilar por não encontrar arquivos como `index.html` e os componentes `.js`.
    -   **Solução:** A estrutura de pastas foi ajustada para o padrão esperado pelo `create-react-app`, com as pastas `public` e `src` no nível correto do projeto React.
3.  **Importação de CSS Externo**:
    -   **Sintoma:** O React, por segurança, proíbe a importação de arquivos de fora do diretório `src` (`ModuleScopePlugin`).
    -   **Solução:** O arquivo CSS do sistema legado foi copiado para dentro da pasta `src` do projeto React, tornando-o autocontido e resolvendo o problema de escopo.
4.  **Redirecionamento Indesejado (O "Login Duplo")**:
    -   **Sintoma:** Após o login bem-sucedido no React, o usuário era redirecionado para a página inicial legada, que por sua vez o redirecionava de volta para a tela de login.
    -   **Causa Raiz:** O `authGuard.js` do sistema legado não verificava apenas o `token`, mas também a existência do objeto `user` no `localStorage`. Como o React salvava apenas o token, o guardião considerava a sessão inválida.
    -   **Solução:** A lógica do componente de login em React foi ajustada para salvar tanto o `token` quanto o objeto `user` no `localStorage`, garantindo uma transição de sessão perfeita e validando a interoperabilidade.

Essas etapas de depuração foram cruciais para validar e solidificar a interoperabilidade entre as duas tecnologias de frontend, provando a flexibilidade da arquitetura do backend.

---

## 5. Roteiro Sugerido para Migração Completa para React

A prova de conceito atual valida a interoperabilidade. Uma migração completa do sistema para React modernizaria a base de código, melhoraria a manutenibilidade e a experiência do desenvolvedor. Abaixo está um roteiro sugerido para essa migração, que pode ser executada de forma gradual.

### Etapa 1: Estrutura do Projeto e Roteamento

-   **Ação:** Configurar o `react-router-dom` para gerenciar a navegação da aplicação.
-   **Detalhes:** Criar rotas para cada página principal do sistema (`/`, `/login`, `/dashboard`, `/transactions`, `/goals`, `/reports`). Isso substituirá a necessidade de múltiplos arquivos `.html` e centralizará o controle de navegação.
-   **Exemplo de Estrutura de Rotas:**
    ```jsx
    import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

    function App() {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
            {/* ... outras rotas protegidas */}
          </Routes>
        </BrowserRouter>
      );
    }
    ```

### Etapa 2: Componentização da UI

-   **Ação:** Desmembrar a UI legada em componentes React reutilizáveis.
-   **Exemplos de Componentes a Criar:**
    -   `Header.js`: O cabeçalho superior com o nome do usuário e o botão de logout.
    -   `Sidebar.js`: O menu de navegação lateral.
    -   `TransactionList.js`: A tabela que exibe as transações.
    -   `TransactionForm.js`: O modal ou formulário para adicionar/editar uma transação.
    -   `GoalCard.js`: O card que exibe uma meta individual.

### Etapa 3: Gerenciamento de Estado Centralizado

-   **Ação:** Implementar a **Context API** do React para gerenciar o estado global da aplicação.
-   **Detalhes:** Criar um `AuthContext` para armazenar as informações do usuário e o status de autenticação. Isso elimina a necessidade de ler o `localStorage` repetidamente em diferentes componentes e centraliza a lógica de login/logout.
-   **Exemplo de `AuthContext`:**
    ```jsx
    const AuthContext = React.createContext();

    function AuthProvider({ children }) {
      const [user, setUser] = useState(null);
      // Lógica de login, logout, etc.
      const value = { user, login, logout };
      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    }
    ```

### Etapa 4: Centralizar o Acesso à API

-   **Ação:** Criar um "serviço de API" ou um custom hook (ex: `useApi`) para centralizar todas as requisições `fetch`.
-   **Benefícios:**
    -   **Não Repetir Código (DRY):** A lógica para adicionar o cabeçalho `Authorization` fica em um único lugar.
    -   **Gerenciamento de Refresh Token:** Este serviço seria o local ideal para implementar a lógica de renovação automática de sessão (interceptar erros `401 Unauthorized` e usar o `refreshToken`).
    -   **Tratamento de Erros:** Padroniza como os erros da API são tratados em toda a aplicação.

### Etapa 5: Migração Gradual Página a Página

A migração não precisa ser feita de uma só vez. A abordagem recomendada, que minimiza riscos, é:

1.  **Escolha uma Página:** Comece por uma página mais simples, como a de "Metas".
2.  **Crie a Versão em React:** Desenvolva a `GoalsPage.js` usando os componentes reutilizáveis (`Header`, `Sidebar`, `GoalCard`).
3.  **Integre a Rota:** Adicione a rota `/goals` no `react-router-dom`.
4.  **Atualize o Link:** No `Sidebar.js`, atualize o link para apontar para a nova rota React em vez do antigo `.html`.
5.  **Repita:** Continue o processo para as outras páginas (`transactions`, `reports`, etc.) até que todo o sistema legado tenha sido substituído.
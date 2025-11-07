# 🌐 Frontend - Smart Gestão Web Interface

Este diretório contém todo o código-fonte da interface de usuário (frontend) da aplicação Smart Gestão. Ele é responsável por apresentar as informações ao usuário, capturar suas interações e se comunicar com a API do backend.

## 1. Tecnologias Utilizadas

O frontend é construído com tecnologias web padrão, focando em simplicidade e compatibilidade:

-   **HTML5**: Estrutura e conteúdo das páginas.
-   **CSS3**: Estilização e layout da interface.
-   **JavaScript (ES6+)**: Lógica de interação, manipulação do DOM, validações no cliente e comunicação assíncrona com a API.
-   **Fetch API**: Para realizar requisições HTTP ao backend.
-   **LocalStorage**: Para armazenar o token de autenticação e dados do usuário no navegador.

## 2. Estrutura de Pastas e Arquivos

```
frontend/
├── index.html          # Página de redirecionamento inicial para o login.
├── pages/              # Contém as páginas HTML principais da aplicação.
│   ├── login.html      # Página de login do usuário.
│   ├── register.html   # Página de registro de novos usuários/empresas.
│   ├── startPage.html  # Dashboard principal após o login.
│   └── ... (outras páginas)
├── assets/             # Recursos estáticos como imagens, ícones, fontes.
├── css/                # Arquivos CSS para estilização global e específica de componentes.
│   ├── style.css       # Estilos globais da aplicação.
│   └── ...
├── js/                 # Arquivos JavaScript com a lógica do frontend.
│   ├── auth.js         # Funções relacionadas à autenticação (login, logout, registro).
│   ├── api.js          # Funções para interação com a API do backend (Fetch API).
│   ├── utils.js        # Funções utilitárias para o frontend (formatação, validação).
│   └── ... (outros scripts)
└── README-frontend.md  # Este arquivo.
```

## 3. Fluxo de Interação com o Backend

1.  **Autenticação**: O `login.html` e `register.html` utilizam funções de `js/auth.js` para enviar credenciais ao backend via `js/api.js`. O token JWT recebido é armazenado no `localStorage`.
2.  **Proteção de Rotas**: Scripts em `js/auth.js` (ou similar) verificam a presença e validade do token no `localStorage` antes de permitir o acesso a páginas protegidas. Se o token estiver ausente ou inválido, o usuário é redirecionado para o `login.html`.
3.  **Requisições à API**: Todas as interações com dados (criar transação, listar metas, etc.) são feitas através de chamadas HTTP para os endpoints do backend, utilizando o token JWT no cabeçalho `Authorization`.
4.  **Renderização de Dados**: Os dados recebidos do backend são processados e exibidos dinamicamente nas páginas HTML usando JavaScript.

## 4. Como Iniciar

Para visualizar o frontend, o backend deve estar rodando. O comando `npm start` na pasta `src/codes/backend` iniciará ambos os servidores.

Após iniciar, acesse `http://localhost:3000` no seu navegador.
# Código-fonte do Projeto Smart Gestão

Este diretório contém todos os arquivos-fonte necessários para o funcionamento do sistema Smart Gestão, uma aplicação web para gestão financeira de microempreendedores e profissionais autônomos.

## Visão Geral do Sistema

O Smart Gestão é uma aplicação web full-stack que utiliza:

### Arquitetura
-   **Padrão MVC (Model-View-Controller) com Camada de Serviços**:
    -   **Models**: Schemas do Mongoose que definem a estrutura dos dados no MongoDB.
    -   **Views**: Interface web responsiva em HTML, CSS e JavaScript puro.
    -   **Controllers**: Orquestram o fluxo da requisição, validam dados e interagem com os serviços e modelos.

### Fluxo de Dados
1. **Cliente (Browser)**
    - Executa JavaScript no frontend.
    - Gerencia o estado da sessão do usuário com `localStorage`.
    - Realiza requisições HTTP para a API.

2. **Servidor (Node.js)**
    - Recebe requisições (por padrão, na porta 5000).
    - Autentica as requisições usando JSON Web Tokens (JWT).
    - Processa as regras de negócio nos `controllers`.
    - Interage com o MongoDB através dos `models` (Mongoose).

3. **Banco de Dados (MongoDB)**
    - Armazena os dados da aplicação em coleções (collections).
    - Utiliza índices para otimizar a performance das consultas.

## Estrutura do Projeto

```text
src/
├── codes/
│   ├── backend/        # API REST em Node.js/Express (Ponto de partida)
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── Scripts/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── Testes/
│   │   │   ├── 1-auth/
│   │   │   ├── 2-features/
│   │   │   ├── 3-security/
│   │   │   ├── 4-reports/
│   │   │   ├── config/
│   │   │   ├── Docs/
│   │   │   └── resultados/
│   │   ├── server.js
│   │   └── README-backend.md
│   ├── frontend/       # Interface web legada em HTML/CSS/JS
│   │   ├── css/
│   │   ├── js/
│   │   └── pages/
│   └── react/          # Prova de conceito da tela de login em React
│       └── README-react.md
└── assets/            # Recursos estáticos compartilhados
```

## Componentes Principais

### Backend (API REST)
-   **Tecnologias:** Node.js, Express, MongoDB com Mongoose.
-   **Funcionalidades:** Autenticação JWT, CRUDs completos, upload de arquivos, geração de relatórios em PDF, arquitetura multi-tenant.
-   **Testes:** Suíte de testes de integração robusta com Jest, garantindo a qualidade e a estabilidade da API.
-   **Documentação Detalhada:** `codes/backend/README-backend.md`

### Frontend (Web Interface)
-   **Tecnologias:** HTML5, CSS3, JavaScript (ES6).
-   **Funcionalidades:** Interface para login, cadastro, gerenciamento de transações, metas e visualização de relatórios.
-   **Segurança:** Proteção de rotas do lado do cliente (`authGuard.js`).
-   **Documentação Detalhada:** `codes/frontend/README-frontend.md`

## Como Iniciar o Projeto

1. Inicie o backend:
   ```bash
   cd codes/backend
   npm install
   npm start # Este comando inicia o backend, o frontend legado e a demo em React.
   ```
   O backend estará disponível em `http://localhost:5000`.

2. O frontend legado iniciará automaticamente em `http://localhost:3000`.

## Documentação Detalhada

- [Documentação do Backend](codes/backend/README-backend.md)
- [Documentação do Frontend](codes/frontend/README-frontend.md)

## Requisitos do Sistema

- Node.js 14+
- MongoDB 4.4+
- Navegador web moderno com suporte a ES6

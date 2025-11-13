# Código-fonte do Projeto Smart Gestão

Este diretório contém todos os arquivos-fonte necessários para o funcionamento do sistema Smart Gestão, uma aplicação web para gestão financeira de microempreendedores e pequenas empresas.

## Visão Geral do Sistema

O Smart Gestão é uma aplicação web full-stack que utiliza:

### Arquitetura
- **Backend (API RESTful)**: Construído com Node.js e Express, responsável por toda a lógica de negócio, autenticação e interação com o banco de dados.
- **Frontend (Cliente Web)**: Interface de usuário construída com HTML, CSS e JavaScript puro, que consome os dados da API.
- **Banco de Dados**: MongoDB (NoSQL) para persistência de dados, gerenciado via Mongoose.

### Fluxo de Dados
1. **Cliente (Browser)**
   - O usuário interage com a interface (páginas HTML).
   - O JavaScript do frontend captura as ações, valida os dados e realiza requisições HTTP (AJAX/Fetch) para a API do backend.
   - A sessão do usuário (token JWT) é gerenciada de forma segura no `localStorage`.

2. **Servidor (Node.js)**
   - Recebe as requisições na porta configurada (padrão: 5000).
   - Middlewares interceptam a requisição para autenticar o usuário (via JWT), verificar permissões e registrar logs.
   - Controllers processam a lógica de negócio e interagem com o MongoDB através dos Models.

3. **Banco de Dados (MongoDB)**
   - Armazena os dados da aplicação em coleções de documentos JSON.
   - Garante a integridade e a estrutura dos dados através dos Schemas definidos no Mongoose.

## Estrutura do Projeto

```text
src/
├── codes/              # Diretório raiz do código-fonte.
│   ├── backend/        # API REST em Node.js/Express. Responsável pela lógica de negócio.
│   │   └── README-backend.md
│   ├── frontend/       # Interface web principal em HTML, CSS e JavaScript puro.
│   │   └── README-frontend.md
│   └── react/          # Prova de conceito da tela de login em React.
└── assets/             # Recursos estáticos (imagens, fontes, etc.).
```

## Componentes Principais

### Backend (API REST)
- Node.js com Express
- MongoDB para persistência
- JWT para autenticação
- Documentação detalhada em `codes/backend/README-backend.md`

### Frontend (Web Interface)
- **Tecnologias**: HTML5, CSS3, JavaScript (ES6 Modules).
- **Responsabilidades**: Renderização da interface, interatividade do usuário, validação de formulários no cliente e comunicação com a API do backend.
- Documentação detalhada em `codes/frontend/README-frontend.md`

## Como Iniciar o Projeto

1. Inicie o backend:
   ```bash
   cd codes/backend
   npm install
   npm start
   ```
   O backend estará disponível em http://localhost:5000

2. O frontend iniciará automaticamente em http://localhost:3000

## Documentação Detalhada

- [Documentação do Backend](codes/backend/README-backend.md)
- [Documentação do Frontend](codes/frontend/README-frontend.md)

## Requisitos do Sistema

- Node.js 14+
- MongoDB 4.4+
- Navegador web moderno com suporte a ES6

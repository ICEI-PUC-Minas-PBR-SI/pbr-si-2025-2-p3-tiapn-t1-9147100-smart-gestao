# Código-fonte do Projeto Smart Gestão

Este diretório contém todos os arquivos-fonte necessários para o funcionamento do sistema Smart Gestão, uma aplicação web para gestão financeira de microempreendedores e pequenas empresas.

## Visão Geral do Sistema

O Smart Gestão é uma aplicação web full-stack que utiliza:

### Arquitetura
- **Backend (API RESTful)**: Construído com Node.js e Express, responsável por toda a lógica de negócio, autenticação, segurança (multi-tenant) e interação com o banco de dados.
- **Frontend (Cliente Web)**: Interface de usuário construída com HTML, CSS e JavaScript puro, que consome os dados da API.
- **Banco de Dados**: MongoDB (NoSQL) para persistência de dados, gerenciado via Mongoose para garantir a estrutura e validação dos dados.

### Fluxo de Dados
1. **Cliente (Browser)**
   - Executa JavaScript no frontend
   - Gerencia estado local com LocalStorage
   - Realiza requisições HTTP para a API

2. **Servidor (Node.js)**
   - Recebe requisições na porta 5000
   - Autentica usando JWT
   - Processa regras de negócio
   - Controllers processam a lógica de negócio e interagem com o MongoDB através dos Models.

3. **Banco de Dados (MongoDB)**
   - Armazena dados em collections
   - Gerencia relacionamentos
   - Executa queries otimizadas

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
│   ├── frontend/       # Interface web legada em HTML, CSS e JavaScript puro.
│   │   ├── css/
│   │   ├── js/
│   │   └── pages/
│   └── react/          # Prova de conceito da tela de login em React.
│       └── README-react.md
└── assets/            # Recursos estáticos compartilhados
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

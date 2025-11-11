# Código-fonte do Projeto Smart Gestão

Este diretório contém todos os arquivos-fonte necessários para o funcionamento do sistema Smart Gestão, uma aplicação web para gestão financeira pessoal e empresarial.

## Visão Geral do Sistema

O Smart Gestão é uma aplicação web full-stack que utiliza:

### Arquitetura
- **Padrão MVC** (Model-View-Controller)
  - Models: Schemas do MongoDB para estruturação dos dados
  - Views: Interface web responsiva em HTML/CSS/JS
  - Controllers: Lógica de negócio em Node.js

### Fluxo de Dados
1. **Cliente (Browser)**
   - Executa JavaScript no frontend
   - Gerencia estado local com LocalStorage
   - Realiza requisições HTTP para a API

2. **Servidor (Node.js)**
   - Recebe requisições na porta 5000
   - Autentica usando JWT
   - Processa regras de negócio
   - Interage com MongoDB

3. **Banco de Dados (MongoDB)**
   - Armazena dados em collections
   - Gerencia relacionamentos
   - Executa queries otimizadas

## Estrutura do Projeto

```
src/
├── codes/
│   ├── backend/        # API REST em Node.js/Express
│   │   └── README-backend.md  # Documentação específica do backend
│   └── frontend/       # Interface web em HTML/CSS/JS
│   │   ├── css/
│   │   ├── js/
│   │   │   ├── docs/   # Documentação e guias de integração do frontend
│   │   │   └── ...
│   │   └── pages/
│   └── react/          # Prova de conceito da tela de login em React
│       └── README-frontend.md # Documentação específica do frontend (legado)
└── assets/            # Recursos estáticos compartilhados
```

## Componentes Principais

### Backend (API REST)
- Node.js com Express
- MongoDB para persistência
- JWT para autenticação
- Documentação detalhada em `codes/backend/README-backend.md`

### Frontend (Web Interface)
- HTML5, CSS3, JavaScript
- Arquitetura modular
- Integração com API REST
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

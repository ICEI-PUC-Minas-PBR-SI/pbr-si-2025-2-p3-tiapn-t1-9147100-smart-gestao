# Código-fonte do Frontend - Smart Gestão

Este diretório contém todos os arquivos-fonte necessários para o funcionamento do frontend do sistema Smart Gestão.

## Detalhamento Técnico

### 1. Sistema de Autenticação

#### 1.1 Login
```javascript
// Processo de Login
async function login(email, password) {
    try {
        // 1. Faz requisição para API
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // 2. Processa resposta
        if (!response.ok) throw new Error('Credenciais inválidas');
        const data = await response.json();

        // 3. Armazena token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // 4. Redireciona
        window.location.href = '/index.html';
    } catch (error) {
        handleError(error);
    }
}
```

#### 1.2 Gerenciamento de Sessão
```javascript
// Verifica autenticação em cada página protegida
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}
```

### 2. Integração com API

#### 2.1 Configuração Base
```javascript
const API_URL = 'http://localhost:5000/api';

// Helper para requisições autenticadas
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.clear();
        window.location.href = '/login.html';
        throw new Error('Sessão expirada');
    }

    return response;
}
```

### 3. Manipulação do DOM

#### 3.1 Exemplo de Renderização de Dados
```javascript
// Renderiza lista de transações
function renderTransactions(transactions) {
    const container = document.querySelector('#transactions-list');
    container.innerHTML = transactions.map(transaction => `
        <div class="transaction ${transaction.type}">
            <span class="date">${formatDate(transaction.date)}</span>
            <span class="description">${transaction.description}</span>
            <span class="amount">${formatCurrency(transaction.amount)}</span>
        </div>
    `).join('');
}
```

### 4. Validação de Formulários

#### 4.1 Exemplo de Validação
```javascript
function validateTransactionForm(data) {
    const errors = {};
    
    if (!data.amount || data.amount <= 0)
        errors.amount = 'Valor deve ser maior que zero';
    
    if (!data.description)
        errors.description = 'Descrição é obrigatória';
        
    if (!data.category)
        errors.category = 'Categoria é obrigatória';
        
    return errors;
}
```

### 5. Manipulação de Dados

#### 5.1 LocalStorage
```javascript
// Gerenciamento de dados locais
const Storage = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    }
};
```

### 6. Tratamento de Erros

```javascript
// Sistema centralizado de tratamento de erros
function handleError(error) {
    console.error('Error:', error);
    
    // Exibe mensagem para o usuário
    const errorDiv = document.querySelector('#error-message');
    if (errorDiv) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
        
        // Auto-hide após 5 segundos
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}
```

### 7. Utilitários

#### 7.1 Formatação
```javascript
// Formatação de moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Formatação de data
function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}
```

#### 7.2 Validações
```javascript
// Validações comuns
const Validators = {
    isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    isStrongPassword: (password) => password.length >= 8,
    isCPF: (cpf) => // implementação de validação de CPF
};
```

## Estrutura de Diretórios

```
frontend/
├── assets-frontend/    # Recursos estáticos
│   ├── fonts/         # Fontes utilizadas
│   ├── icons/         # Ícones e imagens de interface
│   └── images/        # Imagens do sistema
├── css/               # Arquivos de estilo
│   └── style.css      # Estilos globais
├── js/                # Scripts JavaScript
│   ├── api/          # Módulos de integração com o backend
│   │   ├── apiHelper.js     # Configuração base da API
│   │   ├── auth.js          # Autenticação
│   │   ├── transactions.js  # Gerenciamento de transações
│   │   └── metas.js         # Gerenciamento de metas
│   ├── pages/        # Scripts específicos de cada página
│   └── utils/        # Utilitários e funções comuns
└── pages/            # Páginas HTML
    ├── cadastro.html  # Cadastro de usuário
    ├── login.html     # Login do sistema
    ├── metas.html     # Gerenciamento de metas
    ├── perfil.html    # Perfil do usuário
    └── relatorios.html # Relatórios financeiros
```

## Tecnologias Utilizadas

- **HTML5**: Estruturação das páginas
- **CSS3**: Estilização e responsividade
- **JavaScript (ES6+)**: Lógica do cliente e integração com API
- **Fetch API**: Comunicação com o backend
- **LocalStorage**: Armazenamento local de tokens e dados do usuário

## Funcionalidades Principais

### 1. Sistema de Autenticação (`js/api/auth.js`)
- Login com email e senha
- Registro de novos usuários
- Gerenciamento de tokens JWT
- Proteção de rotas autenticadas

### 2. Integração com API (`js/api/apiHelper.js`)
- Configuração centralizada da URL da API
- Gerenciamento automático de headers de autenticação
- Tratamento padronizado de erros
- Funções auxiliares para requisições

### 3. Gestão de Transações (`js/api/transactions.js`)
- Cadastro de receitas e despesas
- Listagem com filtros
- Categorização de transações
- Edição e exclusão de registros

### 4. Metas Financeiras (`js/api/metas.js`)
- Definição de objetivos financeiros
- Acompanhamento de progresso
- Notificações de atingimento

### 5. Relatórios (`pages/relatorios.html`)
- Visualização de dados financeiros
- Gráficos e indicadores
- Exportação de dados

## Fluxo de Dados

1. **Autenticação**:
   ```javascript
   // Exemplo de login
   const response = await fetch('${API_URL}/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password })
   });
   ```

2. **Requisições Autenticadas**:
   ```javascript
   // Exemplo usando apiHelper
   const headers = getAuthHeaders();
   const response = await fetch('${API_URL}/transactions', {
     headers
   });
   ```

## Páginas e Suas Funcionalidades

### Login (`login.html`)
- Formulário de autenticação
- Validação de campos
- Redirecionamento pós-login
- Link para cadastro

### Cadastro (`cadastro.html`)
- Formulário de registro
- Validação de dados
- Feedback de sucesso/erro
- Redirecionamento para login

### Transações (`transacoes.html`)
- Listagem de movimentações
- Filtros e ordenação
- Formulário de nova transação
- Categorização

### Metas (`metas.html`)
- Definição de objetivos
- Acompanhamento visual
- Alertas de progresso
- Histórico de realizações

## Como Executar o Frontend

1. Navegue até a pasta do frontend:
   ```bash
   cd src/codes/frontend/pages
   ```

2. Inicie o servidor HTTP:
   ```bash
   npx http-server . -p 3000
   ```

3. Acesse no navegador:
   ```
   http://localhost:3000
   ```

## Integração com Backend

- API Base: `http://localhost:5000/api`
- Autenticação via JWT
- Headers necessários em requisições autenticadas:
  ```javascript
  {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  }
  ```

## Convenções e Boas Práticas

1. **Estrutura de Arquivos**
   - Componentes reutilizáveis em `js/utils`
   - Uma página HTML para cada funcionalidade
   - Estilos globais em `css/style.css`

2. **JavaScript**
   - Uso de módulos ES6
   - Async/await para operações assíncronas
   - Tratamento consistente de erros
   - Validação de dados no cliente

3. **Segurança**
   - Sanitização de inputs
   - Validação de tokens
   - Proteção contra XSS
   - Logout automático em token expirado

## Manutenção e Desenvolvimento

Para adicionar novas funcionalidades:

1. Crie a página HTML em `pages/`
2. Adicione os estilos específicos
3. Implemente a lógica em `js/pages/`
4. Crie/atualize módulos API em `js/api/`
5. Atualize a documentação

## Próximos Passos e Melhorias Planejadas

- Implementação de PWA
- Melhorias de acessibilidade
- Testes automatizados
- Otimização de performance
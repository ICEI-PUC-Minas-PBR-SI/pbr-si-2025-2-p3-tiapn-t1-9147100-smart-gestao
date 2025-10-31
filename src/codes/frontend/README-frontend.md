# Código-fonte do Frontend - Smart Gestão

Este diretório contém todos os arquivos-fonte necessários para o funcionamento do frontend do sistema Smart Gestão.

## Detalhamento Técnico

### 1. Sistema de Autenticação

#### 1.1 Login
O fluxo de login é gerenciado pelo `js/pages/login.js`, que captura os dados do formulário e chama a função `login` do módulo `js/api/auth.js`. Esta função, por sua vez, utiliza o `apiRequest` para se comunicar com o backend. Em caso de sucesso, os tokens (`token` e `refreshToken`) e os dados do usuário (`user`) são salvos no `localStorage`, e o usuário é redirecionado para a página principal.

#### 1.2 Gerenciamento de Sessão
A proteção das páginas internas é feita pelo script **`js/utils/authGuard.js`**. Este script é incluído no `<head>` de todas as páginas que exigem autenticação. Ele verifica a existência do `token` no `localStorage` antes de a página ser renderizada. Se o token não existir, o usuário é imediatamente redirecionado para a página de login.

**Exemplo de uso em uma página HTML:**
```html
<head>
    ...
    <!-- Script de proteção de rota -->
    <script src="/js/utils/authGuard.js"></script>
    ...
</head>
```

### 2. Integração com API

#### 2.1 Configuração Base
Toda a comunicação com o backend é centralizada no helper **`js/api/apiHelper.js`**. Ele exporta a função `apiRequest`, que encapsula a lógica do `fetch` e adiciona funcionalidades essenciais:

1.  **Inclusão Automática do Token**: Adiciona o `Authorization: Bearer <token>` em todas as requisições para endpoints protegidos.
2.  **Renovação Automática de Sessão**: Se uma requisição falha com status `401` (token expirado), o `apiRequest` utiliza o `refreshToken` para obter um novo `accessToken` do backend de forma silenciosa. Em seguida, ele refaz a requisição original sem que o usuário perceba.
3.  **Logout Automático**: Se a renovação do token falhar (porque o `refreshToken` também expirou), o helper chama a função `logout()`, que limpa o `localStorage` e redireciona o usuário para a página de login.

**Exemplo de uso para buscar transações:**
```javascript
// Em js/api/transactions.js
import { apiRequest } from './apiHelper.js';

export async function getTransactions() {
  const response = await apiRequest('/transactions'); // A mágica acontece aqui!
  if (!response.ok) {
    throw new Error('Não foi possível buscar as transações.');
  }
  return response.json();
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
│   │   ├── transactions.js  # Gerenciamento de transações (Exemplo)
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
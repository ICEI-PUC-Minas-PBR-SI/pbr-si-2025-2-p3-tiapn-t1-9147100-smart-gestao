# Guia de Integração Frontend: Conectando Scripts ao HTML

Este documento é um guia prático para o desenvolvedor responsável pelo HTML/CSS. Ele detalha, página por página, como vincular os scripts JavaScript e quais atributos (`id`, `class`, `data-id`) os elementos HTML precisam ter para que a lógica do sistema funcione corretamente.

---

## 1. Checklist para TODAS as Páginas que Exigem Login

**Páginas afetadas:** `startPage.html`, `transactions.html`, `metas.html`, `reports.html`, `profile.html`, etc.

Estas páginas compartilham uma base comum de segurança e funcionalidades de layout.

### ✅ Checklist de Elementos HTML

1.  **Botão/Link de Logout:**
    -   Verifique se o elemento que o usuário clica para sair do sistema tem o `id="logout-btn"`.
    -   Exemplo: `<a href="#" id="logout-btn">Sair</a>`

2.  **Exibição do Nome do Usuário:**
    -   Verifique se o elemento onde o nome do usuário deve aparecer (geralmente no cabeçalho) tem o `id="user-name"`.
    -   Exemplo: `<span>Olá, <span id="user-name">Usuário</span></span>`

### ✅ Checklist de Scripts

**Ação:** Adicione os seguintes scripts ao final de cada página, **antes de fechar a tag `</body>`**. A ordem é importante.

```html
<!-- 
    ==============================================================================
    SCRIPTS COMUNS A TODAS AS PÁGINAS PROTEGIDAS
    ==============================================================================
    1. GUARDIÃO DE AUTENTICAÇÃO (authGuard.js):
       - Este script é ESSENCIAL. Ele protege a página, redirecionando para o login
         se o usuário não estiver autenticado. Deve ser o primeiro.

    2. SCRIPT PRINCIPAL (main.js):
       - Este script adiciona a funcionalidade ao botão de logout (id="logout-btn")
         e exibe o nome do usuário (no id="user-name").
    ==============================================================================
-->
<script type="module" src="../js/utils/authGuard.js"></script>
<script type="module" src="../js/main.js"></script> 

<!-- Os scripts específicos de cada página (listados abaixo) devem ser adicionados AQUI -->
```

---

## 2. Checklist para a Página de Transações (`transactions.html`)

### ✅ Checklist de Elementos HTML

1.  **Formulário de Criação/Edição:**
    -   O formulário principal deve ter o `id="transaction-form"`.
    -   O título do formulário (ex: "Adicionar Nova Transação") deve ter o `id="form-title"`.
    -   O botão de submissão deve ser do tipo `type="submit"`.
    -   O botão para cancelar a edição deve ser do tipo `type="button"`.

2.  **Tabela de Transações:**
    -   O corpo da tabela (`<tbody>`) onde as transações serão listadas deve ter o `id="transaction-table-body"`.

3.  **Botões de Ação na Tabela:**
    -   Cada botão de **editar** em uma linha da tabela deve ter a classe `class="edit-btn"` e o atributo `data-id` com o ID da transação.
    -   Cada botão de **excluir** deve ter a classe `class="delete-btn"` e o atributo `data-id` com o ID da transação.
    -   Exemplo dentro de uma linha `<tr>`:
        ```html
        <td>
          <button class="action-btn edit-btn" data-id="ID_DA_TRANSACAO_AQUI"><i class="fas fa-edit"></i></button>
          <button class="action-btn delete-btn" data-id="ID_DA_TRANSACAO_AQUI"><i class="fas fa-trash"></i></button>
        </td>
        ```

### ✅ Checklist de Scripts

**Ação:** Adicione o seguinte script ao final da página, **após** os scripts comuns (`authGuard.js` e `main.js`).

```html
<!-- 
    ==============================================================================
    SCRIPT ESPECÍFICO DA PÁGINA DE TRANSAÇÕES
    ==============================================================================
    - O script 'transactions.js' gerencia todo o ciclo de vida das transações.
    - Ele depende dos IDs e classes definidos no checklist acima.
    ==============================================================================
-->
<script type="module" src="../js/pages/transactions.js"></script>
```

---

## 3. Checklist para a Página de Metas (`metas.html`)

### ✅ Checklist de Elementos HTML

1.  **Formulário de Criação/Edição:**
    -   O formulário de metas deve ter o `id="goal-form"`.
    -   O título do formulário (ex: "Adicionar Nova Meta") deve ter o `id="goal-form-title"`.

2.  **Container das Metas:**
    -   O elemento `<div>` que irá conter a lista de cards de metas deve ter o `id="goals-container"`.

3.  **Botões de Ação nos Cards:**
    -   Assim como nas transações, os botões de **editar** e **excluir** dentro de cada card de meta precisam das classes `edit-btn` e `delete-btn` e do atributo `data-id`.

### ✅ Checklist de Scripts

**Ação:** Adicione o seguinte script ao final da página, **após** os scripts comuns.

```html
<!-- 
    ==============================================================================
    SCRIPT ESPECÍFICO DA PÁGINA DE METAS
    ==============================================================================
    - O script 'metas.js' gerencia todo o ciclo de vida das metas.
    - Ele depende dos IDs e classes definidos no checklist acima.
    ==============================================================================
-->
<script type="module" src="../js/pages/metas.js"></script>
```

---

## 4. Checklist para a Página de Relatórios (ou onde houver exportação)

### ✅ Checklist de Elementos HTML

1.  **Botão de Exportação:**
    -   O botão que o usuário clica para exportar o relatório deve ter o `id="export-pdf-btn"`.
    -   Exemplo: `<button id="export-pdf-btn" class="btn">Exportar para PDF</button>`

### ✅ Checklist de Scripts

**Ação:** Adicione o seguinte script ao final da página, **após** os scripts comuns.

```html
<!-- 
    ==============================================================================
    SCRIPT ESPECÍFICO DE EXPORTAÇÃO
    ==============================================================================
    - O script 'export.js' adiciona a funcionalidade ao botão com id="export-pdf-btn".
    - Ele chama a API para gerar e baixar o relatório em PDF.
    ==============================================================================
-->
<script type="module" src="../js/utils/export.js"></script>
```

Seguindo estes checklists, a integração entre a parte visual (HTML) e a lógica de negócio (JavaScript) será bem-sucedida.
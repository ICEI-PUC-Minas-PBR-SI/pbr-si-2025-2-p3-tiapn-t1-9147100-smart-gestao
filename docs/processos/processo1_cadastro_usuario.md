### 3.3.1 Processo 1: Cadastro de Despesas

O processo de cadastro de despesas permite ao usuário registrar e gerenciar suas transações financeiras, sejam elas receitas ou despesas. Esta funcionalidade é essencial para manter um controle financeiro detalhado e preciso, possibilitando a categorização e o acompanhamento de todas as movimentações.

**Fluxo principal:**
1. Usuário acessa a página de Transações.
2. Usuário clica em "Nova Transação".
3. Usuário preenche os detalhes da transação (data, descrição, categoria, tipo, valor).
4. Usuário salva a transação.
5. Sistema valida e registra a transação.
6. Sistema exibe a transação na lista.

Modelagem BPMN: <img width="1461" height="661" alt="Processo1Despesas drawio" src="https://github.com/user-attachments/assets/1d00e476-49bb-4438-b488-c03c85dbd335" />


---

#### Detalhamento das atividades

## Atividade 1 – Visualizar e Filtrar Transações (Usuário)

Esta atividade permite ao usuário visualizar todas as transações existentes e aplicar filtros para refinar a busca.

| Campo/Elemento           | Tipo          | Restrições                                  |
|:-------------------------|:--------------|:--------------------------------------------|
| Botão: Filtrar           | Botão         | Abre opções de filtro.                      |
| Seleção: Período         | Seleção Única | Opções: Últimos 30 dias, Este mês, Mês passado, Personalizado. |
| Seleção: Tipo            | Seleção Única | Opções: Todos, Receitas, Despesas.          |
| Seleção: Categoria       | Seleção Única | Opções: Todas, Materiais, Serviços, Transporte, Impostos, etc. |
| Tabela de Transações     | Tabela        | Exibe Data, Descrição, Categoria, Tipo, Valor e Ações. |
| Botão: Editar (Transação)| Botão         | Permite editar uma transação específica.    |
| Botão: Excluir (Transação)| Botão         | Permite excluir uma transação específica.   |
| Paginação                | Navegação     | Permite navegar entre as páginas de transações. |

**Comandos**
- Clicar em "Filtrar" para exibir as opções de filtro.
- Selecionar opções nos dropdowns "Período", "Tipo" e "Categoria".
- Clicar nos botões de ação (Editar/Excluir) para gerenciar transações individuais.
- Clicar nos botões "Anterior" ou "Próxima" para navegar na paginação.

---

## Atividade 2 – Adicionar Nova Transação (Usuário)

Esta atividade permite ao usuário registrar uma nova receita ou despesa no sistema.

| Campo/Elemento           | Tipo          | Restrições                                  |
|:-------------------------|:--------------|:--------------------------------------------|
| Botão: Nova Transação    | Botão         | Abre um formulário para adicionar transação. |
| Campo: Data              | Data          | Obrigatório. Data da transação.             |
| Campo: Descrição         | Texto         | Obrigatório. Breve descrição da transação.  |
| Campo: Categoria         | Seleção Única | Obrigatório. Categoria da transação (ex: Vendas, Materiais, Serviços). |
| Campo: Tipo              | Seleção Única | Obrigatório. Tipo da transação (Receita ou Despesa). |
| Campo: Valor             | Número        | Obrigatório. Valor monetário da transação.  |
| Botão: Salvar            | Botão         | Salva a nova transação.                     |
| Botão: Cancelar          | Botão         | Cancela a adição da transação.              |

**Comandos**
- Clicar em "Nova Transação".
- Preencher os campos "Data", "Descrição", "Categoria", "Tipo" e "Valor".
- Clicar em "Salvar" para registrar a transação.
- Clicar em "Cancelar" para fechar o formulário sem salvar.

---

_Tipos de dados utilizados:_

*   **Área de texto** - campo texto de múltiplas linhas
*   **Caixa de texto** - campo texto de uma linha
*   **Número** - campo numérico
*   **Data** - campo do tipo data (dd-mm-aaaa)
*   **Hora** - campo do tipo hora (hh:mm:ss)
*   **Data e Hora** - campo do tipo data e hora (dd-mm-aaaa, hh:mm:ss)
*   **Imagem** - campo contendo uma imagem
*   **Seleção única** - campo com várias opções de valores que são mutuamente exclusivas (radio button ou combobox)
*   **Seleção múltipla** - campo com várias opções que podem ser selecionadas mutuamente (checkbox ou listbox)
*   **Arquivo** - campo de upload de documento
*   **Link** - campo que armazena uma URL
*   **Tabela** - campo formado por uma matriz de valores

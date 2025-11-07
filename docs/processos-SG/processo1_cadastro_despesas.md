### 3.3.1 Processo 1: Cadastro de Despesas

O processo de cadastro de despesas permite ao usuário registrar e gerenciar suas transações financeiras, sejam elas receitas ou despesas. Esta funcionalidade é essencial para manter um controle financeiro detalhado e preciso, possibilitando a categorização e o acompanhamento de todas as movimentações.

**Fluxo principal:**
1. O usuário acessa a página de transações.
2. O usuário abre o formulário de lançamento financeiro.
3. O usuário seleciona o tipo de registro (receita ou despesa).
4. O usuário preenche os dados obrigatórios (descrição, valor, categoria, data etc.).
5. O sistema valida os dados do formulário.
6. Se inválidos, o sistema exibe mensagem de erro e o usuário corrige os dados.
7. Se os dados forem válidos, o sistema atualiza saldo e relatórios financeiros.
8. O sistema exibe mensagem de confirmação.
9. Caso o usuário não confirme, pode corrigir os dados.
10. Caso confirme, o sistema salva o registro no banco de dados.

Modelagem BPMN: <img width="1461" height="632" alt="despesasatualizada drawio" src="https://github.com/user-attachments/assets/690d7150-c860-4ba1-9842-6657d8f6fa41" />

> **Ponto de Melhoria (Revisado por Heron):** Olá, equipe! Para alinharmos o diagrama BPMN com o feedback da professora, o responsável pela documentação poderia, por favor, fazer um pequeno ajuste?
>
> **Guia para o ajuste:**
> 1.  No diagrama, mova a tarefa "Salva o registro no banco de dados" para dentro da raia "Sistema".
> 2.  Depois, remova completamente a raia "Banco de Dados", pois o banco é um componente do sistema, não um participante do processo.

---

> **Ponto de Melhoria (Revisado por Heron):** Olá, equipe! Para deixar a documentação mais lógica e completa, o responsável poderia fazer os seguintes ajustes na seção "Detalhamento das atividades"?
>
> **Guia para o ajuste:**
> 1.  **Inverta a ordem das atividades:** A "Atividade 2 – Adicionar Nova Transação" deve vir primeiro, pois é a ação principal. Mova todo o seu bloco para antes da "Atividade 1 – Visualizar e Filtrar Transações".
> 2.  **Renumere os títulos:** Após a troca, ajuste os números para que a primeira seja "Atividade 1" e a segunda "Atividade 2".
> 3.  **Detalhe os comandos:** Na atividade de adicionar transação, descreva o que acontece após o usuário clicar em "Salvar" e "Cancelar", conforme a sugestão que estava no final do arquivo.
>
> *Após realizar os ajustes, pode remover este bloco de revisão e o que está no final do arquivo sobre os comandos.*
 
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

> **Ponto de Melhoria (Revisado por Heron):** Pessoal, para completar a documentação deste processo, o responsável poderia criar e adicionar os wireframes (esboços de tela) aqui? Um esboço simples da tela de transações, mostrando a lista e o formulário, já seria excelente.

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

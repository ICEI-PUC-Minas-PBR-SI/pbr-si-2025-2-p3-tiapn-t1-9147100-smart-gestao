### 3.3.5 Processo 5 – Cadastro de Usuários

O processo de geração de relatórios permite que o usuário visualize e analise suas informações financeiras de forma organizada. Esta funcionalidade é crucial para o acompanhamento da saúde financeira do MEI, oferecendo diferentes perspectivas através de filtros, gráficos e tabelas detalhadas.

**Fluxo principal:**
1. Usuário acessa a aba de Relatórios.
2. Usuário seleciona filtros de período e tipo de relatório.
3. Usuário clica em "Gerar Relatório".
4. Sistema exibe gráficos e estatísticas financeiras.
5. Sistema exibe tabela de análise detalhada.
6. Sistema exibe insights financeiros relevantes.

## **Modelo BPMN:**



## **Wireframe (esboço previo da tela)**



#### Detalhamento das atividades

## Atividade 1 – Selecionar Filtros de Relatório (Usuário)

Esta atividade permite ao usuário definir os parâmetros para a geração do relatório financeiro.

| Campo/Elemento     | Tipo          | Restrições                                  |
|:-------------------|:--------------|:--------------------------------------------|
| Período            | Seleção Única | Obrigatório. Opções: Últimos 30 dias, Este mês, Mês passado, Trimestre atual, Semestre atual, Ano atual. |
| Tipo de Relatório  | Seleção Única | Obrigatório. Opções: Resumo Financeiro, Despesas por Categoria, Fluxo de Caixa, Comparativo Mensal. |
| Botão: Gerar Relatório | Botão         | Habilitado após a seleção dos filtros.      |

**Comandos**
- Selecionar uma opção no dropdown "Período".
- Selecionar uma opção no dropdown "Tipo de Relatório".
- Clicar no botão "Gerar Relatório" para processar as seleções.

---

## Atividade 2 – Visualizar Gráficos e Estatísticas (Sistema)

Após a geração, o sistema apresenta os dados de forma visual para facilitar a compreensão.

| Campo/Elemento           | Tipo   | Restrições                                  |
|:-------------------------|:-------|:--------------------------------------------|
| Gráfico: Receitas vs Despesas | Gráfico de Barras | Exibe comparativo de receitas e despesas. Pode ser filtrado por Mensal, Trimestral, Anual. |
| Gráfico: Despesas por Categoria | Gráfico de Pizza | Exibe a proporção das despesas por categoria. |

**Comandos**
- O sistema exibe automaticamente os gráficos com base nos filtros selecionados.
- O usuário pode selecionar o período de visualização para o gráfico de Receitas vs Despesas (Mensal, Trimestral, Anual).

---

## Atividade 3 – Analisar Tabela Detalhada (Sistema)

Uma tabela fornece uma visão pormenorizada dos dados financeiros.

| Campo/Elemento         | Tipo    | Restrições                                  |
|:-----------------------|:--------|:--------------------------------------------|
| Tabela: Análise Detalhada | Tabela  | Exibe Categoria, Orçamento, Realizado, Variação e % do Total. |

**Comandos**
- O sistema preenche a tabela com os dados detalhados do período e tipo de relatório selecionados.

---

## Atividade 4 – Consultar Insights Financeiros (Sistema)

O sistema oferece insights automáticos para destacar pontos importantes da análise financeira.

| Campo/Elemento           | Tipo   | Restrições                                  |
|:-------------------------|:-------|:--------------------------------------------|
| Insight: Bom trabalho nas vendas! | Texto  | Mensagem positiva sobre aumento de receitas. |
| Insight: Atenção com materiais | Texto  | Alerta sobre orçamento excedido em materiais. |
| Insight: Meta próxima    | Texto  | Informação sobre proximidade de meta.       |

**Comandos**
- O sistema gera e exibe insights contextuais baseados nos dados financeiros.

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

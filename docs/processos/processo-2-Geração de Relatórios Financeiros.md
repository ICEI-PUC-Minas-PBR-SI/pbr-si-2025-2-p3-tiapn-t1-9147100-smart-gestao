### 3.3.2 Processo 2 – Geração de Relatórios Financeiros

Atualmente, muitos microempreendedores têm dificuldade em analisar suas finanças, já que os registros ficam dispersos em cadernos ou planilhas sem padrão. O Smart Gestão oferece a possibilidade de consolidar automaticamente as informações, permitindo gerar relatórios organizados, categorizados e atualizados em tempo real, dando maior clareza sobre lucros, gastos e saldo disponível.

![Exemplo de Modelo BPMN do PROCESSO 2](../images/processo2_planejamento_financeiro.png)

#### Detalhamento das atividades

 Detalhamento das Atividades
No processo de Geração de Relatórios Financeiros, o fluxo se inicia com o usuário Inserindo ou Sincronizando Dados. Nesta etapa, o usuário fornece os registros financeiros, podendo optar por inseri-los manualmente, sincronizar uma planilha através de um campo de Arquivo, ou conectar-se a outro sistema utilizando uma Chave de API. Após a seleção da Fonte dos Dados, o sistema prossegue para a validação e consolidação das informações.
Em seguida, o usuário avança para Selecionar o Período do Relatório, onde define o intervalo de tempo desejado através dos campos Data Inicial e Data Final, e escolhe o Tipo de Relatório (Despesas, Receitas ou Consolidado).
Posteriormente, na etapa de Filtrar Dados, o usuário tem a opção de refinar o relatório, aplicando filtros específicos por Categorias (como alimentação, transporte, fornecedores) e Formas de Pagamento (cartão, dinheiro, pix).
Após a aplicação dos filtros, o sistema Gera o Relatório e o usuário pode Visualizar o Relatório consolidado. Esta visualização inclui os dados, tabelas e gráficos pertinentes, apresentados em um campo de Relatório Gerado (Área de texto/Imagem) somente para leitura, permitindo a análise e identificação de insights financeiros.
Finalmente, o usuário decide a ação a ser tomada. Caso opte por Exportar o Relatório, ele escolhe o Formato de Exportação (PDF, Excel ou CSV) e define o Nome do Arquivo. Se não desejar exportar, ou após a exportação, o processo é finalizado.
Os tipos de dados utilizados na modelagem são:
Área de texto - campo texto de múltiplas linhas
Caixa de texto - campo texto de uma linha
Número - campo numérico
Data - campo do tipo data (dd-mm-aaaa)
Hora - campo do tipo hora (hh:mm:ss)
Data e Hora - campo do tipo data e hora (dd-mm-aaaa, hh:mm:ss)
Imagem - campo contendo uma imagem
Seleção única - campo com várias opções de valores que são mutuamente exclusivas (tradicional radio button ou combobox)
Seleção múltipla - campo com várias opções que podem ser selecionadas mutuamente (tradicional checkbox ou listbox)
Arquivo - campo de upload de documento
Link - campo que armazena uma URL
Tabela - campo formado por uma matriz de valores

A seguir, apresentamos o detalhamento das atividades do processo de Geração de Relatórios Financeiros, com a especificação dos campos e comandos para cada etapa do fluxo.

## Detalhamento das Atividades

### 1. Inserir ou Sincronizar Dados

Nesta etapa, o usuário fornece os dados financeiros que serão a base para a geração do relatório.

| Campo | Tipo | Restrições | Valor Default |
| :--- | :--- | :--- | :--- |
| Fonte dos Dados | Seleção única | Obrigatório. Opções: Inserir Manualmente, Sincronizar Planilha, Conectar Outro Sistema | Inserir Manualmente |
| Arquivo (para planilha) | Arquivo | Opcional. Visível se "Fonte dos Dados" for "Sincronizar Planilha" | N/A |
| Chave de API (para sistema) | Caixa de texto | Opcional. Visível se "Fonte dos Dados" for "Conectar Outro Sistema" | N/A |

| Comandos | Destino | Tipo |
| :--- | :--- | :--- |
| **Validar Dados** | Validar e Consolidar Dados | padrão |
| **Cancelar** | Fim do processo | cancelar |

### 2. Selecionar Período do Relatório

O usuário define o intervalo de tempo e o escopo geral do relatório a ser gerado.

| Campo | Tipo | Restrições | Valor Default |
| :--- | :--- | :--- | :--- |
| Data Inicial | Data | Obrigatório | Primeiro dia do mês atual |
| Data Final | Data | Obrigatório | Último dia do mês atual |
| Tipo de Relatório | Seleção única | Obrigatório. Opções: Despesas, Receitas, Consolidado | Consolidado |

| Comandos | Destino | Tipo |
| :--- | :--- | :--- |
| **Continuar** | Filtrar Dados | padrão |
| **Cancelar** | Fim do processo | cancelar |

### 3. Filtrar Dados

O usuário pode refinar os dados que aparecerão no relatório, aplicando filtros específicos.

| Campo | Tipo | Restrições | Valor Default |
| :--- | :--- | :--- | :--- |
| Categorias | Seleção múltipla | Opcional (alimentação, transporte, fornecedores etc.) | Todas |
| Formas de Pagamento | Seleção múltipla | Opcional (cartão, dinheiro, pix etc.) | Todas |

| Comandos | Destino | Tipo |
| :--- | :--- | :--- |
| **Aplicar Filtros** | Gerar Relatório | padrão |
| **Voltar** | Selecionar Período | cancelar |

### 4. Visualizar Relatório

O sistema apresenta o relatório consolidado para análise do usuário.

| Campo | Tipo | Restrições | Valor Default |
| :--- | :--- | :--- | :--- |
| Relatório Gerado | Área de texto/Imagem | Apenas leitura. Exibe os dados, tabelas e gráficos. | N/A |

| Comandos | Destino | Tipo |
| :--- | :--- | :--- |
| **Exportar** | Exportar Relatório | padrão |
| **Refazer** | Selecionar Período | cancelar |
| **Finalizar** | Fim do processo | cancelar |

### 5. Exportar Relatório

O usuário escolhe o formato desejado para salvar o relatório gerado.

| Campo | Tipo | Restrições | Valor Default |
| :--- | :--- | :--- | :--- |
| Formato de Exportação | Seleção única | Obrigatório. Opções: PDF, Excel, CSV | PDF |
| Nome do Arquivo | Caixa de texto | Obrigatório | Relatorio_Financeiro_[DataFinal] |

| Comandos | Destino | Tipo |
| :--- | :--- | :--- |
| **Salvar** | Fim do processo | padrão |
| **Voltar** | Visualizar Relatório | cancelar |



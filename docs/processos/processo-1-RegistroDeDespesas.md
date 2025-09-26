### 3.3.1 Processo 1 – Registro de Despesas

O processo de registro de despesas e receitas foi criado para permitir que o microempreendedor organize de forma prática suas movimentações financeiras dentro do sistema. O objetivo é oferecer um fluxo simples, em que o usuário consiga lançar valores, categorias e descrições de cada operação, garantindo que todas as informações fiquem registradas corretamente.


![Exemplo de um Modelo BPMN do PROCESSO 1] <img width="1891" height="431" alt="Processo1 drawio" src="https://github.com/user-attachments/assets/bb4ace34-b24a-469e-a982-3a886a74b5d5" />


#### Detalhamento das atividades

As atividades envolvem desde a abertura do formulário de lançamento, o preenchimento e validação dos dados, até o salvamento no banco e a atualização automática dos relatórios e saldos. Dessa forma, o usuário tem maior controle sobre suas finanças e consegue visualizar em tempo real a saúde financeira do seu negócio.

_Os tipos de dados a serem utilizados são:_

_* **Área de texto** - campo texto de múltiplas linhas_

_* **Caixa de texto** - campo texto de uma linha_

_* **Número** - campo numérico_

_* **Data** - campo do tipo data (dd-mm-aaaa)_

_* **Hora** - campo do tipo hora (hh:mm:ss)_

_* **Data e Hora** - campo do tipo data e hora (dd-mm-aaaa, hh:mm:ss)_

_* **Imagem** - campo contendo uma imagem_

_* **Seleção única** - campo com várias opções de valores que são mutuamente exclusivas (tradicional radio button ou combobox)_

_* **Seleção múltipla** - campo com várias opções que podem ser selecionadas mutuamente (tradicional checkbox ou listbox)_

_* **Arquivo** - campo de upload de documento_

_* **Link** - campo que armazena uma URL_

_* **Tabela** - campo formado por uma matriz de valores_


**1- Detalhamento das Atividades**

| **Campo**             | **Tipo**         | **Restrições** | **Valor default**             |
| ---                   | ---              | ---            | ---                           |
| [Nome do campo]       | [tipo de dados]  |                |                               |
| ***Exemplo:***        |                  |                |                               | 
| Descrição da Despesa  |Caixa de Texto    | Obrigatório, até 100 caracteres                |
|Valor                  |Número            | Obrigatório, maior que 0                       |
|Data                   |Dados             | Obrigatório|Data atual                         |
|Forma de Pagamento     |Seleção única     | Opções: Dinheiro, Cartão, Pix, Boleto|Dinheiro |
|Comprovante            |Arquivo           | Opcional (upload de nota fiscal ou recibo)     |

| **Comandos**         |  **Destino**                   | **Tipo** |
| ---                  | ---                            | ---                 |
| [Nome do botão/link] | Atividade/processo de destino  | (default/cancel/  ) |
| ***Exemplo:***       |                                |                     |
| Salvar               | Validar Dados                  | padrão              |
| Cancelar             | Fim do processo                | cancelar            |


**2- Validar Dados**

| **Campo**              | **Tipo**         | **Restrições** | **Valor default** |
| ---                    | ---              | ---            | ---               |
| Verificação automática |Imagem/Ícone      | Verifica campos obrigatórios  | -  |
|                        |                  |                |                   |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Confirmar            | Classificar por Categoria      | padrão            |
| Corrigir             | Inserir Despesa                |  cancelar         |

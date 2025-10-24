### 3.3.1 Processo 1 – Registro de Despesas

Hoje muitos microempreendedores registram suas despesas em cadernos ou planilhas, sem padronização e com risco de perda de informações. O Smart Gestão permitirá que o registro seja automatizado, categorizado e armazenado em nuvem, trazendo mais organização e segurança.

![Exemplo de um Modelo BPMN do PROCESSO 1](../images/process.png "Modelo BPMN do Processo 1.")

#### Detalhamento das atividades

No processo de registro de despesas do sistema Smart Gestão, o usuário inicia inserindo informações básicas como descrição, valor, data e forma de pagamento, com a opção de anexar comprovantes. Em seguida, os dados passam por uma validação automática para garantir o preenchimento correto dos campos obrigatórios. Após essa verificação, a despesa é classificada em categorias pré-definidas, como alimentação, transporte ou fornecedores, possibilitando uma organização mais estruturada. Por fim, o registro é salvo no sistema com identificação única e data/hora automáticas, ficando disponível para consultas futuras e para a geração de relatórios financeiros.

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

### 3.3.3 Processo 3 – Cadastro e gerenciamento de clientes

O processo de Cadastro e Gerenciamento de Clientes é essencial para organizar informações de clientes e fornecedores, servindo de base para outros módulos do sistema, como despesas, receitas e relatórios. Ele garante dados centralizados, evita duplicidades e facilita a tomada de decisões.


![Exemplo de um Modelo BPMN do PROCESSO 1] [Processo3.drawio.pdf](https://github.com/user-attachments/files/22567254/Processo3.drawio.pdf)


#### Detalhamento das atividades

No Sistema, o usuário poderá cadastrar, editar, buscar e desativar registros, contando com validações automáticas e alertas de erro. Assim, o sistema oferece uma interface simples e eficiente para manter os cadastros atualizados e confiáveis.

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

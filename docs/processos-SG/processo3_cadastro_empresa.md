### 3.3.3 Processo 3: Cadastro de Empresa

O processo de cadastro de empresa permite que novos usuários criem uma conta no sistema, fornecendo suas informações básicas e detalhes sobre o tipo de negócio. Esta etapa é fundamental para que o usuário possa começar a utilizar as funcionalidades de controle de despesas.

**Fluxo principal:**
1. Usuário acessa a página de criação de conta.
2. Usuário preenche os dados cadastrais.
3. Usuário clica em "Criar Conta".
4. Sistema valida os dados fornecidos.
5. Sistema cria a nova conta.
6. Usuário é redirecionado para a página de login ou dashboard.

## **Modelagem BPMN:** <img width="1602" height="381" alt="Processo3 drawio" src="https://github.com/user-attachments/assets/2674a917-7672-481f-97ac-62ae25047faa" />
## **Wireframe (esboço previo da tela)**


<img width="482" height="353" alt="Captura de tela 2025-11-07 185142" src="https://github.com/user-attachments/assets/409ab0ae-a9d7-445e-bce3-842ea0978105" />

---

> **Ponto de Melhoria (Revisado por Heron):** Olá, equipe! Para alinhar esta documentação com o formulário de cadastro real (`cadastro.html`) e a lógica do backend, peço ao responsável que ajuste a "Atividade 1 – Preencher Dados Cadastrais" abaixo.
> 
> **Guia para o ajuste:**
> 1.  **Ajustar a Tabela de Campos:** Na tabela, remova a linha referente ao `Tipo de Negócio` e adicione duas novas linhas: uma para `Nome da Empresa` (Texto, Obrigatório) e outra para `CNPJ` (Texto, Obrigatório).
> 2.  **Ajustar a Lista de Comandos:** Na lista de comandos, remova o item sobre "Selecionar o tipo de negócio" e adicione os comandos para "Inserir o nome da empresa" e "Inserir o CNPJ".

--- 

#### Detalhamento das atividades

## Atividade 1 – Preencher Dados Cadastrais (Usuário)

Esta atividade envolve o preenchimento das informações necessárias para a criação da conta.

| Campo/Elemento     | Tipo          | Restrições                                  |
|:-------------------|:--------------|:--------------------------------------------|
| Nome Completo      | Texto         | Obrigatório. Campo de texto.                |
| E-mail             | E-mail        | Obrigatório. Formato de e-mail válido.      |
| Senha              | Senha         | Obrigatório. Mínimo de 6 caracteres.        |
| Confirmar Senha    | Senha         | Obrigatório. Deve ser idêntica à senha.     |
| Tipo de Negócio    | Seleção Única | Obrigatório. Opções: MEI, Autônomo, Outro.  |

**Comandos**
- Inserir o nome completo no campo "Nome Completo".
- Inserir o endereço de e-mail no campo "E-mail".
- Inserir a senha no campo "Senha".
- Inserir a senha novamente no campo "Confirmar Senha".
- Selecionar o tipo de negócio no dropdown "Tipo de Negócio".

---

## Atividade 2 – Criar Conta (Usuário)

Após preencher os dados, o usuário finaliza o processo de criação da conta.

| Campo/Elemento     | Tipo   | Restrições                                  |
|:-------------------|:-------|:--------------------------------------------|
| Botão: Criar Conta | Botão  | Habilitado após o preenchimento de todos os campos obrigatórios e validação. |

**Comandos**
- Clicar no botão "Criar Conta".

---

## Atividade 3 – Navegar para Login (Opcional) (Usuário)

Caso o usuário já possua uma conta, ele pode optar por fazer login.

| Campo/Elemento     | Tipo   | Restrições                                  |
|:-------------------|:-------|:--------------------------------------------|
| Link: Fazer login  | Link   | Redireciona para a página de login.         |

**Comandos**
- Clicar no link "Fazer login".

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

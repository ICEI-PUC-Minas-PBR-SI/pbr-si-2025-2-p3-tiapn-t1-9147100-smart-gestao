### 3.3.4 Processo 4: Criação de metas

O processo de criação de metas permite que os usuários definam objetivos financeiros ou de gestão dentro do sistema, fornecendo informações básicas como nome da meta, valor desejado e prazo. Esta etapa é fundamental para que o usuário possa acompanhar seu progresso e utilizar as funcionalidades de controle de despesas e receitas.

**Fluxo principal:**
1. O usuário acessa a página de criação de metas.
2. O usuário preenche os dados da meta.
3. O usuário clica em “Salvar Meta”.
4. O sistema valida os dados fornecidos.
5. O sistema registra a nova meta.
6. O sistema registra a nova meta.
7. O usuário é redirecionado para a tela de listagem de metas.
6. O usuário é redirecionado para a tela de listagem de metas.


> **Ponto de Melhoria (Revisado por Heron):** Pessoal, a etapa "O sistema registra a nova meta" está duplicada neste fluxo (passos 5 e 6 originais). O responsável pela documentação poderia remover a etapa repetida para deixar o fluxo correto?
   
Modelagem BPMN: <img width="1081" height="661" alt="metas" src="https://github.com/user-attachments/assets/7bcb4eaa-0e56-4e4d-92ec-145efea0c9fc" />


---

> **Ponto de Melhoria Importante (Revisado por Heron):** Olá, equipe! Um ponto de atenção aqui: a seção "Detalhamento das atividades" precisa ser refeita, pois o conteúdo é do cadastro de usuário.
>
> **Guia para a reescrita:**
> O responsável pela documentação pode substituir todo o conteúdo abaixo por uma única atividade chamada **"Definir Nova Meta Financeira"**. A estrutura deve ter:
> - **Uma tabela de campos com:** `Nome da Meta`, `Valor Alvo`, `Prazo` e `Botão: Salvar Meta`.
> - **Uma lista de comandos** descrevendo como preencher cada campo e clicar no botão para salvar.

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

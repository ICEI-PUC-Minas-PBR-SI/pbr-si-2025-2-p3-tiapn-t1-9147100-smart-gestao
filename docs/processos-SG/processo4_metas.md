### 3.3.4 Processo 4: Criação de metas

O processo de criação de metas permite que os usuários definam objetivos financeiros ou de gestão dentro do sistema, fornecendo informações básicas como nome da meta, valor desejado e prazo. Esta etapa é fundamental para que o usuário possa acompanhar seu progresso e utilizar as funcionalidades de controle de despesas e receitas.

**Fluxo principal:**
1. O usuário acessa a página de criação de metas.
2. O usuário preenche os dados da meta.
3. O usuário clica em “Salvar Meta”.
4. O sistema valida e registra a nova meta.
5. O usuário é redirecionado para a tela de listagem de metas.



> **Ponto de Melhoria Crítico (Revisado por Heron):** Olá, equipe! Ao validar os processos, notei que toda a seção "Detalhamento das atividades" abaixo está incorreta (o conteúdo é do processo de cadastro de usuário). Peço ao responsável que a substitua completamente pelo conteúdo correto, conforme o guia abaixo.
> 
> **Guia para a reescrita ("mastigado"):**
> Apague todo o conteúdo desde `#### Detalhamento das atividades` até o final do arquivo e substitua-o por uma nova seção que descreva o processo correto de **criação de metas**.
>
> A nova seção deve conter uma única atividade, "Definir Nova Meta Financeira", detalhando os campos necessários (`Título da Meta`, `Tipo`, `Valor Alvo`, etc.) e os comandos do usuário, de forma semelhante aos outros documentos de processo.
   
Modelagem BPMN: <img width="1081" height="661" alt="metas (2)" src="https://github.com/user-attachments/assets/0b32a756-a7cf-428b-b1a3-83886ee2a48e" />

---

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

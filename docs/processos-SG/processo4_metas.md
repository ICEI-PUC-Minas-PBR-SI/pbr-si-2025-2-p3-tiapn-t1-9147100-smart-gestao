### 3.3.4 Processo 4: Criação de metas

O processo de criação de metas permite que os usuários definam objetivos financeiros ou de gestão dentro do sistema, fornecendo informações básicas como nome da meta, valor desejado e prazo. Esta etapa é fundamental para que o usuário possa acompanhar seu progresso e utilizar as funcionalidades de controle de despesas e receitas.

**Fluxo principal:**
1. O usuário acessa a página de criação de metas.
2. O usuário preenche os dados da meta.
3. O usuário clica em “Salvar Meta”.
4. O sistema valida e registra a nova meta.
5. O usuário é redirecionado para a tela de listagem de metas.

---

> **Ponto de Melhoria Crítico (Revisado por Heron):** Olá, equipe! Ao validar os processos, notei que toda a seção "Detalhamento das atividades" abaixo está incorreta, pois descreve o processo de **cadastro de usuário** em vez do processo de **criação de metas**. Peço ao responsável que realize a correção completa, conforme o guia detalhado abaixo.
> 
> **Guia para a Reescrita:**
> 
> 1.  **Remova o Conteúdo Incorreto:** Apague todo o conteúdo a partir do título `## Atividade 1 – Preencher Dados Cadastrais (Usuário)` até o final do arquivo, **mas preserve a seção `_Tipos de dados utilizados:_`**, que já está correta e deve ser mantida.
> 
> 2.  **Crie a Nova Seção de Atividades:** No lugar do conteúdo removido, adicione a seguinte estrutura para descrever o processo correto de criação de metas, alinhado ao diagrama BPMN acima e ao modelo `Goal.js` do backend.
> 
>     *   **Crie um título principal:** `### Detalhamento das atividades`
> 
>     *   **Crie a Atividade 1:** `#### Atividade 1 – Definir Nova Meta Financeira (Usuário)`
>         *   Adicione a descrição: `Esta atividade envolve o preenchimento dos dados para a criação de uma nova meta financeira.`
>         *   Crie uma tabela de "Campos e Elementos" com os seguintes campos: `Título da Meta` (Caixa de Texto, Obrigatório), `Tipo` (Seleção Única, Obrigatório, com opções como: Receita, Despesa, Economia), `Valor Alvo` (Número, Obrigatório, Valor monetário), `Valor Atual` (Número, Opcional, Valor monetário), `Prazo` (Data, Opcional).
>         *   Adicione uma seção de "Comandos" descrevendo como o usuário preenche cada um desses campos. Exemplo: `- Inserir o título da meta no campo "Título da Meta".`
> 
>     *   **Crie a Atividade 2:** `#### Atividade 2 – Salvar Meta (Usuário)`
>         *   Adicione a descrição: `Após preencher os dados, o usuário finaliza o processo de criação da meta.`
>         *   Crie uma tabela para o botão "Salvar Meta", indicando que ele é habilitado após o preenchimento dos campos obrigatórios.
>         *   Adicione o comando correspondente: `- Clicar no botão "Salvar Meta".`

---   

Modelagem BPMN: 

<img width="1291" height="441" alt="Diagrama sem nome-Página-3 drawio" src="https://github.com/user-attachments/assets/5cb8df22-a084-4f95-a0d7-e869f1384494" />

### Detalhamento das Atividades

#### Atividade 1 – Definir Nova Meta Financeira (Usuário)

Esta atividade envolve o preenchimento dos dados para a criação de uma nova meta financeira.

| Campo/Elemento | Tipo | Restrições |
| :--- | :--- | :--- |
| Título da Meta | Caixa de Texto | Obrigatório. |
| Tipo | Seleção Única | Obrigatório. Opções: Receita, Despesa, Economia. |
| Valor Alvo | Número | Obrigatório. Valor monetário. |
| Valor Atual | Número | Opcional. Valor monetário. |
| Prazo | Data | Opcional. |

#### Comandos de Interação

*   Inserir o título da meta no campo "Título da Meta".
*   Selecionar o tipo de meta no campo "Tipo".
*   Inserir o valor desejado no campo "Valor Alvo".
*   Inserir o valor atual da meta no campo "Valor Atual" (se aplicável).
*   Selecionar a data limite no campo "Prazo" (se aplicável).

---

#### Atividade 2 – Salvar Meta (Usuário)

Após preencher os dados, o usuário finaliza o processo de criação da meta.

| Campo/Elemento | Tipo | Restrições |
| :--- | :--- | :--- |
| Botão: Salvar Meta | Botão | Habilitado após o preenchimento dos campos obrigatórios. |

#### Comandos de Interação

*   Clicar no botão "Salvar Meta".

---


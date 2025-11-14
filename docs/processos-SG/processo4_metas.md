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

### Detalhamento das Atividades

#### Atividade 1 – Definir Nova Meta Financeira (Usuário)

Esta atividade envolve o preenchimento dos dados para a criação de uma nova meta financeira.

| Campo/Elemento | Tipo | Restrições |
| :--- | :--- | :--- |
| Título da Meta | Caixa de Texto | Obrigatório. |
| Categoria | Seleção Única | Obrigatório. (Ex: Equipamento, Fundo de Emergência) |
| Valor Alvo (R$) | Número | Obrigatório. Valor monetário. |
| Valor Atual (R$) | Número | Opcional. Valor monetário. |
| Prazo | Data | Opcional. Formato dd/mm/aaaa. |
| Descrição | Área de Texto | Opcional. |

#### Comandos de Interação

*   Inserir o título da meta no campo "Título da Meta".
*   Selecionar a categoria no campo "Categoria".
*   Inserir o valor desejado no campo "Valor Alvo (R$)".
*   Inserir o valor atual da meta no campo "Valor Atual (R$)" (se aplicável).
*   Selecionar a data limite no campo "Prazo".
*   Inserir a descrição no campo "Descrição (Opcional)".

---

#### Atividade 2 – Salvar Meta (Usuário)

Após preencher os dados, o usuário finaliza o processo de criação da meta.

| Campo/Elemento | Tipo | Restrições |
| :--- | :--- | :--- |
| Botão: Criar Meta | Botão | Habilitado após o preenchimento dos campos obrigatórios. |
| Botão: Cancelar | Botão | Cancela a criação da meta. |

#### Comandos de Interação

*   Clicar no botão "Criar Meta".
*   Clicar no botão "Cancelar".

---

## 2. Processo 5: Gestão e Visualização de Metas (Baseado na Imagem)

Este processo detalha a interação do usuário com a tela de listagem de metas.

### Fluxo Principal

1.  O usuário acessa a página "Minhas Metas".
2.  O sistema exibe a lista de metas.
3.  O usuário filtra a lista por status.
4.  O usuário interage com uma meta específica (Editar, Detalhes, Reativar).

### Detalhamento das Atividades

#### Atividade 1 – Filtrar e Visualizar Metas (Usuário)

Esta atividade envolve a navegação e filtragem da lista de metas.

| Campo/Elemento | Tipo | Restrições |
| :--- | :--- | :--- |
| Botão: Todas | Botão | Filtra para exibir todas as metas. |
| Botão: Em Andamento | Botão | Filtra para exibir metas ativas. |
| Botão: Concluídas | Botão | Filtra para exibir metas finalizadas. |
| Cartão de Meta | Tabela/Elemento | Exibe Título, Status, Prazo/Conclusão e Categoria. |

#### Comandos de Interação

*   Clicar no botão "Todas" para ver todas as metas.
*   Clicar no botão "Em Andamento" para ver as metas ativas.
*   Clicar no botão "Concluídas" para ver as metas finalizadas.

---

#### Atividade 2 – Interagir com Metas (Usuário)

Esta atividade envolve as ações disponíveis para cada meta listada.

| Campo/Elemento | Tipo | Restrições |
| :--- | :--- | :--- |
| Botão: Editar | Botão | Disponível para metas "Em Andamento". Abre o formulário de edição (Processo 4). |
| Botão: Detalhes | Botão | Disponível para todas as metas. Abre a tela de detalhes da meta. |
| Botão: Reativar | Botão | Disponível para metas "Concluídas". Altera o status para "Em Andamento". |

#### Comandos de Interação

*   Clicar no botão "Editar" para modificar uma meta em andamento.
*   Clicar no botão "Detalhes" para ver informações completas da meta.
*   Clicar no botão "Reativar" para reabrir uma meta concluída.

---

## 3. Comandos Git para o Projeto APN

Os comandos a seguir são sugeridos para inicializar o repositório Git e adicionar os arquivos do projeto (`APN.zip` descompactado) para controle de versão.

**Arquivos do Projeto:**
- `APN/cadastro.html`
- `APN/index.html`
- `APN/login.html`
- `APN/metas.html`
- `APN/perfil.html`
- `APN/relatorios.html`
- `APN/style.css`
- `APN/transacoes.html`

```bash
# 1. Inicializa um novo repositório Git no diretório raiz do projeto
git init

# 2. Adiciona todos os arquivos do projeto ao stage
# (Assumindo que os arquivos estão no diretório 'APN/')
git add APN/

# OU, se você estiver no diretório raiz e quiser adicionar todos os arquivos
# git add .

# 3. Confirma (commit) os arquivos adicionados com uma mensagem descritiva
git commit -m "Commit inicial: Adição de todas as páginas HTML e folha de estilo CSS do projeto APN"

# 4. (Opcional) Adiciona um repositório remoto (ex: GitHub)
# Substitua <URL_DO_SEU_REPOSITORIO> pela URL real
# git remote add origin <URL_DO_SEU_REPOSITORIO>

# 5. (Opcional) Envia (push) o código para o repositório remoto
# git push -u origin main

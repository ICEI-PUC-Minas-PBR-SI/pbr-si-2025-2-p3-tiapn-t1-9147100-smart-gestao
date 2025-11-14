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


---
## 2. Detalhamento das Atividades

### 2.1. Atividade 1 – Definir Nova Meta Financeira (Usuário)

Esta atividade envolve o preenchimento dos dados para a criação de uma nova meta financeira. **(Tabela e Comandos reescritos conforme feedback)**

#### Campos e Elementos (Corrigidos)

| Campo/Elemento | Tipo | Restrições |
| :--- | :--- | :--- |
| Título da Meta | Caixa de Texto | Obrigatório. |
| Tipo | Seleção Única | Obrigatório. Opções: Receita, Despesa, Economia. |
| Valor Alvo | Número | Obrigatório. Valor monetário. |
| Valor Atual | Número | Opcional. Valor monetário. |
| Prazo | Data | Opcional. |

#### Comandos de Interação (Corrigidos)

*   Inserir o título da meta no campo "Título da Meta".
*   Selecionar o tipo de meta no campo "Tipo".
*   Inserir o valor desejado no campo "Valor Alvo".
*   Inserir o valor atual da meta no campo "Valor Atual" (se aplicável).
*   Selecionar a data limite no campo "Prazo" (se aplicável).

---

### 2.2. Atividade 2 – Salvar Meta (Usuário)

Após preencher os dados, o usuário finaliza o processo de criação da meta.

#### Campos e Elementos

| Campo/Elemento | Tipo | Restrições |
| :--- | :--- | :--- |
| Botão: Salvar Meta | Botão | Habilitado após o preenchimento dos campos obrigatórios. |

#### Comandos de Interação

*   Clicar no botão "Salvar Meta".

---

## 3. Tipos de Dados Utilizados

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

---

## 4. Comandos Git para o Projeto APN

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

*   **Tabela** - campo formado por uma matriz de valores

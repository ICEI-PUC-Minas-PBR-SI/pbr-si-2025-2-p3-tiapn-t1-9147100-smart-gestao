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
#### Atividade 1 – Inserir Dados do Novo Usuário (Administrador/RH)

Esta atividade envolve o preenchimento das informações para a criação de um novo acesso.

| Campo/Elemento | Tipo | Restrições |
| :--- | :--- | :--- |
| Nome Completo | Caixa de Texto | Obrigatório. |
| E-mail | E-mail | Obrigatório. Formato de e-mail válido. |
| Cargo | Seleção Única | Obrigatório. Opções: Administrador, Financeiro, Vendas, etc. |
| Status | Seleção Única | Obrigatório. Opções: Ativo, Inativo. |
| Senha Provisória | Senha | Opcional. Gerada automaticamente ou definida manualmente. |

#### Comandos de Interação

*   Inserir o nome completo do novo usuário.
*   Inserir o endereço de e-mail (será o login).
*   Selecionar o cargo/nível de acesso.
*   Selecionar o status inicial (Ativo).
*   Clicar em "Salvar Usuário".

---

## 2. Processo 6: Login no Sistema (Estrutura Lógica)

Este processo detalha o acesso do usuário ao sistema após o cadastro.

### Fluxo Principal

1.  Usuário acessa a página de login.
2.  Usuário insere E-mail e Senha.
3.  Usuário clica em "Entrar".
4.  Sistema valida as credenciais.
5.  Se válido, usuário é redirecionado para o Dashboard.
6.  Se inválido, sistema exibe mensagem de erro.

### Detalhamento das Atividades

#### Atividade 1 – Autenticação (Usuário)

Esta atividade envolve a inserção das credenciais para acesso.

| Campo/Elemento | Tipo | Restrições |
| :--- | :--- | :--- |
| E-mail | E-mail | Obrigatório. Formato de e-mail válido. |
| Senha | Senha | Obrigatório. |
| Botão: Entrar | Botão | Habilitado após o preenchimento. |
| Link: Esqueci a Senha | Link | Redireciona para recuperação de senha. |

#### Comandos de Interação

*   Inserir o endereço de e-mail no campo "E-mail".
*   Inserir a senha no campo "Senha".
*   Clicar no botão "Entrar".
*   (Opcional) Clicar no link "Esqueci a Senha".

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
Nota: Se você tiver o conteúdo específico para os Processos 5 e 6 em um arquivo de texto, por favor, me envie para que eu possa refinar esta documentação com base nos seus dados reais.
Tarefa concluída
Como foi este resultado?
Sugestões de acompanhamento

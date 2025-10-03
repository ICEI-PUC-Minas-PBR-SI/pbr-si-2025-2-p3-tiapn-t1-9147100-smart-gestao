### Processo 3 – Personalização de Perfil

O processo de personalização de perfil permite que o usuário configure e edite suas informações pessoais e acadêmicas após o login. Essa etapa é importante para adaptar a experiência de uso às necessidades de cada membro da comunidade acadêmica, permitindo atualizações de dados, inserção de foto, definição de preferências e atualização de informações institucionais.

**Fluxo principal:**
1. Usuário acessa a área de perfil.
2. Sistema exibe formulário de personalização.
3. Usuário atualiza informações desejadas.
4. Sistema valida os dados fornecidos.
5. Sistema salva as alterações no banco de dados.
6. Perfil atualizado é exibido ao usuário.

---

#### Detalhamento das atividades

## Atividade 1 – Acessar e Visualizar Perfil (Usuário)

Esta atividade envolve a navegação do usuário até a página de perfil e a visualização das informações.

| Campo/Elemento           | Tipo   | Restrições                                  |
|:-------------------------|:-------|:--------------------------------------------|
| Botão/Link: Perfil       | Botão/Link | Apenas usuários logados podem acessar       |
| Avatar do Usuário        | Imagem | Exibe a imagem de perfil do usuário         |
| Nome Completo            | Texto  | Exibe o nome completo do usuário            |
| E-mail                   | Texto  | Exibe o e-mail do usuário                   |
| Telefone                 | Texto  | Exibe o telefone do usuário                 |
| CNPJ                     | Texto  | Exibe o CNPJ do usuário                     |
| Tipo de Negócio          | Texto  | Exibe o tipo de negócio do usuário          |

**Comandos**
- Navegar para a página de perfil.
- Visualizar informações pessoais e estatísticas.

---

## Atividade 2 – Editar Informações Pessoais (Usuário)

Permite ao usuário modificar seus dados pessoais exibidos no perfil.

| Campo/Elemento           | Tipo   | Restrições                                  |
|:-------------------------|:-------|:--------------------------------------------|
| Botão: Editar (Informações Pessoais) | Botão  | Habilita a edição dos campos                |
| Campo: Nome Completo     | Texto  | Campo de texto editável                     |
| Campo: E-mail            | Texto  | Campo de texto editável (formato e-mail)    |
| Campo: Telefone          | Texto  | Campo de texto editável (formato telefone)  |
| Campo: CNPJ              | Texto  | Campo de texto editável (formato CNPJ)      |
| Campo: Tipo de Negócio   | Texto  | Campo de texto editável                     |
| Botão: Salvar Alterações | Botão  | Salva as modificações no sistema            |
| Botão: Cancelar Edição   | Botão  | Descarta as modificações e retorna ao estado anterior |

**Comandos**
- Clicar em "Editar" para habilitar os campos.
- Preencher/modificar os campos desejados.
- Clicar em "Salvar Alterações" para persistir os dados.
- Clicar em "Cancelar Edição" para desfazer as alterações.

---

## Atividade 3 – Gerenciar Configurações da Conta (Usuário)

Permite ao usuário ajustar preferências como notificações e tema da interface.

| Campo/Elemento           | Tipo     | Restrições                                  |
|:-------------------------|:---------|:--------------------------------------------|
| Toggle: Notificações     | Toggle   | Ativa/desativa alertas sobre metas e despesas |
| Toggle: E-mails de Relatório | Toggle   | Ativa/desativa o recebimento de relatórios semanais |
| Toggle: Tema Escuro      | Toggle   | Ativa/desativa o modo escuro da interface   |

**Comandos**
- Clicar no toggle para ativar ou desativar a opção desejada.

---

## Atividade 4 – Definir Preferências Financeiras (Usuário)

Permite ao usuário configurar aspectos financeiros como moeda padrão e orçamento.

| Campo/Elemento           | Tipo         | Restrições                                  |
|:-------------------------|:-------------|:--------------------------------------------|
| Seleção: Moeda Padrão    | Seleção única | Escolha entre Real, Dólar, Euro             |
| Seleção: Dia de Vencimento de Impostos | Seleção única | Escolha entre opções pré-definidas ou personalizado |
| Campo: Orçamento Mensal Padrão | Número       | Campo numérico para definir orçamento mensal |

**Comandos**
- Selecionar a moeda padrão desejada.
- Selecionar o dia de vencimento de impostos.
- Inserir um valor para o orçamento mensal padrão.

---

## Atividade 5 – Realizar Ações da Conta (Usuário)

Oferece opções para exportar dados, alterar senha ou sair da conta.

| Campo/Elemento           | Tipo   | Restrições                                  |
|:-------------------------|:-------|:--------------------------------------------|
| Botão: Exportar Todos os Dados | Botão  | Exporta todos os dados do usuário em formato PDF |
| Botão: Alterar Senha     | Botão  | Redireciona para a tela de alteração de senha |
| Botão: Sair da Conta     | Botão  | Encerra a sessão do usuário                 |

**Comandos**
- Clicar em "Exportar Todos os Dados" para gerar um PDF.
- Clicar em "Alterar Senha" para iniciar o processo de mudança de senha.
- Clicar em "Sair da Conta" para fazer logout.

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
 

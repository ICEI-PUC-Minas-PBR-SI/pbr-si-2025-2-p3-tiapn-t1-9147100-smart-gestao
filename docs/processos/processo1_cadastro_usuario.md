### 3.3.1 Processo 1 – Cadastro de Usuários

O processo de cadastro tem como objetivo permitir que novos usuários sejam registrados na plataforma PUC Integra.  
Durante o cadastro, o usuário informa seus dados pessoais (nome, e-mail institucional, senha, matrícula e curso).  
Após o preenchimento, o sistema valida as informações e identifica automaticamente o tipo de usuário: **aluno** ou **professor**.  

Essa identificação é essencial para garantir que o perfil inicial seja atribuído corretamente, permitindo que cada usuário utilize a plataforma de acordo com suas responsabilidades acadêmicas.  

**Oportunidades de melhoria:**  
- Automatizar a identificação do perfil com base na matrícula e e-mail;  
- Implementar mensagens claras de erro para facilitar a experiência do usuário;  
- Garantir segurança no armazenamento dos dados (criptografia de senha e validação de entrada). 

![PROCESSO 1 - Cadastro de Usuários](/assets/images/p1_CadastroUsuario.png "Modelo BPMN do Processo 1.")

---

#### Detalhamento das atividades  

#### Atividade 1 – Acessar tela de cadastro (Usuário)

| **Campo**         | **Tipo**       | **Restrições**              | **Valor default** |
|--------------------|----------------|-----------------------------|-------------------|
| botão cadastro     | Botão          | único, visível              |                   |

| **Comandos**       | **Destino**            | **Tipo**   |
|--------------------|------------------------|------------|
| clicar             | Exibe formulário       | default    |

---

#### Atividade 2 – Exibir formulário de cadastro (Sistema)

| **Campo**            | **Tipo**        | **Restrições**                                        | **Valor default** |
|-----------------------|-----------------|-------------------------------------------------------|-------------------|
| formulário cadastro   | Caixa de texto  | campos obrigatórios: nome, e-mail, senha, matrícula   |                   |

| **Comandos**          | **Destino**                   | **Tipo**   |
|-----------------------|--------------------------------|------------|
| preencher formulário  | Preencher dados do cadastro    | default    |
| cancelar              | Fim do processo                | cancel     |

---

#### Atividade 3 – Preencher dados de cadastro (Usuário)

## Atividade 3 – Exibir formulário de dados (Sistema)
| Campo | Tipo | Restrições |
|-------|------|------------|
| Nome completo | Texto | resposta obrigatória |
| CPF | Numérico | 11 dígitos, formato XXX.XXX.XXX-XX, obrigatório |
| E-mail institucional | Texto | formato XXX@sga.pucminas.br, obrigatório |
| Matrícula | Texto/Numérico | obrigatório |
| Telefone | Numérico | formato (XX)XXXXX-XXXX, obrigatório |
| Senha | Texto | 8 caracteres, contendo maiúscula, minúscula, número e caractere especial, obrigatório |
| Confirmar senha | Texto | 8 caracteres, contendo maiúscula, minúscula, número e caractere especial, obrigatório |
| Tipo de usuário | Combo box | Aluno, professor ou monitor, obrigatório |


| **Comandos**       | **Destino**                | **Tipo**   |
|--------------------|-----------------------------|------------|
| confirmar dados    | Validar informações         | default    |

---

#### Atividade 4 – Validar informações (Sistema)

| **Campo**         | **Tipo**    | **Restrições**                                 | **Valor default** |
|--------------------|-------------|-----------------------------------------------|-------------------|
| validação dados    | Booleano    | verificar e-mail, matrícula e força da senha  |                   |

| **Comandos**       | **Destino**                     | **Tipo**   |
|--------------------|----------------------------------|------------|
| dados válidos      | Identificar perfil               | default    |
| dados inválidos    | Exibir mensagem de erro          | cancel     |

---

#### Atividade 5 – Identificar perfil (Sistema)

| **Campo**        | **Tipo**        | **Restrições**                             | **Valor default** |
|-------------------|-----------------|--------------------------------------------|-------------------|
| perfil usuário    | Seleção única   | aluno (com matrícula em curso) / professor |                   |

| **Comandos**       | **Destino**                | **Tipo**   |
|--------------------|-----------------------------|------------|
| aluno              | Armazenar cadastro          | default    |
| professor          | Armazenar cadastro          | default    |

---

#### Atividade 6 – Armazenar cadastro (Banco de Dados)

| **Campo**            | **Tipo**    | **Restrições**                       | **Valor default** |
|-----------------------|-------------|--------------------------------------|-------------------|
| cadastro registrado   | Registro    | salvar dados de forma segura         |                   |

| **Comandos**       | **Destino**               | **Tipo**   |
|--------------------|----------------------------|------------|
| salvar cadastro    | Confirmar cadastro         | default    |

---

#### Atividade 7 – Confirmar cadastro (Sistema)

| **Campo**        | **Tipo**       | **Restrições**                      | **Valor default** |
|-------------------|----------------|-------------------------------------|-------------------|
| mensagem sucesso  | Texto          | exibida apenas quando cadastro ok   |                   |

| **Comandos**       | **Destino**         | **Tipo**   |
|--------------------|---------------------|------------|
| prosseguir login   | Exibir tela de login | default    |

---

_Tipos de dados utilizados:_  

* **Área de texto** - campo texto de múltiplas linhas  
* **Caixa de texto** - campo texto de uma linha  
* **Número** - campo numérico  
* **Data** - campo do tipo data (dd-mm-aaaa)  
* **Hora** - campo do tipo hora (hh:mm:ss)  
* **Data e Hora** - campo do tipo data e hora (dd-mm-aaaa, hh:mm:ss)  
* **Imagem** - campo contendo uma imagem  
* **Seleção única** - campo com várias opções de valores que são mutuamente exclusivas (radio button ou combobox)  
* **Seleção múltipla** - campo com várias opções que podem ser selecionadas mutuamente (checkbox ou listbox)  
* **Arquivo** - campo de upload de documento  
* **Link** - campo que armazena uma URL  
* **Tabela** - campo formado por uma matriz de valores  
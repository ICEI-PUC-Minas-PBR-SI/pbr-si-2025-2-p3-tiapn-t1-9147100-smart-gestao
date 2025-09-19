### 3.3.1 Processo 1 – Login e Cadastro de usuários

O modelo apresentado descreve o processo de login e cadastro de usuários no sistema PUC Integra.
O fluxo inicia quando o usuário acessa a plataforma, podendo entrar com login e senha ou optar por se cadastrar. No cadastro, o usuário preenche um formulário com dados pessoais (nome, e-mail institucional, CEP, data de nascimento, CPF, matrícula, curso e tipo de usuário). Em seguida, deve aceitar os termos e a política de privacidade.
O sistema valida as informações preenchidas, cruzando CPF, matrícula e e-mail com o banco de dados. Caso haja inconsistências, o usuário retorna ao formulário para correção; se estiverem corretas, o sistema consulta o tipo de usuário e armazena seus dados.
Por fim, são atribuídas permissões específicas conforme o perfil (aluno, professor, monitor ou visitante), e o acesso é liberado, concluindo o processo, garantindo que somente usuários válidos e devidamente cadastrados tenham acesso à plataforma, com permissões ajustadas ao seu papel.


![Exemplo de um Modelo BPMN do PROCESSO 1](../images/modelagem_processo1.png "Modelo BPMN do Processo 1.")

### 3.3.1 Processo 1 – Login e Cadastro de Usuários  

O processo 1 tem como objetivo permitir que os usuários acessem a plataforma, verificando se já possuem cadastro e, caso contrário, possibilitando a criação de um novo registro. Além disso, o processo valida as credenciais fornecidas e libera o acesso apenas para usuários autenticados corretamente.  

**Oportunidades de melhoria:**  
- Automatizar a verificação de cadastro para reduzir o tempo de resposta;  
- Implementar mensagens claras de erro para facilitar a experiência do usuário;  
- Garantir segurança no armazenamento de dados (criptografia de senhas e validação de entrada).  

![Modelo BPMN do Processo 1](../images/process1.png "Modelo BPMN do Processo 1.")  

---

#### Detalhamento das atividades  

**Atividade 1 – Acessar plataforma (Usuário)**  

| **Campo**       | **Tipo**        | **Restrições**                     | **Valor default** |
|------------------|-----------------|------------------------------------|-------------------|
| URL da plataforma| Link            | acesso via navegador               |                   |

| **Comandos**     | **Destino**            | **Tipo**   |
|------------------|------------------------|------------|
| acessar          | Clicar em "Entrar"     | default    |

---

**Atividade 2 – Clicar em "Entrar" (Usuário)**  

| **Campo**        | **Tipo**       | **Restrições**     | **Valor default** |
|-------------------|----------------|--------------------|-------------------|
| botão entrar      | Botão          | único, visível     |                   |

| **Comandos**     | **Destino**               | **Tipo**   |
|------------------|---------------------------|------------|
| confirmar clique | Pergunta se tem cadastro  | default    |

---

**Atividade 3 – Pergunta se tem cadastro (Sistema)**  

| **Campo**         | **Tipo**       | **Restrições**                       | **Valor default** |
|--------------------|----------------|--------------------------------------|-------------------|
| pergunta exibida   | Texto          | resposta obrigatória (sim/não)       |                   |

| **Comandos**       | **Destino**              | **Tipo**   |
|--------------------|--------------------------|------------|
| sim                | Exibe tela de login      | default    |
| não                | Exibe tela de cadastro   | default    |

---

**Atividade 4 – Exibe tela de cadastro (Sistema)**  

| **Campo**         | **Tipo**        | **Restrições**                                      | **Valor default** |
|--------------------|-----------------|-----------------------------------------------------|-------------------|
| formulário cadastro| Tabela/caixas   | campos obrigatórios: nome, e-mail, senha, matrícula |                   |

| **Comandos**       | **Destino**                   | **Tipo**   |
|--------------------|--------------------------------|------------|
| enviar cadastro    | Preencher dados de cadastro    | default    |
| cancelar           | Fim do processo                | cancel     |

---

**Atividade 5 – Preencher dados de cadastro (Usuário)**  

| **Campo**         | **Tipo**        | **Restrições**                                    | **Valor default** |
|--------------------|-----------------|---------------------------------------------------|-------------------|
| nome               | Caixa de texto  | mínimo 3 caracteres                               |                   |
| e-mail             | Caixa de texto  | formato institucional (xxxx@sga.pucminas.br)      |                   |
| senha              | Caixa de texto  | mínimo 8 caracteres, incluindo número e símbolo   |                   |
| matrícula          | Caixa de texto  | valor numérico válido                             |                   |

| **Comandos**       | **Destino**                  | **Tipo**   |
|--------------------|-------------------------------|------------|
| confirmar dados    | Dados estão de acordo?        | default    |

---

**Atividade 6 – Dados estão de acordo? (Sistema)**  

| **Campo**        | **Tipo**     | **Restrições**                    | **Valor default** |
|-------------------|--------------|-----------------------------------|-------------------|
| validação dados   | Booleano     | verificar preenchimento correto   |                   |

| **Comandos**       | **Destino**                    | **Tipo**   |
|--------------------|--------------------------------|------------|
| sim                | Armazena dados cadastrados     | default    |
| não                | Exibe "Tente novamente"        | cancel     |

---

**Atividade 7 – Armazena dados cadastrados (Banco de Dados)**  

| **Campo**          | **Tipo**    | **Restrições**                           | **Valor default** |
|---------------------|-------------|------------------------------------------|-------------------|
| cadastro gravado    | Registro    | salvar dados no banco de forma segura    |                   |

| **Comandos**       | **Destino**       | **Tipo**   |
|--------------------|-------------------|------------|
| finalizar cadastro | Exibe tela de login | default  |

---

**Atividade 8 – Exibe tela de login (Sistema)**  

| **Campo**          | **Tipo**        | **Restrições**                             | **Valor default** |
|---------------------|-----------------|--------------------------------------------|-------------------|
| formulário login    | Caixa de texto  | e-mail e senha obrigatórios                |                   |

| **Comandos**       | **Destino**       | **Tipo**   |
|--------------------|-------------------|------------|
| enviar login       | Efetuar login     | default    |

---

**Atividade 9 – Efetuar login (Usuário)**  

| **Campo**          | **Tipo**        | **Restrições**                   | **Valor default** |
|---------------------|-----------------|----------------------------------|-------------------|
| e-mail              | Caixa de texto  | deve existir no cadastro         |                   |
| senha               | Caixa de texto  | deve coincidir com a cadastrada  |                   |

| **Comandos**       | **Destino**             | **Tipo**   |
|--------------------|-------------------------|------------|
| confirmar acesso   | Dados corretos?         | default    |

---

**Atividade 10 – Dados corretos? (Sistema)**  

| **Campo**         | **Tipo**     | **Restrições**                       | **Valor default** |
|--------------------|--------------|--------------------------------------|-------------------|
| validação login    | Booleano     | e-mail e senha devem coincidir       |                   |

| **Comandos**        | **Destino**          | **Tipo**   |
|---------------------|----------------------|------------|
| sim                 | Login efetuado       | default    |
| não                 | Exibe "Tente novamente" | cancel   |

---

**Atividade 11 – Exibe "Tente novamente" (Sistema)**  

| **Campo**         | **Tipo**       | **Restrições**                | **Valor default** |
|--------------------|----------------|-------------------------------|-------------------|
| mensagem erro      | Texto          | exibida sempre que login falha |                   |

| **Comandos**       | **Destino**         | **Tipo**   |
|--------------------|---------------------|------------|
| retornar login     | Exibe tela de login | default    |

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
### 3.3.1 Processo 1 – Login e Cadastro de usuários

O modelo apresentado descreve o processo de login e cadastro de usuários no sistema PUC Integra.
O fluxo inicia quando o usuário acessa a plataforma, podendo entrar com login e senha ou optar por se cadastrar. No cadastro, o usuário preenche um formulário com dados pessoais (nome, e-mail institucional, CEP, data de nascimento, CPF, matrícula, curso e tipo de usuário). Em seguida, deve aceitar os termos e a política de privacidade.
O sistema valida as informações preenchidas, cruzando CPF, matrícula e e-mail com o banco de dados. Caso haja inconsistências, o usuário retorna ao formulário para correção; se estiverem corretas, o sistema consulta o tipo de usuário e armazena seus dados.
Por fim, são atribuídas permissões específicas conforme o perfil (aluno, professor, monitor ou visitante), e o acesso é liberado, concluindo o processo, garantindo que somente usuários válidos e devidamente cadastrados tenham acesso à plataforma, com permissões ajustadas ao seu papel.


![Exemplo de um Modelo BPMN do PROCESSO 1](../images/modelagem_p1.jpg "Modelo BPMN do Processo 1.")

#### Detalhamento das atividades

**Atividade 1: Acessar Plataforma**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| login | Caixa de texto  | formato de e-mail institucional (xxxx@sga.pucminas.br)  |                   |
| senha | Caixa de texto | mínimo de 8 caracteres, com letra maiúscula, número e caractere especial |                   |


| **Comandos**         |  **Destino**                   | **Tipo** |
| ---                  | ---                            | ---               |
| entrar               | Fim da Atividade 1 (se login válido)              | default           |
| cadastrar            | Clicar em "Cadastre-se"  |                   |

---

**Atividade 2: Preencher formulário de dados**

| **Campo**           | **Tipo**       | **Restrições**                          | **Valor default** |
|----------------------|----------------|-----------------------------------------|-------------------|
| nome completo        | Caixa de texto | obrigatório, máximo 100 caracteres      |                   |
| e-mail institucional | Caixa de texto | formato válido (xxxxxx@sga.pucminas.br) |                   |
| CEP                  | Caixa de texto | formato numérico de 8 dígitos           |                   |
| data de nascimento   | Data           | formato dd-mm-aaaa, idade ≥ 16 anos     |                   |
| CPF                  | Caixa de texto | formato numérico de 11 dígitos          |                   |
| número de matrícula  | Número         | somente números, máximo 10 dígitos      |                   |
| curso                | Seleção única  | lista de cursos cadastrados             |                   |
| tipo de usuário      | Seleção única  | aluno, professor, monitor, visitante    |                   |

| **Comandos** | **Destino**                      | **Tipo**   |
|--------------|----------------------------------|------------|
| salvar       | Validar dados preenchidos        | default    |
| cancelar     | Início do processo               | cancel     |

---

**Atividade 3 – Aceitar termos e privacidade**

| **Campo**          | **Tipo**       | **Restrições**     | **Valor default** |
|---------------------|----------------|--------------------|-------------------|
| aceite termos       | Seleção única  | obrigatório (sim/não) |                |
| aceite privacidade  | Seleção única  | obrigatório (sim/não) |                |

| **Comandos** | **Destino**                      | **Tipo**   |
|--------------|----------------------------------|------------|
| continuar    | Consultar tipo de usuário        | default    |
| voltar       | Preencher formulário de dados    | cancel     |

---

**Atividade 4 – Validar dados preenchidos (Sistema)**

| **Campo**         | **Tipo**   | **Restrições**                                | **Valor default** |
|--------------------|-----------|-----------------------------------------------|-------------------|
| validação cadastro | Tabela    | cruzar CPF, matrícula e e-mail com o banco de dados |                   |

| **Comandos**    | **Destino**                   | **Tipo**   |
|-----------------|--------------------------------|------------|
| dados corretos  | Consultar tipo de usuário      | default    |
| dados incorretos| Preencher formulário de dados  | cancel     |

---

**Atividade 5 – Consultar tipo de usuário**

| **Campo**      | **Tipo**       | **Restrições**                     | **Valor default** |
|-----------------|----------------|------------------------------------|-------------------|
| tipo usuário    | Seleção única  | atribuído automaticamente via matrícula/cadastro |                   |

| **Comandos**   | **Destino**                          | **Tipo**   |
|----------------|--------------------------------------|------------|
| atribuir perfil| Conceder acesso com permissões atribuídas | default |

---

**Atividade 6 – Conceder acesso com permissões atribuídas**

| **Campo**            | **Tipo**         | **Restrições**                                                                 | **Valor default** |
|-----------------------|------------------|--------------------------------------------------------------------------------|-------------------|
| permissões de usuário | Seleção múltipla | conforme tipo: aluno = postar/perguntar; professor = responder; monitor = moderar; visitante = leitura | |

| **Comandos**    | **Destino**        | **Tipo**   |
|-----------------|--------------------|------------|
| acesso liberado | Fim do processo    | default    |

---

_Tipos de dados utilizados:_

* **Área de texto** - campo texto de múltiplas linhas
* **Caixa de texto** - campo texto de uma linha
* **Número** - campo numérico
* **Data** - campo do tipo data (dd-mm-aaaa)
* **Hora** - campo do tipo hora (hh:mm:ss)
* **Data e Hora** - campo do tipo data e hora (dd-mm-aaaa, hh:mm:ss)
* **Imagem** - campo contendo uma imagem
* **Seleção única** - campo com várias opções de valores que são mutuamente exclusivas (tradicional radio button ou combobox)
* **Seleção múltipla** - campo com várias opções que podem ser selecionadas mutuamente (tradicional checkbox ou listbox)
* **Arquivo** - campo de upload de documento
* **Link** - campo que armazena uma URL
* **Tabela** - campo formado por uma matriz de valores

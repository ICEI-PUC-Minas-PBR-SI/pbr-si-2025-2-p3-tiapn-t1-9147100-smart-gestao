### 3.3.1 Processo 1 – Login e Cadastro de usuários

_Apresente aqui o nome e as oportunidades de melhoria para o processo 1. 
Em seguida, apresente o modelo do processo 1, descrito no padrão BPMN._

![Exemplo de um Modelo BPMN do PROCESSO 1](../images/modelagem_p1.png "Modelo BPMN do Processo 1.")

#### Detalhamento das atividades

_Os tipos de dados a serem utilizados são:_

_* **Área de texto** - campo texto de múltiplas linhas_

_* **Caixa de texto** - campo texto de uma linha_

_* **Número** - campo numérico_

_* **Data** - campo do tipo data (dd-mm-aaaa)_

_* **Hora** - campo do tipo hora (hh:mm:ss)_

_* **Data e Hora** - campo do tipo data e hora (dd-mm-aaaa, hh:mm:ss)_

_* **Imagem** - campo contendo uma imagem_

_* **Seleção única** - campo com várias opções de valores que são mutuamente exclusivas (tradicional radio button ou combobox)_

_* **Seleção múltipla** - campo com várias opções que podem ser selecionadas mutuamente (tradicional checkbox ou listbox)_

_* **Arquivo** - campo de upload de documento_

_* **Link** - campo que armazena uma URL_

_* **Tabela** - campo formado por uma matriz de valores_


**Atividade 1: Acessar Plataforma**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| login | Caixa de texto  | formato de e-mail institucional (xxxx@sga.pucminas.br)  |                   |
| senha | Caixa de texto | mínimo de 8 caracteres, com letra maiúscula, número e caractere especial |                   |


| **Comandos**         |  **Destino**                   | **Tipo** |
| ---                  | ---                            | ---               |
| entrar               | Fim da Atividade 1 (se login válido)              | default           |
| cadastrar            | Clicar em "Cadastre-se"  |                   |


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

**Atividade 3 – Aceitar termos e privacidade**

| **Campo**          | **Tipo**       | **Restrições**     | **Valor default** |
|---------------------|----------------|--------------------|-------------------|
| aceite termos       | Seleção única  | obrigatório (sim/não) |                |
| aceite privacidade  | Seleção única  | obrigatório (sim/não) |                |

| **Comandos** | **Destino**                      | **Tipo**   |
|--------------|----------------------------------|------------|
| continuar    | Consultar tipo de usuário        | default    |
| voltar       | Preencher formulário de dados    | cancel     |

**Atividade 4 – Validar dados preenchidos (Sistema)**

| **Campo**         | **Tipo**   | **Restrições**                                | **Valor default** |
|--------------------|-----------|-----------------------------------------------|-------------------|
| validação cadastro | Tabela    | cruzar CPF, matrícula e e-mail com o banco de dados |                   |

| **Comandos**    | **Destino**                   | **Tipo**   |
|-----------------|--------------------------------|------------|
| dados corretos  | Consultar tipo de usuário      | default    |
| dados incorretos| Preencher formulário de dados  | cancel     |


**Atividade 5 – Consultar tipo de usuário**

| **Campo**      | **Tipo**       | **Restrições**                     | **Valor default** |
|-----------------|----------------|------------------------------------|-------------------|
| tipo usuário    | Seleção única  | atribuído automaticamente via matrícula/cadastro |                   |

| **Comandos**   | **Destino**                          | **Tipo**   |
|----------------|--------------------------------------|------------|
| atribuir perfil| Conceder acesso com permissões atribuídas | default |

**Atividade 6 – Conceder acesso com permissões atribuídas**

| **Campo**            | **Tipo**         | **Restrições**                                                                 | **Valor default** |
|-----------------------|------------------|--------------------------------------------------------------------------------|-------------------|
| permissões de usuário | Seleção múltipla | conforme tipo: aluno = postar/perguntar; professor = responder; monitor = moderar; visitante = leitura | |

| **Comandos**    | **Destino**        | **Tipo**   |
|-----------------|--------------------|------------|
| acesso liberado | Fim do processo    | default    |

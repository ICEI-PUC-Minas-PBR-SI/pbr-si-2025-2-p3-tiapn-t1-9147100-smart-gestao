# Processo 4 – Envio de Perguntas e Respostas

O Processo 4 descreve o fluxo pelo qual um usuário publica uma **pergunta** ou envia uma **resposta** na plataforma acadêmica (feed de interação). O objetivo é permitir a criação de dúvidas ligadas às disciplinas institucionais e respostas colaborativas, garantindo validações (formato, disciplina, moderação) e armazenamento no banco de dados para posterior consulta, curadoria e exibição. O diagrama fornecido (p4_PerguntaResposta.png) serviu como base visual para o fluxo (usuário ↔ sistema).

---

## Fluxo principal
1. Usuário acessa o **feed de interação**.  
2. Usuário escolhe se vai **criar uma pergunta** ou **responder** (gateway "Pergunta ou resposta?").  
3. **Se pergunta:** usuário clica em *Fazer uma pergunta*, preenche formulário e envia.  
4. **Se resposta:** usuário seleciona a pergunta que deseja responder, preenche o campo de resposta e envia.  
5. Sistema recebe os dados (endpoint/queue).  
6. Sistema valida/filtra (validações básicas, antispam, associação à disciplina).  
7. Sistema armazena a pergunta/resposta no banco de dados e atualiza metadados da thread.  
8. Sistema retorna confirmação ao usuário e (opcional) notifica envolvidos.

---

![PROCESSO 4 - Envio de Perguntas e Respostas](../images/p4_PerguntaResposta.png "Modelo BPMN do Processo 4.")

---

# Detalhamento das atividades  

### Atividade 1 – Acessar área de Postagens (Usuário)

| **Campo**         | **Tipo**       | **Restrições**              | **Valor**         |
|-------------------|----------------|-----------------------------|-------------------|
| Seção "Postagens" | Navegação UI   | Requer login concluído      |  Default          |

| **Comandos**      | **Destino**            | **Tipo**   |
|-------------------|------------------------|------------|
| Clicar na seção   | Listagem de postagens e opções (perguntar/responder) | Usuário (navegação) |

---

### Gateway - Pergunta ou Resposta?
| **Campo**          | **Tipo**    | **Restrições**                                | **Valor** |
|--------------------|-------------|-----------------------------------------------|-----------|
| Escolha do usuário | Decisão     | Usuário escolhe fluxo | Pergunta / Resposta               |

| **Comandos**       | **Destino**                      | **Tipo**   |
|--------------------|----------------------------------|------------|
| Branching          | Pergunta → Fazer pergunta; Resposta → Selecionar pergunta para responder | Usuário (decisão) |


### Fluxo Pergunta:

Atividade 1: Clicar em "Fazer uma pergunta" (Usuário)

| **Campo**          | **Tipo**    | **Restrições**                | **Valor** |
|--------------------|-------------|-------------------------------|------------|
| Botão "Fazer uma pergunta" | Botão | Único e visível  | Default  |

| **Comandos**       | **Destino**                      | **Tipo**   |
|--------------------|----------------------------------|------------|
| Clicar no botão    | Formulário de dúvida | Usuário (interação)    |

Atividade 2: Preencher formulário de dúvida (Usuário)

| **Campo**          | **Tipo**    | **Restrições**                | **Valor** |
|--------------------|-------------|-------------------------------|------------|
| Campos: Título, Conteúdo, Curso, Disciplina, Palavras-chave | Formulário | Título obrigatório; conteúdo mínimo; curso/disciplina validos |Valores informados|

| **Comandos**       | **Destino**                      | **Tipo**   |
|--------------------|----------------------------------|------------|
| Preecher e submeter| Convergência para confirmar envio | Usuário (entrada) |


### Fluxo Resposta:
Atividade 1: Selecionar pergunta que deseja responder (Usuário)

| **Campo**          | **Tipo**        | **Restrições**               |**Valor**|
|--------------------|-----------------|------------------------------|------------|
| Lista de perguntas | Lista interativa| Perguntas visíveis por disciplina/curso; acesso permitido  | Pergunta selecionada |

| **Comandos**       | **Destino**                      | **Tipo**   |
|--------------------|----------------------------------|------------|
| Clicar na pergunta | Abrir campo de resposta | Usuário (seleção)   |

Atividade 2: Preencher conteúdo da resposta (Usuário)

| **Campo**          | **Tipo**    | **Restrições**                |**Valor** |
|--------------------|-------------|-------------------------------|------------|
| Conteúdo da resposta: Texto, Links, Imagens | Editor de texto enriquecido | Limites de tamanho; imagens com formatos válidos; links sanitizados | Conteúdo inserido |

| **Comandos**       | **Destino**                      | **Tipo**   |
|--------------------|----------------------------------|------------|
| Preecher e submeter| Convergência para confirmar envio| Usuário (entrada) |


### Gateway - Tarefas convergem (confirmação)
| **Campo**          | **Tipo**    | **Restrições**                                |**Valor** |
|--------------------|-------------|-----------------------------------------------|-----------|
|Confirmação de envio| Decisão     | Usuário confirma revisar antes de enviar      | Confirmar / Cancelar|

| **Comandos**       | **Destino**                      | **Tipo**   |
|--------------------|----------------------------------|------------|
| Branching          | Confirmar envio da postagem      | Usuário (decisão) |



### Atividade 2 - Confirmar envio da postagem (Usuário)

| **Campo**          | **Tipo**    | **Restrições**                |**Valor** |
|--------------------|-------------|-------------------------------|------------|
| Botão de envio     | Botão       | Somente após preencher campos obrigatórios | Default  |

| **Comandos**       | **Destino**                      | **Tipo**   |
|--------------------|----------------------------------|------------|
|Clicar para enviar  | Registrar postagem               | Usuário (ação) |


---

### Atividade 3 – Registrar postagem (Sistema)

| **Campo**             | **Tipo**        | **Restrições**                                        |**Valor** |
|-----------------------|-----------------|-------------------------------------------------------|-------------------|
| Persistência da postagem | Serviço      | Inserir metadados (autor, disciplina, timestamp); validação de conteúdo   | Postagem criada |

| **Comandos**          | **Destino**                    | **Tipo**   |
|-----------------------|--------------------------------|------------|
| Salvar no BD          | Organizar por Disciplina/Curso | Sistema (persistência)|


---

### Atividade 4 – Organizar por Disciplina/Curso (Sistema)

| Campo | Tipo | Restrições | **Valor** |
|-------|------|------------|------------|
| Indexação / categorização | Automático | Baseado nos campos do formulário | Postagem indexada |


| **Comandos**       | **Destino**                | **Tipo**   |
|--------------------|----------------------------|------------|
| Atualizar índices / categorias| Mensagem de sucesso | Sistema (indexação)|

---

### Atividade 5 – Exibe mensagem de sucesso (Sistema → Usuário)

| **Campo**               | **Tipo**    | **Restrições**                         |**Valor** |
|-------------------------|-------------|----------------------------------------|------------|
| Mensagem de sucesso     | Mensagem UI | Mensagem com link para visualizar postagem | Texto  |

| **Comandos**       | **Destino**                                   | **Tipo**  |
|--------------------|-----------------------------------------------|-----------|
|Mostrar notificação | Postagem feita                     | Sistema (feedback)|


---

### Atividade 6 – Visualizar postagem feita (Usuário)
 
| **Campo**         | **Tipo**        | **Restrições**                              |**Valor** |
|-------------------|-----------------|---------------------------------------------|-------------------|
| Página da postagem| Página UI       | Exibe título, conteúdo, autor, data, feedbacks |Conteúdo publicado |

| **Comandos**       | **Destino**                 | **Tipo**   |
|--------------------|-----------------------------|------------|
| Visualizar postagem| Não se aplica               | Usuário (visualização)|

---

## Tipos de dados utilizados
- **Área de texto** – conteúdo da pergunta/resposta;  
- **Caixa de texto** – título, referência;  
- **Seleção única** – disciplina;  
- **Seleção múltipla** – tags;  
- **Arquivo** – anexos (pdf, imagens, etc.);  
- **Booleano** – marcar como solução, anonimato;  
- **Data/Hora** – created_at, updated_at.

---

# Wireframe - Perguntas e Respostas

![WIREFRAME - PROCESSO 4 - Perguntas e Respostas](../images/wireframe_[].png)
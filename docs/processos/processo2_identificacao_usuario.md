### 3.3.2 Processo 2 – Login de Usuários

O processo de login garante que apenas usuários cadastrados possam acessar a plataforma PUC Integra.  
Para isso, o usuário deve inserir seu **e-mail institucional** e **senha** previamente cadastrada.  
O sistema valida as credenciais e, em caso de sucesso, libera o acesso ao ambiente da plataforma.  

**Oportunidades de melhoria:**  
- Permitir autenticação multifator (MFA) para maior segurança;  
- Implementar mensagens claras em caso de erro de login;  
- Otimizar o tempo de resposta da autenticação.  

![PROCESSO 2 - Login de Usuários](../images/p2_login.JPG "Modelo BPMN do Processo 2.")

---

#### Detalhamento das atividades  

#### Atividade 1 – Acessar tela de login (Usuário)

| **Campo**        | **Tipo**        | **Restrições**            | **Valor default** |
|-------------------|-----------------|---------------------------|-------------------|
| botão login       | Botão           | único, visível            |                   |

| **Comandos**       | **Destino**            | **Tipo**   |
|--------------------|-------------------------|------------|
| clicar             | Exibe formulário login | default    |

---

#### Atividade 2 – Exibir formulário de login (Sistema)

| **Campo**          | **Tipo**        | **Restrições**                               | **Valor default** |
|---------------------|-----------------|----------------------------------------------|-------------------|
| formulário login    | Caixa de texto  | campos obrigatórios: e-mail e senha          |                   |

| **Comandos**       | **Destino**             | **Tipo**   |
|--------------------|--------------------------|------------|
| preencher login    | Inserir credenciais      | default    |

---

#### Atividade 3 – Inserir credenciais (Usuário)

| **Campo**     | **Tipo**        | **Restrições**                                                | **Valor default** |
|---------------|-----------------|---------------------------------------------------------------|-------------------|
| e-mail        | Caixa de texto  | deve existir no cadastro, formato institucional obrigatório   |                   |
| senha         | Caixa de texto  | deve coincidir com senha cadastrada                           |                   |

| **Comandos**       | **Destino**                  | **Tipo**   |
|--------------------|-------------------------------|------------|
| confirmar login    | Validar credenciais           | default    |

---

#### Atividade 4 – Validar credenciais (Sistema)

| **Campo**            | **Tipo**     | **Restrições**                        | **Valor default** |
|-----------------------|--------------|---------------------------------------|-------------------|
| validação login       | Booleano     | autenticação obrigatória              |                   |

| **Comandos**         | **Destino**                   | **Tipo**   |
|----------------------|--------------------------------|------------|
| credenciais válidas  | Liberar acesso                 | default    |
| credenciais inválidas| Exibir mensagem de erro        | cancel     |

---

#### Atividade 5 – Exibir mensagem de erro (Sistema)

| **Campo**        | **Tipo**      | **Restrições**                       | **Valor default** |
|-------------------|---------------|--------------------------------------|-------------------|
| mensagem erro     | Texto         | exibida sempre que login falhar      |                   |

| **Comandos**       | **Destino**            | **Tipo**   |
|--------------------|-------------------------|------------|
| tentar novamente   | Exibir tela de login    | default    |

---

#### Atividade 6 – Liberar acesso (Sistema)

| **Campo**        | **Tipo**       | **Restrições**                          | **Valor default** |
|-------------------|----------------|-----------------------------------------|-------------------|
| acesso autorizado | Booleano       | válido somente para usuários cadastrados|                   |

| **Comandos**       | **Destino**             | **Tipo**   |
|--------------------|--------------------------|------------|
| prosseguir sistema | Área principal da plataforma | default |
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
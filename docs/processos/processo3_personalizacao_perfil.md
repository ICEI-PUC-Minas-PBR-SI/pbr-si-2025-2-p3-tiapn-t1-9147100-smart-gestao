### 3.3.3 Processo 3 – Personalização de Perfil

O processo de personalização de perfil permite que o usuário configure e edite suas informações pessoais e acadêmicas após o login.  
Essa etapa é importante para adaptar a experiência de uso às necessidades de cada membro da comunidade acadêmica, permitindo atualizações de dados, inserção de foto, definição de preferências e atualização de informações institucionais.  

**Fluxo principal:**  
1. Usuário acessa a área de perfil.  
2. Sistema exibe formulário de personalização.  
3. Usuário atualiza informações desejadas.  
4. Sistema valida os dados fornecidos.  
5. Sistema salva as alterações no banco de dados.  
6. Perfil atualizado é exibido ao usuário.  

![PROCESSO 2 - Personalização do perfil](/assets/images/p3_PersonalizacaoPerfil.JPG "Modelo BPMN do Processo 3.")

---

#### Detalhamento das atividades  

## Atividade 1 – Acessar área de personalização (Usuário)
| Campo | Tipo | Restrições |
|-------|------|------------|
| Botão/Menu: Personalização | Botão | Apenas usuários logados podem acessar |

**Comandos**
- Clicar em personalização → **Tela de personalização**

---

## Atividade 2 – Selecionar preferências (Usuário)
| Campo | Tipo | Restrições |
|-------|------|------------|
| Tema | Botão | Campo obrigatório |
| Idioma | Toggle | Campo obrigatório |
| Notificações | Checkbox | Campo obrigatório |

**Comandos**
- Selecionar a opção desejada

---

## Atividade 3 – Personalização da plataforma (Sistema)
| Campo | Tipo | Restrições |
|-------|------|------------|
| Botão confirmar | Botão | Só habilitado se houver alguma alteração |
| Botão cancelar | Botão | Retorna sem salvar |

**Comandos**
- Confirmar → aplica no sistema  
- Cancelar → retorna à tela inicial  

---

## Atividade 4 – Receber preferências (Sistema)
| Campo | Tipo | Restrições |
|-------|------|------------|
| Dados enviados pelo usuário | - | Devem chegar no formato esperado |

**Comandos**
- Coleta as escolhas → sistema backend

---

## Atividade 5 – Validar dados recebidos (Sistema)
| Campo | Tipo | Restrições |
|-------|------|------------|
| Preferências enviadas | - | Automático |

**Comandos**
- Verificação no sistema

---

## Atividade 6 – Dados corretos? (Sistema)
| Campo | Tipo | Restrições |
|-------|------|------------|
| Booleano | - | Verificar preenchimento correto |

**Comandos**
- Sim → salva no banco e envia feedback  
- Não → exibe "Tente novamente" + motivo do erro  

---

## Atividade 7 – Confirmação ao usuário (Sistema)
| Campo | Tipo | Restrições |
|-------|------|------------|
| Registro | - | Salvar dados no banco de forma segura |

**Comandos**
- Envia feedback → usuário recebe mensagem  
- Retorno → tela inicial
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
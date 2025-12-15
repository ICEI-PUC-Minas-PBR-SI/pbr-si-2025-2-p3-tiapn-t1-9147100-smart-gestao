# 🛠️ Pasta `utils` - Utilitários do Sistema

Esta pasta contém funções e módulos auxiliares (utilitários) que são reutilizados em várias partes do backend. O objetivo principal desta pasta é centralizar código genérico, promovendo a reutilização e evitando a duplicação de lógica (princípio DRY - Don't Repeat Yourself).

## Por que esta pasta é importante?

-   **Reutilização de Código**: Funções como `createLog` ou `successResponse` são usadas em múltiplos controladores. Centralizá-las aqui significa que qualquer alteração ou correção precisa ser feita em um único lugar.
-   **Organização e Clareza**: Mantém os controladores (`controllers`) focados em sua responsabilidade principal (a lógica de negócio da rota), enquanto as tarefas genéricas (como formatar uma resposta ou gravar um log) são delegadas a estes utilitários.
-   **Consistência**: Garante que certas operações, como as respostas da API e a gravação de logs, sigam sempre o mesmo padrão em toda a aplicação.

---

## Conteúdo da Pasta

### `constants.js`

**Função:** Armazena valores constantes do sistema, como os nomes das permissões (`ROOT`, `ADMIN_COMPANY`). Isso evita o uso de "strings mágicas" espalhadas pelo código, o que previne erros de digitação e facilita a manutenção.

### `logger.js`

**Função:** Contém a função `createLog`, que é o ponto central para a gravação de todos os logs de auditoria do sistema. Ela oferece uma interface simples e padronizada para que os controladores e middlewares registrem ações importantes.

### `responseHelper.js`

**Função:** Fornece funções (`successResponse` e `errorResponse`) para padronizar a estrutura de todas as respostas JSON enviadas pela API. Isso garante que o frontend sempre saiba qual formato de dados esperar, seja em caso de sucesso ou de erro.

### `encrypt.js` e `jwt.js` (se existirem)

**Função:** Em versões anteriores ou futuras, esta pasta também pode conter helpers para criptografia de senhas (`bcrypt`) e para a criação/validação de JSON Web Tokens (JWT), centralizando ainda mais a lógica de segurança.
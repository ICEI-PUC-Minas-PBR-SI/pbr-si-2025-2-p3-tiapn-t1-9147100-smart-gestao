# 📦 Modelos JSON para Requisições da API

Esta pasta contém exemplos de **corpos de requisição (payloads)** em formato JSON para os principais endpoints de escrita (`POST` e `PUT`) da API do Smart Gestão.

## Propósito

O objetivo destes arquivos é servir como:

1.  **Documentação Viva**: Fornecem um exemplo claro e prático da estrutura de dados esperada pelo backend.
2.  **Guia para o Frontend**: A equipe de frontend pode usar estes modelos como base para construir os objetos que serão enviados para a API.
3.  **Facilitador de Testes**: Podem ser facilmente copiados e colados em ferramentas de teste de API como Postman, Insomnia ou em comandos `curl`.

## Diferença entre `modelsJson` e a pasta `Examples`

É importante entender a diferença entre as duas pastas para utilizá-las corretamente:

-   **`modelsJson` (Esta pasta):** Contém exemplos do que o **cliente envia** para o servidor. Representa o corpo de uma requisição `POST` ou `PUT`, contendo apenas os campos que o usuário precisa fornecer.
-   **`Examples`:** Contém exemplos da **estrutura de dados completa**, representando como um objeto é armazenado no banco de dados ou como ele é **retornado** pelo servidor em uma requisição `GET`. Inclui campos gerenciados pelo servidor, como `_id`, `companyId`, `createdAt`, etc.

Em resumo: `modelsJson` é sobre **enviar dados**, e `Examples` é sobre **receber ou visualizar dados**.

## Como Utilizar

Cada arquivo `.json` nesta pasta representa o corpo (body) de uma requisição para uma rota específica.

- **`authLogin.json`**: Usado na rota `POST /api/auth/login`.
- **`authRegister.json`**: Usado na rota `POST /api/auth/register`.
- **`transaction.json`**: Usado nas rotas `POST /api/transactions` e `PUT /api/transactions/:id`.
- **`client.json`**: Usado nas rotas `POST /api/clients` e `PUT /api/clients/:id`.
- **`goal.json`**: Usado nas rotas `POST /api/goals` e `PUT /api/goals/:id`.

### Exemplo de uso com `curl`

Para criar uma nova transação, você pode usar o conteúdo de `transaction.json`:

```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d @transaction.json
```

> **Nota**: Lembre-se que os valores nos arquivos são apenas exemplos. Você deve substituí-los pelos dados reais da sua requisição. Para mais detalhes sobre cada endpoint, consulte o `README-backend.md`.
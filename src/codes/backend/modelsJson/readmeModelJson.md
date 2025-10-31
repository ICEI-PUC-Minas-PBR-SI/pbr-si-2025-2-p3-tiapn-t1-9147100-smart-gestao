# 📦 Modelos JSON para Requisições da API

Esta pasta contém exemplos de corpos de requisição (payloads) em formato JSON para os principais endpoints `POST` e `PUT` da API do Smart Gestão.

## Propósito

O objetivo destes arquivos é servir como:

1.  **Documentação Viva**: Fornecem um exemplo claro e prático da estrutura de dados esperada pelo backend.
2.  **Guia para o Frontend**: A equipe de frontend pode usar estes modelos como base para construir os objetos que serão enviados para a API.
3.  **Facilitador de Testes**: Podem ser facilmente copiados e colados em ferramentas de teste de API como Postman, Insomnia ou em comandos `curl`.

## Como Utilizar

Cada arquivo `.json` nesta pasta representa o corpo (body) de uma requisição para uma rota específica.

- **`authLogin.json`**: Usado na rota `POST /api/auth/login`.
- **`authRegister.json`**: Usado na rota `POST /api/auth/register`.
- **`transaction.json`**: Usado nas rotas `POST /api/transactions` e `PUT /api/transactions/:id`.
- **`client.json`**: Usado nas rotas `POST /api/clients` e `PUT /api/clients/:id`.
- **`meta.json`**: Usado nas rotas `POST /api/metas` e `PUT /api/metas/:id`.

### Exemplo de uso com `curl`

Para criar uma nova transação, você pode usar o conteúdo de `transaction.json`:

```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d @transaction.json
```

> **Nota**: Lembre-se que os valores nos arquivos são apenas exemplos. Você deve substituí-los pelos dados reais da sua requisição. Para mais detalhes sobre cada endpoint, consulte o `README-backend.md`.
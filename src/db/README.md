## Arquivo .sql

Adicione aqui os scripts SQL.

# 🧱 Modelagem do Banco de Dados — *Smart Gestão*
---

## 🎯 Visão Geral

O banco de dados do sistema **Smart Gestão** tem como objetivo **centralizar informações de microempreendedores e autônomos**, permitindo o gerenciamento de **clientes, fornecedores, receitas, despesas, metas e alertas financeiros**.

O modelo foi projetado para ser **simples, modular, escalável e compatível** com **MongoDB** ou bancos **relacionais (MySQL, SQLite, PostgreSQL)**, dependendo do ambiente de implantação.

---

## 🧩 1. Modelo Conceitual (Entidades e Relacionamentos)

O **Modelo Conceitual** descreve de forma abstrata **as principais entidades** do sistema e **os relacionamentos entre elas**, sem detalhar ainda tipos de dados ou implementações.

### 🧠 Principais Entidades

- **Usuário** → Representa o proprietário da conta e dados financeiros.  
- **Cliente/Fornecedor** → Registra informações de parceiros comerciais.  
- **Transação** → Armazena as receitas e despesas realizadas.  
- **MetaFinanceira** → Define objetivos financeiros (como limite de gastos).  
- **Alerta** → Notifica o usuário sobre metas e eventos importantes.

---

### 🔗 Relacionamentos

- Um **Usuário** pode ter vários **Clientes/Fornecedores**.  
- Um **Usuário** pode registrar várias **Transações**.  
- Um **Usuário** pode definir várias **MetasFinanceiras**.  
- Uma **MetaFinanceira** pode gerar vários **Alertas**.

---

### 💡 Representação Textual do DER

> **DER (Diagrama Entidade-Relacionamento)** é um modelo gráfico que representa **as entidades de um sistema**, seus **atributos** e **os relacionamentos** entre elas.

```text
Usuário (1) ───< (N) ClienteFornecedor  
Usuário (1) ───< (N) Transação  
Usuário (1) ───< (N) MetaFinanceira  
MetaFinanceira (1) ───< (N) Alerta

```

## 🗺️ 2. Diagrama Visual (DER)

> **DER (Diagrama Entidade-Relacionamento)** é uma representação visual que mostra **como as tabelas (entidades)** se relacionam entre si por meio de **chaves primárias e estrangeiras**.

```text
+--------------------+
|      USUARIO       |
+--------------------+
| id_usuario (PK)    |
| nome               |
| email              |
| senha_hash         |
| data_cadastro      |
+--------------------+

          │ 1
          │
          │ N
+------------------------+
|  CLIENTE_FORNECEDOR    |
+------------------------+
| id_cf (PK)             |
| id_usuario (FK)        |
| tipo                   |
| nome_razao             |
| cpf_cnpj               |
| telefone               |
| email                  |
| categoria              |
| endereco               |
+------------------------+

          │ 1
          │
          │ N
+------------------+
|   TRANSACAO      |
+------------------+
| id_transacao (PK)|
| id_usuario (FK)  |
| id_cf (FK)       |
| tipo             |
| descricao        |
| categoria        |
| valor            |
| data             |
| forma_pagamento  |
| status           |
| anexo            |
+------------------+

          │ 1
          │
          │ N
+------------------+
| META_FINANCEIRA  |
+------------------+
| id_meta (PK)     |
| id_usuario (FK)  |
| tipo_meta        |
| valor_meta       |
| periodo_inicio   |
| periodo_fim      |
| categoria_foco   |
+------------------+

          │ 1
          │
          │ N
+----------------+
|    ALERTA      |
+----------------+
| id_alerta (PK) |
| id_meta (FK)   |
| tipo_alerta    |
| mensagem       |
| data_geracao   |
| status         |
+----------------+
```

### Script Base SQL

> O código abaixo representa a estrutura do banco de dados relacional.
Pode ser executado diretamente em MySQL, SQLite ou MariaDB.

```sql

-- =========================
-- Tabela: Usuario
-- =========================
CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

```sql
-- =========================
-- Tabela: ClienteFornecedor
-- =========================
CREATE TABLE ClienteFornecedor (
    id_cf INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    tipo ENUM('cliente','fornecedor') NOT NULL,
    nome_razao VARCHAR(100) NOT NULL,
    cpf_cnpj VARCHAR(20),
    telefone VARCHAR(20),
    email VARCHAR(100),
    categoria VARCHAR(50),
    endereco VARCHAR(150),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);
```

```sql
-- =========================
-- Tabela: Transacao
-- =========================
CREATE TABLE Transacao (
    id_transacao INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_cf INT,
    tipo ENUM('receita','despesa') NOT NULL,
    descricao VARCHAR(255),
    categoria VARCHAR(50),
    valor DECIMAL(10,2),
    data DATE,
    forma_pagamento VARCHAR(30),
    status ENUM('pago','pendente','recebido','a_receber'),
    anexo VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_cf) REFERENCES ClienteFornecedor(id_cf)
);
```

```sql
-- =========================
-- Tabela: MetaFinanceira
-- =========================
CREATE TABLE MetaFinanceira (
    id_meta INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    tipo_meta ENUM('receita','despesa'),
    valor_meta DECIMAL(10,2),
    periodo_inicio DATE,
    periodo_fim DATE,
    categoria_foco VARCHAR(50),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);
```

```sql
-- =========================
-- Tabela: Alerta
-- =========================
CREATE TABLE Alerta (
    id_alerta INT PRIMARY KEY AUTO_INCREMENT,
    id_meta INT NOT NULL,
    tipo_alerta ENUM('aviso','limite_atingido','acima_da_meta'),
    mensagem VARCHAR(255),
    data_geracao DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ativo','lido'),
    FOREIGN KEY (id_meta) REFERENCES MetaFinanceira(id_meta)
);
```
## 🍃 Estrutura Equivalente no MongoDB

> Abaixo estão os exemplos de documentos (um por coleção) formatados como JSON para inclusão em documentação Markdown.
> Observação: os valores `ObjectId('...')` e `ISODate('...')` estão como **strings** para manter o JSON válido no Markdown.  
> Em seu banco MongoDB real, esses campos devem ser objetos `ObjectId` e `ISODate`.

---

### 📦 Coleção: `usuarios`

```json
{
  "_id": "ObjectId('625f1a2b3c4d5e6f7a8b9c0d')",
  "nome": "Heron Silva",
  "email": "heron@email.com",
  "senha_hash": "hashed_password_example",
  "data_cadastro": "ISODate('2025-10-06T00:00:00Z')"
}
```
### 📦 Coleção: `clienteFornecedor`

```json
{
  "_id": "ObjectId('725f1a2b3c4d5e6f7a8b9c1e')",
  "id_usuario": "ObjectId('625f1a2b3c4d5e6f7a8b9c0d')",
  "tipo": "fornecedor",
  "nome_razao": "Comercial Santos",
  "cpf_cnpj": "12.345.678/0001-99",
  "telefone": "(31) 99999-9999",
  "email": "contato@comercialsantos.com",
  "categoria": "eventual",
  "endereco": "Rua das Palmeiras, 120, Betim/MG"
}
```
### 📦 Coleção: `transacoes`

```json
{
  "_id": "ObjectId('825f1a2b3c4d5e6f7a8b9c2f')",
  "id_usuario": "ObjectId('625f1a2b3c4d5e6f7a8b9c0d')",
  "id_cf": "ObjectId('725f1a2b3c4d5e6f7a8b9c1e')",
  "tipo": "despesa",
  "descricao": "Compra de material de escritório",
  "categoria": "Materiais",
  "valor": 450.00,
  "data": "ISODate('2025-10-06T00:00:00Z')",
  "forma_pagamento": "Pix",
  "status": "pago",
  "anexo": null
}
```

### 📦 Coleção: `metasFinanceiras`

```json
{
  "_id": "ObjectId('925f1a2b3c4d5e6f7a8b9c3a')",
  "id_usuario": "ObjectId('625f1a2b3c4d5e6f7a8b9c0d')",
  "tipo_meta": "despesa",
  "valor_meta": 1000.00,
  "periodo_inicio": "ISODate('2025-10-01T00:00:00Z')",
  "periodo_fim": "ISODate('2025-10-31T00:00:00Z')",
  "categoria_foco": "Alimentação"
}
```

### 📦 Coleção: `alertas`

```json
{
  "_id": "ObjectId('a25f1a2b3c4d5e6f7a8b9c4b')",
  "id_meta": "ObjectId('925f1a2b3c4d5e6f7a8b9c3a')",
  "tipo_alerta": "limite_atingido",
  "mensagem": "Você atingiu 90% do limite de despesas em alimentação",
  "data_geracao": "ISODate('2025-10-06T10:35:00Z')",
  "status": "ativo"
}
```

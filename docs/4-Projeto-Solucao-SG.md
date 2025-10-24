## 4. Projeto da Solução

<span style="color:red">Pré-requisitos: <a href="03-Modelagem do Processo de Negocio.md"> Modelagem do Processo de Negocio</a></span>

---

## 4.1 Arquitetura da Solução

A arquitetura do **Smart Gestão** foi desenvolvida para oferecer **eficiência, escalabilidade e segurança**, considerando um ambiente **web modular** baseado no modelo **cliente-servidor**.  
O sistema é composto por três camadas principais:

1. **Camada de Apresentação (Frontend):** interface gráfica que permite a interação direta com o usuário, responsável por enviar e receber informações da API.  
2. **Camada de Aplicação (Backend):** responsável pelo processamento das regras de negócio, validações, autenticações, integrações e controle de acesso.  
3. **Camada de Dados (Banco de Dados):** encarregada do armazenamento e da persistência das informações financeiras, de usuários, empresas e transações.

Essa arquitetura facilita o desenvolvimento colaborativo, a manutenção e futuras expansões do sistema, como a integração com módulos de Business Intelligence (BI) e Inteligência Artificial (IA).

---

### Descrição dos Módulos e Tecnologias

A aplicação é dividida em módulos independentes e interligados, garantindo maior clareza no desenvolvimento e manutenção do código.  

| Módulo | Descrição | Tecnologias Envolvidas |
|--------|------------|------------------------|
| **Frontend** | Interface de acesso e visualização de dados, projetada para ser responsiva e intuitiva. | React.js, HTML5, CSS3, JavaScript ES6 |
| **Backend (API REST)** | Camada de lógica e controle do sistema, responsável pelas rotas, autenticações e integrações com o banco. | Node.js, Express.js |
| **Banco de Dados** | Armazena e organiza todas as informações persistentes da aplicação. | MongoDB Atlas (NoSQL) e MySQL (SQL local) |
| **Autenticação e Criptografia** | Controle de acesso de usuários e segurança das informações. | JWT (JSON Web Token), bcryptjs |
| **Validação e Segurança** | Validação dos dados e sanitização de entradas. | Joi, CORS, dotenv |
| **Auditoria e Logs** | Registro das ações e acessos ao sistema para rastreabilidade e segurança. | Morgan, Winston |
| **Integração com BI (Futuro)** | Módulo de análise de dados e relatórios preditivos. | Python, Power BI |

O **Smart Gestão** foi projetado para permitir implantação tanto em ambiente **local (on-premise)** quanto em **nuvem (cloud)**, oferecendo flexibilidade para diferentes cenários empresariais.

---

### Diagrama de Arquitetura

A comunicação entre as camadas segue o padrão RESTful, permitindo que cada parte do sistema funcione de forma desacoplada e eficiente.  
A estrutura segue o seguinte fluxo:

1. O **usuário** acessa o sistema por meio de um navegador ou dispositivo móvel.  
2. O **frontend (interface React.js)** envia requisições HTTP (GET, POST, PUT, DELETE) para o **backend Node.js**, que funciona como uma API REST.  
3. O **backend** processa as requisições, aplica regras de negócio e acessa o **banco de dados MongoDB ou MySQL**.  
4. As respostas são devolvidas em formato **JSON**, sendo apresentadas ao usuário por meio de componentes gráficos intuitivos.

---

## 4.2 Protótipos de Telas

A interface do **Smart Gestão** foi concebida com foco em **usabilidade, responsividade e clareza visual**, permitindo uma navegação fluida e objetiva.  
O design segue o princípio de **simplicidade funcional**, onde o usuário encontra facilmente as opções necessárias para gerir suas finanças empresariais.

### Principais Interfaces e sua Elaboração

- **Tela de Login/Cadastro:**  
  Permite o acesso seguro ao sistema, exigindo credenciais válidas (e-mail e senha). Implementa autenticação JWT e criptografia de senhas.  

- **Dashboard Principal:**  
  Exibe o resumo financeiro da empresa, mostrando indicadores como receitas, despesas, lucro líquido e saldo. Gráficos visuais ajudam na análise de desempenho.  

- **Registro de Transação (Receita/Despesa):**  
  Interface para cadastrar novas movimentações financeiras, contendo campos como valor, data, categoria, forma de pagamento e descrição.  

- **Gerenciamento de Categorias:**  
  Permite que o administrador adicione, edite ou remova categorias financeiras personalizadas, adaptando o sistema à realidade de cada empresa.  

- **Relatórios:**  
  Apresenta informações consolidadas, como comparativos de períodos, balanços e distribuição de despesas, permitindo filtragem por data, categoria e tipo.  

- **Definição de Metas:**  
  Módulo que possibilita o registro de objetivos financeiros (exemplo: reduzir custos, atingir determinado lucro).  

- **Alertas e Notificações:**  
  Emite avisos automáticos quando metas são atingidas ou quando há variações significativas nas despesas.  

#### Exemplo de Wireframe

Os wireframes foram criados para ilustrar a disposição dos elementos de interface, o fluxo de navegação e a hierarquia visual entre os módulos.  
O layout é padronizado, com uma barra lateral para navegação e área central para exibição de dados.

---

## Diagrama de Classes

O diagrama de classes representa a estrutura lógica do sistema, detalhando as entidades principais e suas relações.  
Cada classe (como Usuário, Empresa, Transação, Meta e Alerta) possui seus próprios atributos e métodos, permitindo encapsulamento e reutilização.

---

## Modelo ER

### 4.3 Modelo de Dados

O modelo de dados do **Smart Gestão** foi projetado para garantir **integridade, segurança e escalabilidade**.  
Para maior flexibilidade, o sistema suporta dois modelos distintos de persistência:

1. **Modelo Relacional (MySQL)** — utilizado em instalações locais, ideal para empresas com infraestrutura própria.  
2. **Modelo Não Relacional (MongoDB Atlas)** — utilizado no ambiente em nuvem, oferecendo alta disponibilidade e fácil escalabilidade.

---

#### 4.3.1 Modelo ER

O **Diagrama Entidade-Relacionamento (DER)** representa as principais entidades do sistema e suas interconexões.

- **Usuário:** armazena as informações pessoais e de autenticação.  
- **Empresa:** representa a entidade principal à qual o usuário pertence.  
- **Transação:** contém as movimentações financeiras registradas pela empresa.  
- **Categoria:** define os tipos de receitas e despesas existentes.  
- **MetaFinanceira:** registra objetivos financeiros e períodos de execução.  
- **Alerta:** armazena notificações automáticas geradas pelo sistema.  

---

#### Exemplo de DER (texto representativo)

```
Usuário (1) ───< (N) Empresa  
Empresa (1) ───< (N) Transação  
Transação (N) ───> (1) Categoria  
Empresa (1) ───< (N) MetaFinanceira  
MetaFinanceira (1) ───< (N) Alerta
```

---

#### 4.3.2 Esquema Relacional (MySQL)

O modelo relacional é ideal para ambientes corporativos locais, com suporte a chaves primárias e estrangeiras que garantem integridade referencial.

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ROOT','ADMIN','USER','READ_ONLY'),
  company_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  cnpj VARCHAR(20) UNIQUE NOT NULL,
  address VARCHAR(255),
  status ENUM('active','inactive') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  type ENUM('income','expense') NOT NULL,
  category VARCHAR(50),
  value DECIMAL(10,2),
  date DATE,
  description TEXT,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  type ENUM('income','expense'),
  target_value DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  category VARCHAR(50),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  goal_id INT NOT NULL,
  type ENUM('warning','limit_reached','above_target'),
  message VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active','read') DEFAULT 'active',
  FOREIGN KEY (goal_id) REFERENCES goals(id)
);
```

---

#### Exemplo de Estrutura MongoDB

O **MongoDB** utiliza um formato orientado a documentos JSON, permitindo maior flexibilidade na inserção de dados e melhor desempenho em consultas não estruturadas.

```json
{
  "users": {
    "_id": "ObjectId",
    "name": "Heron Silva",
    "email": "heron@email.com",
    "password": "hashed_password",
    "role": "ADMIN_COMPANY",
    "companyId": "ObjectId",
    "createdAt": "2025-10-18T10:00:00Z"
  },
  "companies": {
    "_id": "ObjectId",
    "name": "Smart Solutions LTDA",
    "cnpj": "12.345.678/0001-99",
    "address": "Rua das Palmeiras, 120 - Betim/MG",
    "status": "active",
    "createdAt": "2025-10-18T10:00:00Z"
  },
  "transactions": {
    "_id": "ObjectId",
    "companyId": "ObjectId",
    "type": "expense",
    "category": "Operacional",
    "value": 950.00,
    "date": "2025-10-18T00:00:00Z",
    "description": "Pagamento de energia elétrica"
  },
  "goals": {
    "_id": "ObjectId",
    "companyId": "ObjectId",
    "type": "expense",
    "targetValue": 5000.00,
    "startDate": "2025-10-01T00:00:00Z",
    "endDate": "2025-10-31T00:00:00Z",
    "category": "Custos Fixos"
  },
  "alerts": {
    "_id": "ObjectId",
    "goalId": "ObjectId",
    "type": "limit_reached",
    "message": "Despesas fixas atingiram 90% da meta",
    "createdAt": "2025-10-18T09:30:00Z",
    "status": "active"
  }
}
```

---

### 4.4 Tecnologias 

A seleção das tecnologias foi realizada considerando os seguintes critérios:
- Facilidade de uso e curva de aprendizado reduzida.  
- Compatibilidade com ambiente acadêmico e profissional.  
- Comunidade ativa e ampla documentação.  
- Suporte à escalabilidade e integração com serviços em nuvem.

#### Como as Tecnologias se Relacionam (Fluxo de Interação)

1. O usuário acessa o sistema pelo navegador e interage com o **frontend React.js**.  
2. As requisições são enviadas para o **backend Node.js** por meio de endpoints RESTful.  
3. O backend processa as solicitações, aplica as regras de negócio e se comunica com o **banco de dados MongoDB ou MySQL**.  
4. As respostas são retornadas em **JSON**, exibidas na interface visual.  
5. As ações do usuário são registradas em **logs de auditoria**, garantindo rastreabilidade e segurança.  

---

#### Diagrama de Tecnologias

A comunicação entre os módulos segue um fluxo unificado:
Usuário → Frontend → API Backend → Banco de Dados → Logs/Auditoria

O fluxo permite que o sistema funcione de forma modular e escalável, facilitando manutenções e futuras integrações com serviços de nuvem e relatórios de BI.

---


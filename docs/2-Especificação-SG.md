# 1 - Especificações do Projeto

A definição do problema parte da dificuldade enfrentada por microempreendedores individuais (MEIs) e profissionais autônomos em manter um controle financeiro eficiente. Muitos ainda utilizam métodos manuais ou informais (planilhas, cadernos, anotações soltas), o ocasiona a perda de dados, erros e falta de clareza sobre a real situação financeira do negócio.  
 
A solução proposta é o **Smart Gestão**, um sistema de controle financeiro que permite registrar e categorizar receitas e despesas, emitir relatórios, gerar alertas e apoiar o planejamento estratégico do usuário.  
 
Nesta seção, serão apresentadas as **personas**, as **histórias de usuários**, os **requisitos funcionais e não funcionais** e as **restrições do projeto**, elaborados a partir de técnicas de modelagem de software e práticas de análise de requisitos.

---

## 2 - Requisitos Mínimos do Sistema  

O sistema **Smart Gestão** foi projetado para ser executado em equipamentos com configuração acessível, de forma a atender a realidade de microempreendedores individuais e profissionais autônomos. Para isso, foram definidos requisitos mínimos de hardware e software compatíveis com a execução em computadores pessoais e dispositivos móveis atuais.  

### 2.1 - Hardware mínimo recomendado
- **Processador:** Intel Core i3 (8ª geração ou superior) / AMD Ryzen 3 (3200U ou superior)  
- **Memória RAM:** 8 GB  
- **Armazenamento:** 2 GB livre em disco  
- **Tela:** Resolução mínima de 1024x768 pixels  
- **Rede:** Conexão com a internet  

### 2.2 - Softwares recomendados 
- **Sistema Operacional:** Windows 10 ou superior, Linux Ubuntu 20+, Android 11+ ou iOS 14+  
- **Navegadores compatíveis:** Chrome, Edge, Firefox ou Safari (versões recentes)  
- **Banco de Dados:** PostgreSQL 13+ ou MySQL 8+  
- **Servidor de Aplicação:** Node.js 18+ ou equivalente open-source  

---

## 3 - Personas  
 
- **3.1 - João, 32 anos – Microempreendedor de serviços locais**  
João é dono de uma barbearia em seu bairro. Trabalha sozinho e atende em média 15 clientes por dia. Apesar do bom movimento, enfrenta dificuldades para organizar suas finanças, já que ainda faz os registros em um caderno antigo. Casado e pai de um filho pequeno, ele tem pouco tempo para lidar com planilhas complexas e teme perder o controle do fluxo de caixa. Sonha em expandir seu negócio, mas sabe que precisa de mais clareza sobre lucros e despesas para tomar decisões estratégicas.  
 
- **3.2 - Ana, 28 anos – Vendedora autônoma online**  
Ana vende cosméticos e acessórios em redes sociais e marketplaces. Solteira e bastante conectada ao mundo digital, ela lida diariamente com dezenas de transações pequenas, o que torna difícil visualizar seus lucros reais. Apesar de usar planilhas esporadicamente, acaba se perdendo com a alta demanda. Ana gostaria de uma solução simples no celular para acompanhar receitas, despesas e resultados em tempo real, ajudando-a a investir melhor em marketing e estoque.  
 
- **3.3 - Carlos, 41 anos – Prestador de serviços de manutenção**  
Carlos é casado e tem dois filhos adolescentes. Trabalha com pequenos reparos em domicílios, como eletricidade e encanamento. Costuma anotar seus ganhos e gastos em papéis soltos e frequentemente mistura finanças pessoais com profissionais. Isso gera dificuldades na hora de calcular margens de lucro e planejar investimentos. Carlos deseja separar melhor suas contas e ter um sistema que o ajude a entender se realmente está lucrando no fim do mês.  
 
- **3.4 - Marina, 36 anos – Dona de restaurante local**  
Marina administra um pequeno delivery de refeições caseiras. Casada e apaixonada por gastronomia, investe muito tempo na cozinha e pouco no gerenciamento do negócio. Utiliza anotações manuais para organizar custos e pagamentos, mas sofre com atrasos em contas e falta de controle sobre tributos. Ela precisa de relatórios claros sobre faturamento e custos, além de alertas que a ajudem a não perder prazos. Seu objetivo é organizar as finanças para manter o restaurante sustentável e, no futuro, abrir uma segunda unidade.
 
---

## 4 - Histórias de Usuários  
 
| EU COMO… (Persona) | QUERO/PRECISO… (Funcionalidade) | PARA… (Motivo/Valor) |
|---------------------|---------------------------------|-----------------------|
| Ana | Classificar transações por categoria | Identificar padrões de gastos |
| Ana | Registrar transações pelo celular | Não perder registros quando estiver em trânsito |
| Ana | Ter garantia de segurança nos dados | Confiar que informações não serão vazadas |
| Carlos | Visualizar relatórios gráficos mensais | Facilitar análise financeira |
| Carlos | Exportar relatórios em PDF/Excel | Compartilhar com contador |
| João | Cadastrar receitas e despesas rapidamente | Ter controle diário do caixa |
| João | Receber alertas de vencimento de tributos | Evitar multas e atrasos |
| João | Cadastrar fornecedores | Organizar despesas recorrentes |
| Marina | Definir metas de gastos | Controlar orçamento e evitar excessos |
| Marina | Ter um dashboard inicial com visão geral | Tomar decisões rápidas |

---

## 5 - Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

---

### 5.1 - Requisitos Funcionais

| ID | Descrição | Prioridade |
|----|------------|------------|
| RF-001 | Permitir o cadastro de receitas e despesas | ALTA |
| RF-002 | Classificar transações em categorias predefinidas (ex.: alimentação, transporte, contas fixas) | ALTA |
| RF-003 | Emitir relatórios financeiros simples (mensais e anuais) em formato de tabela | ALTA |
| RF-004 | Exibir gráficos básicos (pizza e barra) para análise de despesas e receitas | MÉDIA |
| RF-005 | Permitir que o usuário defina metas de gastos mensais por categoria | MÉDIA |
| RF-006 | Emitir lembretes automáticos de pagamentos (ex.: tributos e contas recorrentes) | MÉDIA |
| RF-007 | Exibir um painel inicial (dashboard) com resumo das principais informações financeiras | ALTA |
| RF-008 | Permitir exportação de relatórios em PDF | MÉDIA |
| RF-009 | Possibilitar cadastro básico de fornecedores e clientes | MÉDIA |
| RF-010 | Disponibilizar acesso ao sistema via navegador (desktop) e versão simplificada mobile | ALTA |

---

### 5.2 - Requisitos Não Funcionais

| ID | Descrição | Prioridade |
|----|------------|------------|
| RNF-001 | O sistema deve ser responsivo, permitindo uso em diferentes dispositivos (PCs e celulares) | ALTA |
| RNF-002 | O tempo médio de resposta das operações deve ser de até **5 segundos** | MÉDIA |
| RNF-003 | O sistema deve ser compatível com navegadores modernos (Chrome, Firefox, Edge) | ALTA |
| RNF-004 | Os dados do usuário devem ser armazenados de forma segura em banco de dados | ALTA |
| RNF-005 | O banco de dados deve suportar ao menos **1.000 registros de transações** sem perda de desempenho | MÉDIA |
| RNF-006 | O sistema deve ser implementado de forma modular, facilitando futuras expansões | MÉDIA |
| RNF-007 | A interface deve ser simples, intuitiva e de fácil navegação para usuários não técnicos | ALTA |
| RNF-008 | O login deve exigir usuário e senha, com recuperação básica de senha por e-mail | MÉDIA |
| RNF-009 | A arquitetura deve possibilitar futura integração com APIs externas (ex.: serviços contábeis) | BAIXA |

---

### 5.3 - Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

| ID | Descrição |
|----|------------|
| R-01 | O projeto deverá ser entregue até a data limite estabelecida pela disciplina |
| R-02 | O sistema deve ser desenvolvido apenas com tecnologias open-source e gratuitas |
| R-03 | O sistema não terá integração bancária direta nesta versão inicial |
| R-04 | O escopo do projeto está limitado ao **controle de receitas e despesas**, não incluindo contabilidade avançada |
| R-05 | A disponibilidade obrigatória do sistema está restrita ao período de apresentação/testes acadêmicos |
| R-06 | O desenvolvimento deve seguir o cronograma definido em sprints |
| R-07 | O sistema não contemplará funcionalidades de análise preditiva ou inteligência artificial nesta versão inicial |
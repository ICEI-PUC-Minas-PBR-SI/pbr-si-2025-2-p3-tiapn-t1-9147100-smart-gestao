# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="01-Documentação de Contexto.md"> Documentação de Contexto</a></span>

Esta seção descreve a solução proposta a partir da perspectiva do usuário. São apresentadas as **personas**, as **histórias de usuários**, os **requisitos funcionais e não funcionais** e as **restrições** do projeto.  

Para elaborar esta etapa, utilizamos as seguintes **técnicas e ferramentas**:  
- **Personas**: criadas com base em perfis de alunos, professores e gestores da PUC Minas, aplicando **mapa de empatia** e levantamento de stakeholders.  
- **Histórias de usuários (User Stories)**: elaboradas com base em práticas ágeis, utilizando o modelo **EU COMO... QUERO... PARA...**.  
- **Requisitos funcionais e não funcionais**: definidos a partir das histórias e priorizados pela técnica **MoSCoW (Must, Should, Could, Won’t)**.  
- **Restrições**: estabelecidas de acordo com as normas institucionais e de segurança digital da PUC Minas. 

## Personas

1. **Clara Monteverde (Aluna):**  21 anos, estudante de Análise e Desenvolvimento de Sistemas. Mora em Belo Horizonte, solteira. Busca otimizar seus estudos, utilizando a internet de forma segura e confiável.  

2. **Rafael Antunes (Professor):**  54 anos, professor de Algoritmos e Estrutura de Dados. Casado, 2 filhos, mora em Contagem. Deseja atender melhor seus alunos fora da sala de aula, oferecendo suporte digital.  

3. **Mariana Costa (Administradora):**  29 anos, responsável pela gestão administrativa e moderação. Casada, mãe de 1 filho, mora em BH. Busca manter a plataforma segura, organizada e dentro das normas institucionais.  

4. **Lucas Oliveira (Aluno):** 23 anos, faz estágio em desenvolvimento e cursa Engenharia de Software. Mora em Betim. Gosta de colaborar em fóruns, responder dúvidas e compartilhar materiais. Vê na plataforma uma oportunidade de reforçar o portfólio acadêmico.  

5. **Fernanda Dias (Tutora de Laboratórios):**  32 anos, tutora da área de TI no campus Barreiro. Mora em Belo Horizonte. Precisa acompanhar os alunos, sugerir materiais de apoio e validar respostas técnicas.  


## Histórias de Usuários

Com base na análise das personas forma identificadas as seguintes histórias de usuários:

## Histórias de Usuários

| EU COMO...   | QUERO/PRECISO ...                  | PARA ...                                                      |
|--------------|------------------------------------|----------------------------------------------------------------|
| Aluno        | Tirar minhas dúvidas em um canal confiável | Otimizar meu aprendizado e me preparar para avaliações |
| Aluno        | Acessar materiais de diferentes disciplinas | Integrar meus estudos em um único ambiente |
| Aluno        | Avaliar respostas de colegas        | Contribuir para a qualidade das interações |
| Professor    | Responder alunos via web            | Apoiar o aprendizado e economizar tempo de atendimento individual |
| Professor    | Indicar materiais complementares    | Direcionar melhor os estudos dos alunos |
| Administrador| Aplicar as políticas de uso         | Garantir que a plataforma seja usada de forma correta |
| Administrador| Gerar relatórios de uso e interações| Monitorar engajamento e desempenho da plataforma |
| Tutor        | Validar respostas técnicas dos alunos| Garantir que o conteúdo publicado esteja correto e confiável |

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

### Requisitos Funcionais

| ID     | Descrição do Requisito  | Prioridade |
|--------|-------------------------|------------|
| RF-001 | Permitir cadastro e autenticação de usuários com credenciais da PUC | ALTA |
| RF-002 | Permitir envio de dúvidas pelos alunos | ALTA |
| RF-003 | Permitir que professores e tutores respondam dúvidas | ALTA |
| RF-004 | Permitir que usuários avaliem respostas (curtida/nota) | MÉDIA |
| RF-005 | Disponibilizar materiais de apoio e bibliografia recomendada | ALTA |
| RF-006 | Permitir personalização do perfil do usuário (foto, bio, curso) | MÉDIA |
| RF-007 | Emitir relatórios de participação e desempenho | MÉDIA |
| RF-008 | Possibilitar moderação de conteúdos pela equipe administrativa | ALTA |
| RF-009 | Manter registro de interações (perguntas, respostas, avaliações) | ALTA |
| RF-010 | Permitir integração futura com calendário acadêmico e portal do aluno | BAIXA |

### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O login deve ser realizado com as credenciais institucionais da PUC | ALTA | 
|RNF-002| Todo tráfego de dados deve ser protegido por protocolos de segurança. |  ALTA | 
|RNF-003| O sistema precisa diferenciar permissões de acordo com o perfil do usuário. | MÉDIA | 
|RNF-004| Informações sensíveis, como senhas, devem ser armazenadas de forma criptografada. |  ALTA | 
|RNF-005| A plataforma deve manter registros de atividades críticas para auditoria. |  ALTA |
|RNF-006| O tempo de carregamento das páginas deve ser inferior a 2 segundos em situações normais. | MÉDIA | 
|RNF-007| A aplicação deve suportar uma quantidade definida de acessos simultâneos sem perda significativa de desempenho. | MÉDIA | 
|RNF-008| O código deve seguir boas práticas de desenvolvimento para facilitar melhorias. | MÉDIA | 
|RNF-009| A arquitetura do sistema deve ser modular, favorecendo correções e novas implementações. |  MÉDIA | 
|RNF-010| Deve haver documentação atualizada dos principais componentes. |  ALTA | 
|RNF-011| A interface deve ser simples e intuitiva, de fácil uso para alunos e professores. | ALTA | 
|RNF-012| O sistema deve seguir padrões de acessibilidade, garantindo acesso a pessoas com deficiência. |  ALTA | 
|RNF-013| O layout precisa ser responsivo, funcionando bem em computadores, tablets e celulares. | MÉDIA | 
|RNF-014| A aplicação deve funcionar nos principais navegadores atuais. | ALTA | 
|RNF-015| Deve haver backups automáticos e periódicos do banco de dados. | MÉDIA |
|RNF-016| Nenhum dado deve ser perdido em situações de queda do sistema. | ALTA | 
|RNF-017| A plataforma deve possibilitar integrações futuras com outros serviços acadêmicos, como calendário e portal do aluno | BAIXA | 
|RNF-018| O sistema deve possibilitar o acompanhamento de desempenho e uso. |  MÉDIA | 

Com base nas Histórias de Usuário, enumere os requisitos da sua solução. Classifique esses requisitos em dois grupos:

- [Requisitos Funcionais
 (RF)](https://pt.wikipedia.org/wiki/Requisito_funcional):
 correspondem a uma funcionalidade que deve estar presente na
  plataforma (ex: cadastro de usuário).
- [Requisitos Não Funcionais
  (RNF)](https://pt.wikipedia.org/wiki/Requisito_n%C3%A3o_funcional):
  correspondem a uma característica técnica, seja de usabilidade,
  desempenho, confiabilidade, segurança ou outro (ex: suporte a
  dispositivos iOS e Android).
Lembre-se que cada requisito deve corresponder à uma e somente uma
característica alvo da sua solução. Além disso, certifique-se de que
todos os aspectos capturados nas Histórias de Usuário foram cobertos.

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|R-01| A aplicação deve utilizar infraestrutura compatível com os padrões da PUC Minas. |
|R-02| O banco de dados deve armazenar informações apenas em servidores autorizados e que atendam às normas da universidade. |
|R-03| Apenas usuários com vínculo ativo com a PUC Minas poderão criar contas e acessar os conteúdos. |
|R-04| Dados sensíveis não poderão ser compartilhados fora do ambiente institucional. |
|R-05| Alunos só poderão postar dúvidas e respostas após autenticação no sistema. |
|R-06| A moderação de conteúdos inapropriados ficará restrita à equipe administrativa da instituição. |
|R-08| A plataforma deve seguir o padrão visual e de identidade institucional da PUC Minas. |
|R-09| Somente informações autorizadas poderão ser integradas ao calendário acadêmico e bibliografia institucional. |
|R-10| O acesso externo (fora da comunidade acadêmica da PUC) será restrito, salvo autorização expressa da instituição. |
|R-11| O acesso será restrito a estudantes da área de Tecnologia da Informação da PUC Minas. |

## Matriz de Rastreabilidade
A tabela abaixo mostra a relação entre as **Histórias de Usuários** e os **Requisitos funcionais e não-funcionais** que garantem sua implementação.

| História de Usuário                                                                 | Requisitos Relacionados |
|-------------------------------------------------------------------------------------|--------------------------|
| **EU COMO aluno quero tirar minhas dúvidas em um canal confiável para otimizar meu aprendizado** | RF-002, RF-003, RNF-001, RNF-002 |
| **EU COMO aluno quero acessar materiais de diferentes disciplinas para integrar meus estudos em um único ambiente** | RF-005, RF-009, RNF-013 |
| **EU COMO aluno quero avaliar respostas de colegas para contribuir para a qualidade das interações** | RF-004, RF-009 |
| **EU COMO professor quero responder alunos via web para apoiar o aprendizado** | RF-003, RF-005, RNF-011 |
| **EU COMO professor quero indicar materiais complementares para direcionar melhor os estudos dos alunos** | RF-005, RNF-010 |
| **EU COMO administrador quero aplicar as políticas de uso para garantir que a plataforma seja usada de forma correta** | RF-008, RNF-003, RNF-005 |
| **EU COMO administrador quero gerar relatórios de uso e interações para monitorar engajamento** | RF-007, RF-009, RNF-018 |
| **EU COMO tutor quero validar respostas técnicas dos alunos para garantir confiabilidade do conteúdo** | RF-003, RF-008, RNF-004 |
| **EU COMO aluno quero personalizar meu perfil para ter uma identidade no ambiente virtual** | RF-006, RNF-011, RNF-013 |
| **EU COMO administrador quero que apenas usuários com vínculo ativo possam acessar** | RF-001, RNF-001, R-03 |
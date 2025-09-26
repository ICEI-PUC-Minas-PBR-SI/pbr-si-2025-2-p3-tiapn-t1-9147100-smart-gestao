## 3. Modelagem dos Processos de Negócio

### 3.1. Modelagem da situação atual (Modelagem AS IS)
No contexto atual, o processo de compartilhamento e validação de conhecimento entre a comunidade acadêmica da PUC Minas acontece de forma fragmentada, e desorganizada, exigindo a necessidade de recorrer a fontes externas, como inteligências artificiais, redes sociais e plataformas online. Embora esses recursos ofereçam respostas imediatas, não garantem aos usuários a veracidade das informações, o alinhamento acadêmico ou integração as diretrizes institucionais. Ademais, a interação entre professores, monitores e estudantes acontece, principalmente, em sala de aula, por e-mail ou através sistemas administrativos da universidade que não são focados no suporte ao aprendizado. 
Portanto, os cenários observados caracterizam um fluxo de troca de informações descentralizado e sem padrões, em que a confiabilidade é baixa e a comunicação entre os alunos, professores e colaboradores da universidade não é totalmente aproveitada.

### 3.2. Descrição geral da proposta (Modelagem TO BE)

Após analisar o processo atual, busca-se, com este projeto, desenvolver um ambiente digital, seguro e intuitivo para a troca de dúvidas, respostas e materiais de estudo entre a comunidade acadêmica da Pontifícia Universidade Católica de Minas Gerais. O sistema busca suprir a falta de uma ferramenta disponível aos alunos que garanta a troca de informações, diante os conteúdos
lecionados. Para isso, o sistema contará com: 
* **Diferentes perfis de usuários:** alunos, professores, equipe administrativa e monitores selecionados por professores da instituição;
* **Interação entre usuários:** permite que qualquer usuário responda a dúvidas postadas na plataforma.
* **Validação de conteúdo:** recursos que permitem a verificação e avaliação de conteúdos e conhecimentos utilizados em forma de like/dislike.
* **Integração institucional:** conexão com elementos e informações da universidade, como disciplinas, calendário acadêmico e bibliografias recomendadas. 

**Processo 1 – Cadastro de Usuários:** Esse processo é responsável por registrar novos membros da comunidade acadêmica na plataforma.  
O fluxo inicia quando o usuário acessa a tela de cadastro e insere seus dados pessoais e institucionais (nome, e-mail, senha, matrícula e curso, quando aplicável). O sistema realiza a validação automática desses dados, verificando se a matrícula é válida e se o e-mail corresponde ao domínio institucional. Em seguida, identifica se o usuário é aluno ou professor, atribuindo o perfil inicial de forma automática. O cadastro é armazenado com segurança e uma mensagem de confirmação é exibida. Esse processo garante que apenas pessoas ligadas à instituição sejam registradas e que seu perfil inicial já esteja adequado à função acadêmica desempenhada.  

**Processo 3 – Personalização de Perfil**: Após realizar login com sucesso, o usuário pode acessar a área de personalização de perfil. Nesse processo, ele tem a possibilidade de atualizar suas informações pessoais e acadêmicas, como nome, senha, curso, além de adicionar uma foto de perfil e uma breve biografia. O sistema valida os dados inseridos, verificando duplicidade de e-mail, consistência de matrícula e formatos aceitos para imagens. Quando aprovadas, as alterações são salvas no banco de dados e imediatamente refletidas na conta do usuário. Esse processo é essencial para proporcionar uma experiência mais personalizada e alinhada às preferências individuais, fortalecendo o senso de pertencimento à comunidade acadêmica.

Assim, espera-se que o fortalecimento da cultura acadêmica participativa, inovadora e tecnológica seja garantido, promovendo o engajamento dos membros da comunidade e a troca de experiência e conhecimentos entre eles. Ademais, deseja-se que a plataforma possa contribuir para integrar diferentes cursos na área de Tecnologia da Informaçãp, estimulando práticas de aprendizagem ativa, além de servir como suporte ao aprendizado e como um repositório vivo de conhecimentos produzidos dentro e pela própria universidade. Por fim, é imprescindível citar a intenção de posicionar a instituição como um meio propício a inovações e que
utiliza da tecnologia no meio educacional, gerando impacto positivo tanto para os usuários, quanto para
a reputação acadêmica.

### 3.3. Modelagem dos processos

[PROCESSO 1 - Cadastro de Usuários](./processos/processo1_cadastro_usuario.md "Detalhamento do Processo 1.")
[PROCESSO 2 - Login de Usuários](./processos/processo2_login_usuario.md "Detalhamento do Processo 2.")
[PROCESSO 2 - Personalização de Perfil](./processos/processo3_personalizacao_usuario.md "Detalhamento do Processo 3.")

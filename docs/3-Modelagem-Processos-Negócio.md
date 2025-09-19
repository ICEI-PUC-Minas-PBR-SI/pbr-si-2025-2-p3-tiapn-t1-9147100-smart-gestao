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

**Processo 1** – Login e Cadastro de Usuário: responsável por permitir que novos usuários se registrem no sistema ou acessem com suas credenciais institucionais. Esse processo assegura que apenas membros devidamente identificados tenham acesso à plataforma, mediante o fornecimento de dados pessoais, validação de informações e aceite de termos e políticas. Ao final, o sistema atribui permissões de acordo com o perfil cadastrado.

**Processo 2** – Identificação do Usuário e Definição do Perfil: após o login, o sistema consulta o cadastro e identifica automaticamente se o usuário é aluno, professor, monitor ou administrador. A partir dessa classificação, são aplicadas permissões específicas (por exemplo: alunos podem postar dúvidas e interagir, professores podem responder e validar conteúdos, monitores podem moderar discussões, e administradores gerenciam o ambiente). Esse processo garante que cada usuário tenha uma experiência ajustada ao seu papel na comunidade acadêmica.

Assim, espera-se que o fortalecimento da cultura acadêmica participativa, inovadora e tecnológica seja garantido, promovendo o engajamento dos membros da comunidade e a troca de experiência e conhecimentos entre eles. Ademais, deseja-se que a plataforma possa contribuir para integrar diferentes cursos na área de Tecnologia da Informaçãp, estimulando práticas de aprendizagem ativa, além de servir como suporte ao aprendizado e como um repositório vivo de conhecimentos produzidos dentro e pela própria universidade. Por fim, é imprescindível citar a intenção de posicionar a instituição como um meio propício a inovações e que
utiliza da tecnologia no meio educacional, gerando impacto positivo tanto para os usuários, quanto para
a reputação acadêmica.

### 3.3. Modelagem dos processos

[PROCESSO 1 - Login e Cadastro de Usuário](./processos/processo1_cadastro_login.md "Detalhamento do Processo 1.")

[PROCESSO 2 - Identificação do Usuário e definição do perfil](./processos/processo2_identificacao_usuario.md "Detalhamento do Processo 2.")

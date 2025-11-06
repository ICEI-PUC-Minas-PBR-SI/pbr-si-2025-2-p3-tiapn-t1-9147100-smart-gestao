# Roteiro de Testes - Smart Gestão

Aqui tá a lista do que a gente precisa testar pra garantir que o sistema tá funcionando direitinho. A ideia é usar umas 3 ou 4 empresas fakes pra validar tudo.

Este arquivo será excluido após a validação destes testes.

---

## 1. Cadastro e Login (Autenticação)

O básico, pra ver se o acesso tá seguro.

- [x] **Cadastro de Usuário Novo:**
    - Acessar a página de cadastro.
    - Criar um usuário para a "Empresa A".
    - Tentar cadastrar de novo com o mesmo e-mail e ver se o sistema barra.

- [x] **Login:**
    - Fazer login com o usuário da "Empresa A".
    - Tentar fazer login com uma senha errada e ver se dá erro.

- [x] **Proteção de Rota:**
    - Fazer logout.
    - Tentar acessar a URL do dashboard direto (ex: `startPage.html`). O sistema tem que te jogar de volta pra tela de login.

- [x] **Recuperação de Senha:**
    - Clicar em "Esqueci minha senha".
    - Seguir o fluxo para ver se a redefinição funciona.

- [x] **Logout:**
    - Clicar no botão de sair e confirmar que a sessão foi encerrada (redirecionado para o login).

---

## 2. Teste de Isolamento de Dados (O MAIS IMPORTANTE!)

Esse teste é crucial pra provar que uma empresa não vê os dados da outra.

- [x] **Cenário:**
    1.  Cadastre e faça login com um usuário da **"Empresa A"**.
    2.  Crie uma transação (ex: "Venda de Produto A", R$ 100,00).
    3.  Crie uma meta (ex: "Comprar Cadeira Nova").
    4.  Faça logout.

- [x] **Validação:**
    1.  Agora, cadastre e faça login com um usuário da **"Empresa B"**.
    2.  Vá para a página de transações. A transação "Venda de Produto A" **NÃO PODE** aparecer.
    3.  Vá para a página de metas. A meta "Comprar Cadeira Nova" **NÃO PODE** aparecer.
    4.  Crie uma transação para a Empresa B e confirme que ela aparece só para o usuário da Empresa B.

---

## 3. Módulo de Transações (O dia a dia do usuário)

Vamos testar o CRUD completo de transações.

- [ ] **Criar Transação:**
    - Criar uma receita e ver se o valor aparece corretamente no card "Receitas" do dashboard.
    - Criar uma despesa e ver se o valor aparece no card "Despesas".
    - Verificar se o "Saldo" do dashboard foi atualizado corretamente.

- [ ] **Listar Transações:**
    - Ir para a página de transações e confirmar que as transações criadas estão na lista.

- [ ] **Editar Transação:**
    - Pegar uma transação da lista, clicar em editar, mudar o valor ou a descrição.
    - Salvar e confirmar que a lista e o dashboard foram atualizados.

- [ ] **Excluir Transação:**
    - Excluir uma transação da lista.
    - Confirmar que ela sumiu da lista e que os valores do dashboard foram recalculados.

- [ ] **Filtrar Transações:**
    - Usar os filtros de data, tipo (receita/despesa) e categoria para ver se a lista responde corretamente.

---

## 4. Módulo de Metas

Testar o ciclo de vida das metas.

- [ ] **Criar Meta:**
    - Ir para a página de metas e criar um novo objetivo (ex: "Atingir R$ 5.000 de faturamento").
    - Confirmar que a nova meta aparece na lista.

- [ ] **Editar Meta:**
    - Editar o valor ou o título de uma meta existente e salvar.

- [ ] **Excluir Meta:**
    - Remover uma meta da lista.

---

## 5. Módulo de Relatórios

Verificar se os dados consolidados estão corretos.

- [ ] **Gerar Relatório:**
    - Ir para a página de relatórios.
    - Gerar um relatório para "Este mês".
    - Conferir se os totais de despesas por categoria no relatório batem com as transações que você cadastrou.

---

Pronto! Se tudo isso passar, a gente pode dizer que o backend e as principais funcionalidades do sistema estão sólidos.
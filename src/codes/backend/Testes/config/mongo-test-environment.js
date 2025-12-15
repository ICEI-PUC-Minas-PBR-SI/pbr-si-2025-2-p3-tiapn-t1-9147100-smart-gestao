/**
 * =================================================================================
 * ARQUIVO: Testes/config/mongo-test-environment.js
 *
 * DESCRIÇÃO:
 *            Esta classe estende o ambiente padrão do Node.js para o Jest.
 *            Anteriormente, ela continha a lógica de setup e teardown, mas essa
 *            responsabilidade foi movida para `globalSetup.cjs` e `globalTeardown.cjs`
 *            para garantir um ambiente único e estável para toda a suíte de testes,
 *            evitando condições de corrida. Este arquivo foi mantido por razões
 *            históricas, mas não é mais utilizado ativamente pela configuração do Jest.
 * =================================================================================
 */
import NodeEnvironment from 'jest-environment-node';

class MongoTestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  // A lógica de setup e teardown foi centralizada em `globalSetup.js` e `globalTeardown.js`.
  // Isso evita a recriação do servidor e do banco de dados a cada arquivo de teste,
  // que era a causa dos erros de "duplicate key" e outras condições de corrida.
}

export default MongoTestEnvironment;
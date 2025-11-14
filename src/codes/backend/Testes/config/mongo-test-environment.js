/**
 * =================================================================================
 * ARQUIVO: Testes/config/mongo-test-environment.js
 *
 * DESCRIÇÃO:
 *            Esta classe estende o ambiente padrão do Node.js para o Jest.
 *            Anteriormente, ela continha a lógica de setup e teardown, mas essa
 *            responsabilidade foi movida para `globalSetup.js` e `globalTeardown.js`
 *            para evitar condições de corrida quando os testes são executados.
 * =================================================================================
 */
import NodeEnvironment from 'jest-environment-node';

class MongoTestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  // A lógica de setup e teardown foi movida para globalSetup.js e globalTeardown.js
  // para evitar condições de corrida. Este arquivo agora apenas estende o ambiente padrão.
}

export default MongoTestEnvironment;
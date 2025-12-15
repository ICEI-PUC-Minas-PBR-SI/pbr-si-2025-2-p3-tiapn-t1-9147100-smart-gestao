/**
 * =================================================================================
 * ARQUIVO: Testes/3-security/persistence.test.js
 *
 * DESCRIÇÃO:
 *            Este teste é um "guardião" de segurança. Sua única responsabilidade
 *            é verificar se os dados de teste manuais, criados pelo script
 *            `create-test-companies.js`, permanecem no banco de dados após a
 *            execução completa da suíte de testes automatizados (`npm test`).
 *
 *            Ele prova que a nossa estratégia de "limpeza seletiva" no `globalTeardown`
 *            está funcionando e que os dados de desenvolvimento não são destruídos.
 * =================================================================================
 */

import mongoose from 'mongoose';
import User from '../../models/User.js';

describe('Security: Persistência de Dados Manuais', () => {
  // Lista de e-mails dos usuários que devem sobreviver ao processo de teste.
  const manualTestUsers = [
    { email: 'empresa-frontend@test.com', name: 'Empresa Frontend' },
    { email: 'empresa-backend@test.com', name: 'Empresa Backend' },
    { email: 'empresa-react@test.com', name: 'Empresa React' },
  ];

  // Garante que o teste só rode se o banco de dados estiver conectado.
  beforeAll(async () => {
    if (mongoose.connection.readyState !== 1) {
      // Usa a mesma URI do setup global para consistência.
      const mongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
      await mongoose.connect(mongoUri);
    }
  });

  // Garante que a conexão com o banco de dados aberta por este teste seja fechada.
  afterAll(async () => {
    // Apenas desconecta se a conexão ainda estiver aberta.
    if (mongoose.connection.readyState === 1) await mongoose.disconnect();
  });

  test('deve garantir que os usuários de teste manuais permaneçam no banco após a execução de `npm test`', async () => {
    console.log('\n--- 🛡️  Teste de Persistência: Verificando dados manuais... ---');

    for (const testUser of manualTestUsers) {
      const userInDb = await User.findOne({ email: testUser.email });

      // A asserção principal: o usuário não deve ser nulo.
      expect(userInDb).not.toBeNull();

      console.log(`   - [PASS] Usuário da "${testUser.name}" permaneceu no banco.`);
    }
  });
});
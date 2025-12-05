/**
 * =================================================================================
 * ARQUIVO: Testes/config/globalTeardown.cjs
 *
 * DESCRIÇÃO:
 *            Este script é executado uma única vez APÓS todos os testes terem
 *            sido concluídos. Sua responsabilidade é encerrar os recursos
 *            globais que foram iniciados no `globalSetup`, como o servidor da API
 *            e a conexão com o banco de dados.
 * =================================================================================
 */
const Company = require('../../models/Company.js').default;
const User = require('../../models/User.js').default;
const SessionToken = require('../../models/SessionToken.js').default;
const Client = require('../../models/Client.js').default;
const Transaction = require('../../models/Transaction.js').default;

module.exports = async () => {
  console.log('\n--- 🧹 [GLOBAL TEARDOWN] Finalizando ambiente de teste ---');

  // Etapa 1: Limpeza Seletiva do Banco de Dados.
  // Verifica se a variável global com os IDs dos documentos de teste foi definida.
  // A flag `PERSISTENCE_TEST_RUN` impede a limpeza para que o teste de persistência possa ser validado.
  if (global.__TEST_CLEANUP_IDS__ && !process.env.PERSISTENCE_TEST_RUN) {
    const { companies, users, clients, transactions } = global.__TEST_CLEANUP_IDS__;

    if (companies.length > 0 || users.length > 0 || clients.length > 0 || transactions.length > 0) {
      await Promise.all([
        Company.deleteMany({ _id: { $in: companies } }),
        User.deleteMany({ _id: { $in: users } }),
        Client.deleteMany({ _id: { $in: clients } }),
        Transaction.deleteMany({ _id: { $in: transactions } }),
        SessionToken.deleteMany({ userId: { $in: users } })
      ]);
      console.log('   - [OK] Dados de teste temporários foram removidos.');
    }
  }

  // Etapa 2: Encerrar o servidor da API de forma "graciosa".
  // Chama a função `stopServer` exportada pelo `server.js`.
  if (global.__SERVER_MODULE__ && typeof global.__SERVER_MODULE__.stopServer === 'function') {
    await global.__SERVER_MODULE__.stopServer();
  }

  console.log('--- ✅ [GLOBAL TEARDOWN] Ambiente finalizado com sucesso ---');
};
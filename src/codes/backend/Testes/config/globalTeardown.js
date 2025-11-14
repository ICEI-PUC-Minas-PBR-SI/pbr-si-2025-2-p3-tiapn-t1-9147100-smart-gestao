/**
 * =================================================================================
 * ARQUIVO: Testes/config/globalTeardown.js
 *
 * DESCRIÇÃO:
 *            Este script é executado uma única vez APÓS todos os testes terem
 *            sido concluídos. Sua única responsabilidade é encerrar os recursos
 *            globais que foram iniciados no `globalSetup`, como o servidor da API
 *            e a conexão com o banco de dados.
 * =================================================================================
 */
import mongoose from 'mongoose';
/**
 * =================================================================================
 * ARQUIVO: Testes/config/globalTeardown.js
 *
 * DESCRIÇÃO:
 *            Este script é executado uma única vez APÓS todos os testes terem
 *            sido concluídos. Sua única responsabilidade é encerrar os recursos
 *            globais que foram iniciados no `globalSetup`, como o servidor da API
 *            e a conexão com o banco de dados.
 * =================================================================================
 */
import Company from '../../models/Company.js';
import User from '../../models/User.js';
import SessionToken from '../../models/SessionToken.js';
import Client from '../../models/Client.js';
import Transaction from '../../models/Transaction.js';

export default async () => {
  console.log('\n--- 🧹 [GLOBAL TEARDOWN] Finalizando ambiente de teste ---');
  
  // Etapa 1: Limpeza Seletiva do Banco de Dados.
  // Esta é a etapa mais crítica para garantir que os testes não interfiram
  // com os dados de desenvolvimento manual (ex: as empresas de teste fixas).
  if (global.__TEST_CLEANUP_IDS__) {
    // Recupera a lista de IDs que foi salva pelo globalSetup.
    const { companies, users, clients, transactions } = global.__TEST_CLEANUP_IDS__;

    // Executa a exclusão em paralelo para maior eficiência.
    // O operador '$in' do MongoDB garante que apenas os documentos cujos '_id'
    // correspondem aos da lista serão apagados.
    await Promise.all([
      Company.deleteMany({ _id: { $in: companies } }),
      User.deleteMany({ _id: { $in: users } }),
      Client.deleteMany({ _id: { $in: clients } }),
      Transaction.deleteMany({ _id: { $in: transactions } }),
      // Os tokens de sessão são vinculados pelo 'userId', então também os limpamos.
      SessionToken.deleteMany({ userId: { $in: users } })
    ]);
    console.log('   - [OK] Dados de teste temporários foram removidos.');
  }

  // Etapa 2: Encerrar o servidor da API.
  // Isso libera a porta e encerra o processo do servidor de forma graciosa.
  if (global.__SERVER_MODULE__ && typeof global.__SERVER_MODULE__.stopServer === 'function') {
    await global.__SERVER_MODULE__.stopServer();
  }

  console.log('--- ✅ [GLOBAL TEARDOWN] Ambiente finalizado com sucesso ---');
};